package com.finrhythm.api.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finrhythm.api.admin.audit.AdminAccessAuditService;
import com.finrhythm.api.admin.security.AdminBearerTokenAuthenticationFilter;
import com.finrhythm.api.admin.security.AdminPermissions;
import com.finrhythm.api.admin.security.AdminSecurityProperties;
import com.finrhythm.api.common.web.ApiErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(AdminSecurityProperties.class)
@RequiredArgsConstructor
public class SecurityConfig {
    private static final String ADMIN_CODE_STATUS_PATH =
            "/api/v1/admin/tenants/*/pilot-launches/*/access-pools/*/code-status";

    private final ObjectMapper objectMapper;

    @Bean
    SecurityFilterChain apiSecurityFilterChain(
            HttpSecurity http,
            AdminBearerTokenAuthenticationFilter adminBearerTokenAuthenticationFilter
    ) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, ADMIN_CODE_STATUS_PATH)
                        .hasAuthority(AdminPermissions.CODE_STATUS_READ)
                        .requestMatchers("/api/v1/admin/**")
                        .denyAll()
                        .anyRequest()
                        .permitAll()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(adminAuthenticationEntryPoint())
                        .accessDeniedHandler(adminAccessDeniedHandler())
                )
                .addFilterBefore(adminBearerTokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    AdminBearerTokenAuthenticationFilter adminBearerTokenAuthenticationFilter(
            AdminSecurityProperties properties,
            AdminAccessAuditService adminAccessAuditService
    ) {
        return new AdminBearerTokenAuthenticationFilter(properties, adminAccessAuditService);
    }

    @Bean
    UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }

    private AuthenticationEntryPoint adminAuthenticationEntryPoint() {
        return (request, response, exception) -> writeError(
                response,
                HttpServletResponse.SC_UNAUTHORIZED,
                "ADMIN_AUTHENTICATION_REQUIRED",
                "Admin API authentication is required."
        );
    }

    private AccessDeniedHandler adminAccessDeniedHandler() {
        return (request, response, exception) -> writeError(
                response,
                HttpServletResponse.SC_FORBIDDEN,
                "ADMIN_PERMISSION_DENIED",
                "Admin API permission is required."
        );
    }

    private void writeError(
            HttpServletResponse response,
            int status,
            String code,
            String message
    ) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), ApiErrorResponse.withoutFields(code, message));
    }
}
