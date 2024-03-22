package com.ssafy.libro.domain.usergroup.controller;

import com.ssafy.libro.domain.usergroup.dto.*;
import com.ssafy.libro.domain.usergroup.service.UserGroupService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usergroup")
public class UserGroupController {
    private final UserGroupService userGroupService;

    @GetMapping("/{clubId}")
    public ResponseEntity<?> getClubDetail(@PathVariable("clubId") Long clubId) {
        ClubDetailResponseDto clubResponseDto = userGroupService.getClubDetail(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(clubResponseDto));
    }

    @GetMapping("/list")
    public ResponseEntity<?> getClubList(ClubListDetailRequestDto dto) {
        Slice<ClubListDetailResponseDto> clubs = userGroupService.getClubList(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(clubs));
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<?> getClubMembers(@PathVariable("clubId") Long clubId) {
        List<ClubMemberDetailResponseDto> members = userGroupService.getClubMembers(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(members));
    }

    @DeleteMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<?> deleteClubMember(@PathVariable("clubId") Long clubId, @PathVariable("memberId") Long memberId) {
        userGroupService.deleteClubMember(clubId, memberId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("동아리 회원이 탈퇴되었습니다."));
    }

    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> joinClub(@PathVariable("clubId") Long clubId, @RequestBody ClubJoinClubRequestDto dto) {
        userGroupService.joinClub(clubId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽에 가입되었습니다."));
    }

    @DeleteMapping("/{clubId}/members/{memberId}/leave")
    public ResponseEntity<?> leaveClub(@PathVariable("clubId") Long clubId, @PathVariable("memberId") Long memberId) {
        userGroupService.leaveClub(clubId, memberId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽에서 탈퇴되었습니다."));
    }

    @GetMapping("/myClubList")
    public ResponseEntity<?> getMyClubs(MyClubRequestDto dto) {
        Slice<MyClubResponseDto> myClubs = userGroupService.getMyClubs(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(myClubs));
    }

    @GetMapping("/hasPermission/{clubId}/{userId}")
    public ResponseEntity<?> getClubMemberShip(@PathVariable("clubId") Long clubId, @PathVariable("userId") Long userId) {
        ClubMemberShipResponseDto result  = userGroupService.getClubMemberShip(clubId, userId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("클럽에 가입되었습니다.", Map.of("data", result)));
    }
}
