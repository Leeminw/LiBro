package com.ssafy.libro.domain.usergroup.repository;

import com.ssafy.libro.domain.usergroup.dto.*;
import org.springframework.data.domain.Slice;

import java.util.List;
import java.util.Optional;

public interface UserGroupCustomRepository {
    Optional<ClubDetailResponseDto> getClubDetail(Long clubId);

    Optional<ClubSummaryResponseDto> getClubSummary(Long clubId);

    List<ClubMemberDetailResponseDto> getClubMemberList(Long clubId);

    Slice<ClubListDetailResponseDto> getClubList(ClubListDetailRequestDto dto);

    Slice<MyClubResponseDto> getMyClubs(MyClubRequestDto dto);

    ClubMemberShipResponseDto getClubMemberShip(Long clubId, Long userId);

}
