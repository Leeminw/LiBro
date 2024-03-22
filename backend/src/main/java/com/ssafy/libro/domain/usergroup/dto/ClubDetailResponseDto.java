package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClubDetailResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdDate;
    private String userName;
    private String profile;
}
