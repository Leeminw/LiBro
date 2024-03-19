package com.ssafy.libro.domain.user.controller;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.service.UserService;
import com.ssafy.libro.global.common.ResponseData;
import com.ssafy.libro.global.oauth.service.CustomOAuth2UserService;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/user")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final Response response;

    @PostMapping("/login")
    ResponseEntity<?> userLogin(@RequestBody String token) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success(userService.loginUser(token)));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinUser(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyPage(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }
}
