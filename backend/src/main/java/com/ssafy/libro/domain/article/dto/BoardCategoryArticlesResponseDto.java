package com.ssafy.libro.domain.article.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCategoryArticlesResponseDto {
        private String name;
        private String picture;
        private String title;
        private Integer commentCount;
        private LocalDateTime createdDate;
        private long id;
        private long categoryId;
}
