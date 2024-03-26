package com.ssafy.libro.domain.shorts.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import com.ssafy.libro.domain.shorts.dto.*;
import com.ssafy.libro.domain.shorts.repository.TaskJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.*;
import org.bytedeco.javacv.Frame;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShortsServiceImpl implements ShortsService {

    private static final int PROMPT_DIVIDE_NUM = 3;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    private final TaskServiceImpl taskService;
    private final PromptServiceImpl promptService;

    private final BookRepository bookRepository;
    private final TaskJpaRepository taskJpaRepository;


    @Override
    public ShortsResponseDto createShorts(ShortsRequestDto requestDto) throws IOException {
        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(PromptRequestDto.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build());

        Resource resource = createVideo(promptResponseDto);

        return ShortsResponseDto.builder()
                .title(promptResponseDto.getTitle())
                .content(promptResponseDto.getContent())
                .korPrompt(promptResponseDto.getKorPrompt())
                .engPrompt(promptResponseDto.getEngPrompt())
                .resource(resource)
                .build();
    }

    @Override
    public BookDetailResponseDto getShortsByBookId(Long bookId) throws IOException {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new BookNotFoundException(bookId));
        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(PromptRequestDto.builder()
                .title(book.getTitle())
                .content(book.getSummary())
                .build());

        Resource resource = createVideo(promptResponseDto);
        return null;
//        return ShortsResponseDto.builder()
//                .title(promptResponseDto.getTitle())
//                .content(promptResponseDto.getContent())
//                .korPrompt(promptResponseDto.getKorPrompt())
//                .engPrompt(promptResponseDto.getEngPrompt())
//                .resource(resource)
//                .build();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private String[] dividePrompt(String initPrompt) {
        String[] splitPrompts = initPrompt.split(", ");
        int elemNumPerPrompt = (int) Math.ceil((double) splitPrompts.length / PROMPT_DIVIDE_NUM);

        String[] sentences = new String[PROMPT_DIVIDE_NUM];
        for (int i = 0; i < PROMPT_DIVIDE_NUM; i++) {
            StringBuilder sb = new StringBuilder();

            int initIndex = i * elemNumPerPrompt;
            int exitIndex = (i + 1) * elemNumPerPrompt;
            for (int j = initIndex; j < Math.min(exitIndex, splitPrompts.length); j++)
                sb.append(splitPrompts[j]).append(", ");
            sentences[i] = sb.toString();
        }
        return sentences;
    }

    private Resource createVideo(PromptResponseDto promptResponseDto) throws IOException {
        String[] sentences = promptResponseDto.getEngPrompt().split(", ");

        List<String> encodedImages = new ArrayList<>();
        for (String sentence : sentences) {
            DiffusionResponseDto diffusionResponseDto = createImages(sentence);
            encodedImages.addAll(diffusionResponseDto.getImages());
        }

        // 동영상 파일을 임시 디렉토리에 저장
        Path tempDir = Files.createTempDirectory("outputs");
        String videoFileName = UUID.randomUUID() + ".mp4";
        String videoFilePath = tempDir.resolve(videoFileName).toString();

        List<byte[]> decodedImages = decodeImages(encodedImages);
        for (byte[] decodedImage : decodedImages) {
            String imageFileName = UUID.randomUUID() + ".jpg";
            Path imagePath = tempDir.resolve(imageFileName);
            Files.write(imagePath, decodedImage);
        }

        // ffmpeg를 사용하여 이미지로부터 동영상 생성
        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
            recorder.setFrameRate(FRAME_RATE);
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.start();

            createVideo(decodedImages, recorder);
            recorder.stop();
        }

        // 생성된 동영상에 자막추가 처리
        // addSubtitlesToVideo(videoFilePath, videoFilePath, subtitleText, 0, 20000);

        // 생성된 동영상 파일을 S3에 저장
        File videoFile = new File(videoFilePath);
        if (videoFile.exists()) {
            String s3Key = "shorts/" + videoFileName;
            amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
            log.info("Uploaded video to S3: {}", s3Key);
        } else {
            log.error("Video file does not exist: {}", videoFilePath);
        }

        // S3에 업로드된 동영상 파일의 주소를, Book Entity의 shortsUrl 필드에 업데이트

        // 임시 파일 및 디렉토리 삭제
        try (Stream<Path> walk = Files.walk(tempDir)) {
            walk.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(file -> {
                        if (!file.delete()) {
                            log.error("Failed to delete {}", file.getAbsolutePath());
                        }
                    });
        }

        return new FileSystemResource(videoFile);
    }

    private DiffusionResponseDto createImages(String prompt) {
        /* Request Stable Diffusion */
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
        DiffusionRequestDto diffusionRequestDto = new DiffusionRequestDto().updatePrompt(prompt);
        HttpEntity<DiffusionRequestDto> request = new HttpEntity<>(diffusionRequestDto, httpHeaders);
        ResponseEntity<DiffusionResponseDto> response = restTemplate.postForEntity(url, request, DiffusionResponseDto.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else if (response.getStatusCode().is4xxClientError()) {
            log.error("Client error while creating images with prompt '{}': {}", prompt, response.toString());
            throw new HttpClientErrorException(response.getStatusCode(), "Client error: " + response.toString());
        } else if (response.getStatusCode().is5xxServerError()) {
            log.error("Server error while creating images with prompt '{}': {}", prompt, response.toString());
            throw new HttpServerErrorException(response.getStatusCode(), "Server error: " + response.toString());
        } else {
            log.error("Unexpected response status while creating images with prompt '{}': {}", prompt, response.getStatusCode());
            throw new RuntimeException("Unexpected response status: " + response.getStatusCode());
        }
    }

    private List<byte[]> decodeImages(List<String> base64Images) {
        List<byte[]> decodedImages = new ArrayList<>();
        for (String base64Image : base64Images) {
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            decodedImages.add(imageBytes);
        }
        return decodedImages;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public void createImages(PromptRequestDto promptRequestDto) throws IOException {
        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(promptRequestDto);

        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        DiffusionRequestDto diffusionRequestDto = new DiffusionRequestDto();
        diffusionRequestDto = diffusionRequestDto.updatePrompt(promptResponseDto.getEngPrompt());

        HttpEntity<DiffusionRequestDto> request = new HttpEntity<>(diffusionRequestDto, httpHeaders);
        ResponseEntity<DiffusionResponseDto> response = restTemplate.postForEntity(url, request, DiffusionResponseDto.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            DiffusionResponseDto responseBody = response.getBody();
            List<byte[]> decodedImages = decodeImages(responseBody.getImages());

            // 이미지 데이터와 줄거리를 매개변수로 넣으면 동영상파일이 리턴됨

            // 동영상 파일을 임시 디렉토리에 저장
            Path tempDir = Files.createTempDirectory("outputs");
            String videoFileName = UUID.randomUUID() + ".mp4";
            String videoFilePath = tempDir.resolve(videoFileName).toString();

            for (byte[] decodedImage : decodedImages) {
                String imageFileName = UUID.randomUUID() + ".jpg";
                Path imagePath = tempDir.resolve(imageFileName);
                Files.write(imagePath, decodedImage);
            }

            // ffmpeg를 사용하여 이미지로부터 동영상 생성
            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
                recorder.setFrameRate(FRAME_RATE);
                recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
                recorder.setFormat("mp4");
                recorder.start();

                createVideo(decodedImages, recorder);
                recorder.stop();
            }

            // 생성된 동영상에 자막추가 처리
            // addSubtitlesToVideo(videoFilePath, videoFilePath, subtitleText, 0, 20000);

            // 생성된 동영상 파일을 S3에 저장
            File videoFile = new File(videoFilePath);
            if (videoFile.exists()) {
                String s3Key = "shorts/" + videoFileName;
                amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
                log.info("Uploaded video to S3: {}", s3Key);
            } else {
                log.error("Video file does not exist: {}", videoFilePath);
            }

            // S3에 업로드된 동영상 파일의 주소를, Book Entity의 shortsUrl 필드에 업데이트

            // 임시 파일 및 디렉토리 삭제
            try (Stream<Path> walk = Files.walk(tempDir)) {
                walk.sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(file -> {
                            if (!file.delete()) {
                                log.error("Failed to delete {}", file.getAbsolutePath());
                            }
                        });
            }

            log.info("Images: {}", responseBody.getImages());
            log.info("Parameters: {}", responseBody.getParameters());
            log.info("Info: {}", responseBody.getInfo());
        } else {
            log.error("Failed to get a successful response");
        }
    }




    private static void createVideo(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) {
        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
            for (byte[] imageBytes : decodedImages) {
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
                for (int i = 0; i < FRAME_RATE * (60 / decodedImages.size()); i++)
                    recorder.record(frameConverter.convert(image));
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public static String addSubtitlesToVideo(String inputVideoPath, String outputVideoPath, String subtitleText,
                                             long startTimeMillis, long endTimeMillis) throws Exception {
        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputVideoPath)) {
            grabber.start();

            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputVideoPath, grabber.getImageWidth(), grabber.getImageHeight(), grabber.getAudioChannels())) {
                recorder.setFormat(grabber.getFormat());
                recorder.setFrameRate(grabber.getFrameRate());
                recorder.setVideoCodec(grabber.getVideoCodec());
                recorder.setAudioChannels(grabber.getAudioChannels());
                recorder.start();

                // 문장 단위로 텍스트 나누기
                String[] sentences = subtitleText.split("\\.\\s*|\\?\\s*|!\\s*");
                long totalDuration = endTimeMillis - startTimeMillis;
                long durationPerSentence = totalDuration / sentences.length;
                long currentStartTime = startTimeMillis;

                Frame frame;
                int frameNumber = 0;

                while ((frame = grabber.grabFrame()) != null) {
                    long timestamp = grabber.getTimestamp();

                    if (timestamp >= currentStartTime && timestamp <= currentStartTime + durationPerSentence) {
                        String filterString = String.format("drawtext=text='%s':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=24:fontcolor=white", sentences[frameNumber]);
                        try (FFmpegFrameFilter frameFilter = new FFmpegFrameFilter(filterString, grabber.getImageWidth(), grabber.getImageHeight())) {
                            frameFilter.setPixelFormat(grabber.getPixelFormat());
                            frameFilter.start();
                            frameFilter.push(frame);
                            frame = frameFilter.pull();
                        }
                    }

                    recorder.record(frame);

                    if (timestamp > currentStartTime + durationPerSentence) {
                        currentStartTime += durationPerSentence;
                        if (frameNumber < sentences.length)
                            frameNumber++;
                    }
                }
            }
        }

        return outputVideoPath; // 처리된 동영상 파일의 경로 반환
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private static final int WIDTH = 360;
    private static final int HEIGHT = 640;
    private static final int FRAME_RATE = 30;
    private static final int VIDEO_WIDTH = 720;
    private static final int VIDEO_HEIGHT = 1280;


















    @Override
    public void createShorts() {
        String outputFile = UUID.randomUUID() + ".mp4";
        String[] imageFiles = {"00017-977685478.png", "00034-4170023442.png", "00042-3231078231.png"};
        String text = "여기에 책의 줄거리가 들어갑니다. 이 텍스트는 여러 문장으로 구성될 수 있으며, 이미지 위에 표시됩니다.";

        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputFile, WIDTH, HEIGHT)) {
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_MPEG4);
            recorder.setFrameRate(FRAME_RATE);
            recorder.setFormat("mp4");
            recorder.start();

            processImage(recorder, imageFiles, text);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }




    private void processImage(FFmpegFrameRecorder recorder, String[] imageFiles, String text) throws IOException {
        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
            for (String imageFile : imageFiles) {
                BufferedImage originalImage = ImageIO.read(new File(imageFile));
                BufferedImage overlayImage = overlayTextOnImage(originalImage, text);
                for (int i = 0; i < FRAME_RATE * (60 / imageFiles.length); i++) {
                    recorder.record(frameConverter.convert(overlayImage));
                }
            }
        }
    }

    private static BufferedImage overlayTextOnImage(BufferedImage image, String text) {
        // 텍스트 오버레이 설정
        Graphics2D g2d = image.createGraphics();
        Font font = new Font("Malgun Gothic", Font.BOLD, 150);
        g2d.setFont(font);

        FontMetrics fm = g2d.getFontMetrics();
        int imageWidth = image.getWidth();

        // Break the text into lines that fit the image width
        List<String> lines = wrapText(text, fm, imageWidth - 20);

        // Calculate the total height of the text block
        int textHeight = lines.size() * fm.getHeight();

        // Starting Y position to center text block at the bottom of the image
        int y = image.getHeight() - textHeight - 10; // 10 is a bottom margin

        // Draw each line
        for (String line : lines) {
            int lineWidth = fm.stringWidth(line);
            int x = (imageWidth - lineWidth) / 2; // Center the line on the X axis
            g2d.drawString(line, x, y += fm.getAscent());
            y += fm.getDescent() + fm.getLeading(); // Move to the next line position
        }

        g2d.dispose();
        return image;
    }

    // Utility method to wrap text into lines
    private static List<String> wrapText(String text, FontMetrics fm, int maxWidth) {
        List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder(words[0]);

        for (int i = 1; i < words.length; i++) {
            if (fm.stringWidth(line + " " + words[i]) < maxWidth) {
                line.append(" ").append(words[i]);
            } else {
                lines.add(line.toString());
                line = new StringBuilder(words[i]);
            }
        }

        lines.add(line.toString());
        return lines;
    }
}
