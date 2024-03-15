package com.ssafy.libro.domain.userbookcomment.controller;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;
import com.ssafy.libro.domain.userbookcomment.service.UserBookCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class UserBookCommentController {
    private final UserBookCommentService userBookCommentService;
    @PostMapping("")
    public ResponseEntity<?> createUserBookComment(@RequestBody UserBookCommentCreateRequestDto requestDto){
        userBookCommentService.createUserBookComment(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @GetMapping("/{userBookId}")
    public ResponseEntity<?> getUserBookComment(@PathVariable Long userBookId){
        List<UserBookCommentDetailResponseDto> result = userBookCommentService.getUserBookCommentList(userBookId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PutMapping("")
    public ResponseEntity<?> updateUserBookComment(@RequestBody UserBookCommentUpdateRequestDto requestDto){
        UserBookCommentDetailResponseDto result = userBookCommentService.updateUserBookComment(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    @DeleteMapping("/{userBookCommentId}")
    public ResponseEntity<?> deleteUserBookComment(@PathVariable Long userBookCommentId){
        userBookCommentService.deleteUserBookComment(userBookCommentId);
        return ResponseEntity.ok("comment deleted");
    }


}
