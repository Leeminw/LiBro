package com.ssafy.libro.domain.comment.dto;

import com.ssafy.libro.domain.comment.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentDetailResponseDto {
    private final String name;
    private final LocalDateTime createdDate;
    private final String content;
    private final String picture;
    private final Long id;


    public CommentDetailResponseDto(String name, LocalDateTime createdDate, String content, String picture, Long id) {
        this.name = name;
        this.createdDate = createdDate;
        this.content = content;
        this.picture = picture;
        this.id = id;
    }
}
