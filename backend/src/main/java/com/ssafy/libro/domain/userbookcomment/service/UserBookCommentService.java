package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;

import java.util.List;

public interface UserBookCommentService {

    UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) throws Exception;
    UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto) throws Exception;
    void deleteUserBookComment(Long id) throws Exception;
    UserBookCommentDetailResponseDto getUserBookComment(Long id)throws Exception;
    List<UserBookCommentDetailResponseDto> getUserBookCommentList();

    // 등록도서 검색
    // 등록도서 목록조회
    // 등록도서 상세조회

}
