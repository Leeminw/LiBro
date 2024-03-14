package com.ssafy.libro.domain.userbook.controller;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.userbook.service.UserBookService;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/vi/userbook")
@RequiredArgsConstructor
public class UserBookController {
//    등록 도서 검색 조회
    private final UserBookService userBookService;


    @GetMapping("/search")
    public ResponseEntity<?> getUserBooksUsingKeyWord (@RequestParam Map<Object,Object> keyword) {
        return ResponseEntity.ok("data");
    }
//    등록 도서 목록 조회
    @GetMapping("")
    public ResponseEntity<?> getUserBooks (){
        List<BookDetailResponseDto> result = userBookService.getUserBookList();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
//    등록 도서 상세 조회
    @GetMapping("/detail/{bookId}")
    public ResponseEntity<?> getUserBookDetail(@PathVariable Long bookId){

        return ResponseEntity.ok("");
    }
//    등록 도서 추가 기능
    @PostMapping("/{bookId}")
    public ResponseEntity<?> postUserBook(@PathVariable Long bookId){
       return ResponseEntity.ok("");
    }
//    등록 도서 수정 기능
    @PutMapping("/{bookId}")
    public ResponseEntity<?> updateUserBook (){
        return ResponseEntity.ok("");
    }
//    등록 도서 삭제 기능
    @DeleteMapping("/{bookdId}")
    public ResponseEntity<?> deleteUserBook () {
        return ResponseEntity.ok("");
    }
//    전체 등록 도서 완독률
//    @GetMapping("/")
//    특정 등록 도서 완독률
//    특정 등록 도서 평점 기능

//    특정 등록 도서 메모 기능
//    독서 기록
//    독서 기록 조회
//    독서 기록 분석 ?

}
