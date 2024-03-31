package com.ssafy.libro.domain.shorts.exception;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException() {
        super("No Tasks Found");
    }

    public TaskNotFoundException(String message) {
        super("Task Not Found with " + message);
    }

    public TaskNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
