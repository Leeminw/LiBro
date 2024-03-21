package com.ssafy.libro.domain.comment.dto;

import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.comment.entity.Comment;
import com.ssafy.libro.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentUpdateRequestDto {
    private final String content;
    private final Long  boardId;
    private final Long userId;

    public Comment toEntity(Article article, User user){
        return Comment.builder()
                .content(content)
                .user(user)
                .article(article)
                .build();
    }
}
