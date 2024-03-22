package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClubListDetailResponseDto {
    private Long clubId;
    private String userName;
    private String name;
    private LocalDateTime createdDate;
}
