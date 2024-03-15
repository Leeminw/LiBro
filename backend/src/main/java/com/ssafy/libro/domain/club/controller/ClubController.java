package com.ssafy.libro.domain.club.controller;

import com.ssafy.libro.domain.club.dto.ClubCreateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/club")
public class ClubController {
    ResponseEntity<?> createClub(ClubCreateRequestDto dto){


    }
}
