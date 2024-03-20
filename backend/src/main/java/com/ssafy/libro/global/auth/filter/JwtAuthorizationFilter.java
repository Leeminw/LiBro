package com.ssafy.libro.global.auth.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository, JwtProvider jwtProvider) {
        super(authenticationManager);
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        try {

            System.out.println("인증이나 권한이 필요한 주소 요청!");

            String jwtToken = request.getHeader("Authorization");
            System.out.println("jwtHeader : " + jwtToken);

            //header 있는지 확인
            if (jwtToken == null || !jwtToken.startsWith("Bearer")) {
                chain.doFilter(request, response);
                return;
            }


            if (jwtProvider.validateAccessToken(jwtToken)) {
                //access라면
                System.out.println("ACCESS TOKEN!!");
/*                User userEntity = userRepository.findByUserId(jwtProvider.getUserId(jwtToken));
                PrincipalDetails principalDetails = new PrincipalDetails(userEntity);*/

                //JWT 서명을 통해서 서명이 정상이면 Authentication 객체를 만들어준다.
/*                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
                System.out.println(authentication);
                // 강제로 시큐리티의 세션에 접근하여 Authentication 객체 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);*/
                chain.doFilter(request, response);

            } else if (jwtProvider.validateRefreshToken(jwtToken)) {
                //refresh라면
                System.out.println("REFRESH TOKEN!!");
                jwtToken = jwtToken.replace("Bearer ","");
                String accessToken = jwtProvider.reCreateAccessToken(jwtToken);
/*                JWToken token = JWToken.builder().grantType("Bearer ").accessToken(accessToken).refreshToken(jwtToken).build();
                response.getWriter().write(new Response().getSuccessString(token));*/
            }
        }
        catch (JWTVerificationException e){
            throw new JWTVerificationException(e.getMessage());
        }
        catch (ExpiredJwtException e){
            throw new ExpiredJwtException(null,null,e.getMessage());
        }

    }
}
