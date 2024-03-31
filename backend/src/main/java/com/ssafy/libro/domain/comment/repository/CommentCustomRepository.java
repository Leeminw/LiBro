package com.ssafy.libro.domain.comment.repository;

import com.ssafy.libro.domain.comment.dto.CommentDetailResponseDto;

import java.util.List;

public interface CommentCustomRepository {
    List<CommentDetailResponseDto> findByArticleId(Long articleId);
}
