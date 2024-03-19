package com.ssafy.libro.global.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

public class JwtExceptionFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // 다음 filter Chain에 대한 실행 (filter-chain의 마지막에는 Dispatcher Servlet이 실행된다.)
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {

            //토큰의 유효기간 만료
            Map<String,Object> result = new HashMap<>();
            result.put("result","expired");
            result.put("message","토큰 유효기간 만료");
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));

        } catch (JwtException | IllegalArgumentException e) {
            //유효하지 않은 토큰
            Map<String,Object> result = new HashMap<>();
            result.put("result","failed");
            result.put("message","유효하지 않은 토큰");
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));

        } catch (NoSuchElementException e) {

            //사용자 찾을 수 없음
            Map<String,Object> result = new HashMap<>();
            result.put("result","failed");
            result.put("data","찾을 수 없는 사용자");
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));

        } catch (ArrayIndexOutOfBoundsException e) {

            Map<String,Object> result = new HashMap<>();
            result.put("result","failed");
            result.put("data","ArrayIndexOutOfBoundsException");
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(result));

        } catch (NullPointerException e) {
            filterChain.doFilter(request, response);
        }
    }

}
