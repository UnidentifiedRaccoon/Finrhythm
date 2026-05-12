package com.finrhythm.api.admin.audit;

public record AdminAccessAuditPrincipal(
        String principalType,
        String principalRef
) {
    public static AdminAccessAuditPrincipal adminApiToken() {
        return new AdminAccessAuditPrincipal("ADMIN_API_TOKEN", "admin-api-token");
    }

    public static AdminAccessAuditPrincipal anonymous() {
        return new AdminAccessAuditPrincipal("ANONYMOUS", null);
    }
}
