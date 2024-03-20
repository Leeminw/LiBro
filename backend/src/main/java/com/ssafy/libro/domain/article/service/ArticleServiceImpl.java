package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleDetailResponseDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.article.exception.ArticleNotFoundException;
import com.ssafy.libro.domain.article.repository.ArticleRepository;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.board.exception.BoardNotFoundException;
import com.ssafy.libro.domain.board.repository.BoardRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    @Override
    public ArticleDetailResponseDto getArticle(Long articleId) {
        Article article = articleRepository.findById(articleId).orElseThrow(
                ()->new ArticleNotFoundException(articleId)
        );
        return new ArticleDetailResponseDto(article);
    }

    @Override
    public void createArticle(ArticleCreateRequestDto dto) {
        Board board = boardRepository.findById(dto.getBoardId()).orElseThrow(
                ()-> new BoardNotFoundException(dto.getBoardId())
        );
        User user = userRepository.findById(dto.getUserId()).orElseThrow(
                ()-> new UserNotFoundException(dto.getUserId())
        );
        Article article = dto.toEntity(board,user);
        articleRepository.save(article);
    }

    @Override
    public void deleteArticle(Long articleId) {
        Article article = articleRepository.findById(articleId).orElseThrow(
                ()->new ArticleNotFoundException(articleId)
        );
        articleRepository.delete(article);
    }

    @Override
    public void updateArticle(Long articleId, ArticleUpdateRequestDto dto) {
        Article article = articleRepository.findById(articleId).orElseThrow(
                ()->new ArticleNotFoundException(articleId)
        );

        article.update(dto);
    }
}
