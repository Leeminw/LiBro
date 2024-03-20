package com.ssafy.libro.domain.userbook.controller;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.userbook.dto.*;
import com.ssafy.libro.domain.userbook.service.UserBookService;
import com.ssafy.libro.global.common.ResponseData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/v1/userbook")
@RequiredArgsConstructor
public class UserBookController {
    private final UserBookService userBookService;


//    등록 도서 검색 조회
    @GetMapping("/search")
    public ResponseEntity<?> getUserBooksUsingKeyWord (@RequestParam Map<String,String> keyword) {
        return ResponseEntity.ok("data");
    }

//    등록 도서 목록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookList (@PathVariable Long userId){
        List<UserBookListResponseDto> responseDtoList = userBookService.getUserBookList(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }
//    등록 도서 상세 조회
    @GetMapping("/detail/{userBookId}")
    public ResponseEntity<?> getUserBookDetail(@PathVariable Long userBookId){
        UserBookDetailResponseDto responseDtoList = userBookService.getUserBook(userBookId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }
//    등록 도서 추가 기능
    @PostMapping("")
    public ResponseEntity<?> postUserBook(@RequestBody UserBookMappingRequestDto requestDto){
        UserBookDetailResponseDto responseDto = userBookService.mappingUserBook(requestDto);
       return ResponseEntity.status(HttpStatus.CREATED).body(ResponseData.success(responseDto));
    }
//    등록 도서 수정 기능
    @PutMapping("")
    public ResponseEntity<?> updateUserBook (@RequestBody UserBookUpdateRequestDto requestDto){
        UserBookDetailResponseDto responseDto = userBookService.updateUserBook(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
//    관리타입 수정
    @PostMapping("type")
    public ResponseEntity<?> updateUserBookType(@RequestBody UserBookTypeUpdateRequestDto requestDto){
        UserBookDetailResponseDto responseDto = userBookService.updateType(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
//    등록 도서 삭제 기능
    @DeleteMapping("/{userBookId}")
    public ResponseEntity<?> deleteUserBook (@PathVariable Long userBookId) {
        userBookService.deleteUserBook(userBookId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success("deleted user-book mapping"));
    }

//    특정 등록 도서 평점 기능
    @PostMapping("/rating")
    public ResponseEntity<?> updateUserBookRating(@RequestBody UserBookRatingRequestDto requestDto){
        UserBookDetailResponseDto responseDto = userBookService.updateRating(requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
//    독서 기록 조회( 회원별 완독한 도서를 월별로 조회하는기능)
    @GetMapping("/date/{userId}")
    public ResponseEntity<?> getBookListByDate
            (@PathVariable Long userId, @RequestParam Integer year, @RequestParam Integer month){
        List<UserBookListByDateResponseDto> responseDtoList = userBookService.getBookListByDate(userId,year,month);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }

//    사용자 등록 도서 완독
    @GetMapping("/read-ratio/user/{userId}")
    public ResponseEntity<?> getUserReadRatio(@PathVariable Long userId){
        UserBookRatioResponseDto responseDto = userBookService.getUserReadRatio(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
//   특정 등록 도서 완독률

    @GetMapping("/read-ratio/book/{bookId}")
    public ResponseEntity<?> getBookReadRatio(@PathVariable Long bookId){
        UserBookRatioResponseDto responseDto = userBookService.getBookReadRatio(bookId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDto));
    }
//    @GetMapping("/")
    @GetMapping("/complete/{userId}")
    public ResponseEntity<?> getUserBookReadComplete(@PathVariable Long userId){
        List<UserBookListResponseDto> responseDtoList = userBookService.getUserBookReadComplete(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }
    @GetMapping("/on-read/{userId}")
    public ResponseEntity<?> getUserBookOnRead(@PathVariable Long userId){
        List<UserBookListResponseDto> responseDtoList = userBookService.getUserBookOnReading(userId);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseData.success(responseDtoList));
    }
//    독서 기록 분석 ?

}
