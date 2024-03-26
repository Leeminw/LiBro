package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PromptServiceImpl implements PromptService {

    @Override
    public PromptResponseDto tokenizeText2Prompt(PromptRequestDto requestDto) throws IOException {
        String tokenizedText = tokenizeText(requestDto.getContent());
        String translatedEngText = translateRequest(tokenizedText, "ko", "en");
        String translatedKorText = translateRequest(tokenizedText, "en", "ko");
        return PromptResponseDto.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .engPrompt(translatedEngText)
                .korPrompt(translatedKorText)
                .build();
    }

    @Override
    public PromptResponseDto translateText2Prompt(PromptRequestDto requestDto) throws IOException {
        String processedText = preprocessingText(requestDto.getContent());
        String translatedEngText = translateRequest(processedText, "ko", "en");
        String translatedKorText = translateRequest(processedText, "en", "ko");
        return PromptResponseDto.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .engPrompt(translatedEngText)
                .korPrompt(translatedKorText)
                .build();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private String tokenizeText(String text) {
        /* 특수문자 및 줄바꿈 전처리 */
        return text.replaceAll("[^a-zA-Z가-힣0-9\\s]", "")
                .replaceAll("\\s+", ", ")
                .toLowerCase()
                .trim();
    }

    private String preprocessingText(String text) {
        /* 특수문자 및 줄바꿈 전처리 */
        return text.replaceAll("[^a-zA-Z가-힣0-9\\s,.!?]", "")
                .replaceAll("[,.!?]", ",")
                .replaceAll("\\s+", " ")
                .toLowerCase()
                .trim();
    }

    private String translateRequest(String text, String sourceLang, String targetLang) throws IOException {
        /* Encoding Text UTF-8 CharacterSet */
        String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
        String requestURL = String.format("https://translate.google.com/m?sl=%s&tl=%s&q=%s",
                sourceLang, targetLang, encodedText);

        /* Request Translate */
        URL url = new URL(requestURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

        /* Response Translate */
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
        }

        /* Extract Translated Text */
        Pattern pattern = Pattern.compile("<div class=\"result-container\">(.*?)</div>");
        Matcher matcher = pattern.matcher(response.toString());
        return matcher.find() ? matcher.group(1) : "Not Found";
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    private static final int ITERATIONS = 100; // 계산 반복 횟수
//    private static final double MIN_DIFF = 0.001; // 수렴 조건을 위한 최소 차이
//    private static final double DAMPING_FACTOR = 0.85;
//
//    private static class Graph {
//        Map<String, List<String>> edges = new HashMap<>();
//
//        void addEdge(String source, String target) {
//            edges.computeIfAbsent(source, k -> new ArrayList<>()).add(target); // 양방향으로 연결
//            edges.computeIfAbsent(target, k -> new ArrayList<>()).add(source); // 양방향으로 연결
//        }
//
//        List<String> getNeighbors(String node) {
//            return edges.getOrDefault(node, new ArrayList<>());
//        }
//    }
//
//    @Override
//    public PromptResponseDto convertText2Prompt(PromptRequestDto requestDto) throws IOException {
//        /* 특수문자 전처리 */
//        String processedText = requestDto.getSummary()
//                .replaceAll("[^a-zA-Z가-힣0-9\\s]", "")
//                .replaceAll("\\s+", " ")
//                .toLowerCase()
//                .trim();
//
//        /* TextRank 문자열 우선순위 계산 */
//        Graph graph = new Graph();
//        String[] tokens = processedText.split("\\s+");
//        for (int i = 0; i < tokens.length - 1; i++)
//            graph.addEdge(tokens[i], tokens[i + 1]);
//
//        /* TextRank Graph 초기화 */
//        Map<String, Double> score = new HashMap<>();
//        for (String node : graph.edges.keySet())
//            score.put(node, 1.0);
//
//        /* TextRank 계산 수행 */
//        boolean converged = false;
//        for (int i = 0; i < ITERATIONS; i++) {
//            Map<String, Double> tempScore = new HashMap<>();
//            for (String node : graph.edges.keySet()) {
//                double rank = 1 - DAMPING_FACTOR;
//                for (String neighbor : graph.getNeighbors(node)) {
//                    rank += DAMPING_FACTOR * (score.get(neighbor) / graph.getNeighbors(neighbor).size());
//                }
//                tempScore.put(node, rank);
//                converged = !(Math.abs(rank - score.get(node)) > MIN_DIFF);
//            }
//            score = tempScore;
//            if (converged) break;
//        }
//
//        /* 우선순위대로 나열 후 영문 번역 */
//        String korPrompt = score.entrySet().stream()
//                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
//                .limit(200) // 상위 200개 키로 제한
//                .map(Map.Entry::getKey)
//                .collect(Collectors.joining(", "));
//        String engPrompt = translateText2Text(korPrompt, "ko", "en");
//        return new PromptResponseDto(requestDto.getTitle(), requestDto.getSummary(), korPrompt, engPrompt);
//    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    @Override
//    public PromptResponseDto convertText2Prompt(PromptRequestDto requestDto) throws IOException {
//        String translatedText = translateText2Text(requestDto.getSummary(), "ko", "en");
//
//        /* 특수문자 전처리 */
//        String processedText = translatedText
//                .replaceAll("[^a-zA-Z가-힣0-9\\s]", "")
//                .replaceAll("\\s+", " ")
//                .toLowerCase()
//                .trim();
//        String[] tokens = processedText.split("\\s+");
//        Graph graph = new Graph();
//        for (int i = 0; i < tokens.length - 1; i++)
//            graph.addEdge(tokens[i], tokens[i + 1]);
//
//        Map<String, Double> score = new HashMap<>();
//        for (String node : graph.edges.keySet())
//            score.put(node, 1.0);
//
//        boolean converged = false;
//        for (int i = 0; i < ITERATIONS; i++) {
//            Map<String, Double> tempScore = new HashMap<>();
//            for (String node : graph.edges.keySet()) {
//                double rank = 1 - DAMPING_FACTOR;
//                for (String neighbor : graph.getNeighbors(node)) {
//                    rank += DAMPING_FACTOR * (score.get(neighbor) / graph.getNeighbors(neighbor).size());
//                }
//                tempScore.put(node, rank);
//                converged = !(Math.abs(rank - score.get(node)) > MIN_DIFF);
//            }
//            score = tempScore;
//            if (converged) break;
//        }
//
//        String engPrompt = score.entrySet().stream()
//                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
//                .map(Map.Entry::getKey)
//                .collect(Collectors.joining(", "));
//        String korPrompt = translateText2Text(engPrompt, "en", "ko");
//        return new PromptResponseDto(requestDto.getTitle(), requestDto.getSummary(), korPrompt, engPrompt);
//    }

}
