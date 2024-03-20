package com.ssafy.libro.domain.user.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
@AllArgsConstructor
@Builder
public class SecurityUserDto {
    private final Long id;
    private final String email;
    private final String name;
    private final String profile;
    private final String role;
}
