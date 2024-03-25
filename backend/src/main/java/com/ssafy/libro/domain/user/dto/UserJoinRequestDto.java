package com.ssafy.libro.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserJoinRequestDto {
    private final Long id;
    private final String nickname;
    private final char gender;
    private final int age;
    private final List<String> interest;
}
