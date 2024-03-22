package com.ssafy.libro.domain.usergroup.repository;

import com.ssafy.libro.domain.usergroup.dto.*;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface UserGroupCustomRepository {
    ClubDetailResponseDto getClubDetail(Long clubId);

    List<ClubMemberDetailResponseDto> getClubMemberList(Long clubId);

    Slice<ClubListDetailResponseDto> getClubList(ClubListDetailRequestDto dto);

    Slice<MyClubResponseDto> getMyClubs(MyClubRequestDto dto);

    ClubMemberShipResponseDto getClubMemberShip(Long clubId, Long userId);

}
