package com.ssafy.libro.domain.userbook.exception;

public class UserBookValidationException extends RuntimeException {

    public UserBookValidationException(Long id) {
        super("Invalidate Entity with id: " + id);
    }

    public UserBookValidationException(String message) {
        super(message);
    }

    public UserBookValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
