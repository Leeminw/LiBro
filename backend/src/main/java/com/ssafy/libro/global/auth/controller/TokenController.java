package com.ssafy.libro.global.auth.controller;

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
@RequiredArgsConstructor
@RestController
@CrossOrigin
@Slf4j
public class TokenController {
    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService tokenService;
    private final JwtProvider jwtProvider;
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
