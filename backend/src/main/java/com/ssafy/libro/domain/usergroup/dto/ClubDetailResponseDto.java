package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClubDetailResponseDto {
    private Long clubId;
    private String clubName;
    private String description;
    private LocalDateTime createdDate;
    private String clubOwnerName;
    private String profile;
    private Long memberCount;
}
