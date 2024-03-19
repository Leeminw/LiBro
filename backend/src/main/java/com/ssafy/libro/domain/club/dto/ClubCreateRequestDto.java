package com.ssafy.libro.domain.club.dto;

import com.ssafy.libro.domain.club.entity.Club;
import lombok.Getter;

@Getter
public class ClubCreateRequestDto {
    private String name;
    private String description;

    public Club toEntitiy(){
        return Club.builder()
                .name(name)
                .description(description).build();
    }
}