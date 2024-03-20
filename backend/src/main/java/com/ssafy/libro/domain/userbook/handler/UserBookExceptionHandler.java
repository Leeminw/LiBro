package com.ssafy.libro.domain.userbook.handler;

import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.exception.BookValidationException;
import com.ssafy.libro.domain.userbook.exception.UserBookNotFoundException;
import com.ssafy.libro.domain.userbook.exception.UserBookValidationException;
import com.ssafy.libro.global.common.ResponseData;
import com.ssafy.libro.global.exceptions.CustomValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class UserBookExceptionHandler {

    @ExceptionHandler(UserBookNotFoundException.class)
    public ResponseEntity<?> handleBookNotFoundException(UserBookNotFoundException e) {
        log.error("UserBookNotFoundException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    //
    @ExceptionHandler(UserBookValidationException.class)
    public ResponseEntity<?> handleBookValidationException(UserBookValidationException e) {
        log.error("UserBookValidationException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

}
