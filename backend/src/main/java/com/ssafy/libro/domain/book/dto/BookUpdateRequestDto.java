package com.ssafy.libro.domain.book.dto;


import com.ssafy.libro.domain.book.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookUpdateRequestDto {
    private Long id;
    private String isbn;
    private String title;
    private String summary;

    private Integer price;
    private Double rating;
    private Integer ratingCount;

    private String author;
    private String translator;
    private String publisher;
    private LocalDateTime pubDate;

    private String thumbnail;
    private String shortsUrl;

}
