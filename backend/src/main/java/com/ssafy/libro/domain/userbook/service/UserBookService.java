package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.userbook.dto.UserBookDetailResponseDto;
import com.ssafy.libro.domain.userbook.dto.UserBookListResponseDto;
import com.ssafy.libro.domain.userbook.dto.UserBookMappingRequestDto;
import com.ssafy.libro.domain.userbook.dto.UserBookUpdateRequestDto;

import java.util.List;

public interface UserBookService {
    // 등록도서 검색

    // 등록도서 목록
    List<UserBookListResponseDto> getUserBookList(Long userId);

    // 등록도서 상세 >> history, comment 같이 조회
    UserBookDetailResponseDto getUserBook(Long id);
    // 등록도서 추가
    UserBookDetailResponseDto mappingUserBook(UserBookMappingRequestDto requestDto);
    // 등록도서 수정
    UserBookDetailResponseDto updateUserBook(UserBookUpdateRequestDto requestDto);

    // 등록도서 삭제
    void deleteUserBook(Long id);




}
