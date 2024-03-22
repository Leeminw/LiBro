package com.ssafy.libro.domain.comment.controller;


import com.ssafy.libro.domain.comment.dto.CommentCreateRequestDto;
import com.ssafy.libro.domain.comment.dto.CommentUpdateRequestDto;
import com.ssafy.libro.domain.comment.service.CommentService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequestMapping("/api/comment")
@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("{articleId}")
    public ResponseEntity<?> getCommentList(@PathVariable Long articleId){
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(commentService.getCommentList(articleId)));
    }

    @PostMapping("")
    public ResponseEntity<?> createComment(@RequestBody CommentCreateRequestDto dto){
        Long savedArticleId = commentService.createArticle(dto);

        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("댓글이 작성되었습니다.", Map.of("data", Map.of("id" , savedArticleId ))));
    }

    @DeleteMapping("{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId){
        commentService.deleteArticle(commentId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("댓글이 삭제되었습니다.",null));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody CommentUpdateRequestDto dto){
        commentService.updateArticle(commentId,dto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("댓글이 수정 되었습니다."));
    }
}
