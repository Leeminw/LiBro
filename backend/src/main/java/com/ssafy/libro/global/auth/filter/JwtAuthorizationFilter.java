package com.ssafy.libro.global.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
//import com.ssafy.libro.global.auth.entity.JWToken;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String jwtToken = request.getHeader("Authorization");
        log.info("filter - jwtHeader : " + jwtToken);
        //header 있는지 확인
        if (jwtToken == null || !jwtToken.startsWith("Bearer")) {
            chain.doFilter(request, response);
            return;
        }

        Map<String,Object> result = new HashMap<>();
        response.setHeader("Access-Control-Allow-Origin", "https://j10a301.p.ssafy.io/");
        response.setStatus(HttpStatus.CREATED.value());
        String providerResult = jwtProvider.validateToken(jwtToken);
        if (providerResult.equals("access")) {
            log.info("Access Token Filter");
            User user = userRepository.findById(jwtProvider.getUserId(jwtToken))
                    .orElseThrow(IllegalAccessError::new);
            Authentication auth = getAuthentication(user);
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, response);
            return;
        } else if(providerResult.equals("refresh")) {
            log.info("Refresh Token Filter");
            providerResult = jwtProvider.validateRefreshToken(jwtToken);
            if (providerResult.equals("validate")) {
                jwtToken = jwtToken.replace("Bearer ", "");
                String accessToken = jwtProvider.reCreateAccessToken(jwtToken);
                response.setStatus(HttpServletResponse.SC_OK);
                result.put("accessToken", accessToken);
            } else {
                response.setStatus(HttpServletResponse.SC_GONE);
            }
        } else if(providerResult.equals("expired")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
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
