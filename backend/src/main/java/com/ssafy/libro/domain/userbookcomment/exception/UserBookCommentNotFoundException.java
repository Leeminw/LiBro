package com.ssafy.libro.domain.userbookcomment.exception;

public class UserBookCommentNotFoundException extends RuntimeException {

    public UserBookCommentNotFoundException(Long id) {
        super("UserBookComment Not Found with id: " + id);
    }

    public UserBookCommentNotFoundException(String message) {
        super(message);
    }

    public UserBookCommentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
