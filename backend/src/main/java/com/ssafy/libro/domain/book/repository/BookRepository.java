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

    Boolean existsBookByIsbn(String isbn);
    Boolean existsBookByTitle(String title);
    Boolean existsBookByAuthor(String author);


    Optional<List<Book>> findAllByShortsUrlIsNull();
    Optional<List<Book>> findAllByShortsUrlIsNotNull();


    Optional<Book> findByIsbn(String isbn);
    Optional<List<Book>> findAllByIsbn(String isbn);
    Optional<Page<Book>> findAllByIsbn(String isbn, Pageable pageable);
    Optional<Page<Book>> findAllByTitleContaining(String title, Pageable pageable);
    Optional<Page<Book>> findAllByAuthorContaining(String author, Pageable pageable);
    Optional<Page<Book>> findAllBySummaryContaining(String summary, Pageable pageable);


    Optional<Page<Book>> findByPriceGreaterThanEqual(Integer price);
    Optional<Page<Book>> findByRatingGreaterThanEqual(Double rating);
    Optional<Page<Book>> findByPriceBetween(Integer minPrice, Integer maxPrice);
    Optional<Page<Book>> findByRatingBetween(Double minRating, Double maxRating);

}
