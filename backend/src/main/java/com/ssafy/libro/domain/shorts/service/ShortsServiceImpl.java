package com.ssafy.libro.domain.shorts.service;

import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.List;

@Slf4j
@Service
public class ShortsServiceImpl implements ShortsService {

    private static final int WIDTH = 360;
    private static final int HEIGHT = 640;
    private static final int FRAME_RATE = 1;

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
