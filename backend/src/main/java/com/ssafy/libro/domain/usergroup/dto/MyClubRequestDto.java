package com.ssafy.libro.domain.usergroup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyClubRequestDto {
    private Long userId;
    private String sortOrder;
    private String keyword;
    private Long clubId;

    public MyClubRequestDto(Long userId) {
        this.userId = userId;
    }
}
