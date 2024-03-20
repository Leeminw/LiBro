package com.ssafy.libro.domain.userbookcomment.handler;

import com.ssafy.libro.domain.userbookcomment.exception.UserBookCommentNotFoundException;
import com.ssafy.libro.domain.userbookcomment.exception.UserBookCommentValidationException;
import com.ssafy.libro.global.common.ResponseData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class UserBookCommentExceptionHandler {

    @ExceptionHandler(UserBookCommentNotFoundException.class)
    public ResponseEntity<?> handleBookNotFoundException(UserBookCommentNotFoundException e) {
        log.error("UserBookComment NotFoundException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    //
    @ExceptionHandler(UserBookCommentValidationException.class)
    public ResponseEntity<?> handleBookValidationException(UserBookCommentValidationException e) {
        log.error("UserBookCommentValidationException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

}
