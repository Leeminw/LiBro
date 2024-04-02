package com.ssafy.libro.domain.article.repository;


import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.article.dto.BoardCategoryArticlesRequestDto;
import com.ssafy.libro.domain.article.dto.BoardCategoryArticlesResponseDto;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.ssafy.libro.domain.article.entity.QArticle.article;

@Repository
@AllArgsConstructor
public class ArticleCustomRepositoryImpl implements ArticleCustomRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Slice<BoardCategoryArticlesResponseDto> searchArticles(Long clubId, BoardCategoryArticlesRequestDto dto) {
        Pageable pageable = PageRequest.ofSize(10);

        List<BoardCategoryArticlesResponseDto> result = jpaQueryFactory.select(Projections.bean(
                        BoardCategoryArticlesResponseDto.class,
                        article.user.nickname.as("name"),
                        article.user.profile.as("picture"),
                        article.title,
                        article.comments.size().as("commentCount"),
                        article.createdDate,
                        article.id.as("id"),
                        article.board.id.as("categoryId"),
                        article.user.id.as("writerId")))
                .from(article)
                .where(
                        equalClub(clubId),
                        decideId(dto.getArticleId(), dto.getSortOrder()),
                        equalKeyword(dto.getKeyword()),
                        equalBoardType(dto.getBoardId())
                )
                .orderBy(orderBy(dto.getSortOrder()))
                .limit(pageable.getPageSize() + 1)
                .fetch();

        return new SliceImpl<>(result, pageable, hasNextPage(result, pageable.getPageSize()));
    }

    private static BooleanExpression decideId(Long articleId, String sortOrder) {
        if ("oldest".equals(sortOrder)) {
            if (articleId == null) return null;
            return article.id.gt(articleId);
        } else {
            if (articleId == null) return null;
            return article.id.lt(articleId);
        }
    }

    private OrderSpecifier<?> orderBy(String sortOrder) {
        if ("latest".equals(sortOrder) || sortOrder == null)  return article.createdDate.desc();
        return article.createdDate.asc();
    }

    private static BooleanExpression equalBoardType(Long boardId) {
        if (boardId == 0 || boardId == null) return null;
        return article.board.id.eq(boardId);
    }

    private static BooleanExpression equalKeyword(String keyword) {
        if (StringUtils.isBlank(keyword)) return null;
        return article.title.like("%" + keyword + "%");
    }

    private static BooleanExpression equalClub(Long clubId) {
        return article.board.club.id.eq(clubId);
    }

    private boolean hasNextPage(List<?> contents, int pageSize) {
        if (contents.size() > pageSize) {
            contents.remove(pageSize);
            return true;
        }
        return false;
    }
}
