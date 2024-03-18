package com.ssafy.libro.domain.userbookhistory.dto;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Builder
@Getter
@ToString
public class UserBookHistoryUpdateRequestDto {
    private Long id;
    private Long userBookId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private UserBook userbook;

    public UserBookHistory toEntity(){
        return UserBookHistory.builder()
                .id(this.id)
                .endDate(this.endDate)
                .startDate(this.startDate)
                .build();
    }

}
