package com.ssafy.libro.domain.userbook.dto;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import java.time.LocalDateTime;

public class UserBookRequestDto {
    private Long userId;
    private Long bookId;
    private String type;
    private Float rating;
    private String ratingComment;
    private Boolean ratingSpoiler;
    private LocalDateTime updatedDate;


    public UserBook toEntity() {
        return UserBook.builder()
                .type(this.type)
                .rating(this.rating)
                .ratingSpoiler(this.ratingSpoiler)
                .ratingComment(this.ratingComment)
                .updatedDate(this.updatedDate)
                .build();
    }

}
