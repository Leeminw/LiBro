package com.ssafy.libro.domain.userbookcomment.dto;

import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserBookCommentUpdateRequestDto {
    private Long userBookCommentId;
    private String content;

}
