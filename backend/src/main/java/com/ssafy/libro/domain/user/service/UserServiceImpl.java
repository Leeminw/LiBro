package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final Response response;
    private UserRepository userRepository;

    @Override
    public ResponseEntity<Map<String, Object>> loadUser(String token) {
        try {
            Optional<User> user = userRepository.findById(Long.parseLong(token));
            return response.handleSuccess("회원 정보 로드 성공", user);
        } catch (Exception e) {
            System.out.println(e);
            return response.handleFail("회원 정보 로드 실패", e);
        }
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
