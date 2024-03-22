package com.ssafy.libro.domain.club.service;

import com.ssafy.libro.domain.club.dto.ClubCreateRequestDto;
import com.ssafy.libro.domain.club.dto.ClubUpdateRequestDto;

public interface ClubService {
    Long createClub(ClubCreateRequestDto dto);

    void updateClub(Long clubId, ClubUpdateRequestDto dto);

    void deleteClub(Long clubId);
}
