package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;

import java.io.IOException;
import java.util.Map;

public interface ShortsService {
    Map<String, Double> analyzeText(String text);

    PromptResponseDto translatePrompt(PromptRequestDto requestDto) throws IOException;
}
