package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;

import java.io.IOException;

public interface PromptService {

    PromptResponseDto tokenizeText2Prompt(PromptRequestDto requestDto) throws IOException;
    PromptResponseDto translateText2Prompt(PromptRequestDto requestDto) throws IOException;

}
