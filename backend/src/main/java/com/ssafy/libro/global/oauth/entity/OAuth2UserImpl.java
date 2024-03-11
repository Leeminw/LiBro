package com.ssafy.libro.global.oauth.entity;

import com.ssafy.libro.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class OAuth2UserImpl extends DefaultOAuth2User {
    User user;
    public OAuth2UserImpl(Collection<? extends GrantedAuthority> authorities, Map<String, Object> attributes, String nameAttributeKey, User user) {
        super(authorities, attributes, nameAttributeKey);
        this.user=user;
    }
}
