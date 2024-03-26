package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.repository.BookRepository;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.domain.user.service.UserService;
import com.ssafy.libro.domain.userbook.dto.*;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.exception.NotReadBookException;
import com.ssafy.libro.domain.userbook.exception.UserBookNotFoundException;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import com.ssafy.libro.domain.userbookcomment.dto.UserBookCommentDetailResponseDto;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import com.ssafy.libro.domain.userbookcomment.repository.UserBookCommentRepository;
import com.ssafy.libro.domain.userbookhistory.dto.UserBookHistoryDetailResponseDto;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import com.ssafy.libro.domain.userbookhistory.repository.UserBookHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
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
    private final UserService userService;
    public List<UserBookListResponseDto> getUserBookList(){
        User user = userService.loadUser();
        List<UserBook> userBookList = userBookRepository.findUserBookByUser(user)
                .orElseThrow(() -> new UserBookNotFoundException("user : " + user.getId()));

        return getUserBookListResponseDtos(userBookList);
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
    @Transactional
    public UserBookDetailResponseDto mappingUserBook(UserBookMappingRequestDto requestDto) {
        User user = userService.loadUser();
        Book book = bookRepository.findById(requestDto.getBookId())
                .orElseThrow(() -> new BookNotFoundException(requestDto.getBookId()));
        UserBook userBook = requestDto.toEntity();

        userBook.updateUser(user);
        userBook.updateBook(book);

        userBook = userBookRepository.save(userBook);

        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    @Transactional
    public UserBookDetailResponseDto updateUserBook(UserBookUpdateRequestDto requestDto) {
        UserBook userBook = userBookRepository.findById(requestDto.getId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getId()));
        userBook.update(requestDto);
        userBook = userBookRepository.save(userBook);

        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    @Transactional
    public void deleteUserBook(Long userBookId) {
        UserBook userBook = userBookRepository.findById(userBookId)
                .orElseThrow(() -> new UserBookNotFoundException(userBookId));

        userBook.updateDelete();
        userBookRepository.save(userBook);
        
    }

    @Override
    public List<UserBookListByDateResponseDto> getBookListByDate(Integer year, Integer month) {
        User user = userService.loadUser();
        // date parsing
        LocalDateTime startDateTime = LocalDateTime.of(year, month, 1, 0, 0);
        int lastDayOfMonth = Month.of(month).length(Year.isLeap(year));
        LocalDateTime endDateTime = LocalDateTime.of(year, month, lastDayOfMonth, 23, 59, 59);

        log.debug("service layer : startDate = {} , endDate = {}",startDateTime, endDateTime);

        List<UserBook> result = userBookRepository.findUserBookByUserAndDate(user,startDateTime,endDateTime)
                .orElseThrow(()-> new UserBookNotFoundException("userid : " + user.getId()));
        List<UserBookListByDateResponseDto> responseDtoList = new ArrayList<>();
        log.debug("service layer : result size = {}", result.size());

        for(UserBook userBook : result){
            List<UserBookHistoryDetailResponseDto> historyList = new ArrayList<>();
            for(UserBookHistory history : userBook.getUserBookHistoryList()){
                historyList.add(new UserBookHistoryDetailResponseDto(history));
            }
            UserBookListByDateResponseDto responseDto = UserBookListByDateResponseDto.builder()
                    .userBookId(userBook.getId())
                    .bookDetailResponseDto(new BookDetailResponseDto(userBook.getBook()))
                    .bookHistoryDetailResponseDto(historyList)
                    .build();
            responseDtoList.add(responseDto);
        }

        return responseDtoList;
    }
    @Override
    @Transactional
    public UserBookDetailResponseDto updateRating(UserBookRatingRequestDto requestDto){
        UserBook userBook = userBookRepository.findById(requestDto.getUserBookId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getUserBookId()));
        // 다 못읽은 경우 에러처리

        if(!userBook.getIsComplete()){
            throw new NotReadBookException(requestDto.getUserBookId());
        }
        // 이미 한 기록을 수정하는지 여부 검사
        boolean isModify = false;
        double curRating = 0;

        if (userBook.getRating() != null){
            isModify = true;
            curRating = userBook.getRating();
        }

        userBook.updateRating(requestDto);

        userBookRepository.save(userBook);
        // book 정보 갱신
        Book book = userBook.getBook();

        double rating = book.getRating();
        int count = book.getRatingCount();

        double updateRating;
        if(isModify){
            updateRating = (rating*count - curRating + requestDto.getRating())/count;
        }
        else{
            count ++;
            updateRating = (rating*(count) + requestDto.getRating())/count;
        }
        book.updateRating(updateRating, count);

        bookRepository.save(book);

        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    @Transactional
    public UserBookDetailResponseDto updateType(UserBookTypeUpdateRequestDto requestDto) {
        UserBook userBook = userBookRepository.findById(requestDto.getUserBookId())
                .orElseThrow(() -> new UserBookNotFoundException(requestDto.getUserBookId()));

        userBook.updateType(requestDto.getType());
        userBookRepository.save(userBook);
        return new UserBookDetailResponseDto(userBook);
    }

    @Override
    public UserBookRatioResponseDto getUserReadRatio() {
        User user = userService.loadUser();
        long total = userBookRepository.countUserBookByUser(user)
                .orElseThrow(() -> new UserBookNotFoundException("no data"));
        long read = userBookRepository.countUserBookByUserReadComplete(user)
                .orElse(0L);

        return UserBookRatioResponseDto.builder()
                .type("user")
                .ratio(1.0*read/total)
                .totalSize(total)
                .readSize(read)
                .build();

    }

    @Override
    public UserBookRatioResponseDto getBookReadRatio(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        long total = userBookRepository.countUserBookByBook(book)
                .orElseThrow(() -> new UserBookNotFoundException("no data"));
        long read  = userBookRepository.countUserBookByBookReadComplete(book)
                .orElse(0L);

        return UserBookRatioResponseDto.builder()
                .type("book")
                .ratio(1.0*read/total)
                .totalSize(total)
                .readSize(read)
                .build();

    }

    @Override
    public List<UserBookListResponseDto> getUserBookOnReading() {
        User user = userService.loadUser();
        List<UserBook> userBookList = userBookRepository.findUserBookOnReading(user)
                .orElseThrow(() -> new UserBookNotFoundException("no data"));
        return getUserBookListResponseDtos(userBookList);
    }

    @Override
    public List<UserBookListResponseDto> getUserBookReadComplete() {
        User user = userService.loadUser();
        List<UserBook> userBookList = userBookRepository.findUserBookReadComplete(user)
                .orElseThrow(() -> new UserBookNotFoundException("no data"));
        return getUserBookListResponseDtos(userBookList);
    }

    private List<UserBookListResponseDto> getUserBookListResponseDtos(List<UserBook> userBookList) {
        List<UserBookListResponseDto> responseDtoList = new ArrayList<>();
        for(UserBook userBook : userBookList){
            UserBookListResponseDto responseDto = UserBookListResponseDto.builder()
                    .userBookId(userBook.getId())
                    .type(userBook.getType())
                    .createdTime(userBook.getCreatedDate())
                    .updatedTime(userBook.getUpdatedDate())
                    .ratingSpoiler(userBook.getRatingSpoiler())
                    .rating(userBook.getRating())
                    .ratingComment(userBook.getRatingComment())
                    .isComplete(userBook.getIsComplete())
                    .isDeleted(userBook.getIsDeleted())
                    .bookDetailResponseDto(new BookDetailResponseDto(userBook.getBook()))
                    .build();

            responseDtoList.add(responseDto);
        }

        return responseDtoList;
    }


}
