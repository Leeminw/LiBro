package com.ssafy.libro.domain.article.controller;


import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import com.ssafy.libro.domain.article.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/api/article")
@RestController
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    @GetMapping("{articleId}")
    public ResponseEntity<Map<String,Object>> getArticle(@PathVariable("articleId") Long articleId){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PostMapping("/")
    public ResponseEntity<Map<String,Object>> createArticle(@RequestBody ArticleCreateRequestDto dto){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @DeleteMapping("{articleId}")
    public ResponseEntity<Map<String,Object>> deleteArticle(@PathVariable("articleId") Long articleId){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PutMapping("/")
    public ResponseEntity<Map<String,Object>> updateArticle(@RequestBody ArticleUpdateRequestDto dto){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }



}
