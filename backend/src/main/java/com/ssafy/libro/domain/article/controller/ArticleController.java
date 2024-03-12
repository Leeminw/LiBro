package com.ssafy.libro.domain.article.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/api/article")
@RestController
@RequiredArgsConstructor
public class ArticleController {
    @GetMapping("{articleId}")
    public ResponseEntity<Map<String,Object>> getArticle(@PathVariable("articleId") Long articleId){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String,Object>> createArticle(Long articleId){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
