package com.ssafy.libro.domain.userbookcomment.repository;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBookCommentRepository extends JpaRepository<UserBookComment, Long> {
    Optional<List<UserBookComment>> findByUserBook(UserBook userBook);
}
