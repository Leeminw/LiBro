package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
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
}
