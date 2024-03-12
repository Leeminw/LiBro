package com.ssafy.libro.domain.book.exception;

public class BookValidationException extends RuntimeException {

    public BookValidationException(Long id) {
        super("Invalidate Entity with id: " + id);
    }

    public BookValidationException(String message) {
        super(message);
    }

    public BookValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
