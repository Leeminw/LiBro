package com.ssafy.libro.global.auth.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.auth.entity.JWToken;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import com.ssafy.libro.global.util.entity.Response;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Component
@CrossOrigin
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String jwtToken = request.getHeader("Authorization");
        System.out.println("filter - jwtHeader : " + jwtToken);

        //header 있는지 확인
        if (jwtToken == null || !jwtToken.startsWith("Bearer")) {
            chain.doFilter(request, response);
            return;
        }

        Map<String,Object> result = new HashMap<>();
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setStatus(HttpStatus.CREATED.value());
        String providerResult = jwtProvider.validateToken(jwtToken);
        if (providerResult.equals("access")) {
            System.out.println("ACCESS TOKEN!!");
            User user = userRepository.findById(jwtProvider.getUserId(jwtToken))
                    .orElseThrow(IllegalAccessError::new);
            Authentication auth = getAuthentication(user);
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, response);
            return;
        } else if(providerResult.equals("refresh")) {
            System.out.println("REFRESH TOKEN!!");
            providerResult = jwtProvider.validateRefreshToken(jwtToken);
            if (providerResult.equals("validate")) {
                jwtToken = jwtToken.replace("Bearer ", "");
                String accessToken = jwtProvider.reCreateAccessToken(jwtToken);
                JWToken token = JWToken.builder().grantType("Bearer ").accessToken(accessToken).refreshToken(jwtToken).build();
                chain.doFilter(request, response);
                return;
            } else if(providerResult.equals("refresh_expired")){
                User user = userRepository.findById(jwtProvider.getUserId(jwtToken))
                        .orElseThrow(IllegalAccessError::new);
                String refreshToken = jwtProvider.createRefreshToken(user.getId(), List.of(user.getRole().getKey()));
                
            }
        }
        result.put("result", providerResult);
        response.getWriter().write(new ObjectMapper().writeValueAsString(result));
        response.getWriter().flush();
    }

    public Authentication getAuthentication(User user) {
        return new UsernamePasswordAuthenticationToken(user, "",
                List.of(new SimpleGrantedAuthority(user.getRole().getKey())));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().contains("token/");
    }
}
