package com.ssafy.libro.global.auth.service;


import com.ssafy.libro.global.auth.entity.RefreshToken;
import com.ssafy.libro.global.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {
    private final RefreshTokenRepository repository;

    @Transactional
    public void saveTokenInfo(String id, String accessToken, String refreshToken) {
        repository.save(new RefreshToken(id, accessToken, refreshToken));
    }

    // 토큰 재발급, 로그아웃 시 사용
    @Transactional
    public void removeRefreshToken(String accessToken) {
        RefreshToken token = repository.findByAccessToken(accessToken)
                .orElseThrow(IllegalArgumentException::new);
        repository.delete(token);
    }

}
