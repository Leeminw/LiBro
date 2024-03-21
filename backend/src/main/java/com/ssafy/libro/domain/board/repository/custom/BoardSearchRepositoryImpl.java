package com.ssafy.libro.domain.board.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.board.entity.Board;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.libro.domain.board.entity.QBoard.board;

@Repository
@RequiredArgsConstructor
public class BoardSearchRepositoryImpl implements BoardSearchRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<Board> getBoardListByGroupId(Long groupId) {
        return jpaQueryFactory
                .selectFrom(board)
                .where(board.club.id.eq(groupId))
                .fetch();
    }
}
