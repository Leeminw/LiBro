package com.ssafy.libro.domain.usergroup.exception;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.user.entity.User;

public class AlreadyJoinedException extends RuntimeException{
    public AlreadyJoinedException(Club club, User user) {
        super(String.format("{%s(%s) 클럽에 이미 가입되어 있습니다. %s(%s)}", club.getName(), club.getId(), user.getName(), user.getId()));
    }

    public AlreadyJoinedException(String message) {
        super(message);
    }

    public AlreadyJoinedException(String message, Throwable cause) {
        super(message, cause);
    }
}
