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
import java.awt.*;
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
    private static final int PROMPT_DIVIDE_NUM = 3;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private ShortsResponseDto createOrGetShorts(String title, String content) throws IOException {
        PromptResponseDto promptResponseDto = promptService.translateText2Prompt(new PromptRequestDto(title, content));
        List<String> encodedImages = requestStableDiffusion(promptResponseDto.getEngPrompt());
        List<byte[]> decodedImages = decodeImages(encodedImages);

        /* Local 환경 테스트용 임시 코드*/
        /*String[] imageFiles = {"00017-977685478.png", "00034-4170023442.png", "00042-3231078231.png"};
        List<byte[]> decodedImages = new ArrayList<>();
        for (String imageFile : imageFiles) {
            Path imageFilePath = Paths.get(imageFile);
            byte[] imageBytes = Files.readAllBytes(imageFilePath);
            decodedImages.add(imageBytes);
        }*/
        /* Local 환경 테스트용 임시 코드*/

        // saveImages(decodedImages);
        Resource sourceResource = createVideo(decodedImages, promptResponseDto.getKorPrompt());
        Resource targetResource = convertFileSystem2ByteArrayResource((FileSystemResource) sourceResource);
        String filename = sourceResource.getFilename();
        cleanupTemporaryDirectory(Paths.get("outputs"));

        return ShortsResponseDto.builder()
                .title(promptResponseDto.getTitle())
                .content(promptResponseDto.getContent())
                .korPrompt(promptResponseDto.getKorPrompt())
                .engPrompt(promptResponseDto.getEngPrompt())
                .resource(targetResource)
                .filename(filename)
                .build();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private List<String> requestStableDiffusion(String engPrompt) {
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
    
    private static DiffusionResponseDto createImages(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
//        String url = "http://127.0.0.1:7860/sdapi/v1/txt2img";
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            Path imageFilePath = outputPath.resolve(imageFileName);
            Files.write(imageFilePath, decodedImage);
        }
    }

    private Resource createVideo(List<byte[]> decodedImages, String sentences) throws IOException {
        Path outputPath = Paths.get("outputs");
        Files.createDirectories(outputPath);

        File videoFile = sentences == null || sentences.isEmpty() ?
                generateVideoFromImages(decodedImages, outputPath) :
                generateSubtitledVideoFromImages(decodedImages, sentences, outputPath);

//        uploadVideoToS3(videoFile);
        return new FileSystemResource(videoFile);
    }

    private Resource convertFileSystem2ByteArrayResource(FileSystemResource fileSystemResource) throws IOException {
        Path filePath = Paths.get(fileSystemResource.getPath());
        byte[] fileBytes = Files.readAllBytes(filePath);
        return new ByteArrayResource(fileBytes);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private File generateVideoFromImages(List<byte[]> decodedImages, Path outputPath) throws IOException {
        String videoFileName = UUID.randomUUID() + VIDEO_FILE_FORMAT;
        String videoFilePath = outputPath.resolve(videoFileName).toString();

        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
            recorder.setFrameRate(FRAME_RATE);
            recorder.setFormat("mp4");
            recorder.start();

            recordImagesToVideo(decodedImages, recorder);
        }

        return new File(videoFilePath);
    }

    private void recordImagesToVideo(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) throws IOException {
        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
            for (byte[] imageBytes : decodedImages) {
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
                for (int i = 0; i < FRAME_RATE * (60 / decodedImages.size()); i++)
                    recorder.record(frameConverter.convert(image));
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private File generateSubtitledVideoFromImages(List<byte[]> decodedImages, String sentences, Path outputPath) throws IOException {
        String videoFileName = UUID.randomUUID() + VIDEO_FILE_FORMAT;
        String videoFilePath = outputPath.resolve(videoFileName).toString();

        try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
            recorder.setFrameRate(FRAME_RATE);
            recorder.setFormat("mp4");
            recorder.start();

            List<byte[]> subtitledImages = createSubtitledImages(decodedImages, sentences);
            recordImagesToVideo(subtitledImages, recorder);
        } catch (FrameRecorder.Exception e) {
            log.error("Error while generating video with subtitle: {}", e.getMessage());
            throw new IOException("Error generating video", e);
        }

        return new File(videoFilePath);
    }

    // 최대공약수(GCD)를 구하는 메소드
    private static int gcd(int a, int b) {
        if (b == 0) return a;
        return gcd(b, a % b);
    }

    // 최소공배수(LCM)를 구하는 메소드
    private static int lcm(int a, int b) {
        return a * (b / gcd(a, b));
    }

    private static List<byte[]> createSubtitledImages(List<byte[]> decodedImages, String sentences) throws IOException {
        String[] subtitles = sentences.split(",");
        int cntSubtitledImages = lcm(decodedImages.size(), subtitles.length);

        // 이미지 & 자막의 반복 비율 계산
        int imageRepeatRate = cntSubtitledImages / decodedImages.size();
        int subtitleRepeatRate = cntSubtitledImages / subtitles.length;

        List<byte[]> subtitledImages = new ArrayList<>();
        for (int i = 0; i < cntSubtitledImages; i++) {
            int imageIndex = (i / imageRepeatRate) % decodedImages.size();
            int subtitleIndex = (i / subtitleRepeatRate) % subtitles.length;

            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(decodedImages.get(imageIndex)));
            BufferedImage overlayImage = overlayTextOnImage(originalImage, subtitles[subtitleIndex]);
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ImageIO.write(overlayImage, "jpg", baos);
                subtitledImages.add(baos.toByteArray());
            }
        }
        return subtitledImages;
    }


    public static File addSubtitleToVideo(String inputPath, String sentences, Path outputPath) {
        String videoFileName = UUID.randomUUID() + VIDEO_FILE_FORMAT;
        String videoFilePath = outputPath.resolve(videoFileName).toString();

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(inputPath);
             FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, grabber.getImageWidth(), grabber.getImageHeight())) {
            grabber.start();
            recorder.setFrameRate(FRAME_RATE);
            recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.start();

            Java2DFrameConverter frameConverter = new Java2DFrameConverter();
            String[] subtitles = sentences.split(",");

            Frame frame;
            while ((frame = grabber.grabImage()) != null) {
                BufferedImage bufferedImage = frameConverter.convert(frame);
                for (String subtitle : subtitles) {
                    BufferedImage overlayedImage = overlayTextOnImage(bufferedImage, subtitle);
                    recorder.record(frameConverter.convert(overlayedImage));
                }
            }

            recorder.stop();
            grabber.stop();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return new File(videoFilePath);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private static BufferedImage overlayTextOnImage(BufferedImage image, String text) {
        Graphics2D g2d = image.createGraphics();
        Font font = new Font("Malgun Gothic", Font.BOLD, 125);
        g2d.setFont(font);

        FontMetrics fm = g2d.getFontMetrics();
        int imageWidth = image.getWidth();

        List<String> lines = wrapText(text, fm, imageWidth - 20);
        int textHeight = lines.size() * fm.getHeight();
        int y = (image.getHeight() - textHeight) / 2;   // 가운데 정렬
//        int y = (image.getHeight() - textHeight) - 10;  // 아래쪽 정렬, margin 10

        for (String line : lines) {
            int lineWidth = fm.stringWidth(line);
            int x = (imageWidth - lineWidth) / 2;
            g2d.drawString(line, x, y += fm.getAscent());
            y += fm.getDescent() + fm.getLeading();
        }

        g2d.dispose();
        return image;
    }

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private void uploadVideoToS3(File videoFile) {
        if (!videoFile.exists()) {
            log.error("Video file does not exist: {}", videoFile.getAbsolutePath());
            return;
        }
        String s3Key = S3KEY_PREFIX + videoFile.getName();
        amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
        log.info("Uploaded video to S3: {}", s3Key);
    }

    public void cleanupTemporaryDirectory(Path path) throws IOException {
        try (Stream<Path> stream = Files.walk(path)) {
            stream.sorted(Comparator.reverseOrder()).map(Path::toFile)
                    .forEach(file -> {
                        if (!file.delete())
                            log.error("Failed to delete {}", file.getAbsolutePath());
                    });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    public static void addSubtitleToVideo(File videoFile, String sentences) {
//        try (FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(videoFile)) {
//            frameGrabber.start();
//            // 동영상을 쓰기 위한 FrameRecorder 초기화
//            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFile, frameGrabber.getImageWidth(), frameGrabber.getImageHeight())) {
//                recorder.setVideoCodec(frameGrabber.getVideoCodec()); // 동일한 코덱 사용
//                recorder.setFrameRate(frameGrabber.getFrameRate()); // 동일한 프레임 레이트 사용
//                recorder.start();
//
//                // 자막으로 사용할 문장 배열
//                String[] subtitles = sentences.split(",");
//                int subtitleIndex = 0; // 현재 표시할 자막 인덱스
//                int frameCountPerSubtitle = (int) frameGrabber.getLengthInFrames() / subtitles.length; // 각 자막을 표시할 프레임 수
//
//                Frame frame;
//                int frameCount = 0;
//                while ((frame = frameGrabber.grab()) != null && subtitleIndex < subtitles.length) {
//                    if (frame.image != null) {
//                        // 현재 프레임 번호가 다음 자막으로 넘어갈 시점인지 확인
//                        if (frameCount >= frameCountPerSubtitle * (subtitleIndex + 1)) {
//                            subtitleIndex++; // 다음 자막으로 넘어감
//                        }
//
//                        // 현재 자막을 프레임에 추가
//                        if (subtitleIndex < subtitles.length) {
//                            addSubtitleToFrame(frame, subtitles[subtitleIndex]);
//                        }
//
//                        recorder.record(frame); // 처리된 프레임을 출력 동영상에 기록
//                    }
//                    frameCount++;
//                }
//                recorder.stop();
//            }
//            frameGrabber.stop();
//        } catch (Exception e) {
//            log.error("Exception");
//        }
//    }
//
//    private static void addSubtitleToFrame(Frame frame, String subtitle) {
//        // JavaCV에서 Frame을 OpenCV의 Mat 객체로 변환
//        try (OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat()) {
//            Mat mat = converter.convert(frame);
//
//            // 자막을 추가할 위치와 스타일 설정
//            int fontSize = 11; // 폰트 크기
//            int thickness = 4; // 폰트 두께
//            int fontFace = FONT_HERSHEY_SIMPLEX;
//            Scalar color = new Scalar(255, 255, 255, 0); // 흰색
//            IntPointer baseLine = new IntPointer(1);
//
//            // 프레임 크기에 맞춰 자막 줄바꿈 계산
//            String[] words = subtitle.split(" ");
//            List<String> lines = new ArrayList<>();
//            String currentLine = "";
//            for (String word : words) {
//                String testLine = currentLine + word + " ";
//                Size textSize = getTextSize(testLine, fontFace, fontSize, thickness, baseLine);
//                if (textSize.get(0) <= mat.cols()) { // 현재 줄에 단어를 추가
//                    currentLine = testLine;
//                } else { // 새 줄 시작
//                    lines.add(currentLine);
//                    currentLine = word + " ";
//                }
//            }
//            lines.add(currentLine); // 마지막 줄 추가
//
//            // 각 줄을 프레임 중앙에 추가
//            int startY = (mat.rows() - lines.size() * 30) / 2; // 시작 Y 위치 조정
//            for (String line : lines) {
//                Size textSize = getTextSize(line.trim(), fontFace, fontSize, thickness, baseLine);
//                int x = (mat.cols() - (int) textSize.width()) / 2;
//                int y = startY + (int) textSize.height();
//                startY += 30; // 다음 줄의 Y 위치
//
//                // 자막을 프레임에 추가하는 수정된 코드 부분
//                putText(mat, line.trim(), new Point(x, y), fontFace, fontSize, color, thickness, LINE_AA, false);
//
//            }
//
//            // 수정된 Mat 객체를 다시 Frame으로 변환
//            Frame newFrame = converter.convert(mat);
//            frame.image = newFrame.image;
//        }
//    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//                Path imageFilePath = tempDir.resolve(imageFileName);
//                Files.write(imageFilePath, decodedImage);
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

}
