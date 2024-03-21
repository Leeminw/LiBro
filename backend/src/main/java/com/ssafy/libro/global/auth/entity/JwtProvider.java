package com.ssafy.libro.global.auth.entity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component

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
    public String createAccessToken(String id, List<String> role) {
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

        String id = (String) claims.get("id");
        List<String> role = (List<String>) claims.get("role");
        return createAccessToken(id, role);
    }

    public String createRefreshToken(String id, List<String> role) {
        String refreshToken = Jwts.builder()
                .claim("id", id)
                .claim("type", "refresh")
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpTime))
                .signWith(SECRET_KEY)
                .compact();
        redisTemplate.opsForValue().set(
                id, //key
                refreshToken, //value
                refreshExpTime,
                TimeUnit.MILLISECONDS
        );

        return refreshToken;
    }

    public boolean verifyToken(String token) {
        try {
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

    public Boolean validateAccessToken(String accessToken) {
        System.out.println("access check : " + accessToken);
        accessToken = accessToken.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(accessToken)
                .getBody();
        String type = (String) claims.get("type");
        return "access".equals(type);
    }

    public Boolean validateRefreshToken(String refreshToken) {
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
                return claims.getExpiration().after(new Date());
            }
        }
        System.out.println("failed");
        return false;
    }

    public String getUserId(String jwt) {
        jwt = jwt.replace("Bearer ", "");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
        return (String) claims.get("id");
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
