package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;

import java.io.IOException;

public interface PromptService {

    String translateText2Text(String text, String sourceLang, String targetLang) throws IOException;

    PromptResponseDto convertText2Prompt(PromptRequestDto requestDto) throws IOException;

}
