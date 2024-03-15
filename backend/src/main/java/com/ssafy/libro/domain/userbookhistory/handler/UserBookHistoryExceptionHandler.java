package com.ssafy.libro.domain.userbookhistory.handler;

import com.ssafy.libro.domain.userbookhistory.exception.UserBookHistoryNotFoundException;
import com.ssafy.libro.domain.userbookhistory.exception.UserBookHistoryValidationException;
import com.ssafy.libro.global.common.ResponseData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class UserBookHistoryExceptionHandler {

    @ExceptionHandler(UserBookHistoryNotFoundException.class)
    public ResponseEntity<?> handleBookNotFoundException(UserBookHistoryNotFoundException e) {
        log.error("UserBookComment NotFoundException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    //
    @ExceptionHandler(UserBookHistoryValidationException.class)
    public ResponseEntity<?> handleBookValidationException(UserBookHistoryValidationException e) {
        log.error("UserBookCommentValidationException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

}
