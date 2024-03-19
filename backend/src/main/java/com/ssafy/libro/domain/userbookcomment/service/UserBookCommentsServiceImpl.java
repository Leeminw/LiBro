package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.exception.UserBookNotFoundException;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookcomment.exception.UserBookCommentNotFoundException;
import com.ssafy.libro.domain.userbookcomment.repository.UserBookCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserBookCommentsServiceImpl implements UserBookCommentService{
    private final UserBookRepository userBookRepository;
    private final UserBookCommentRepository userBookCommentRepository;

    @Override
    public UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) {
        UserBookComment userBookComment = requestDto.toEntity();
        UserBook userBook = userBookRepository.findById(requestDto.getUserBookId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getUserBookId()));

        userBookComment.updateUserBook(userBook);
        userBookCommentRepository.save(userBookComment);


        return new UserBookCommentDetailResponseDto(userBookComment);
    }

    @Override
    public UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto) {
        UserBookComment userBookComment = userBookCommentRepository.findById(requestDto.getId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getId()));
        userBookComment.update(requestDto);

        return new UserBookCommentDetailResponseDto(userBookComment);
    }

    @Override
    public void deleteUserBookComment(Long userBookCommentId)  {
        UserBookComment userBookComment = userBookCommentRepository.findById(userBookCommentId)
                .orElseThrow(() -> new UserBookCommentNotFoundException(userBookCommentId));

        userBookCommentRepository.delete(userBookComment);
    }

    @Override
    public UserBookCommentDetailResponseDto getUserBookComment(Long userBookCommentId) {
        UserBookComment userBookComment = userBookCommentRepository.findById(userBookCommentId)
                .orElseThrow(() -> new UserBookCommentNotFoundException(userBookCommentId));
        return new UserBookCommentDetailResponseDto(userBookComment);
    }

    @Override
    public List<UserBookCommentDetailResponseDto> getUserBookCommentList(Long userBookId) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new UserBookNotFoundException(userBookId));
        List<UserBookComment> userBookCommentList = userBookCommentRepository.findByUserBook(userBook)
                .orElseThrow(() -> new UserBookCommentNotFoundException("userBookId: " + userBookId));

        List<UserBookCommentDetailResponseDto> responseDtoList = new ArrayList<>();
        for(UserBookComment comment : userBookCommentList){
            responseDtoList.add(new UserBookCommentDetailResponseDto(comment));
        }
        return responseDtoList;
    }
}
