package com.ssafy.libro.domain.shorts.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShortsServiceImpl implements ShortsService {
    private static final String S3_BASE_URL = "https://%s.s3.amazonaws.com/";
    private static final String S3KEY_PREFIX = "shorts/";
    private static final String VIDEO_FILE_FORMAT = ".mp4";
    private static final int PROMPT_DIVIDE_NUM = 5;
    private static final int WIDTH = 360;
    private static final int HEIGHT = 640;
    private static final int FRAME_RATE = 30;
    private static final int VIDEO_WIDTH = 720;
    private static final int VIDEO_HEIGHT = 1280;

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    private final TaskServiceImpl taskService;
    private final PromptServiceImpl promptService;

    private final BookRepository bookRepository;
    private final TaskJpaRepository taskJpaRepository;

    @Override
    public ShortsResponseDto createShorts(ShortsRequestDto requestDto) throws IOException {
        return createOrGetShorts(requestDto.getTitle(), requestDto.getContent());
    }

    @Override
    public ShortsResponseDto getShortsByBookId(Long bookId) throws IOException {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new BookNotFoundException(bookId));
        return createOrGetShorts(book.getTitle(), book.getSummary());
    }

    private ShortsResponseDto createOrGetShorts(String title, String content) throws IOException {
        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(new PromptRequestDto(title, content));
        List<String> encodedImages = processPrompts(promptResponseDto.getEngPrompt());
        List<byte[]> decodedImages = decodeImages(encodedImages);

        // saveImages(decodedImages);

        Resource resource = createVideo(decodedImages);
        return ShortsResponseDto.builder()
                .title(promptResponseDto.getTitle())
                .content(promptResponseDto.getContent())
                .korPrompt(promptResponseDto.getKorPrompt())
                .engPrompt(promptResponseDto.getEngPrompt())
                .resource(resource)
                .build();
    }

    private List<String> processPrompts(String engPrompt) {
        String[] sentences = dividePrompt(engPrompt);
        List<String> encodedImages = new ArrayList<>();
        for (String sentence : sentences) {
            DiffusionResponseDto diffusionResponseDto = createImages(sentence);
            encodedImages.addAll(diffusionResponseDto.getImages());
        }
        return encodedImages;
    }

    private static String[] dividePrompt(String initPrompt) {
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* Request Stable Diffusion */
    private static DiffusionResponseDto createImages(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
        // String url = "http://127.0.0.1:7860/sdapi/v1/txt2img";
        DiffusionRequestDto diffusionRequestDto = new DiffusionRequestDto().updatePrompt(prompt);
        log.info(diffusionRequestDto.toString());
        HttpEntity<DiffusionRequestDto> request = new HttpEntity<>(diffusionRequestDto, httpHeaders);
        try {
            ResponseEntity<DiffusionResponseDto> response = restTemplate.postForEntity(url, request, DiffusionResponseDto.class);
            return Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No response body"));
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("Error while creating images with prompt '{}': {}", prompt, e.getMessage());
            throw new ResponseStatusException(e.getStatusCode(), "Error during image creation: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating images: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error during image creation");
        }
    }

    private static List<byte[]> decodeImages(List<String> base64Images) {
        List<byte[]> decodedImages = new ArrayList<>();
        for (String base64Image : base64Images) {
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            decodedImages.add(imageBytes);
        }
        return decodedImages;
    }

    private void saveImages(List<byte[]> decodedImages) throws IOException {
        Path outputPath = Paths.get("outputs");
        Files.createDirectories(outputPath);
        for (byte[] decodedImage : decodedImages) {
            String imageFileName = UUID.randomUUID() + ".jpg";
            Path imagePath = outputPath.resolve(imageFileName);
            Files.write(imagePath, decodedImage);
        }
    }

    private Resource createVideo(List<byte[]> decodedImages) throws IOException {
        Path outputPath = Paths.get("outputs");
        File videoFile = generateVideoFromImages(decodedImages, outputPath);
        byte[] videoBytes = Files.readAllBytes(videoFile.toPath());
//        uploadVideoToS3(videoFile);
        cleanUpTemporaryDirectory(outputPath);
//        return new FileSystemResource(videoFile);
        return new ByteArrayResource(videoBytes);
    }

    private File generateVideoFromImages(List<byte[]> decodedImages, Path tempDir) throws IOException {
        String videoFileName = UUID.randomUUID() + VIDEO_FILE_FORMAT;
        String videoFilePath = tempDir.resolve(videoFileName).toString();

        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
            recorder.setFrameRate(FRAME_RATE);
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.start();
            recordImagesToVideo(decodedImages, recorder);
        } catch (FrameRecorder.Exception e) {
            log.error("Error while generating video: {}", e.getMessage());
            throw new IOException("Error generating video", e);
        }

        return new File(videoFilePath);
    }

    private void recordImagesToVideo(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) throws FrameRecorder.Exception, IOException {
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

    private void uploadVideoToS3(File videoFile) {
        if (!videoFile.exists()) {
            log.error("Video file does not exist: {}", videoFile.getAbsolutePath());
            return;
        }
        String s3Key = S3KEY_PREFIX + videoFile.getName();
        amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
        log.info("Uploaded video to S3: {}", s3Key);
    }

    private void cleanUpTemporaryDirectory(Path tempDir) throws IOException {
        try (Stream<Path> walk = Files.walk(tempDir)) {
            walk.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(file -> {
                        if (!file.delete()) {
                            log.error("Failed to delete {}", file.getAbsolutePath());
                        }
                    });
        }
    }

//    private Resource createVideo(List<byte[]> decodedImages) throws IOException {
//        // 동영상 파일을 임시 디렉토리에 저장
//        Path tempDir = Files.createTempDirectory("outputs");
//        String videoFileName = UUID.randomUUID() + ".mp4";
//        String videoFilePath = tempDir.resolve(videoFileName).toString();
//
//        // ffmpeg를 사용하여 이미지로부터 동영상 생성
//        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
//            recorder.setFrameRate(FRAME_RATE);
//            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
//            recorder.setFormat("mp4");
//            recorder.start();
//
//            createVideo(decodedImages, recorder);
//            recorder.stop();
//        }
//
//        // 생성된 동영상에 자막추가 처리
//        // addSubtitlesToVideo(videoFilePath, videoFilePath, subtitleText, 0, 20000);
//        File videoFile = new File(videoFilePath);
//        String s3Url = saveVideoToS3Server(videoFile);
//
//
//        // S3에 업로드된 동영상 파일의 주소를, Book Entity의 shortsUrl 필드에 업데이트
//        Book book = bookRepository.findById()
//
//        // 임시 파일 및 디렉토리 삭제
//        try (Stream<Path> walk = Files.walk(tempDir)) {
//            walk.sorted(Comparator.reverseOrder())
//                    .map(Path::toFile)
//                    .forEach(file -> {
//                        if (!file.delete()) {
//                            log.error("Failed to delete {}", file.getAbsolutePath());
//                        }
//                    });
//        }
//
//        return new FileSystemResource(videoFile);
//    }
//
//    private String saveVideoToS3Server(File videoFile) {
//        // 생성된 동영상 파일을 S3에 저장
//        if (videoFile.exists()) {
//            String s3Key = "shorts/" + videoFile.getName();
//            amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
//            log.info("Uploaded video to S3: {}", s3Key);
//            return "https://" + bucketName + ".s3.amazonaws.com/" + s3Key;
//        } else {
//            log.error("Video file does not exist: {}", videoFile.getAbsolutePath());
//        }
//        return null;
//    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    public void createImages(PromptRequestDto promptRequestDto) throws IOException {
//        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(promptRequestDto);
//
//        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//
//        DiffusionRequestDto diffusionRequestDto = new DiffusionRequestDto();
//        diffusionRequestDto = diffusionRequestDto.updatePrompt(promptResponseDto.getEngPrompt());
//
//        HttpEntity<DiffusionRequestDto> request = new HttpEntity<>(diffusionRequestDto, httpHeaders);
//        ResponseEntity<DiffusionResponseDto> response = restTemplate.postForEntity(url, request, DiffusionResponseDto.class);
//
//        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
//            DiffusionResponseDto responseBody = response.getBody();
//            List<byte[]> decodedImages = decodeImages(responseBody.getImages());
//
//            // 이미지 데이터와 줄거리를 매개변수로 넣으면 동영상파일이 리턴됨
//
//            // 동영상 파일을 임시 디렉토리에 저장
//            Path tempDir = Files.createTempDirectory("outputs");
//            String videoFileName = UUID.randomUUID() + ".mp4";
//            String videoFilePath = tempDir.resolve(videoFileName).toString();
//
//            for (byte[] decodedImage : decodedImages) {
//                String imageFileName = UUID.randomUUID() + ".jpg";
//                Path imagePath = tempDir.resolve(imageFileName);
//                Files.write(imagePath, decodedImage);
//            }
//
//            // ffmpeg를 사용하여 이미지로부터 동영상 생성
//            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
//                recorder.setFrameRate(FRAME_RATE);
//                recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
//                recorder.setFormat("mp4");
//                recorder.start();
//
//                createVideo(decodedImages, recorder);
//                recorder.stop();
//            }
//
//            // 생성된 동영상에 자막추가 처리
//            // addSubtitlesToVideo(videoFilePath, videoFilePath, subtitleText, 0, 20000);
//
//            // 생성된 동영상 파일을 S3에 저장
//            saveVideoToS3Server(videoFilePath, videoFileName);
//
//            // S3에 업로드된 동영상 파일의 주소를, Book Entity의 shortsUrl 필드에 업데이트
//
//            // 임시 파일 및 디렉토리 삭제
//            try (Stream<Path> walk = Files.walk(tempDir)) {
//                walk.sorted(Comparator.reverseOrder())
//                        .map(Path::toFile)
//                        .forEach(file -> {
//                            if (!file.delete()) {
//                                log.error("Failed to delete {}", file.getAbsolutePath());
//                            }
//                        });
//            }
//
//            log.info("Images: {}", responseBody.getImages());
//            log.info("Parameters: {}", responseBody.getParameters());
//            log.info("Info: {}", responseBody.getInfo());
//        } else {
//            log.error("Failed to get a successful response");
//        }
//    }
//
//
//    private static void createVideo(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) {
//        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
//            for (byte[] imageBytes : decodedImages) {
//                BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
//                for (int i = 0; i < FRAME_RATE * (60 / decodedImages.size()); i++)
//                    recorder.record(frameConverter.convert(image));
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage());
//        }
//    }
//
//    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    public static String addSubtitlesToVideo(String inputVideoPath, String outputVideoPath, String subtitleText,
//                                             long startTimeMillis, long endTimeMillis) throws Exception {
//        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputVideoPath)) {
//            grabber.start();
//
//            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputVideoPath, grabber.getImageWidth(), grabber.getImageHeight(), grabber.getAudioChannels())) {
//                recorder.setFormat(grabber.getFormat());
//                recorder.setFrameRate(grabber.getFrameRate());
//                recorder.setVideoCodec(grabber.getVideoCodec());
//                recorder.setAudioChannels(grabber.getAudioChannels());
//                recorder.start();
//
//                // 문장 단위로 텍스트 나누기
//                String[] sentences = subtitleText.split("\\.\\s*|\\?\\s*|!\\s*");
//                long totalDuration = endTimeMillis - startTimeMillis;
//                long durationPerSentence = totalDuration / sentences.length;
//                long currentStartTime = startTimeMillis;
//
//                Frame frame;
//                int frameNumber = 0;
//
//                while ((frame = grabber.grabFrame()) != null) {
//                    long timestamp = grabber.getTimestamp();
//
//                    if (timestamp >= currentStartTime && timestamp <= currentStartTime + durationPerSentence) {
//                        String filterString = String.format("drawtext=text='%s':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=24:fontcolor=white", sentences[frameNumber]);
//                        try (FFmpegFrameFilter frameFilter = new FFmpegFrameFilter(filterString, grabber.getImageWidth(), grabber.getImageHeight())) {
//                            frameFilter.setPixelFormat(grabber.getPixelFormat());
//                            frameFilter.start();
//                            frameFilter.push(frame);
//                            frame = frameFilter.pull();
//                        }
//                    }
//
//                    recorder.record(frame);
//
//                    if (timestamp > currentStartTime + durationPerSentence) {
//                        currentStartTime += durationPerSentence;
//                        if (frameNumber < sentences.length)
//                            frameNumber++;
//                    }
//                }
//            }
//        }
//
//        return outputVideoPath; // 처리된 동영상 파일의 경로 반환
//    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//    public void createShorts() {
//        String outputFile = UUID.randomUUID() + ".mp4";
//        String[] imageFiles = {"00017-977685478.png", "00034-4170023442.png", "00042-3231078231.png"};
//        String text = "여기에 책의 줄거리가 들어갑니다. 이 텍스트는 여러 문장으로 구성될 수 있으며, 이미지 위에 표시됩니다.";
//
//        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(outputFile, WIDTH, HEIGHT)) {
//            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_MPEG4);
//            recorder.setFrameRate(FRAME_RATE);
//            recorder.setFormat("mp4");
//            recorder.start();
//
//            processImage(recorder, imageFiles, text);
//        } catch (Exception e) {
//            log.error(e.getMessage());
//        }
//    }
//
//
//
//
//    private void processImage(FFmpegFrameRecorder recorder, String[] imageFiles, String text) throws IOException {
//        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
//            for (String imageFile : imageFiles) {
//                BufferedImage originalImage = ImageIO.read(new File(imageFile));
//                BufferedImage overlayImage = overlayTextOnImage(originalImage, text);
//                for (int i = 0; i < FRAME_RATE * (60 / imageFiles.length); i++) {
//                    recorder.record(frameConverter.convert(overlayImage));
//                }
//            }
//        }
//    }
//
//    private static BufferedImage overlayTextOnImage(BufferedImage image, String text) {
//        // 텍스트 오버레이 설정
//        Graphics2D g2d = image.createGraphics();
//        Font font = new Font("Malgun Gothic", Font.BOLD, 150);
//        g2d.setFont(font);
//
//        FontMetrics fm = g2d.getFontMetrics();
//        int imageWidth = image.getWidth();
//
//        // Break the text into lines that fit the image width
//        List<String> lines = wrapText(text, fm, imageWidth - 20);
//
//        // Calculate the total height of the text block
//        int textHeight = lines.size() * fm.getHeight();
//
//        // Starting Y position to center text block at the bottom of the image
//        int y = image.getHeight() - textHeight - 10; // 10 is a bottom margin
//
//        // Draw each line
//        for (String line : lines) {
//            int lineWidth = fm.stringWidth(line);
//            int x = (imageWidth - lineWidth) / 2; // Center the line on the X axis
//            g2d.drawString(line, x, y += fm.getAscent());
//            y += fm.getDescent() + fm.getLeading(); // Move to the next line position
//        }
//
//        g2d.dispose();
//        return image;
//    }
//
//    // Utility method to wrap text into lines
//    private static List<String> wrapText(String text, FontMetrics fm, int maxWidth) {
//        List<String> lines = new ArrayList<>();
//        String[] words = text.split(" ");
//        StringBuilder line = new StringBuilder(words[0]);
//
//        for (int i = 1; i < words.length; i++) {
//            if (fm.stringWidth(line + " " + words[i]) < maxWidth) {
//                line.append(" ").append(words[i]);
//            } else {
//                lines.add(line.toString());
//                line = new StringBuilder(words[i]);
//            }
//        }
//
//        lines.add(line.toString());
//        return lines;
//    }
}
