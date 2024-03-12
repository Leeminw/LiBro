package com.ssafy.libro.domain.userbook.service;

import com.ssafy.libro.domain.book.dto.BookDetailResponseDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.userbook.entity.UserBook;
import com.ssafy.libro.domain.userbook.repository.UserBookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserBookServiceImpl implements UserBookService{
    private final UserBookRepository userBookRepository;

    public List<BookDetailResponseDto> getUserBookList(){
//        User user = User.builder().build();
//
//        Optional<List<UserBook>> userBookList = userBookRepository.findByUser(user);
//        List<BookDetailResponseDto> result = new ArrayList<>();
//        if(userBookList.isEmpty()) return result;
//        for(UserBook userbook : userBookList.get()){
//            BookDetailResponseDto bookDetail = new BookDetailResponseDto(userbook.getBook());
//            result.add(bookDetail);
//        }


        return null;
    }




}
