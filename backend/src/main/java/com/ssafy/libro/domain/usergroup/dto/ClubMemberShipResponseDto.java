package com.ssafy.libro.domain.usergroup.dto;

import com.ssafy.libro.domain.usergroup.entity.ClubRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClubMemberShipResponseDto {
    private Long clubId;
    private Long userId;
    private ClubRole role;
}
