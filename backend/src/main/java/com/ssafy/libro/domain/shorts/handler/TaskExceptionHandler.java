package com.ssafy.libro.domain.shorts.handler;

import com.ssafy.libro.domain.book.exception.BookNotFoundException;
import com.ssafy.libro.domain.book.exception.BookValidationException;
import com.ssafy.libro.domain.shorts.exception.TaskNotFoundException;
import com.ssafy.libro.domain.shorts.exception.TaskValidationException;
import com.ssafy.libro.global.common.ResponseData;
import com.ssafy.libro.global.exceptions.CustomValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class TaskExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<?> handleTaskNotFoundException(TaskNotFoundException e) {
        log.error("TaskNotFoundException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TaskValidationException.class)
    public ResponseEntity<?> handleTaskValidationException(TaskValidationException e) {
        log.error("TaskValidationException: " + e.getMessage());
        return new ResponseEntity<>(ResponseData.failure(e.getMessage()), HttpStatus.BAD_REQUEST);
    }

}
