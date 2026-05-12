package com.finrhythm.api.admin.audit;

import com.finrhythm.api.admin.security.AdminPermissions;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.UUID;

public record AdminAccessAuditRoute(
        String route,
        String action,
        String permission,
        UUID tenantId,
        UUID pilotLaunchId,
        UUID accessPoolId
) {
    public static final String ADMIN_API_PREFIX = "/api/v1/admin/";
    public static final String DEFAULT_DENIED_ROUTE = "/api/v1/admin/**";
    public static final String CODE_STATUS_ROUTE =
            "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";
    public static final String CODE_STATUS_ACTION = "admin.code_status.read";
    public static final String DEFAULT_DENIED_ACTION = "admin.default_denied";

    public static AdminAccessAuditRoute from(HttpServletRequest request) {
        String method = request.getMethod() == null ? "" : request.getMethod().toUpperCase(Locale.ROOT);
        String path = requestPath(request);
        String[] segments = path.startsWith("/") ? path.substring(1).split("/") : path.split("/");

        if ("GET".equals(method) && isCodeStatusPath(segments)) {
            return new AdminAccessAuditRoute(
                    CODE_STATUS_ROUTE,
                    CODE_STATUS_ACTION,
                    AdminPermissions.CODE_STATUS_READ,
                    parseUuid(segments[4]),
                    parseUuid(segments[6]),
                    parseUuid(segments[8])
            );
        }

        return new AdminAccessAuditRoute(
                DEFAULT_DENIED_ROUTE,
                DEFAULT_DENIED_ACTION,
                null,
                null,
                null,
                null
        );
    }

    public static String requestPath(HttpServletRequest request) {
        String contextPath = request.getContextPath();
        String uri = request.getRequestURI();
        return StringUtils.hasText(contextPath) && uri.startsWith(contextPath)
                ? uri.substring(contextPath.length())
                : uri;
    }

    private static boolean isCodeStatusPath(String[] segments) {
        return segments.length == 10
                && "api".equals(segments[0])
                && "v1".equals(segments[1])
                && "admin".equals(segments[2])
                && "tenants".equals(segments[3])
                && "pilot-launches".equals(segments[5])
                && "access-pools".equals(segments[7])
                && "code-status".equals(segments[9]);
    }

    private static UUID parseUuid(String value) {
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }
}
