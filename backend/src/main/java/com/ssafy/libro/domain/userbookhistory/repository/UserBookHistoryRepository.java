package com.ssafy.libro.domain.userbookhistory.repository;

import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookhistory.entity.UserBookHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBookHistoryRepository extends JpaRepository<UserBookHistory, Long> {
    Optional<List<UserBookHistory>> findByUserBook(UserBook userBook);
    Optional<UserBookHistory> findFirstByUserBookOrderByStartDateDesc(UserBook userBook);
}
