package com.ssafy.libro.domain.user.service;

import com.ssafy.libro.domain.user.dto.UserJoinRequestDto;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface UserService {
    ResponseEntity<Map<String,Object>> loginUser(String token);
    ResponseEntity<Map<String,Object>> joinUser(UserJoinRequestDto requestDto);
}
