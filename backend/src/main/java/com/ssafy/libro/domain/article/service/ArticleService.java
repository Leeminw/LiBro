package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleDetailResponseDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;

public interface ArticleService {
    ArticleDetailResponseDto getArticle(Long articleId);

    void createArticle(ArticleCreateRequestDto dto);

    void deleteArticle(Long articleId);

    void updateArticle(Long articleId, ArticleUpdateRequestDto dto);
}
