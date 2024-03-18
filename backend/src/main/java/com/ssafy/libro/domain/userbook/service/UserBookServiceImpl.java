package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.domain.userbook.dto.UserBookDetailResponseDto;
import com.ssafy.libro.domain.userbook.dto.UserBookListResponseDto;
import com.ssafy.libro.domain.userbook.dto.UserBookMappingRequestDto;
import com.ssafy.libro.domain.userbook.dto.UserBookUpdateRequestDto;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.exception.UserBookNotFoundException;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookcomment.repository.UserBookCommentRepository;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import com.ssafy.libro.domain.userbookhistory.repository.UserBookHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserBookServiceImpl implements UserBookService{
    private final UserBookRepository userBookRepository;
    private final BookRepository bookRepository;
    private final UserBookHistoryRepository userBookHistoryRepository;
    private final UserBookCommentRepository userBookCommentRepository;
    private final UserRepository userRepository;
    public List<UserBookListResponseDto> getUserBookList(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        List<UserBook> userBookList = userBookRepository.findUserBookByUser(user)
                .orElseThrow(() -> new UserBookNotFoundException("user : " + userId));

        List<UserBookListResponseDto> result = new ArrayList<>();
        for(UserBook userbook : userBookList){
            UserBookListResponseDto responseDto = UserBookListResponseDto.builder()
                    .userBookId(userbook.getId())
                    .type(userbook.getType())
                    .createdTime(userbook.getCreatedDate())
                    .updatedTime(userbook.getUpdatedDate())
                    .ratingSpoiler(userbook.getRatingSpoiler())
                    .rating(userbook.getRating())
                    .ratingComment(userbook.getRatingComment())
                    .bookDetailResponseDto(new BookDetailResponseDto(userbook.getBook()))
                    .build();

            result.add(responseDto);
        }


        return result;
    }

    @Override
    public UserBookDetailResponseDto getUserBook(Long id) {
        UserBook userBook = userBookRepository.findById(id)
                .orElseThrow(()-> new UserBookNotFoundException(id));

        UserBookDetailResponseDto responseDto = new UserBookDetailResponseDto(userBook);

        // 사용자의 해당 도서를 읽은 기록
        Optional<List<UserBookHistory>>historyList = userBookHistoryRepository.findByUserBook(userBook);
        if(historyList.isPresent() && !historyList.get().isEmpty()){
            List<UserBookHistoryDetailResponseDto> historyDetailList = new ArrayList<>();
            for(UserBookHistory history : historyList.get()){
                historyDetailList.add(new UserBookHistoryDetailResponseDto(history));
            }
            responseDto.updateHistoryList(historyDetailList);
        }
        // 사용자가 해당 도서에 남긴 글귀

        Optional<List<UserBookComment>> commentList = userBookCommentRepository.findByUserBook(userBook);
        if(commentList.isPresent() && !commentList.get().isEmpty()){
            List<UserBookCommentDetailResponseDto> commentDetailList = new ArrayList<>();
            for(UserBookComment comment : commentList.get()){
                commentDetailList.add(new UserBookCommentDetailResponseDto(comment));

            }
            responseDto.updateCommentList(commentDetailList);
        }


        return responseDto;
    }

    @Override
    public UserBookDetailResponseDto mappingUserBook(UserBookMappingRequestDto requestDto) {
        User user = User.builder().build();
        Book book = bookRepository.findById(requestDto.getBookId())
                .orElseThrow(() -> new BookNotFoundException(requestDto.getBookId()));
        UserBook userBook = requestDto.toEntity();

        userBook.updateUser(user);
        userBook.updateBook(book);

        userBook = userBookRepository.save(userBook);

        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    public UserBookDetailResponseDto updateUserBook(UserBookUpdateRequestDto requestDto) {
        UserBook userBook = userBookRepository.findById(requestDto.getId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getId()));
        userBook.update(requestDto);
        userBook = userBookRepository.save(userBook);

        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    public void deleteUserBook(Long id) {
        userBookRepository.findById(id);
    }


}
