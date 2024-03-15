package com.ssafy.libro.domain.user.controller;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.service.UserService;
import com.ssafy.libro.global.common.ResponseData;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;
    private final Response response;
    @PostMapping("/join")
    public ResponseEntity<?> joinUser(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyPage(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }
}
