package com.ssafy.libro.domain.comment.service;

import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.article.exception.ArticleNotFoundException;
import com.ssafy.libro.domain.article.repository.ArticleRepository;
import com.ssafy.libro.domain.comment.dto.CommentCreateRequestDto;
import com.ssafy.libro.domain.comment.dto.CommentDetailResponseDto;
import com.ssafy.libro.domain.comment.dto.CommentUpdateRequestDto;
import com.ssafy.libro.domain.comment.entity.Comment;
import com.ssafy.libro.domain.comment.exception.CommentNotFoundException;
import com.ssafy.libro.domain.comment.repository.CommentRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;


    @Override
    public Long createArticle(CommentCreateRequestDto dto) {

        Article article = articleRepository.findById(dto.getBoardId()).orElseThrow(
                () -> new ArticleNotFoundException(dto.getBoardId())
        );

        User user = userRepository.findById(dto.getUserId()).orElseThrow(
                () -> new UserNotFoundException(dto.getUserId())
        );

        Comment comment = dto.toEntity(article, user);

        return commentRepository.save(comment).getId();
    }

    @Override
    public void deleteArticle(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new CommentNotFoundException(commentId)
        );
        commentRepository.delete(comment);
    }

    @Override
    public void updateArticle(Long commentId, CommentUpdateRequestDto dto) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new CommentNotFoundException(commentId)
        );
        comment.update(dto);
    }

    @Override
    public List<CommentDetailResponseDto> getCommentList(Long articleId) {
        return commentRepository.findByArticleId(articleId);
    }
}
