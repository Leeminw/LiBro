package com.ssafy.libro.global.auth.filter;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.ssafy.libro.domain.user.dto.SecurityUserDto;
import com.ssafy.libro.domain.user.entity.User;
import com.ssafy.libro.domain.user.repository.UserRepository;
import com.ssafy.libro.global.auth.entity.JwtProvider;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
@CrossOrigin
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

//    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository, JwtProvider jwtProvider) {
//        super(authenticationManager);
//        this.userRepository = userRepository;
//        this.jwtProvider = jwtProvider;
//    }

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
                User user = userRepository.findUserByAuthId(jwtProvider.getUserId(jwtToken))
                        .orElseThrow(IllegalAccessError::new);
                Authentication auth = getAuthentication(user);
                SecurityContextHolder.getContext().setAuthentication(auth);
                chain.doFilter(request, response);

            } else if (jwtProvider.validateRefreshToken(jwtToken)) {
                //refresh라면
                System.out.println("REFRESH TOKEN!!");
                jwtToken = jwtToken.replace("Bearer ", "");
                String accessToken = jwtProvider.reCreateAccessToken(jwtToken);
/*                JWToken token = JWToken.builder().grantType("Bearer ").accessToken(accessToken).refreshToken(jwtToken).build();
                response.getWriter().write(new Response().getSuccessString(token));*/
            }
        } catch (JWTVerificationException e) {
            throw new JWTVerificationException(e.getMessage());
        } catch (ExpiredJwtException e) {
            throw new ExpiredJwtException(null, null, e.getMessage());
        }


    }

    public Authentication getAuthentication(User user) {
        return new UsernamePasswordAuthenticationToken(user, "",
                List.of(new SimpleGrantedAuthority(user.getRole().getKey())));
    }
}
