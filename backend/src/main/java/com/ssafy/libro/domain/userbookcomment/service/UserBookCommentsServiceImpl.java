package com.ssafy.libro.domain.userbookcomment.service;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentCreateRequestDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentUpdateRequestDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookcomment.repository.UserBookCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBookCommentsServiceImpl implements UserBookCommentService{
    private final UserBookRepository userBookRepository;
    private final UserBookCommentRepository userBookCommentRepository;

    @Override
    public UserBookCommentDetailResponseDto createUserBookComment(UserBookCommentCreateRequestDto requestDto) throws Exception {
        UserBookComment userBookComment = requestDto.toEntity();
        UserBook userBook = userBookRepository.findById(requestDto.getUserBookId())
                .orElseThrow(() -> new Exception());

        userBookComment.updateUserBook(userBook);
        userBookCommentRepository.save(userBookComment);


        return new UserBookCommentDetailResponseDto(userBookComment);
    }

    @Override
    public UserBookCommentDetailResponseDto updateUserBookComment(UserBookCommentUpdateRequestDto requestDto) throws Exception {
        UserBookComment userBookComment = userBookCommentRepository.findById(requestDto.getId())
                .orElseThrow(() -> new Exception());
        userBookComment.update(requestDto);

        return null;
    }

    @Override
    public void deleteUserBookComment(Long id) throws Exception {
        UserBookComment userBookComment = userBookCommentRepository.findById(id)
                .orElseThrow(() -> new Exception());

        userBookCommentRepository.delete(userBookComment);
    }

    @Override
    public UserBookCommentDetailResponseDto getUserBookComment(Long id) throws Exception {
        UserBookComment userBookComment = userBookCommentRepository.findById(id)
                .orElseThrow(() -> new Exception());


        return new UserBookCommentDetailResponseDto(userBookComment);
    }

    @Override
    public List<UserBookCommentDetailResponseDto> getUserBookCommentList() {

        return null;
    }
}
