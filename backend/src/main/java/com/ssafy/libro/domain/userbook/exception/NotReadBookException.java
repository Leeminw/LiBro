package com.ssafy.libro.domain.userbook.exception;

public class NotReadBookException extends RuntimeException {

    public NotReadBookException(Long id) {
        super("Book not read: " + id);
    }

    public NotReadBookException(String message) {
        super(message);
    }

    public NotReadBookException(String message, Throwable cause) {
        super(message, cause);
    }

}
