package com.ssafy.libro.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@ToString
public class UserJoinRequestDto {
    private Long id;
    private final String nickname;
    private final char gender;
    private final int age;
    private final List<String> interest;
}
