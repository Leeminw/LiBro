package com.ssafy.libro.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileEditRequestDto {
    private String profile;
    private String nickName;
}
