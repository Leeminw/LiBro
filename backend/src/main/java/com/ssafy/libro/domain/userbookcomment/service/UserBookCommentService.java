package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;

import java.util.List;

public interface UserBookCommentService {

    UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) ;
    UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto) ;
    void deleteUserBookComment(Long id) ;
    UserBookCommentDetailResponseDto getUserBookComment(Long id);
    List<UserBookCommentDetailResponseDto> getUserBookCommentList(Long userBookId);

    // 등록도서 검색
    // 등록도서 목록조회
    // 등록도서 상세조회

}
