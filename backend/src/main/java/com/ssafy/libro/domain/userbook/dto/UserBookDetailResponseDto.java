package com.ssafy.libro.domain.userbook.dto;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookDetailResponseDto {
    private long id;
    private Long userId;
    private Long bookId;
    private String type;
    private Double rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
    private Boolean isCompleted;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;


    // join
    private List<UserBookCommentDetailResponseDto> commentList;
    private List<UserBookHistoryDetailResponseDto> historyList;

    public UserBookDetailResponseDto(UserBook userBook){
        this.id = userBook.getId();
        this.userId = userBook.getUser().getId();
        this.bookId = userBook.getBook().getId();
        this.type = userBook.getType();
        this.rating = userBook.getRating();
        this.ratingComment = userBook.getRatingComment();
        this.ratingSpoiler = userBook.getRatingSpoiler();
        this.createdDate = userBook.getCreatedDate();
        this.updatedDate = userBook.getUpdatedDate();
        this.isCompleted = userBook.getIsComplete();
    }

    public void updateCommentList(List<UserBookCommentDetailResponseDto> commentList){
        this.commentList = commentList;
    }
    public void updateHistoryList(List<UserBookHistoryDetailResponseDto> historyList){
        this.historyList = historyList;
    }
}
