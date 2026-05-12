/*
 * Auto-generated from packages/api-client/openapi/finrhythm-api.openapi.json.
 * Do not edit manually. Run `pnpm --filter @finrhythm/api-client generate`.
 */
export const INVITE_CODE_STATUSES = ["CREATED", "ISSUED", "RESERVED", "ACTIVATED", "REVOKED", "EXPIRED"];
export const ACCESS_POOL_STATUSES = ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export const PILOT_LAUNCH_STATUSES = ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export const LEGAL_DOCUMENT_TYPES = ["PRIVACY_POLICY", "PERSONAL_DATA_CONSENT", "TERMS_OF_USE", "FINANCIAL_DISCLAIMER"];
export const ADMIN_CODE_STATUS_PATH_TEMPLATE = "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";
export function buildAdminCodeStatusUrl(baseUrl, params) {
    const url = new URL(ADMIN_CODE_STATUS_PATH_TEMPLATE
        .replace("{tenantId}", encodeURIComponent(params.tenantId))
        .replace("{pilotLaunchId}", encodeURIComponent(params.pilotLaunchId))
        .replace("{accessPoolId}", encodeURIComponent(params.accessPoolId)), baseUrl);
    if (params.status) {
        url.searchParams.set("status", params.status);
    }
    if (params.page !== undefined) {
        url.searchParams.set("page", String(params.page));
    }
    if (params.size !== undefined) {
        url.searchParams.set("size", String(params.size));
    }
    return url;
}
export async function fetchAdminCodeStatus(baseUrl, params, init = {}) {
    const url = buildAdminCodeStatusUrl(baseUrl, params);
    const response = await fetch(url, {
        ...init,
        method: "GET"
    });
    if (!response.ok) {
        throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export const LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION = "draft-2026-05-12";
export const LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE = "/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances";
export function buildLegalDocumentAcceptanceUrl(baseUrl, params) {
    return new URL(LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE.replace("{employeeRegistrationId}", encodeURIComponent(params.employeeRegistrationId)), baseUrl);
}
export async function fetchLegalDocumentAcceptance(baseUrl, params, init = {}) {
    const url = buildLegalDocumentAcceptanceUrl(baseUrl, params);
    const headers = new Headers(init.headers);
    if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
    }
    const response = await fetch(url, {
        ...init,
        method: "POST",
        headers,
        body: JSON.stringify(params.body)
    });
    if (!response.ok) {
        throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
