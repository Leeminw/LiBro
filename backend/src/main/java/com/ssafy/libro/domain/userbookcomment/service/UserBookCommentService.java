package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;

import java.util.List;

public interface UserBookCommentService {

    UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) throws Exception;
    UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto);
    void deleteUserBookComment(Long id);
    UserBookCommentDetailResponseDto getUserBookComment(Long id)throws Exception;
    List<UserBookCommentDetailResponseDto> getUserBookCommentList();
}
