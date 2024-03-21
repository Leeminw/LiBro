package com.ssafy.libro.domain.article.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class BoardCategoryArticlesRequestDto {
    private String sortOrder;
    private String keyword;
    private Long boardId;
    private Long articleId;
}
