package com.ssafy.libro.domain.usergroup.service;

import com.ssafy.libro.domain.usergroup.dto.*;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface UserGroupService {
    ClubDetailResponseDto getClubDetail(Long clubId);

    Slice<ClubListDetailResponseDto> getClubList(ClubListDetailRequestDto dto);

    List<ClubMemberDetailResponseDto> getClubMembers(Long clubId);

    void deleteClubMember(Long clubId, Long memberId);

    void joinClub(Long clubId, ClubJoinClubRequestDto dto);

    void leaveClub(Long clubId, Long memberId);

    Slice<MyClubResponseDto> getMyClubs(MyClubRequestDto dto);

    ClubMemberShipResponseDto getClubMemberShip(Long clubId, Long userId);
}
