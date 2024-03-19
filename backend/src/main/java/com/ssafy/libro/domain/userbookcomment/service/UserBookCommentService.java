package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;

import java.util.List;

public interface UserBookCommentService {

    UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) ;
    UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto) ;
    void deleteUserBookComment(Long userBookCommentId) ;
    UserBookCommentDetailResponseDto getUserBookComment(Long userBookCommentId);
    List<UserBookCommentDetailResponseDto> getUserBookCommentList(Long userBookId);

}
