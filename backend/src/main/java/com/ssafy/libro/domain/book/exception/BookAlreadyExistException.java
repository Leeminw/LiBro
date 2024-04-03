package com.ssafy.libro.domain.book.exception;

public class BookAlreadyExistException extends RuntimeException {

    public BookAlreadyExistException() {
        super("Book Already Exist");
    }

    public BookAlreadyExistException(Long id) {
        super("Book Already Exist with id: " + id);
    }

    public BookAlreadyExistException(String message) {
        super("Book Already Exist with " + message);
    }

    public BookAlreadyExistException(String message, Throwable cause) {
        super(message, cause);
    }

}
