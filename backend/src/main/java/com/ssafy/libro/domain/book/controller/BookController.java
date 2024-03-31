package com.ssafy.libro.domain.book.controller;

import com.ssafy.libro.domain.book.dto.BookCreateRequestDto;
import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.dto.BookUpdateRequestDto;
import com.ssafy.libro.domain.book.service.BookServiceImpl;
import com.ssafy.libro.domain.book.service.NaverBookAPIServiceImpl;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BookController {

    private final BookServiceImpl bookService;
    private final NaverBookAPIServiceImpl naverBookAPIService;

    @PostMapping("/api/v1/book")
    public ResponseEntity<?> createBook(@RequestBody BookCreateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.createBook(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @PutMapping("/api/v1/book")
    public ResponseEntity<?> updateBook(@RequestBody BookUpdateRequestDto requestDto) {
        BookDetailResponseDto responseDto = bookService.updateBook(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @DeleteMapping("/api/v1/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        BookDetailResponseDto responseDto = bookService.deleteBook(id);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/api/v1/book/{id}")
    public ResponseEntity<?> findBookById(@PathVariable Long id) {
        BookDetailResponseDto responseDto = bookService.findBookById(id);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/book")
    public ResponseEntity<?> findBookByIsbn(@RequestParam String isbn) {
        BookDetailResponseDto responseDto = bookService.findBookByIsbn(isbn);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/api/v1/book-list/search")
    public ResponseEntity<?> findAllBy(@RequestParam(required = false) String isbn) {
        List<BookDetailResponseDto> responseDto = bookService.findAllBooks();
        if (isbn != null) responseDto = bookService.findAllByIsbn(isbn);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/book-page/search")
    public ResponseEntity<?> searchBooksBy(@RequestParam(required = false) String isbn,
                                           @RequestParam(required = false) String title,
                                           @RequestParam(required = false) String author,
                                           @RequestParam(required = false) String summary,
                                           @PageableDefault(page = 0, size = 10, sort = "id,asc") Pageable pageable) {
        Page<BookDetailResponseDto> responseDto = bookService.findAllBooks(pageable);
        if (isbn != null) responseDto = bookService.findAllByIsbn(isbn, pageable);
        else if (title != null) responseDto = bookService.searchBooksByTitleContaining(title, pageable);
        else if (author != null) responseDto = bookService.searchBooksByAuthorContaining(author, pageable);
        else if (summary != null) responseDto = bookService.searchBooksBySummaryContaining(summary, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    @GetMapping("/api/v1/book-page/filter")
    public ResponseEntity<?> filterBooksBy(@RequestParam(required = false) Integer minPrice,
                                           @RequestParam(required = false) Integer maxPrice,
                                           @RequestParam(required = false) Double minRating,
                                           @RequestParam(required = false) Double maxRating,
                                           @PageableDefault(page = 0, size = 10, sort = "id,asc") Pageable pageable) {
        Page<BookDetailResponseDto> responseDto = bookService.findAllBooks(pageable);
        if (minPrice != null && maxPrice != null)
            responseDto = bookService.filterBooksByPriceBetween(minPrice, maxPrice, pageable);
        else if (minRating != null && maxRating != null)
            responseDto = bookService.filterBooksByRatingBetween(minRating, maxRating, pageable);
        else if (minPrice != null)
            responseDto = bookService.filterBooksByPriceGreaterThanEqual(minPrice, pageable);
        else if (minRating != null)
            responseDto = bookService.filterBooksByRatingGreaterThanEqual(minRating, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @GetMapping("/api/v1/naver-book-api/update")
    public ResponseEntity<?> updateBookByApi(@RequestParam String query) throws IOException {
        naverBookAPIService.updateBooksByNaverAPI(query);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("Update Complete Successfully."));
    }

    @GetMapping("/api/v1/book/search")
    public ResponseEntity<?> getBooksByTitle(
            @RequestParam String key, @RequestParam String word, @RequestParam Integer page, @RequestParam Integer size) {
        List<BookDetailResponseDto> responseDto = null;
        log.debug("controller page : {} , size : {}", page, size);
        if ("isbn".equals(key)) {
            // isbn 조회
            responseDto = bookService.findAllByIsbn(word);
        } else if ("title".equals(key)) {
            // title 조회
            responseDto = bookService.searchBooksByTitleContaining(word, PageRequest.of(page, size)).getContent();
        } else if ("author".equals(key)) {
            // 작가조회
            responseDto = bookService.searchBooksByAuthorContaining(word, PageRequest.of(page, size)).getContent();
        } else {
            //키워드가 없는 경우
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseData.error("잘못된 요청입니다."));
        }

        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }

}
