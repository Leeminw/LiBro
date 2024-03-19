package com.ssafy.libro.domain.userbookhistory.service;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.exception.UserBookNotFoundException;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryCreateRequestDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryUpdateRequestDto;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import com.ssafy.libro.domain.userbookhistory.exception.UserBookHistoryNotFoundException;
import com.ssafy.libro.domain.userbookhistory.repository.UserBookHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserBookHistoryServiceImpl implements UserBookHistoryService{
    private final UserBookRepository userBookRepository;
    private final UserBookHistoryRepository userBookHistoryRepository;

    @Override
    public UserBookHistoryDetailResponseDto createUserBookHistory(UserBookHistoryCreateRequestDto requestDto) {
        UserBookHistory userBookHistory = requestDto.toEntity();
        Long userBookId = requestDto.getUserBookId();
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new UserBookNotFoundException(userBookId));

        userBookHistory.updateUserBook(userBook);
        userBookHistoryRepository.save(userBookHistory);

        return new UserBookHistoryDetailResponseDto(userBookHistory);
    }

    @Override
    public UserBookHistoryDetailResponseDto updateUserBookHistory
            (UserBookHistoryUpdateRequestDto requestDto) {
        UserBookHistory userBookHistory = userBookHistoryRepository.findById(requestDto.getId())
                .orElseThrow(() -> new UserBookHistoryNotFoundException(requestDto.getId()));
        userBookHistory.update(requestDto);
        userBookHistoryRepository.save(userBookHistory);

        return new UserBookHistoryDetailResponseDto(userBookHistory);
    }

    @Override
    public void deleteUserBookHistory(Long id) {
        userBookRepository.deleteById(id);
    }

    @Override
    public UserBookHistoryDetailResponseDto getUserBookHistory(Long userBookHistoryId)  {
        UserBookHistory userbookHistory = userBookHistoryRepository.findById(userBookHistoryId)
                .orElseThrow(() -> new UserBookHistoryNotFoundException(userBookHistoryId) );

        return new UserBookHistoryDetailResponseDto(userbookHistory);
    }

    @Override
    public List<UserBookHistoryDetailResponseDto> getUserBookHistoryList(Long userBookId) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new UserBookNotFoundException(userBookId));

        List<UserBookHistory> userBookHistoryList = userBookHistoryRepository.findByUserBook(userBook)
                .orElseThrow(() -> new UserBookHistoryNotFoundException(userBookId));

        List<UserBookHistoryDetailResponseDto> responseDtoList = new ArrayList<>();

        for(UserBookHistory history : userBookHistoryList){
            responseDtoList.add(new UserBookHistoryDetailResponseDto(history));
        }

        return responseDtoList;
    }
}
