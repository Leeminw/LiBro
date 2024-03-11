package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import com.ssafy.libro.global.util.entity.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final Response response;
    @Override
    public ResponseEntity<Map<String, Object>> joinUser(UserJoinRequestDto requestDto){
        try {

            return response.handleSuccess("회원가입 성공",null);
        }
        catch (Exception e){
            return response.handleFail("회원가입 실패.",null);
        }
    }
}
