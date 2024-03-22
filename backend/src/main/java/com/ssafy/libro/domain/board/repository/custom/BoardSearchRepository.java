package com.ssafy.libro.domain.board.repository.custom;

import com.ssafy.libro.domain.board.entity.Board;

import java.util.List;

public interface BoardSearchRepository {
    List<Board> getBoardListByGroupId(Long groupId);
}
