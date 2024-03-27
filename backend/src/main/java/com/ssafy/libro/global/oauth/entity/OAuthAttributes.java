package com.ssafy.libro.global.oauth.entity;

import com.ssafy.libro.domain.user.entity.Role;
import com.ssafy.libro.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.Map;

@Getter
@Slf4j
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
            case "naver":
                return ofNaver(registrationId, attributes);
            case "kakao":
                return ofKakao(registrationId, attributes);
        }
        return null;
    }

    private static OAuthAttributes ofGoogle(String registrationId, Map<String, Object> attributes) {
        log.info("ofGoogle"+attributes.toString());
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .profile((String) attributes.get("picture"))
                .authType(registrationId)
                .authId((String) attributes.get("sub"))
                .build();
    }

    private static OAuthAttributes ofNaver(String registrationId, Map<String, Object> attributes) {
        log.info("ofNaver"+attributes.toString());
        Map<String, Object> account = (Map<String, Object>) attributes.get("response");
        log.info(account.toString());
        return OAuthAttributes.builder()
                .name((String) account.get("name"))
                .email((String) account.get("email"))
                .profile((String) account.get("profile_image"))
                .authType(registrationId)
                .authId((String) account.get("id"))
                .build();
    }

    private static OAuthAttributes ofKakao(String registrationId, Map<String, Object> attributes) {
        log.info("ofKakao"+attributes.toString());
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");
        log.info("account : "+account.toString());
        log.info("profile : "+profile.toString());
        return OAuthAttributes.builder()
                .name((String) profile.get("nickname"))
                .email((String) account.get("email"))
                .profile((String) profile.get("profile_image_url"))
                .authType(registrationId)
                .authId(String.valueOf(attributes.get("id")))
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