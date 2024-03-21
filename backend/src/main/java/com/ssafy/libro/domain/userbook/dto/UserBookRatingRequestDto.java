package com.ssafy.libro.domain.userbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookRatingRequestDto {
    private Long userBookId;
    private Double rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
}
