package com.ssafy.libro.domain.shorts.controller;

import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import com.ssafy.libro.domain.shorts.service.PromptServiceImpl;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class PromptController {
    private final PromptServiceImpl promptService;

    @PostMapping("/api/v1/prompt/translate")
    public ResponseEntity<?> translatePrompt(@RequestBody PromptRequestDto requestDto) throws IOException {
        PromptResponseDto responseDto = promptService.convertText2Prompt(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

}
