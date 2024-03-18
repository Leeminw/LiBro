package com.ssafy.libro.domain.userbook.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.libro.domain.book.entity.Book;
import com.ssafy.libro.domain.user.entity.QUser;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.entity.QUserBook;
import com.ssafy.libro.domain.book.entity.QBook;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static com.ssafy.libro.domain.book.entity.QBook.book;
import static com.ssafy.libro.domain.userbook.entity.QUserBook.userBook;


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
                .where(userBook.user.eq(user))
                .fetch();

        return Optional.of(bookList);
    }
}
