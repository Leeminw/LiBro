package com.ssafy.libro.domain.usergroup.exception;

import com.ssafy.libro.domain.club.entity.Club;
import com.ssafy.libro.domain.user.entity.User;

public class NotFoundJoinException extends RuntimeException{
    public NotFoundJoinException(Club club, User user) {
        super(String.format("{%s(%s)님의 %s(%s) 클럽에 가입을 확인 할 수 없습니다.}", user.getName(), user.getId(), club.getName(), club.getId()));
    }

    public NotFoundJoinException(String message) {
        super(message);
    }

    public NotFoundJoinException(String message, Throwable cause) {
        super(message, cause);
    }
}
