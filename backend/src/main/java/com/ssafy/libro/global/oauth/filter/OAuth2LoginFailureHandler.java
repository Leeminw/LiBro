package com.ssafy.libro.global.oauth.filter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
<<<<<<< HEAD
        response.sendRedirect("https://j10a301.p.ssafy.io:3000/");
=======
        response.sendRedirect("https://j10a301.p.ssafy.io/");
>>>>>>> 034813c (fix: base url 수정)
    }
}
