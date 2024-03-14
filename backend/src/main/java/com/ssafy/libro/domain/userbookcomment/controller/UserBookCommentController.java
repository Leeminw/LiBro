package com.ssafy.libro.domain.userbookcomment.controller;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.service.UserBookCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("")
    public ResponseEntity<?> getUserBookComment(@PathVariable Long id){

        return ResponseEntity.status(HttpStatus.OK).body("");
    }


}
