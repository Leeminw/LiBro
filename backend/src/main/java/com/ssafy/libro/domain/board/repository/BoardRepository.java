package com.ssafy.libro.domain.board.repository;

import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.board.repository.custom.BoardSearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board,Long>, BoardSearchRepository {
}
