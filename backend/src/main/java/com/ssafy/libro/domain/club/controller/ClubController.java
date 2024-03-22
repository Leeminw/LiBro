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
    private final ClubService clubService;

    @PostMapping("")
    public ResponseEntity<?> createClub(@RequestBody ClubCreateRequestDto dto) {
        Long savedClubId = clubService.createClub(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리가 생성되었습니다.", Map.of("clubId", savedClubId)));
    }

    @PutMapping("/{clubId}")
    public ResponseEntity<?> updateClub(@PathVariable("clubId") Long clubId, @RequestBody ClubUpdateRequestDto dto) {
        clubService.updateClub(clubId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리 정보가 수정되었습니다."));
    }

    @DeleteMapping("/{clubId}")
    public ResponseEntity<?> deleteClub(@PathVariable("clubId") Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리가 삭제되었습니다."));
    }

    @GetMapping("/{clubId}")
    public ResponseEntity<?> getClubDetail(@PathVariable("clubId") Long clubId) {
        ClubDetailResponseDto clubResponseDto = clubService.getClubDetail(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(clubResponseDto));
    }

    @GetMapping("")
    public ResponseEntity<?> getClubList(ClubListDetailResponseDto dto) {
        List<ClubListDetailResponseDto> clubs = clubService.getClubList(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(clubs));
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<?> getClubMembers(@PathVariable("clubId") Long clubId) {
        List<ClubMemberDetailResponseDto> members = clubService.getClubMembers(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(members));
    }

    @DeleteMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<?> deleteClubMember(@PathVariable("clubId") Long clubId, @PathVariable("memberId") Long memberId) {
        clubService.deleteClubMember(clubId, memberId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리 회원이 삭제되었습니다."));
    }

    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> joinClub(@PathVariable("clubId") Long clubId, @RequestBody ClubJoinClubRequestDto dto) {
        clubService.joinClub(clubId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리에 가입되었습니다."));
    }

    @DeleteMapping("/{clubId}/members/{memberId}/leave")
    public ResponseEntity<?> leaveClub(@PathVariable("clubId") Long clubId, @PathVariable("memberId") Long memberId) {
        clubService.leaveClub(clubId, memberId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리에서 탈퇴되었습니다."));
    }
}
