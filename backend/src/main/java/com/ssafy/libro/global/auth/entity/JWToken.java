package com.ssafy.libro.global.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Builder
@Data
@AllArgsConstructor
public class JWToken implements Serializable {
    private String grantType; // "Bearer " prefix
    private String accessToken;
    private String refreshToken;

}
