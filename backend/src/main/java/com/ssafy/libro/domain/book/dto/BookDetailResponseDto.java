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
public class BookDetailResponseDto {
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
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public BookDetailResponseDto(Book entity) {
        this.id = entity.getId();
        this.isbn = entity.getIsbn();
        this.title = entity.getTitle();
        this.summary = entity.getSummary();
        this.price = entity.getPrice();
        this.rating = entity.getRating();
        this.ratingCount = entity.getRatingCount();
        this.author = entity.getAuthor();
        this.translator = entity.getTranslator();
        this.publisher = entity.getPublisher();
        this.pubDate = entity.getPubDate();
        this.thumbnail = entity.getThumbnail();
        this.shortsUrl = entity.getShortsUrl();
        this.createdDate = entity.getCreatedDate();
        this.updatedDate = entity.getUpdatedDate();
    }

}
