package com.ssafy.libro.global.oauth.filter;

import com.ssafy.libro.domain.user.entity.Role;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import com.ssafy.libro.global.oauth.entity.OAuth2UserImpl;
import com.ssafy.libro.global.util.entity.Response;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        User user = ((OAuth2UserImpl)authentication.getPrincipal()).getUser();

        if(user.getRole().equals(Role.GUEST)){
            List<String> input = new ArrayList<>();
            input.add(user.getRole().getTitle());
            String token = jwtProvider.createAccessToken(user.getAuthId(), input);
            String refreshToken = jwtProvider.createRefreshToken(user.getAuthId(), input);

            String redirectURL = UriComponentsBuilder.fromUriString("http://localhost:3000/login/loading")
                    .queryParam("accessToken", token)
                    .queryParam("refreshToken", refreshToken)
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();
            getRedirectStrategy().sendRedirect(request, response, redirectURL);
        }
    }
}
