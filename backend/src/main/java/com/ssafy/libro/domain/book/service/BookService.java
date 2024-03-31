package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {
    BookDetailResponseDto createBook(BookCreateRequestDto requestDto);
    BookDetailResponseDto updateBook(BookUpdateRequestDto requestDto);
    BookDetailResponseDto deleteBook(Long id);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    List<BookDetailResponseDto> searchAllByShortsUrlIsNull();
    List<BookDetailResponseDto> searchAllByShortsUrlIsNotNull();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    BookDetailResponseDto findBookById(Long id);
    BookDetailResponseDto findBookByIsbn(String isbn);
    List<BookDetailResponseDto> findAllBooks();
    List<BookDetailResponseDto> findAllByIsbn(String isbn);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Page<BookDetailResponseDto> findAllBooks(Pageable pageable);
    Page<BookDetailResponseDto> findAllByIsbn(String isbn, Pageable pageable);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Page<BookDetailResponseDto> searchBooksByTitleContaining(String title, Pageable pageable);
    Page<BookDetailResponseDto> searchBooksByAuthorContaining(String author, Pageable pageable);
    Page<BookDetailResponseDto> searchBooksBySummaryContaining(String summary, Pageable pageable);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Page<BookDetailResponseDto> filterBooksByPriceGreaterThanEqual(Integer price, Pageable pageable);
    Page<BookDetailResponseDto> filterBooksByRatingGreaterThanEqual(Double rating, Pageable pageable);
    Page<BookDetailResponseDto> filterBooksByPriceBetween(Integer minPrice, Integer maxPrice, Pageable pageable);
    Page<BookDetailResponseDto> filterBooksByRatingBetween(Double minRating, Double maxRating, Pageable pageable);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //List<BookDetailResponseDto> searchBooksByTitleContainingAndAuthorContaining(String title, String author);
    //List<BookDetailResponseDto> searchBooksByTitleContainingAndSummaryContaining(String title, String summary);
    //List<BookDetailResponseDto> searchBooksByTitleContainingAndPublisherContaining(String title, String publisher);
    //List<BookDetailResponseDto> searchBooksBySummaryContainingAndAuthorContaining(String summary, String author);
    //List<BookDetailResponseDto> searchBooksBySummaryContainingAndPublisherContaining(String summary, String publisher);
    //List<BookDetailResponseDto> searchBooksByAuthorContainingAndPublisherContaining(String author, String publisher);
    //List<BookDetailResponseDto> filterBooksByTitleContainingAndPriceBetween(String title, Integer minPrice, Integer maxPrice);
    //List<BookDetailResponseDto> filterBooksByAuthorContainingAndPriceBetween(String author, Integer minPrice, Integer maxPrice);
    //List<BookDetailResponseDto> filterBooksBySummaryContainingAndPriceBetween(String summary, Integer minPrice, Integer maxPrice);
    //List<BookDetailResponseDto> filterBooksByPublisherContainingAndPriceBetween(String publisher, Integer minPrice, Integer maxPrice);
    //List<BookDetailResponseDto> filterBooksByTitleContainingAndRatingGreaterThanEqual(String title, Double rating);
    //List<BookDetailResponseDto> filterBooksByTitleContainingAndRatingCountGreaterThanEqual(String title, Integer ratingCount);
    //List<BookDetailResponseDto> filterBooksByAuthorContainingAndRatingGreaterThanEqual(String author, Double rating);
    //List<BookDetailResponseDto> filterBooksByAuthorContainingAndRatingCountGreaterThanEqual(String author, Integer ratingCount);
    //List<BookDetailResponseDto> filterBooksBySummaryContainingAndRatingGreaterThanEqual(String summary, Double rating);
    //List<BookDetailResponseDto> filterBooksBySummaryContainingAndRatingCountGreaterThanEqual(String summary, Integer ratingCount);
    //List<BookDetailResponseDto> filterBooksByPublisherContainingAndRatingGreaterThanEqual(String publisher, Double rating);
    //List<BookDetailResponseDto> filterBooksByPublisherContainingAndRatingCountGreaterThanEqual(String publisher, Integer ratingCount);
}
