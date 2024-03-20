package com.ssafy.libro.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserJoinRequestDto {
    private final String email;
    private final String name;
    private final LocalDateTime birth;
    private final String profile;
    private final String nickname;
    private final String gender;
}
