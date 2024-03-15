package com.ssafy.libro.domain.userbookcomment.dto;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookCommentCreateRequestDto {
    private Long userBookId;
    private String content;

    public UserBookComment toEntity() {
        return UserBookComment.builder()
                .content(this.content)
                .build();
    }
}
