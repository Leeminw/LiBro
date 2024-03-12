package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ArticleService {
    ResponseEntity<Map<String,Object>> createArticle(ArticleCreateRequestDto dto);
    ResponseEntity<Map<String,Object>> updateArticle(ArticleUpdateRequestDto dto);
    ResponseEntity<Map<String,Object>> getArticle(Long articleId);
    ResponseEntity<Map<String,Object>> deletedArticle(Long articleId);
}
