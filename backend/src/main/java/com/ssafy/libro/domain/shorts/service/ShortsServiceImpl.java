package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.ffmpeg.global.avcodec.*;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ShortsServiceImpl implements ShortsService {

    private static final int ITERATIONS = 100; // 반복 횟수를 늘림
    private static final double MIN_DIFF = 0.001; // 수렴 조건을 위한 최소 차이
    private static final double DAMPING_FACTOR = 0.85;

    private static class Graph {
        Map<String, List<String>> edges = new HashMap<>();

        void addEdge(String source, String target) {
            edges.computeIfAbsent(source, k -> new ArrayList<>()).add(target); // 양방향으로 연결
            edges.computeIfAbsent(target, k -> new ArrayList<>()).add(source); // 양방향으로 연결
        }

        List<String> getNeighbors(String node) {
            return edges.getOrDefault(node, new ArrayList<>());
        }
    }

    @Override
    public Map<String, Double> analyzeText(String text) {
        Graph graph = new Graph();

        // 텍스트 전처리: 영문은 소문자로, 한글은 그대로 유지하며, 특수 문자와 불필요한 공백 및 줄바꿈 제거
        String processedText = text
                .replaceAll("[^a-zA-Z가-힣0-9\\s]", "") // 영문, 한글을 제외한 모든 문자 제거
                .replaceAll("\\s+", " ") // 여러 개의 공백을 하나의 공백으로 변환
                .toLowerCase()  // 영문 문자를 소문자로 변환. 한글은 변화 없음.
                .trim(); // 문자열 앞뒤의 공백 제거
        log.debug("ShortsService - processedText: " + processedText);

        // 단어 토큰화
        String[] tokens = processedText.split("\\s+");
        log.debug("ShortsService - tokens: " + Arrays.toString(tokens));

        // 그래프 구성: 각 단어를 노드로 추가하고, 연속적으로 나타나는 단어들 사이에 엣지를 추가
        for (int i = 0; i < tokens.length; i++) {
            String currentWord = tokens[i];

            // 연속적인 단어 사이에 엣지 추가
            if (i < tokens.length - 1) {
                String nextWord = tokens[i + 1];
                graph.addEdge(currentWord, nextWord);
            }
        }

        log.debug("ShortsService - graph: " + graph.edges.toString());
        return calculateTextRank(graph);
    }

    private static final String sourceLang = "ko";
    private static final String targetLang = "en";
    @Override
    public PromptResponseDto translatePrompt(PromptRequestDto requestDto) throws IOException {
        String encodedText = URLEncoder.encode(requestDto.getSummary(), StandardCharsets.UTF_8);
        String urlString = String.format("https://translate.google.com/m?hl=%s&sl=%s&q=%s",
                targetLang, sourceLang, encodedText);

        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder response = new StringBuilder();
        String inputLine;
        while ((inputLine = br.readLine()) != null)
            response.append(inputLine);
        br.close();

        Pattern pattern = Pattern.compile("<div class=\\\"result-container\\\">(.*?)</div>");
        Matcher matcher = pattern.matcher(response.toString());
        String translatedText = matcher.find() ? matcher.group(1) : "Not Found";
        log.debug("ShortsService - translated prompt: " + translatedText);
        return new PromptResponseDto(requestDto.getTitle(), requestDto.getSummary(), translatedText);
    }

    private Map<String, Double> calculateTextRank(Graph graph) {
        Map<String, Double> score = new HashMap<>();
        for (String node : graph.edges.keySet())
            score.put(node, 1.0);

        boolean converged = false;
        for (int i = 0; i < ITERATIONS; i++) {
            Map<String, Double> tempScore = new HashMap<>();
            for (String node : graph.edges.keySet()) {
                double rank = 1 - DAMPING_FACTOR;
                for (String neighbor : graph.getNeighbors(node)) {
                    rank += DAMPING_FACTOR * (score.get(neighbor) / graph.getNeighbors(neighbor).size());
                }
                tempScore.put(node, rank);
                converged = !(Math.abs(rank - score.get(node)) > MIN_DIFF);
            }
            score = tempScore;
            if (converged) break;
        }

        return score;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
