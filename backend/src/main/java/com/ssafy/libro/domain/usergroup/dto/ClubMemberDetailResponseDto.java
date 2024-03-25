package com.ssafy.libro.domain.usergroup.dto;

import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;


@AllArgsConstructor
@Data
public class ClubMemberDetailResponseDto {
    private Long userId;
    private String name;
    private String profile;
    private LocalDateTime createdDate;
    private ClubRole role;
}

