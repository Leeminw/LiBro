package com.ssafy.libro.domain.userbook.repository.custom;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.user.entity.QUser;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.entity.QUserBook;
import com.ssafy.libro.domain.book.entity.QBook;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static com.ssafy.libro.domain.book.entity.QBook.book;
import static com.ssafy.libro.domain.userbook.entity.QUserBook.userBook;
import static com.ssafy.libro.domain.userbookhistory.entity.QUserBookHistory.userBookHistory;
import static com.ssafy.libro.domain.userbookcomment.entity.QUserBookComment.userBookComment;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserBookCustomRepositoryImpl implements UserBookCustomRepository{
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<List<UserBook>> findUserBookByUser(User user) {
        List<UserBook> bookList = jpaQueryFactory
                .select(userBook)
                .from(userBook)
                .leftJoin(userBook.book,book).fetchJoin()
                .where(userBook.user.eq(user)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                )
                .fetch();

        return Optional.of(bookList);
    }

    @Override
    public Optional<List<UserBook>> findUserBookByUserAndDate
            (User user, LocalDateTime startDate, LocalDateTime endDate) {
        List<UserBook> bookList = jpaQueryFactory
                .select(userBook)
                .from(userBook)
                .leftJoin(userBook.userBookHistoryList, userBookHistory).fetchJoin()
                .leftJoin(userBook.book, book).fetchJoin()
                .where(userBook.user.eq(user)
                        .and(userBookHistory.startDate.between(startDate,endDate))
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                )
                .fetch();


        return Optional.of(bookList);
    }
    // 읽고있는 도서 (유저) 가장 최근 데이터가 null 값인것.
    @Override
    public Optional<List<UserBook>> findUserBookOnReading(User user) {
        List<UserBook> userBookList =
                jpaQueryFactory.select(userBook)
                .from(userBook)
                .leftJoin(userBook.userBookHistoryList, userBookHistory)
                .leftJoin(userBook.book,book).fetchJoin()
                .where(userBook.isOnRead.eq(true)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                ).fetch();

        return Optional.of(userBookList);
    }

    @Override
    public Optional<List<UserBook>> findUserBookReadComplete(User user) {
        List<UserBook> userBookList = jpaQueryFactory
                .select(userBook)
                .from(userBook)
                .leftJoin(userBook.user, QUser.user)
                .leftJoin(userBook.book, QBook.book).fetchJoin()
                .where(userBook.user.eq(user)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                        .and(userBook.isComplete.eq(true))
                )
                .fetch();
        return Optional.of(userBookList);
    }

    @Override
    public Optional<Long> countUserBookByBook(Book book) {
        Long result = jpaQueryFactory
                .select(userBook.count())
                .from(userBook)
                .leftJoin(userBook.book, QBook.book)
                .where(userBook.book.eq(book).and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull())))
                .fetchFirst();
        return Optional.of(result);
    }

    @Override
    public Optional<Long> countUserBookByBookReadComplete(Book book) {
        Long result = jpaQueryFactory
                .select(userBook.count())
                .from(userBook)
                .leftJoin(userBook.book, QBook.book)
                .where(userBook.book.eq(book)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                        .and(userBook.isComplete.eq(true))
                )
                .fetchFirst();
        return Optional.of(result);
    }

    @Override
    public Optional<Long> countUserBookByUser(User user) {
        Long result = jpaQueryFactory
                .select(userBook.count())
                .from(userBook)
                .leftJoin(userBook.user, QUser.user)
                .where(userBook.user.eq(user)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull())))
                .fetchFirst();
        return Optional.of(result);
    }

    @Override
    public Optional<Long> countUserBookByUserReadComplete(User user) {
        Long result = jpaQueryFactory
                .select(userBook.count())
                .from(userBook)
                .leftJoin(userBook.user, QUser.user)
                .where(userBook.user.eq(user)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                        .and(userBook.isComplete.eq(true))
                )
                .fetchFirst();
        return Optional.of(result);
    }

    @Override
    public Optional<List<UserBook>> findUserBookCommentList(User user) {
        List<UserBook> result = jpaQueryFactory
                .select(userBook)
                .from(userBook)
                .leftJoin(userBook.book , book).fetchJoin()
                .leftJoin(userBook.userBookCommentList, userBookComment).fetchJoin()
                .where(userBook.user.eq(user)
                        .and((userBook.isDeleted.eq(false)).or(userBook.isDeleted.isNull()))
                ).fetch();


        return Optional.of(result);
    }
}
