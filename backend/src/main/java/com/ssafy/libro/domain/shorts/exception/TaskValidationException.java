package com.ssafy.libro.domain.shorts.exception;

public class TaskValidationException extends RuntimeException {

    public TaskValidationException() {
        super("Invalid Request Parameter(s), Check Type or Format");
    }

    public TaskValidationException(String message) {
        super("Invalid Request Parameter(s), Check Type or Format with " + message);
    }

    public TaskValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
