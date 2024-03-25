package com.ssafy.libro.domain.club.dto;

import com.ssafy.libro.domain.club.entity.Club;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class ClubCreateRequestDto {
    private String name;
    private String description;
    private Long userId;

    public Club toClubEntity(){
        return Club.builder()
                .name(name)
                .description(description)
                .isDeleted(false)
                .build();
    }
}
