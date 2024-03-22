package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.*;
import org.springframework.data.domain.Slice;

public interface ArticleService {
    ArticleDetailResponseDto getArticle(Long articleId);

    Long createArticle(ArticleCreateRequestDto dto);

    void deleteArticle(Long articleId);

    void updateArticle(Long articleId, ArticleUpdateRequestDto dto);

    Slice<BoardCategoryArticlesResponseDto> getArticleList(Long clubId, BoardCategoryArticlesRequestDto dto);
}
