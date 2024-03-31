package com.ssafy.libro.domain.book.exception;

public class BookValidationException extends RuntimeException {

    public BookValidationException() {
        super("Invalid Request Parameter(s), Check Type or Format");
    }

    public BookValidationException(String message) {
        super("Invalid Request Parameter(s), Check Type or Format with " + message);
    }

    public BookValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
