package com.ssafy.libro.domain.board.dto;

import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.club.entity.Club;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BoardCreateRequestDto {
    private final Long clubId;
    private final String name;

    public Board toEntity(Club club){
        return Board.builder()
                .club(club)
                .name(name)
                .build();
    }
}
