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
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        User user = ((OAuth2UserImpl)authentication.getPrincipal()).getUser();
        System.out.println(user);
        if(user.getRole().equals(Role.GUEST)){
            String redirectURL = UriComponentsBuilder.fromUriString("http://localhost:3000/")
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString();
            response.getWriter().write(new Response().getSuccessString("",user));
            getRedirectStrategy().sendRedirect(request, response, redirectURL);
        }
    }
}
