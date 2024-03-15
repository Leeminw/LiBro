package com.ssafy.libro.domain.userbookhistory.service;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryCreateRequestDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryUpdateRequestDto;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import com.ssafy.libro.domain.userbookhistory.repository.UserBookHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBookHistoryServiceImpl implements UserBookHistoryService{
    private final UserBookRepository userBookRepository;
    private final UserBookHistoryRepository userBookHistoryRepository;

    @Override
    public UserBookHistoryDetailResponseDto createUserBookHistory(UserBookHistoryCreateRequestDto requestDto) throws Exception {
        UserBookHistory userBookHistory = requestDto.toEntity();
        Long userBookId = requestDto.getUserBookId();
        UserBook userBook = userBookRepository.findById(userBookId).orElseThrow(() -> new Exception());

        userBookHistory.updateUserBook(userBook);
        userBookHistoryRepository.save(userBookHistory);

        return new UserBookHistoryDetailResponseDto(userBookHistory);
    }

    @Override
    public UserBookHistoryDetailResponseDto updateUserBookHistory
            (UserBookHistoryUpdateRequestDto requestDto) throws Exception {
        UserBookHistory userBookHistory = userBookHistoryRepository.findById(requestDto.getId())
                .orElseThrow(() -> new Exception());
        userBookHistory.update(requestDto);
        userBookHistoryRepository.save(userBookHistory);

        return new UserBookHistoryDetailResponseDto(userBookHistory);
    }

    @Override
    public void deleteUserBookHistory(Long id) {
        userBookRepository.deleteById(id);
    }

    @Override
    public UserBookHistoryDetailResponseDto getUserBookHistory(Long id) throws Exception {
        UserBookHistory userbookHistory = userBookHistoryRepository.findById(id)
                .orElseThrow(() -> new Exception(""));

        return new UserBookHistoryDetailResponseDto(userbookHistory);
    }

    @Override
    public List<UserBookHistoryDetailResponseDto> getUserBookHistoryList() {
//        List<UserBookHistoryDetailResponseDto> list = new ArrayList<>();
//        User user = User.builder().build();
//
        return null;
    }
}
