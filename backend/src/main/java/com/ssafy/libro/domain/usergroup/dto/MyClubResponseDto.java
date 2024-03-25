package com.ssafy.libro.domain.usergroup.dto;

import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MyClubResponseDto {
    private Long clubId;
    private String clubOwnerName;
    private String clubName;
    private LocalDateTime createdDate;
    private ClubRole role;
}
