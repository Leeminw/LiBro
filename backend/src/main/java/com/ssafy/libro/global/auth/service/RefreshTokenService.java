package com.ssafy.libro.global.auth.service;


import com.ssafy.libro.global.auth.entity.JwtProvider;
import com.ssafy.libro.global.auth.entity.RefreshToken;
import com.ssafy.libro.global.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {
    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;

    // 토큰 재발급, 로그아웃 시 사용
    @Transactional
    public void removeRefreshToken(String token) {
        redisTemplate.delete(String.valueOf(jwtProvider.getUserId(token)));
    }

}
