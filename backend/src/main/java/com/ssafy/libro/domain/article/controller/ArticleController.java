package com.ssafy.libro.domain.article.controller;


import com.ssafy.libro.domain.article.dto.ArticleCreateRequestDto;
import com.ssafy.libro.domain.article.dto.ArticleUpdateRequestDto;
import com.ssafy.libro.domain.article.service.ArticleService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/article")
@RestController
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;
    @GetMapping("{articleId}")
    public ResponseEntity<?> getArticle(@PathVariable("articleId") Long articleId){
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(articleService.getArticle(articleId)));
    }

    @PostMapping("/")
    public ResponseEntity<?> createArticle(@RequestBody ArticleCreateRequestDto dto){
        articleService.createArticle(dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("게시물이 생성되었습니다.",null));
    }

    @DeleteMapping("{articleId}")
    public ResponseEntity<?> deleteArticle(@PathVariable("articleId") Long articleId){
        articleService.deleteArticle(articleId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("게시물이 삭제되었습니다.",null));
    }

    @PutMapping("/{articleId}")
    public ResponseEntity<?> updateArticle(@PathVariable("articleId")Long articleId, @RequestBody ArticleUpdateRequestDto dto){
        articleService.updateArticle(articleId,dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("수정되었습니다."));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createArticle(Long articleId){

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
