package com.ssafy.libro.domain.club.exception;

public class ClubNotFoundException extends RuntimeException{
    public ClubNotFoundException(Long id) {
        super("Club Not Found with id: " + id);
    }

    public ClubNotFoundException(String message) {
        super(message);
    }

    public ClubNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
