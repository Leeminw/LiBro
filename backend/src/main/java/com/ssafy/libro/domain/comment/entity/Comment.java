package com.ssafy.libro.domain.comment.entity;

import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.comment.dto.CommentUpdateRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Article article;

    public Comment(CommentUpdateRequestDto dto){
        this.content = dto.getContent();
        this.updatedDate = LocalDateTime.now();
    }

    public void update(CommentUpdateRequestDto dto){
        this.content = dto.getContent();
        this.updatedDate = LocalDateTime.now();
    }

}
