package com.ssafy.libro.domain.userbookhistory.exception;

public class UserBookHistoryValidationException extends RuntimeException {

    public UserBookHistoryValidationException(Long id) {
        super("Invalidate Entity with id: " + id);
    }

    public UserBookHistoryValidationException(String message) {
        super(message);
    }

    public UserBookHistoryValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
