package com.ssafy.libro.domain.article.dto;

import com.ssafy.libro.domain.article.entity.Article;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ArticleDetailResponseDto {
    private Long id;
    private String title;
    private String content;
    private Integer hit;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String name;
    private String picture;
    private Long boardId;
    private Long writerId;


    public ArticleDetailResponseDto(Article article){
        this.id = article.getId();
        this.title= article.getTitle();
        this.content = article.getContent();
        this.hit = article.getHit();
        this.createdDate = article.getCreatedDate();
        this.updatedDate = article.getUpdatedDate();
        this.name = article.getUser().getName();
        this.picture = article.getUser().getProfile();
        this.boardId = article.getBoard().getId();
        this.writerId = article.getUser().getId();
    }

}
