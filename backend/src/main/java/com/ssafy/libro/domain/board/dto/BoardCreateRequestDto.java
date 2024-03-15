package com.ssafy.libro.domain.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BoardCreateRequestDto {
    private final Long clubId;
    private final String name;
}
