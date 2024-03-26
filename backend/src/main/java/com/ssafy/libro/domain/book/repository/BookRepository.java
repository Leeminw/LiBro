package com.ssafy.libro.domain.book.repository;

import com.ssafy.libro.domain.book.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    //저자 검색
    Page<Book> findBookByAuthorContaining(String author, Pageable pageable);
    //ISBN 검색
    Optional<List<Book>> findBookByIsbn(String Isbn);
    //제목 검색
    Page<Book> findBookByTitleContaining(String title, Pageable pageable);

    Boolean existsByIsbn(String isbn);
    Optional<Book> findByIsbn(String isbn);
}
