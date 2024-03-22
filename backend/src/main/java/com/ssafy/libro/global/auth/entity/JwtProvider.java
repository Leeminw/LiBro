package com.ssafy.libro.global.auth.entity;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class JwtProvider {

    @Value("${jwt.accessExpTime}")
    long accessExpTime;

    @Value("${jwt.refreshExpTime}")
    long refreshExpTime;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private final SecretKey SECRET_KEY;

    public JwtProvider(@Value("${jwt.secret}") String key) {
        this.SECRET_KEY = new SecretKeySpec(key.getBytes(), SignatureAlgorithm.HS512.getJcaName());
    }

    // 액세스 토큰 생성
    public String createAccessToken(Long id, List<String> role) {
        String accessToken = Jwts.builder()
                .claim("id", id)
                .claim("type", "access")
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + accessExpTime))
                .signWith(SECRET_KEY)
                .compact();
        System.out.println("accessToken : " + accessToken);
        return accessToken;
    }

    //
    public String reCreateAccessToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

        Long id = Long.parseLong((String) claims.get("id"));
        List<String> role = (List<String>) claims.get("role");
        return createAccessToken(id, role);
    }

    public String createRefreshToken(Long id, List<String> role) {
        String refreshToken = Jwts.builder()
                .claim("id", id)
                .claim("type", "refresh")
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpTime))
                .signWith(SECRET_KEY)
                .compact();
        redisTemplate.opsForValue().set(
                String.valueOf(id), //key
                refreshToken, //value
                refreshExpTime,
                TimeUnit.MILLISECONDS
        );

        return refreshToken;
    }

    public boolean verifyToken(String token) {
        try {
            token = token.replace("Bearer ", "");
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return claims.getBody()
                    .getExpiration()
                    .after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String validateToken(String accessToken) {
        System.out.println("access check : " + accessToken);
        accessToken = accessToken.replace("Bearer ", "");
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
            String type = (String) claims.get("type");
            return type;
        } catch (ExpiredJwtException e) {
            return "expired";
        } catch (JwtException | IllegalArgumentException e) {
            return "invalid";
        } catch (NoSuchElementException e) {
            return "not_found";
        } catch (ArrayIndexOutOfBoundsException e) {
            return "index_out_of_bounds";
        } catch (NullPointerException e) {
            return "null";
        } catch (Exception e) {
            return "exception";
        }
    }

    public String validateRefreshToken(String refreshToken) {
        System.out.println("refresh check");
        refreshToken = refreshToken.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();
        String type = (String) claims.get("type");
        if (type.equals("refresh")) {
            System.out.println("create refresh");
            ValueOperations<String, Object> stringValueOperations = redisTemplate.opsForValue();
            String redisValue = (String) stringValueOperations.get(String.valueOf(claims.get("email")));
            if (redisValue != null) {
                return claims.getExpiration().after(new Date()) ? "validate" : "refresh_expired";
            }
        }
        return "failed";
    }

    public Long getUserId(String jwt) {
        jwt = jwt.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
        return Long.valueOf((Integer) claims.get("id"));
    }

    public List<String> getUserRole(String jwt) {
        jwt = jwt.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
        return (List<String>) claims.get("role");
    }

}
