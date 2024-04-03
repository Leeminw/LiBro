package com.ssafy.libro.domain.userbook.repository.custom;

import com.querydsl.core.Tuple;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.entity.UserBook;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserBookCustomRepository {
    Optional<List<UserBook>> findUserBookByUser(User user);
    Optional<List<UserBook>> findUserBookByUserAndDate(User user, LocalDateTime startDate, LocalDateTime endDate);
    Optional<List<UserBook>> findUserBookByUserAndDateV2(User user, LocalDateTime startDate, LocalDateTime endDate);
    // 읽고있는 도서 (유저) 가장 최근 데이터가 null 값인것.
    Optional<List<UserBook>> findUserBookOnReading(User user);
    // 완독 도서 (유저)
    Optional<List<UserBook>> findUserBookReadComplete(User user);
    //
    Optional<Long> countUserBookByBook(Book book);
    Optional<Long> countUserBookByBookReadComplete(Book book);
    Optional<Long> countUserBookByUser(User user);
    Optional<Long> countUserBookByUserAndBook(User user, Book book);
    Optional<Long> countUserBookByUserReadComplete(User user);

    Optional<List<UserBook>> findUserBookCommentList(User user);
    List<Tuple> getUserGenderAgeCounts(Book book);
    List<Tuple> getUserBookRating(Book book);

    Optional<List<UserBook>> getUserBookRatingList(Book book);


}
