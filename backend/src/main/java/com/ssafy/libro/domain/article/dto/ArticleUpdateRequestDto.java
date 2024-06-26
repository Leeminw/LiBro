package com.ssafy.libro.domain.article.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArticleUpdateRequestDto {
    private final String title;
    private final String content;
    private final Long  boardId;
    private final Long userId;
}
