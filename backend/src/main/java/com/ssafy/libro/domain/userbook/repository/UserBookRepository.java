package com.ssafy.libro.domain.userbook.repository;

import com.ssafy.libro.domain.userbook.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBookRepository extends JpaRepository<UserBook,Long> {
}
