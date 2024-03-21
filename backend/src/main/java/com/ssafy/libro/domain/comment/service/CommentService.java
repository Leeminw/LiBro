package com.ssafy.libro.domain.comment.service;

import com.ssafy.libro.domain.comment.dto.CommentCreateRequestDto;
import com.ssafy.libro.domain.comment.dto.CommentDetailResponseDto;
import com.ssafy.libro.domain.comment.dto.CommentUpdateRequestDto;

import java.util.List;

public interface CommentService {
    Long createArticle(CommentCreateRequestDto dto);

    void deleteArticle(Long articleId);

    void updateArticle(Long articleId, CommentUpdateRequestDto dto);

    List<CommentDetailResponseDto> getCommentList(Long articleId);
}
