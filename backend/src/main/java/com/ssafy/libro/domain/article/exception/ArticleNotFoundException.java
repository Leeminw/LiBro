package com.ssafy.libro.domain.article.exception;

public class ArticleNotFoundException extends RuntimeException{
    public ArticleNotFoundException(Long id) {
        super("Article Not Found with id: " + id);
    }

    public ArticleNotFoundException(String message) {
        super(message);
    }

    public ArticleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
