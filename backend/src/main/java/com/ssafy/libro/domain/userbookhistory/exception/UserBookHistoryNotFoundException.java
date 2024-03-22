package com.ssafy.libro.domain.userbookhistory.exception;

public class UserBookHistoryNotFoundException extends RuntimeException {

    public UserBookHistoryNotFoundException(Long id) {
        super("UserBookComment Not Found with id: " + id);
    }

    public UserBookHistoryNotFoundException(String message) {
        super(message);
    }

    public UserBookHistoryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
