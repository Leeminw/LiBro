package com.ssafy.libro.domain.user.dto;

import com.ssafy.libro.domain.user.entity.Role;
import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class OAuthUser {
    private Long id;
    private String name;
    private String email;
    private String authId;
    private String authType;
    private String profile;
    private Role role;
    private String nickName;
}
