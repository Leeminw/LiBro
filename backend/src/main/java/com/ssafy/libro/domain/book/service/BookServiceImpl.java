package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.*;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookAlreadyExistException;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    public BookDetailResponseDto createBook(BookCreateRequestDto requestDto) {
        Optional<Book> optionalBook = bookRepository.findByIsbn(requestDto.getIsbn());
        if(optionalBook.isPresent()) throw new BookAlreadyExistException();
        Book book = bookRepository.save(requestDto.toEntity());
        return new BookDetailResponseDto(book);
    }

    @Override
    public BookDetailResponseDto updateBook(BookUpdateRequestDto requestDto) {
        Book book = bookRepository.findById(requestDto.getId())
                .orElseThrow(() -> new BookNotFoundException(requestDto.getId()));
        book = bookRepository.save(book.update(requestDto));
        return new BookDetailResponseDto(book);
    }

    @Override
    public BookDetailResponseDto deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        bookRepository.delete(book);
        return new BookDetailResponseDto(book);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public List<BookDetailResponseDto> searchAllByShortsUrlIsNull() {
        List<Book> books = bookRepository.findAllByShortsUrlIsNull()
                .orElseThrow(BookNotFoundException::new);
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    @Override
    public List<BookDetailResponseDto> searchAllByShortsUrlIsNotNull() {
        List<Book> books = bookRepository.findAllByShortsUrlIsNotNull()
                .orElseThrow(BookNotFoundException::new);
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public BookDetailResponseDto findBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        return new BookDetailResponseDto(book);
    }

    @Override
    public List<BookDetailResponseDto> findAllBooks() {
        List<Book> books = bookRepository.findAll();
        if (books.isEmpty()) throw new BookNotFoundException();
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    @Override
    public Page<BookDetailResponseDto> findAllBooks(Pageable pageable) {
        Page<Book> books = bookRepository.findAll(pageable);
        if (books.isEmpty()) throw new BookNotFoundException();
        return books.map(BookDetailResponseDto::new);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public BookDetailResponseDto findBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException(isbn));
        return new BookDetailResponseDto(book);
    }

    @Override
    public List<BookDetailResponseDto> findAllByIsbn(String isbn) {
        List<Book> books = bookRepository.findAllByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException(isbn));
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    @Override
    public Page<BookDetailResponseDto> findAllByIsbn(String isbn, Pageable pageable) {
        Page<Book> books = bookRepository.findAllByIsbn(isbn, pageable)
                .orElseThrow(() -> new BookNotFoundException(isbn));
        return books.map(BookDetailResponseDto::new);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Page<BookDetailResponseDto> searchBooksByTitleContaining(String title, Pageable pageable) {
        Page<Book> books = bookRepository.findAllByTitleContaining(title, pageable)
                .orElseThrow(() -> new BookNotFoundException(title));
        return books.map(BookDetailResponseDto::new);
    }

    @Override
    public Page<BookDetailResponseDto> searchBooksByAuthorContaining(String author, Pageable pageable) {
        Page<Book> books = bookRepository.findAllByAuthorContaining(author, pageable)
                .orElseThrow(() -> new BookNotFoundException(author));
        return books.map(BookDetailResponseDto::new);
    }

    @Override
    public Page<BookDetailResponseDto> searchBooksBySummaryContaining(String summary, Pageable pageable) {
        Page<Book> books = bookRepository.findAllBySummaryContaining(summary, pageable)
                .orElseThrow(() -> new BookNotFoundException(summary));
        return books.map(BookDetailResponseDto::new);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Page<BookDetailResponseDto> filterBooksByPriceGreaterThanEqual(Integer price, Pageable pageable) {
        Page<Book> books = bookRepository.findByPriceGreaterThanEqual(price, pageable)
                .orElseThrow(() -> new BookNotFoundException(price.toString()));
        return books.map(BookDetailResponseDto::new);
    }

    @Override
    public Page<BookDetailResponseDto> filterBooksByRatingGreaterThanEqual(Double rating, Pageable pageable) {
        Page<Book> books = bookRepository.findByRatingGreaterThanEqual(rating, pageable)
                .orElseThrow(() -> new BookNotFoundException(rating.toString()));
        return books.map(BookDetailResponseDto::new);
    }

    @Override
    public Page<BookDetailResponseDto> filterBooksByPriceBetween(Integer minPrice, Integer maxPrice, Pageable pageable) {
        Page<Book> books = bookRepository.findByPriceBetween(minPrice, maxPrice, pageable)
                .orElseThrow(() -> new BookNotFoundException(minPrice.toString() + maxPrice.toString()));
        return books.map(BookDetailResponseDto::new);
    }

    @Override
    public Page<BookDetailResponseDto> filterBooksByRatingBetween(Double minRating, Double maxRating, Pageable pageable) {
        Page<Book> books = bookRepository.findByRatingBetween(minRating, maxRating, pageable)
                .orElseThrow(() -> new BookNotFoundException(minRating.toString() + maxRating.toString()));
        return books.map(BookDetailResponseDto::new);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
