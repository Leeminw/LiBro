package com.ssafy.libro.domain.board.service;

import com.ssafy.libro.domain.board.dto.BoardCreateRequestDto;
import com.ssafy.libro.domain.board.dto.BoardResponseDto;
import com.ssafy.libro.domain.board.dto.BoardUpdateRequestDto;

import java.util.List;

public interface BoardService {
    List<BoardResponseDto> getBoardList(Long groupId);

    Long createBoard(BoardCreateRequestDto dto);
    void updateBoard(BoardUpdateRequestDto dto);

    void deleteBoard(Long boardId);
}
