package com.ssafy.libro.domain.book.controller;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.service.BookServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookController {
    private final BookServiceImpl bookService;

    @PostMapping("/api/v1/book")
    public ResponseEntity<?> createBook(@RequestBody BookCreateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.createBook(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/api/v1/book")
    public ResponseEntity<?> updateBook(@RequestBody BookUpdateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.updateBook(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @DeleteMapping("/api/v1/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/api/v1/book/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        BookDetailResponseDto responseDto = bookService.getBook(id);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/api/v1/books")
    public ResponseEntity<?> getBooks() {
        List<BookDetailResponseDto> responseDto = bookService.getBooks();
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

}
