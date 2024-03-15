package com.ssafy.libro.domain.article.dto;

import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArticleCreateRequestDto {
    private final String title;
    private final String content;
    private final Long  boardId;
    private final Long userId;

    public Article toEntity(Board board, User user){
        return Article.builder()
                .title(title)
                .content(content)
                .user(user)
                .board(board)
                .build();
    }
}
