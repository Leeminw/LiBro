package com.ssafy.libro.domain.comment.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentDetailResponseDto {
    private final String name;
    private final LocalDateTime createdDate;
    private final String content;
    private final String picture;
    private final Long id;
    private final Long writerId;


    public CommentDetailResponseDto(String name, LocalDateTime createdDate, String content, String picture, Long id, Long writerId) {
        this.name = name;
        this.createdDate = createdDate;
        this.content = content;
        this.picture = picture;
        this.id = id;
        this.writerId = writerId;
    }
}
