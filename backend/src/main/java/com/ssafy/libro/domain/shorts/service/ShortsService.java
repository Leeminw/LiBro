package com.ssafy.libro.domain.shorts.service;

import com.ssafy.libro.domain.shorts.dto.ShortsRequestDto;
import com.ssafy.libro.domain.shorts.dto.ShortsResponseDto;

import java.io.IOException;

public interface ShortsService {
    ShortsResponseDto createShorts(ShortsRequestDto requestDto) throws IOException;
    ShortsResponseDto getShortsByBookId(Long bookId) throws IOException;

}
