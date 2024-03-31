package com.ssafy.libro.domain.shorts.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import com.ssafy.libro.domain.shorts.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.font.TextLayout;
import java.awt.geom.AffineTransform;
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
    private static final int FRAME_RATE = 30;
    private static final int VIDEO_WIDTH = 720;     // 360, 720, 1080
    private static final int VIDEO_HEIGHT = 1280;   // 640, 1280, 1920

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;
    private final AmazonS3 amazonS3;

    private final BookRepository bookRepository;
    private final PromptServiceImpl promptService;

//    @Scheduled(cron = "0 */1 * * * *", zone = "Asia/Seoul")
    private void autoCreateShorts4ExistsBook() throws IOException {
        List<Book> books = bookRepository.findAllByShortsUrlIsNull().orElseThrow(
                () -> new BookNotFoundException(""));

        for (Book book : books) {
            log.info(String.format("Start Creating Shorts and Save into S3 Server: BookId = %05d", book.getId()));
            log.info(String.format("Start Creating Shorts and Save into S3 Server: Title = %s", book.getTitle()));
            log.info(String.format("Start Creating Shorts and Save into S3 Server: Summary = %s", book.getSummary()));
            try {
                ShortsRequestDto shortsRequestDto = ShortsRequestDto.builder()
                        .title(book.getTitle())
                        .content(book.getSummary())
                        .build();
                ShortsResponseDto shortsResponseDto = createShorts(shortsRequestDto);
                String s3Url = uploadVideoToS3(shortsResponseDto.getResource(), shortsResponseDto.getFilename());
                bookRepository.save(book.updateShortsUrl(s3Url));
            } catch (IOException e) {
                log.error(e.getMessage());
            }
            log.info(String.format("Complete Creating Shorts and Save into S3 Server: BookId = %05d", book.getId()));
            log.info(String.format("Complete Creating Shorts and Save into S3 Server: Title = %s", book.getTitle()));
            log.info(String.format("Complete Creating Shorts and Save into S3 Server: Summary = %s", book.getSummary()));
            log.info(String.format("Complete Creating Shorts and Save into S3 Server: S3 URL = %s", book.getShortsUrl()));
        }
    }

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
//        String[] imageFiles = {"00017-977685478.png", "00034-4170023442.png", "00042-3231078231.png"};
//        List<byte[]> decodedImages = new ArrayList<>();
//        for (String imageFile : imageFiles) {
//            Path imageFilePath = Paths.get(imageFile);
//            byte[] imageBytes = Files.readAllBytes(imageFilePath);
//            decodedImages.add(imageBytes);
//        }
        /* Local 환경 테스트용 임시 코드*/

        // saveImages(decodedImages);
        // Resource srouceResource = createVideo(decodedImages, promptResponseDto.getKorPrompt());
        Resource srouceResource = createVideo(decodedImages, content + "\n" + title);
        Resource targetResource = convertByteArrayResource(srouceResource);
        String filename = srouceResource.getFilename();

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

    private static String[] dividePrompt(String summary) {
        String processedSummary = summary.replaceAll("\\s+", "\n");
        String[] splitSummary = processedSummary.split("[.!?]+\\s+|\\r?\\n");;

        int elemNumPerPrompt = (int) Math.ceil((double) splitSummary.length / PROMPT_DIVIDE_NUM);

        String[] sentences = new String[PROMPT_DIVIDE_NUM];
        for (int i = 0; i < PROMPT_DIVIDE_NUM; i++) {
            StringBuilder sb = new StringBuilder();

            int initIndex = i * elemNumPerPrompt;
            int exitIndex = (i + 1) * elemNumPerPrompt;
            for (int j = initIndex; j < Math.min(exitIndex, splitSummary.length); j++)
                sb.append(splitSummary[j]).append(", ");
            sentences[i] = sb.toString();
        }
        return sentences;
    }

