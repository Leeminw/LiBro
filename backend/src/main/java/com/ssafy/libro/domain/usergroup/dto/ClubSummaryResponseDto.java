package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClubSummaryResponseDto {
    private Long clubId;
    private String clubName;
    private LocalDateTime createdDate;
    private Long memberCount;
}
