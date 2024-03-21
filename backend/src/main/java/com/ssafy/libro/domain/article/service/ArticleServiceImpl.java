package com.ssafy.libro.domain.article.service;

import com.ssafy.libro.domain.article.dto.*;
import com.ssafy.libro.domain.article.entity.Article;
import com.ssafy.libro.domain.article.exception.ArticleNotFoundException;
import com.ssafy.libro.domain.article.repository.ArticleRepository;
import com.ssafy.libro.domain.board.entity.Board;
import com.ssafy.libro.domain.board.exception.BoardNotFoundException;
import com.ssafy.libro.domain.board.repository.BoardRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ArticleServiceImpl implements ArticleService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    @Override
    public ArticleDetailResponseDto getArticle(Long articleId) {
        Article article = articleRepository.findById(articleId).orElseThrow(
                () -> new ArticleNotFoundException(articleId)
        );

        return new ArticleDetailResponseDto(article);
    }

    @Override
    public Long createArticle(ArticleCreateRequestDto dto) {
        Board board = boardRepository.findById(dto.getBoardId()).orElseThrow(
                ()-> new BoardNotFoundException(dto.getBoardId())
        );
        User user = userRepository.findById(dto.getUserId()).orElseThrow(
                ()-> new UserNotFoundException(dto.getUserId())
        );
        Article article = dto.toEntity(board,user);
        Article saved = articleRepository.save(article);

        log.info("글쓰기 성공");

        return saved.getId();
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

    @Override
    public Slice<BoardCategoryArticlesResponseDto> getArticleList(Long clubId, BoardCategoryArticlesRequestDto dto) {
        return articleRepository.searchArticles(clubId, dto);
    }
}
