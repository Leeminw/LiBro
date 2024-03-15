package com.ssafy.libro.domain.userbookhistory.entity;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryUpdateRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class UserBookHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @ManyToOne(fetch = FetchType.LAZY,targetEntity = UserBook.class)
    @JoinColumn(name = "userbook_id")
    private UserBook userBook;

    public void updateUserBook(UserBook userbook){
        this.userBook = userbook;
    }
    public void update(UserBookHistoryUpdateRequestDto requestDto){
        this.startDate = requestDto.getStartDate();
        this.endDate = requestDto.getEndDate();

    }
}
