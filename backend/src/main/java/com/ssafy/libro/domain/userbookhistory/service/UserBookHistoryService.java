package com.ssafy.libro.domain.userbookhistory.service;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryCreateRequestDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryUpdateRequestDto;

import java.util.List;

public interface UserBookHistoryService {
    // create, update, delete, get,
    UserBookHistoryDetailResponseDto createUserBookHistory(UserBookHistoryCreateRequestDto userBookHistory) throws Exception;
    UserBookHistoryDetailResponseDto updateUserBookHistory(UserBookHistoryUpdateRequestDto userBookHistory) throws Exception;
    void deleteUserBookHistory(Long id);
    UserBookHistoryDetailResponseDto getUserBookHistory(Long id) throws Exception;
    List<UserBookHistoryDetailResponseDto> getUserBookHistoryList(Long userBookId);
}
