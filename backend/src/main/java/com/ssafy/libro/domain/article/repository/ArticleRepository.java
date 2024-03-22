package com.ssafy.libro.domain.article.repository;

import com.ssafy.libro.domain.article.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article,Long>, ArticleCustomRepository{
}