//    private static String[] dividePrompt(String initPrompt) {
//        String[] splitPrompts = initPrompt.split(", ");
//        int elemNumPerPrompt = (int) Math.ceil((double) splitPrompts.length / PROMPT_DIVIDE_NUM);
//
//        String[] sentences = new String[PROMPT_DIVIDE_NUM];
//        for (int i = 0; i < PROMPT_DIVIDE_NUM; i++) {
//            StringBuilder sb = new StringBuilder();
//
//            int initIndex = i * elemNumPerPrompt;
//            int exitIndex = (i + 1) * elemNumPerPrompt;
//            for (int j = initIndex; j < Math.min(exitIndex, splitPrompts.length); j++)
//                sb.append(splitPrompts[j]).append(", ");
//            sentences[i] = sb.toString();
//        }
//        return sentences;
//    }

    private static DiffusionResponseDto createImages(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

//         String url = "http://127.0.0.1:7860/sdapi/v1/txt2img";
        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
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

        // uploadVideoToS3(videoFile);
        return new FileSystemResource(videoFile);
    }

    private Resource convertByteArrayResource(Resource resource) throws IOException {
        Path filePath = resource.getFile().toPath();
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

    private void recordImagesToVideo(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) throws IOException {
        try (Java2DFrameConverter frameConverter = new Java2DFrameConverter()) {
            for (byte[] imageBytes : decodedImages) {
                BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
                for (int i = 0; i < (FRAME_RATE * 60) / decodedImages.size(); i++)
                    recorder.record(frameConverter.convert(image));
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        String[] subtitles = sentences.split("(?<=[.!?])\\s*|\\n+");
        int cntSubtitledImages = lcm(decodedImages.size(), subtitles.length);
        log.info(Arrays.toString(subtitles));

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private static BufferedImage overlayTextOnImage(BufferedImage image, String text) {
        Graphics2D g2d = image.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
//        Font font = new Font("Noto Sans CJK KR", Font.BOLD, 64);
        Font font = new Font("Nanum Pen Script", Font.BOLD, 54);
//        Font font = new Font("Nanum Pen", Font.BOLD, 54);
        g2d.setFont(font);

        FontMetrics fm = g2d.getFontMetrics();
        int imageWidth = image.getWidth();

        List<String> lines = wrapText(text, fm, imageWidth - 20);
        int textHeight = lines.size() * fm.getHeight();

        int margin = 10; // 텍스트 배경 마진
        int padding = 5; // 텍스트 배경 패딩
        int backgroundHeight = textHeight + 2 * (margin + padding);

        int yBackground = (image.getHeight() - backgroundHeight) / 2;
        int yText = yBackground + margin + padding + fm.getAscent();

        // 배경 그리기
        g2d.setColor(new Color(0, 0, 0, 123)); // 반투명 검은색
        g2d.fillRect(0, yBackground, imageWidth, backgroundHeight);

        // 텍스트 및 윤곽선의 색상과 스트로크 설정
        Color textColor = Color.WHITE;
        Color outlineColor = Color.BLACK;
        Stroke stroke = new BasicStroke(8); // 윤곽선 두께

        for (String line : lines) {
            int lineWidth = fm.stringWidth(line);
            int xText = (imageWidth - lineWidth) / 2;

            TextLayout textLayout = new TextLayout(line, font, g2d.getFontRenderContext());
            AffineTransform transform = AffineTransform.getTranslateInstance(xText, yText);
            Shape outline = textLayout.getOutline(transform);

            // 윤곽선 그리기
            g2d.setStroke(stroke);
            g2d.setColor(outlineColor);
            g2d.draw(outline);

            // 텍스트 채우기
            g2d.setColor(textColor);
            g2d.fill(outline);

            yText += fm.getAscent() + fm.getDescent() + fm.getLeading();
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
    public String uploadVideoToS3(File videoFile) {
        if (!videoFile.exists()) {
            log.error("Video file does not exist: {}", videoFile.getAbsolutePath());
            return null;
        }
        String s3Key = S3KEY_PREFIX + videoFile.getName();
        amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, videoFile));
        log.info("Uploaded video to S3: {}", s3Key);

        // return uploaded file S3 URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, amazonS3.getRegionName(), s3Key);
    }

    public String uploadVideoToS3(Resource resource, String filename) throws IOException {
        try (InputStream inputStream = resource.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(inputStream.available());


            String s3Key = S3KEY_PREFIX + filename;
            amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, inputStream, metadata));

            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, amazonS3.getRegionName(), s3Key);
        }
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

}
