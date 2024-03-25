package com.ssafy.libro.global.oauth.service;


import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.oauth.entity.OAuth2UserImpl;
import com.ssafy.libro.global.oauth.entity.OAuthAttributes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@RequiredArgsConstructor
@Service
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 기본 OAuth2UserService 객체 생성
        log.info("loadUser call "+ userRequest.toString());
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        // OAuth2UserService를 사용하여 OAuth2User 정보를 가져온다.
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        log.info("oAuth2user call"+oAuth2User.toString());
        // 클라이언트 등록 ID와 OAuth2User 정보를 가져온다.
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("registrationId call"+registrationId);
        String nameAttributeKey = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();
        log.info("nameAttributeKey call"+nameAttributeKey);
        // OAuth2UserService를 사용하여 가져온 OAuth2User정보로 OAuth2Attribute 객체 생성
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, oAuth2User.getAttributes());
        log.info("request to : "+attributes.getAuthType());
        User user = userRepository.findUserByAuthTypeAndAuthId(attributes.getAuthType(), attributes.getAuthId())
                .orElse(attributes.toEntity());
        // 회원가입이 안되어있을 시 DB 저장
        if (user.getId() == null) {
            log.info("user info :  "+user.toString());
            userRepository.save(user);
        }
        return new OAuth2UserImpl(Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey())),
                oAuth2User.getAttributes(), nameAttributeKey, user);
    }
}
