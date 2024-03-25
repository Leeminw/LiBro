package com.ssafy.libro.global.oauth.entity;

import com.ssafy.libro.domain.user.entity.Role;
import com.ssafy.libro.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
public class OAuthAttributes {
    private final Map<String, Object> attributes;
    private final String name;
    private final String email;
    private final String profile;
    private final String authType;
    private final String authId;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, Long id, String authType, String authId, String name, String email, String profile) {
        this.attributes = attributes;
        this.name = name;
        this.email = email;
        this.profile = profile;
        this.authType = authType;
        this.authId = authId;
    }

    public static OAuthAttributes of(String registrationId, Map<String, Object> attributes) {
        switch (registrationId) {
            case "google":
                return ofGoogle(registrationId, attributes);
        }
        return null;
    }

    private static OAuthAttributes ofGoogle(String registrationId, Map<String, Object> attributes) {
        System.out.println(attributes.toString());
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .profile((String) attributes.get("picture"))
                .authType(registrationId)
                .authId((String) attributes.get("sub"))
                .build();
    }

    public User toEntity() {
        return User.builder()
                .name(name)
                .email(email)
                .authId(authId)
                .authType(authType)
                .profile(profile)
                .role(Role.GUEST)
                .build();
    }
}