package com.ssafy.libro.global.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;


public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JwtProvider tokenProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        setFilterProcessesUrl("/api/user/login");
    }


    // /login 요청을 하면 로그인 시도를 위해서 실행되는 함수
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        System.out.println("attempt login");
        // 1. username, password 받기
        try {
            ObjectMapper om = new ObjectMapper();
            User user = om.readValue(request.getInputStream(), User.class);
            System.out.println(user);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getEmail());
            System.out.println("token: "+authenticationToken);
            // PrincipalDetailsService의 loadUserByUsername()이 실행됨.
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            // authentication이 들어왔다는건 DB에 username과 password가 일치하는 것을 찾았다는 것.


            // 이제 Authentication 객체가 세션영역에 저장됨. 즉, 로그인이 되었다는 뜻.
            return authentication; // 저장을 위해 리턴

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    // attemptAuthentication 후 인증이 정상적으로 되었다면 해당 함수가 실행
    // JWT 토큰을 생성해서 request를 요청한 사용자에게 JWT을 응답으로 주면 됨.
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
/*        System.out.println("successfulAuthentication :  인증 완료!");

        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();

        User user = principalDetails.getUser();
        //Access Token 생성
        String accessToken = tokenProvider.createAccessToken(user.getUserId(),user.getRoleList());

        // Refresh Token 생성
        String refreshToken = tokenProvider.createRefreshToken(user.getUserId(),user.getRoleList());
        //서버에 저장


        JWToken token = JWToken.builder().grantType("Bearer ").accessToken(accessToken).refreshToken(refreshToken).build();
        response.getWriter().write(new Response().getSuccessString(token));*/
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        System.out.println("unsuccessfulAuthentication : login failed!!");
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.setStatus(HttpStatus.BAD_REQUEST.value());
       // response.getWriter().write(new Response().getFailString("ID/PW를 확인해주세요",null));
    }
}
