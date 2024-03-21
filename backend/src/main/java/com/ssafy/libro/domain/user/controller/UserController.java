package com.ssafy.libro.domain.user.controller;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.service.UserService;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import com.ssafy.libro.global.auth.entity.RefreshToken;
import com.ssafy.libro.global.auth.repository.RefreshTokenRepository;
import com.ssafy.libro.global.auth.service.RefreshTokenService;
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
    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService tokenService;
    private final JwtProvider jwtProvider;

    @GetMapping("/load")
    public ResponseEntity<?> userLogin(@RequestHeader("Authorization") final String accessToken) {
        User result = userService.loadUser(accessToken);
        if (result != null)
            return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("회원 정보 로드 성공", result));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseData.failure("회원 정보 로드 실패"));
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinUser(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/mypage")
    public ResponseEntity<?> getMyPage(@RequestBody UserJoinRequestDto requestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success("회원가입 성공"));
    }

    @GetMapping("/token/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") final String accessToken) {
        tokenService.removeRefreshToken(accessToken);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("200"));
    }

    @GetMapping("/token/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") final String accessToken) {
        Optional<RefreshToken> refreshToken = tokenRepository.findByAccessToken(accessToken);
        if (refreshToken.isPresent() && jwtProvider.verifyToken(refreshToken.get().getRefreshToken())) {
            RefreshToken resultToken = refreshToken.get();
            String newAccessToken = jwtProvider.createAccessToken(resultToken.getId(), jwtProvider.getUserRole(resultToken.getRefreshToken()));
            resultToken.updateAccessToken(newAccessToken);
            tokenRepository.save(resultToken);
            return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("200", newAccessToken));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseData.failure("400"));
    }

}
