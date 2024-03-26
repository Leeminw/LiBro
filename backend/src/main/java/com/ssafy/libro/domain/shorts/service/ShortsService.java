package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.ShortsRequestDto;
import com.ssafy.libro.domain.shorts.dto.ShortsResponseDto;

import java.io.IOException;

public interface ShortsService {
    ShortsResponseDto createShorts(ShortsRequestDto requestDto) throws IOException;
    BookDetailResponseDto getShortsByBookId(Long bookId) throws IOException;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    void createImages(PromptRequestDto requestDto) throws IOException;
    void createShorts();
}
