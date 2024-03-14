package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;

import java.util.List;

public interface UserBookService {
    List<BookDetailResponseDto> getUserBookList();
}
