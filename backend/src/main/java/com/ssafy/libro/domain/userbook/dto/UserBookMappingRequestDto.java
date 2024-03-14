package com.ssafy.libro.domain.userbook.dto;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBookMappingRequestDto {
    private Long userId;
    private Long bookId;
    private String type;
    private Float rating;
    private String ratingComment;
    private Boolean ratingSpoiler;


    public UserBook toEntity() {
        return UserBook.builder()
                .type(this.type)
                .rating(this.rating)
                .ratingSpoiler(this.ratingSpoiler)
                .ratingComment(this.ratingComment)
                .build();
    }

}
