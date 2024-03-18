package com.ssafy.libro.domain.book.controller;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.service.BookServiceImpl;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BookController {
    private final BookServiceImpl bookService;

    @PostMapping("/api/v1/book")
    public ResponseEntity<?> createBook(@RequestBody BookCreateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.createBook(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success(responseDto));
    }

    @PutMapping("/api/v1/book")
    public ResponseEntity<?> updateBook(@RequestBody BookUpdateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.updateBook(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @DeleteMapping("/api/v1/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ResponseData.success(id));
    }

    @GetMapping("/api/v1/book/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        BookDetailResponseDto responseDto = bookService.getBook(id);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/books")
    public ResponseEntity<?> getBooks() {
        List<BookDetailResponseDto> responseDto = bookService.getBooks();
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/book/search")
    public ResponseEntity<?> getBooksByTitle(
            @RequestParam String key, @RequestParam String word, @RequestParam Integer page, @RequestParam Integer size){
        List<BookDetailResponseDto> responseDto = null;
        log.debug("controller page : {} , size : {}", page, size);
        if("isbn".equals(key)){
            // isbn 조회
            responseDto = bookService.getBooksByIsbn(word);
        }
        else if("title".equals(key)){
            // title 조회
            responseDto = bookService.getBooksByTitle(word, PageRequest.of(page,size));
        }
        else if("author".equals(key)){
            // 작가조회
            responseDto = bookService.getBooksByAuthor(word, PageRequest.of(page,size));
        }
        else{
            //키워드가 없는 경우
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseData.error("잘못된 요청입니다."));
        }

        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }


}
