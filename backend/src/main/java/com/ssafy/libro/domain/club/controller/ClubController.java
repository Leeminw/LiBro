package com.ssafy.libro.domain.club.controller;

import com.ssafy.libro.domain.club.dto.ClubCreateRequestDto;
import com.ssafy.libro.domain.club.dto.ClubUpdateRequestDto;
import com.ssafy.libro.domain.club.service.ClubService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/club")
public class ClubController {
    private final ClubService clubService;

    @PostMapping("")
    public ResponseEntity<?> createClub(@RequestBody ClubCreateRequestDto dto) {
        Long savedClubId = clubService.createClub(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽이 생성되었습니다.", Map.of("clubId", savedClubId)));
    }

    @PutMapping("/{clubId}")
    public ResponseEntity<?> updateClub(@PathVariable("clubId") Long clubId, @RequestBody ClubUpdateRequestDto dto) {
        clubService.updateClub(clubId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽 정보가 수정되었습니다."));
    }

    @DeleteMapping("/{clubId}")
    public ResponseEntity<?> deleteClub(@PathVariable("clubId") Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽이 삭제되었습니다."));
    }
}
