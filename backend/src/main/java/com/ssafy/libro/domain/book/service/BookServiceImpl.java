package com.ssafy.libro.domain.book.service;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
