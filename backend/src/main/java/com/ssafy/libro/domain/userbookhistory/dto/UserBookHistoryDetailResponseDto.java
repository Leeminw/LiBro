package com.ssafy.libro.domain.userbookhistory.dto;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserBookHistoryDetailResponseDto {
    private Long userBookHistoryId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

//    private UserBook userbook;

    public UserBookHistoryDetailResponseDto(UserBookHistory userBookHistory){
        this.userBookHistoryId = userBookHistory.getId();
        this.startDate = userBookHistory.getStartDate();
        this.endDate = userBookHistory.getEndDate();
//        this.userbook = userBookHistory.getUserBook();
    }
}
