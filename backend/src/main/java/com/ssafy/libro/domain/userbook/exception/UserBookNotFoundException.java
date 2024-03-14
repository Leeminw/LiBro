package com.ssafy.libro.domain.userbook.exception;

public class UserBookNotFoundException extends RuntimeException {

    public UserBookNotFoundException(Long id) {
        super("UserBook Not Found with id: " + id);
    }

    public UserBookNotFoundException(String message) {
        super(message);
    }

    public UserBookNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
