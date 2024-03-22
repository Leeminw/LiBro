package com.ssafy.libro.domain.shorts.controller;

import com.ssafy.libro.domain.shorts.service.ShortsService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ShortsController {

    private final ShortsService shortsService;

    @GetMapping("/api/v1/shorts/create/test")
    public ResponseEntity<?> createShortsTest() {
        shortsService.createShorts();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("쇼츠영상 S3 주소가 들어갈 예정"));
    }

}
