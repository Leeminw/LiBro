package com.ssafy.libro.domain.board.exception;

public class BoardNotFoundException extends RuntimeException{
    public BoardNotFoundException(Long id) {
        super("Board Not Found with id: " + id);
    }

    public BoardNotFoundException(String message) {
        super(message);
    }

    public BoardNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
