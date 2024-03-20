package com.ssafy.libro.global.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JWToken {
    private String grantType; // "Bearer " prefix
    private String accessToken;
    private String refreshToken;
}
