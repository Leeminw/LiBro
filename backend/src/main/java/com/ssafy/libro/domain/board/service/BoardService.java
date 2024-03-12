package com.ssafy.libro.domain.board.service;

import com.ssafy.libro.domain.board.dto.BoardCreateRequestDto;
import com.ssafy.libro.domain.board.dto.BoardResponseDto;

import java.util.List;

public interface BoardService {
    List<BoardResponseDto> getBoardList(Long groupId);
    BoardResponseDto getBoard();

    void createBoard(BoardCreateRequestDto dto);

    void deleteBoard(Long boardId);
}
