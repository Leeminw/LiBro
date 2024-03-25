package com.ssafy.libro.domain.user.controller;

import com.ssafy.libro.domain.user.dto.OAuthUser;
import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.service.UserService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/api/user")
@RequiredArgsConstructor
@RestController
@CrossOrigin
@Slf4j
public class UserController {
    private final UserService userService;

    @GetMapping("/load")
    public ResponseEntity<?> userLogin() {
        User user = userService.loadUser();
        if (user != null){
            OAuthUser result = OAuthUser.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .profile(user.getProfile())
                    .name(user.getName())
                    .authType(user.getAuthType())
                    .role(user.getRole())
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("회원 정보 로드 성공", result));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseData.failure("회원 정보 로드 실패"));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinUser(@RequestBody UserJoinRequestDto requestDto) {
        userService.joinUser(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyPage(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/test")
    public ResponseEntity<?> getTest() {
        log.info("call test");
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("성공"));
    }

}
