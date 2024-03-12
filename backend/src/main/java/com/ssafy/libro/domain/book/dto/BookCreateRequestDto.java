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
public class BookCreateRequestDto {
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

    public Book toEntity() {
        return Book.builder()
                .isbn(isbn)
                .title(title)
                .summary(summary)
                .price(price)
                .rating(rating)
                .ratingCount(ratingCount)
                .author(author)
                .translator(translator)
                .publisher(publisher)
                .pubDate(pubDate)
                .thumbnail(thumbnail)
                .shortsUrl(shortsUrl)
                .build();
    }
}
