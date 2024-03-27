package com.ssafy.libro.domain.comment.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.comment.dto.CommentDetailResponseDto;
import com.ssafy.libro.domain.comment.entity.QComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CommentCustomRepositoryImpl implements CommentCustomRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<CommentDetailResponseDto> findByArticleId(Long articleId) {
        QComment comment = QComment.comment;

        return jpaQueryFactory.select(Projections.constructor(CommentDetailResponseDto.class,
                        comment.user.name,
                        comment.createdDate,
                        comment.content,
                        comment.user.profile,
                        comment.id,
                        comment.user.id.as("writerId")))
                .from(comment)
                .where(comment.article.id.eq(articleId))
                .fetch();
    }
}
