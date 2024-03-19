package com.ssafy.libro.domain.userbook.repository.custom;

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
}
