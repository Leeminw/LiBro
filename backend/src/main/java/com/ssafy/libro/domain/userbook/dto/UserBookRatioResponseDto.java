package com.ssafy.libro.domain.userbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookRatioResponseDto {
    private String type;
    private Double ratio;
    private Long totalSize;
    private Long readSize;
}
