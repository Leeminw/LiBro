package com.ssafy.libro.domain.userbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserBookUpdateRequestDto {
    private Long id;
    private String type;
    private Boolean isComplete;
    private Double rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
}
