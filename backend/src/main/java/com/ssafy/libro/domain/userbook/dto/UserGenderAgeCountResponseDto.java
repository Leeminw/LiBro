package com.ssafy.libro.domain.userbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserGenderAgeCountResponseDto {
    private Integer age;
    private Long count;
    private Character gender;
}
