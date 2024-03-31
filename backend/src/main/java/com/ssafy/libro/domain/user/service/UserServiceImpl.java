package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.OAuthUser;
import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.dto.UserProfileEditRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.exception.UserNotFoundException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.util.entity.Response;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements UserService {
    private final Response response;
    private final UserRepository userRepository;

    @Override
    public User loadUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof User) {
                    User user = (User) principal;
                    return user;
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
        return null;
    }


    @Transactional
    @Override
    public boolean joinUser(UserJoinRequestDto requestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof User) {
                User user = (User) principal;
                userRepository.findUserById(user.getId())
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found with "+user.getId()));
                user.updateUserJoin(requestDto);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    @Override
    public void editProfile(UserProfileEditRequestDto requestDto) {
        User user = loadUser();
        user.editProfile(requestDto);
        userRepository.save(user);
    }

    //  요청할 떄 헤더에서 baerer token 뜯어
    // user id >>
    // user repository find by ~~
    // user return service.
}
