package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.dto.UserProfileEditRequestDto;
import com.ssafy.libro.domain.user.entity.User;

public interface UserService {
    User loadUser();
    boolean joinUser(UserJoinRequestDto requestDto);

    void editProfile(UserProfileEditRequestDto requestDto);
}
