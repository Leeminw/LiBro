package com.ssafy.libro.global.auth.controller;

import com.ssafy.libro.global.auth.entity.JwtProvider;
import com.ssafy.libro.global.auth.service.RefreshTokenService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/api/token")
@RequiredArgsConstructor
@RestController
@CrossOrigin
@Slf4j
public class TokenController {
    private final RedisTemplate<String, String> redisTemplate;
    private final RefreshTokenService tokenService;
    private final JwtProvider jwtProvider;
    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") final String token) {
        try {
            tokenService.removeRefreshToken(token);
        } catch (Exception e) {
            log.info("logout exception");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseData.failure("401"));
        }
        log.info("logout ok");
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("200"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") final String token) {
        long id = jwtProvider.getUserId(token);
        String refreshToken = redisTemplate.opsForValue().get(id);
        if (jwtProvider.verifyToken(refreshToken)) {
            String newAccessToken = jwtProvider.createAccessToken(id, jwtProvider.getUserRole(token));
            return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("200", newAccessToken));
        } else {
            tokenService.removeRefreshToken(token);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseData.failure("400"));
    }
}
