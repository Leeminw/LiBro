package com.ssafy.libro.domain.userbook.dto;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.comment.dto.CommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCommentListResponseDto {

    private Long userBookId;
    private BookDetailResponseDto bookDetailResponseDto;
    private List<UserBookCommentDetailResponseDto> commentList;

}
