package com.ssafy.libro.domain.shorts.controller;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import com.ssafy.libro.domain.shorts.service.ShortsService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ShortsController {

    private final ShortsService shortsService;

    @GetMapping("/api/v1/shorts/prompt")
    public ResponseEntity<?> analyzeText(@RequestParam String text) {
        log.debug("ShortsController - text: " + text);

        Map<String, Double> analysisResult = shortsService.analyzeText(text);
        // 맵의 엔트리 셋을 리스트로 변환
        List<Map.Entry<String, Double>> list = new ArrayList<>(analysisResult.entrySet());
        // 리스트를 Double 값에 따라 내림차순으로 정렬
        list.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

        log.debug("ShortsController - result: " + analysisResult.toString());
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(list));
    }

    @PostMapping("/api/v1/shorts/prompt/translate")
    public ResponseEntity<?> translatePrompt(@RequestBody PromptRequestDto requestDto) throws IOException {
        PromptResponseDto responseDto = shortsService.translatePrompt(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/shorts/create/test")
    public ResponseEntity<?> createShortsTest() {
        shortsService.createShorts();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("성공."));
    }
}
