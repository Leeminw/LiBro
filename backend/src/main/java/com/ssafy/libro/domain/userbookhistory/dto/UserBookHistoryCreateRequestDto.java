package com.ssafy.libro.domain.userbookhistory.dto;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Builder
@Getter
@ToString
public class UserBookHistoryCreateRequestDto {
    private Long userBookId;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;


    public UserBookHistory toEntity(){
        return UserBookHistory.builder()
                .endDate(this.endDate)
                .startDate(this.startDate)
                .build();
    }

}
