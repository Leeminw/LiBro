package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    @Override
    public ResponseEntity<Map<String, Object>> createArticle(ArticleCreateRequestDto dto) {
        return null;
    }

    @Override
    public ResponseEntity<Map<String, Object>> updateArticle(ArticleUpdateRequestDto dto) {
        return null;
    }

    @Override
    public ResponseEntity<Map<String, Object>> getArticle(Long articleId) {
        return null;
    }

    @Override
    public ResponseEntity<Map<String, Object>> deletedArticle(Long articleId) {
        return null;
    }
}
