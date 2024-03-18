package com.ssafy.libro.domain.userbookcomment.repository;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBookCommentRepository extends JpaRepository<UserBookComment, Long> {
    Optional<List<UserBookComment>> findByUserBook(UserBook userBook);
    // 회원별 완독한 책들을 캘린더 형식으로 월별로 보여주는 기능?
    //
}
