package com.ssafy.libro.domain.userbookcomment.dto;

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
public class UserBookCommentDetailResponseDto {
    private Long userBookCommentId;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public UserBookCommentDetailResponseDto (UserBookComment userBookComment){
        this.userBookCommentId = userBookComment.getId();
        this.content = userBookComment.getContent();
        this.createdDate = userBookComment.getCreatedDate();
        this.updatedDate = userBookComment.getUpdatedDate();
    }
}
