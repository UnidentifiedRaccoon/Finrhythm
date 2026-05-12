package com.finrhythm.api.admin.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class AdminBearerTokenAuthenticationFilter extends OncePerRequestFilter {
    private static final String ADMIN_API_PREFIX = "/api/v1/admin/";
    private static final String BEARER_PREFIX = "Bearer ";

    private final AdminSecurityProperties adminSecurityProperties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!isAdminApiRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String bearerToken = bearerToken(request.getHeader(HttpHeaders.AUTHORIZATION));
        if (adminSecurityProperties.matchesBearerToken(bearerToken)) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    "admin-api-token",
                    null,
                    List.of(new SimpleGrantedAuthority(AdminPermissions.CODE_STATUS_READ))
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private static boolean isAdminApiRequest(HttpServletRequest request) {
        String contextPath = request.getContextPath();
        String uri = request.getRequestURI();
        String path = StringUtils.hasText(contextPath) && uri.startsWith(contextPath)
                ? uri.substring(contextPath.length())
                : uri;
        return path.startsWith(ADMIN_API_PREFIX);
    }

    private static String bearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            return "";
        }
        return authorizationHeader.substring(BEARER_PREFIX.length());
    }
}
