package com.ssafy.libro.domain.shorts.controller;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.service.BookService;
import com.ssafy.libro.domain.book.service.BookServiceImpl;
import com.ssafy.libro.domain.shorts.dto.PromptRequestDto;
import com.ssafy.libro.domain.shorts.dto.PromptResponseDto;
import com.ssafy.libro.domain.shorts.dto.ShortsRequestDto;
import com.ssafy.libro.domain.shorts.dto.ShortsResponseDto;
import com.ssafy.libro.domain.shorts.service.PromptServiceImpl;
import com.ssafy.libro.domain.shorts.service.ShortsService;
import com.ssafy.libro.domain.shorts.service.ShortsServiceImpl;
import com.ssafy.libro.domain.shorts.service.TaskServiceImpl;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ShortsController {

    private final BookServiceImpl bookService;
    private final TaskServiceImpl taskService;
    private final PromptServiceImpl promptService;
    private final ShortsServiceImpl shortsService;

    @PostMapping("/api/v1/shorts/create")
    public ResponseEntity<?> createShorts(@RequestBody ShortsRequestDto requestDto) throws IOException {
        ShortsResponseDto responseDto = shortsService.createShorts(requestDto);
        String filename = responseDto.getFilename();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(responseDto.getResource());
    }

    @GetMapping("/api/v1/shorts")
    public ResponseEntity<?> getShortsByBookId(@RequestParam("book-id") Long bookId) throws IOException {
        BookDetailResponseDto bookResponseDto = bookService.getBook(bookId);
        ShortsRequestDto shortsRequestDto = ShortsRequestDto.builder()
                .title(bookResponseDto.getTitle())
                .content(bookResponseDto.getSummary())
                .build();

        ShortsResponseDto responseDto = shortsService.createShorts(shortsRequestDto);
        String filename = responseDto.getFilename();

        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(responseDto.getResource());
    }

}
