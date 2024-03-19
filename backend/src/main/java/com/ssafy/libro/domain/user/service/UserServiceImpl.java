package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final Response response;
    @Override
    public ResponseEntity<Map<String, Object>> loginUser(String token) {
        String endPointUri = "https://www.googleapis.com/oauth2/v2/userinfo";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        ResponseEntity<String> uriResponse = restTemplate.exchange(endPointUri, HttpMethod.GET, entity, String.class);
        String userInfo = uriResponse.getBody();
        try {
            return response.handleSuccess("회원가입 성공", userInfo);
        } catch (Exception e) {
            return response.handleFail("회원가입 실패.", e);
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
