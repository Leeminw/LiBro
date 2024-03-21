package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final Response response;
    private UserRepository userRepository;

    @Override
    public User loadUser(String token) {
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

    @Override
    public ResponseEntity<Map<String, Object>> joinUser(UserJoinRequestDto requestDto) {
        try {

            return response.handleSuccess("회원가입 성공", null);
        } catch (Exception e) {
            return response.handleFail("회원가입 실패.", null);
        }
    }
}
