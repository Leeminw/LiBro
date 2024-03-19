package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;

    @Override
    public BookDetailResponseDto createBook(BookCreateRequestDto requestDto) {
        Book book = bookRepository.save(requestDto.toEntity());
        return new BookDetailResponseDto(book);
    }

    @Override
    public BookDetailResponseDto updateBook(BookUpdateRequestDto requestDto) {
        Book book = bookRepository.findById(requestDto.getId()).orElseThrow(
                () -> new BookNotFoundException(requestDto.getId()));
        book = bookRepository.save(book.update(requestDto));
        return new BookDetailResponseDto(book);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public BookDetailResponseDto getBook(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(
                () -> new BookNotFoundException(id));
        return new BookDetailResponseDto(book);
    }

    @Override
    public List<BookDetailResponseDto> getBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream().map(BookDetailResponseDto::new).toList();
    }

    @Override
    public List<BookDetailResponseDto> getBooksByTitle(String title, Pageable pageable) {
        log.debug("service page : {} , size : {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<Book> bookList = bookRepository.findBookByTitleContaining(title, pageable);
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList.getContent()){
            log.debug("requested data : {}", book);

            responseDto.add(new BookDetailResponseDto(book));
        }

        return responseDto;
    }

    @Override
    public List<BookDetailResponseDto> getBooksByAuthor(String author, Pageable pageable) {
        Page<Book> bookList = bookRepository.findBookByAuthorContaining(author,pageable);
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList){
            responseDto.add(new BookDetailResponseDto(book));
        }
        return responseDto;
    }

    @Override
    public List<BookDetailResponseDto> getBooksByIsbn(String isbn) {
        List<Book> bookList = bookRepository.findBookByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException(isbn));
        List<BookDetailResponseDto> responseDto = new ArrayList<>();
        for(Book book : bookList){
            responseDto.add(new BookDetailResponseDto(book));
        }
        return responseDto;
    }


}
