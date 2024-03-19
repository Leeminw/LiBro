package com.ssafy.libro.domain.userbook.dto;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookListResponseDto {
    private Long userBookId;
    private String type;
    private BookDetailResponseDto bookDetailResponseDto;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private Float rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
}
