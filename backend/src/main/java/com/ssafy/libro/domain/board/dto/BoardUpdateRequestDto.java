package com.ssafy.libro.domain.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BoardUpdateRequestDto {
    private final Long clubId;
    private final Long boardId;
    private final String name;
}
