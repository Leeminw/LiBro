package com.ssafy.libro.domain.userbook.dto;

import java.time.LocalDateTime;

public class UserBookDetailResponseDto {
    private Long userId;
    private Long bookId;
    private String type;
    private Float rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
    private LocalDateTime updatedDate;
}
