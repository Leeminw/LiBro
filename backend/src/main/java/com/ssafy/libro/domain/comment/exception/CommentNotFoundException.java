package com.ssafy.libro.domain.comment.exception;

public class CommentNotFoundException extends RuntimeException{
    public CommentNotFoundException(Long id) {
        super("Comment Not Found with id: " + id);
    }

    public CommentNotFoundException(String message) {
        super(message);
    }

    public CommentNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
