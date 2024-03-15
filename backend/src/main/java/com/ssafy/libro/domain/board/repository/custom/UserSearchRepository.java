package com.ssafy.libro.domain.board.repository.custom;

import com.ssafy.libro.domain.board.entity.Board;

import java.util.List;

public interface UserSearchRepository {
    List<Board> getBoardListByGroupId(Long groupId);
}
