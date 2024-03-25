package com.ssafy.libro.domain.shorts.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import com.ssafy.libro.domain.shorts.dto.ShortsRequestDto;
import com.ssafy.libro.domain.shorts.dto.ShortsResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShortsServiceImpl implements ShortsService {

    private final PromptServiceImpl promptService;

    @Override
    public void createImages(PromptRequestDto promptRequestDto) throws IOException {
        PromptResponseDto promptResponseDto = promptService.convertText2Prompt(promptRequestDto);

        String url = "http://222.107.238.44:7860/sdapi/v1/txt2img";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        ShortsRequestDto shortsRequestDto = new ShortsRequestDto();
        shortsRequestDto = shortsRequestDto.updatePrompt(promptResponseDto.getEngPrompt());

        HttpEntity<ShortsRequestDto> request = new HttpEntity<>(shortsRequestDto, httpHeaders);
        ResponseEntity<ShortsResponseDto> response = restTemplate.postForEntity(url, request, ShortsResponseDto.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            ShortsResponseDto responseBody = response.getBody();
            List<byte[]> decodedImages = decodeImages(responseBody.getImages());

            // 이미지 데이터와 줄거리를 매개변수로 넣으면 동영상파일이 리턴됨

            // 이미지 파일을 임시 디렉토리에 저장
            Path tempDir = Files.createTempDirectory("outputs");
//            for (int i = 0; i < decodedImages.size(); i++) {
//                Path imagePath = tempDir.resolve(String.format("image%03d.jpg", i));
//                Files.write(imagePath, decodedImages.get(i));
//            }

            // ffmpeg를 사용하여 이미지로부터 동영상 생성
            String videoFileName = UUID.randomUUID() + ".mp4";
            String videoFilePath = tempDir.resolve(videoFileName).toString();

            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(videoFilePath, VIDEO_WIDTH, VIDEO_HEIGHT)) {
                recorder.setFrameRate(FRAME_RATE);
                recorder.setVideoCodec(org.bytedeco.ffmpeg.global.avcodec.AV_CODEC_ID_H264);
                recorder.setFormat("mp4");
                recorder.start();

                createShorts(decodedImages, recorder);

                recorder.stop();
            } catch (Exception e) {
                log.error(e.getMessage());
            }

            // 리턴된 동영상 파일을 S3에 저장하면 끝!!!
//            try {
//                // AWS S3 클라이언트 초기화
//                S3Client s3 = S3Client.builder()
//                        .region(Region.of("YOUR_REGION")) // 예: us-east-1
//                        .credentialsProvider(DefaultCredentialsProvider.create())
//                        .build();
//
//                // S3 버킷 이름과 파일명 설정
//                String bucketName = "YOUR_BUCKET_NAME";
//                // 파일을 S3에 업로드
//                s3.putObject(PutObjectRequest.builder()
//                                .bucket(bucketName)
//                                .key("videos/" + videoFileName) // 예: videos/UUID.mp4
//                                .build(),
//                        RequestBody.fromFile(new File(videoFilePath)));
//
//                log.info("Video uploaded to S3: " + videoFileName);
//            } catch (Exception e) {
//                log.error("Failed to upload video to S3: " + e.getMessage());
//            }

            // 임시 파일 및 디렉토리 삭제
            try {
                Files.walk(tempDir)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            } catch (IOException e) {
                log.error("Failed to delete temp files: " + e.getMessage());
            }


            log.info("Images: {}", responseBody.getImages());
            log.info("Parameters: {}", responseBody.getParameters());
            log.info("Info: {}", responseBody.getInfo());
        } else {
            log.error("Failed to get a successful response");
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

    private static void createShorts(List<byte[]> decodedImages, FFmpegFrameRecorder recorder) {
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


//    private void uploadFileToS3(String bucketName, String key, String filePath) {
//        s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(key).build(),
//                RequestBody.fromFile(new File(filePath)));
//        log.info("File uploaded to S3 bucket: " + bucketName + ", Key: " + key);
//    }

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
