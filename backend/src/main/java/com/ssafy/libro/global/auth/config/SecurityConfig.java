package com.ssafy.libro.global.auth.config;

import com.ssafy.libro.global.auth.filter.CustomAccessDeniedHandler;
import com.ssafy.libro.global.auth.filter.CustomAuthenticationEntryPoint;
import com.ssafy.libro.global.auth.filter.CustomCorsFilter;
import com.ssafy.libro.global.oauth.filter.OAuth2LoginSuccessHandler;
import com.ssafy.libro.global.oauth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
@EnableWebSecurity //스프링 시큐리티 필터(SecurityConfig)가 스프링 필터체인에 등록됨.
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomCorsFilter corsFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public BCryptPasswordEncoder encodePwd(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션을 stateless로 관리
                .httpBasic(AbstractHttpConfigurer::disable) // 기본적인 로그인 기능 사용 x
                .formLogin(AbstractHttpConfigurer::disable)
                // 특정 URL에 대한 권한 설정.
                .authorizeHttpRequests((authorizeRequests) -> {
                    authorizeRequests
                            .requestMatchers("/api/user/join")
                            .anonymous()

                            .requestMatchers("/api/**")
                            .authenticated()


                            .requestMatchers("/api/admin/**")
                            .hasRole("ADMIN")

                            .anyRequest().permitAll();
                })
                .oauth2Login(httpSecurityOAuth2LoginConfigurer -> httpSecurityOAuth2LoginConfigurer.userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig.userService(customOAuth2UserService)).successHandler(oAuth2LoginSuccessHandler))
                .exceptionHandling(httpSecurityExceptionHandlingConfigurer -> httpSecurityExceptionHandlingConfigurer.authenticationEntryPoint(customAuthenticationEntryPoint))
                .exceptionHandling(httpSecurityExceptionHandlingConfigurer -> httpSecurityExceptionHandlingConfigurer.accessDeniedHandler(customAccessDeniedHandler))
                .addFilterBefore(corsFilter, SecurityContextHolderFilter.class)
                .build();
    }
}

