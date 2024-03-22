package com.ssafy.libro.domain.userbook.dto;


import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserBookListByDateResponseDto {
    private Long userBookId;
    private BookDetailResponseDto bookDetailResponseDto;
    private List<UserBookHistoryDetailResponseDto> bookHistoryDetailResponseDto;

}
