package com.ssafy.libro.domain.article.repository;

import com.ssafy.libro.domain.article.dto.BoardCategoryArticlesRequestDto;
import com.ssafy.libro.domain.article.dto.BoardCategoryArticlesResponseDto;
import org.springframework.data.domain.Slice;

public interface ArticleCustomRepository {

    Slice<BoardCategoryArticlesResponseDto> searchArticles(Long clubId, BoardCategoryArticlesRequestDto dto);
}
