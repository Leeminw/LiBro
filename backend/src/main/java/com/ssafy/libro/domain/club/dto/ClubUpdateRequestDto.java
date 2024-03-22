package com.ssafy.libro.domain.club.dto;

import com.ssafy.libro.domain.club.entity.Club;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ClubUpdateRequestDto {
    private String name;
    private String description;
    private String userId;

    public Club toEntitiy(){
        return Club.builder()
                .name(name)
                .description(description)
                .updatedDate(LocalDateTime.now())
                .build();
    }
}
