package com.ssafy.libro.domain.userbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookRatingResponseDto {
    private String nickName;
    private String email;
    private Double rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
    private LocalDateTime createdDate;
}
