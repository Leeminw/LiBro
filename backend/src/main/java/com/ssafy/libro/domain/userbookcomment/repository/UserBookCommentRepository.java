package com.ssafy.libro.domain.userbookcomment.repository;

import com.ssafy.libro.domain.userbookcomment.entity.UserBookComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBookCommentRepository extends JpaRepository<UserBookComment, Long> {
}
