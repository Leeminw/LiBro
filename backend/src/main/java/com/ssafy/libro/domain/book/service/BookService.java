package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface BookService {
     BookDetailResponseDto createBook(BookCreateRequestDto requestDto);
     BookDetailResponseDto updateBook(BookUpdateRequestDto requestDto);
     BookDetailResponseDto deleteBook(Long id);

     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     List<BookDetailResponseDto> getAllByShortsUrlIsNull();
     List<BookDetailResponseDto> getAllByShortsUrlIsNotNull();

     BookDetailResponseDto getByIsbn(String isbn);
     List<BookDetailResponseDto> getAllByIsbn(String isbn);
     Page<BookDetailResponseDto> getAllByIsbn(String isbn, Pageable pageable);
     Page<BookDetailResponseDto> getAllByTitleContaining(String title, Pageable pageable);
     Page<BookDetailResponseDto> getAllByAuthorContaining(String author, Pageable pageable);
     Page<BookDetailResponseDto> getAllBySummaryContaining(String summary, Pageable pageable);


     Page<BookDetailResponseDto> getByPriceGreaterThanEqual(Integer price);
     Page<BookDetailResponseDto> getByRatingGreaterThanEqual(Double rating);
     Page<BookDetailResponseDto> getByPriceBetween(Integer minPrice, Integer maxPrice);
     Page<BookDetailResponseDto> getByRatingBetween(Double minRating, Double maxRating);


     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     BookDetailResponseDto getBook(Long id);
     List<BookDetailResponseDto> getBooks();

     List<BookDetailResponseDto> getBooksByTitle(String title, Pageable pageable);
     List<BookDetailResponseDto> getBooksByAuthor(String author, Pageable pageable);
     List<BookDetailResponseDto> getBooksByIsbn(String isbn);

     void updateBooksByApi(String query) throws IOException;

     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // List<BookCreateResponseDto> getBooksByTitle(String title);
    // List<BookCreateResponseDto> getBooksByAuthor(String author);
    // List<BookCreateResponseDto> getBooksByPublisher(String publisher);
    // List<BookCreateResponseDto> getBooksByIsbn(String isbn);
    // List<BookCreateResponseDto> getBooksByRating(Double rating);
    // List<BookCreateResponseDto> getBooksByRatingCount(Integer ratingCount);
    // List<BookCreateResponseDto> getBooksByPrice(Integer price);
    // List<BookCreateResponseDto> getBooksByPubDate(LocalDateTime pubDate);
    // List<BookCreateResponseDto> getBooksBySummary(String summary);
    // List<BookCreateResponseDto> getBooksByTranslator(String translator);
    // List<BookCreateResponseDto> getBooksByTitleAndAuthor(String title, String author);
    // List<BookCreateResponseDto> getBooksByTitleAndPublisher(String title, String publisher);
    // List<BookCreateResponseDto> getBooksByTitleAndIsbn(String title, String isbn);
    // List<BookCreateResponseDto> getBooksByTitleAndRating(String title, Double rating);
    // List<BookCreateResponseDto> getBooksByTitleAndRatingCount(String title, Integer ratingCount);
    // List<BookCreateResponseDto> getBooksByTitleAndPrice(String title, Integer price);
    // List<BookCreateResponseDto> getBooksByTitleAndPubDate(String title, LocalDateTime pubDate);
    // List<BookCreateResponseDto> getBooksByTitleAndSummary(String title, String summary);
    // List<BookCreateResponseDto> getBooksByTitleAndTranslator(String title, String translator);
    // List<BookCreateResponseDto> getBooksByAuthorAndPublisher(String author, String publisher);
    // List<BookCreateResponseDto> getBooksByAuthorAndIsbn(String author, String isbn);
    // List<BookCreateResponseDto> getBooksByAuthorAndRating(String author, Double rating);
    // List<BookCreateResponseDto> getBooksByAuthorAndRatingCount(String author, Integer ratingCount);
    // List<BookCreateResponseDto> getBooksBy
}
