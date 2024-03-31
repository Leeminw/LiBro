package com.ssafy.libro.domain.book.exception;

public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException() {
        super("No Book Found");
    }

    public BookNotFoundException(Long id) {
        super("Book Not Found with id: " + id);
    }

    public BookNotFoundException(String message) {
        super("Book Not Found with " + message);
    }

    public BookNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
