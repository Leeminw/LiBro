package com.ssafy.libro.domain.userbookcomment.exception;

public class UserBookCommentValidationException extends RuntimeException {

    public UserBookCommentValidationException(Long id) {
        super("Invalidate Entity with id: " + id);
    }

    public UserBookCommentValidationException(String message) {
        super(message);
    }

    public UserBookCommentValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
