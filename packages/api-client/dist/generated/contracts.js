/*
 * Auto-generated from packages/api-client/openapi/finrhythm-api.openapi.json.
 * Do not edit manually. Run `pnpm --filter @finrhythm/api-client generate`.
 */
export const INVITE_CODE_STATUSES = ["CREATED", "ISSUED", "RESERVED", "ACTIVATED", "REVOKED", "EXPIRED"];
export const ACCESS_POOL_STATUSES = ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export const PILOT_LAUNCH_STATUSES = ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export const LEGAL_DOCUMENT_TYPES = ["PRIVACY_POLICY", "PERSONAL_DATA_CONSENT", "TERMS_OF_USE", "FINANCIAL_DISCLAIMER"];
export const DIAGNOSTIC_ATTEMPT_STATES = ["DRAFT", "SUBMITTED"];
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
export const EMPLOYEE_PROFILE_SUMMARY_PATH = "/api/v1/employee-registrations/profile-summary";
export function buildEmployeeProfileSummaryUrl(baseUrl) {
    return new URL(EMPLOYEE_PROFILE_SUMMARY_PATH, baseUrl);
}
export async function fetchEmployeeProfileSummary(baseUrl, params, init = {}) {
    const url = buildEmployeeProfileSummaryUrl(baseUrl);
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
export const EMPLOYEE_PROFILE_SESSIONS_PATH = "/api/v1/employee-registrations/profile-sessions";
export function buildEmployeeProfileSessionsUrl(baseUrl) {
    return new URL(EMPLOYEE_PROFILE_SESSIONS_PATH, baseUrl);
}
export async function fetchEmployeeProfileSession(baseUrl, params, init = {}) {
    const url = buildEmployeeProfileSessionsUrl(baseUrl);
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
export const EMPLOYEE_ME_PROFILE_SUMMARY_PATH = "/api/v1/employee-registrations/me/profile-summary";
export function buildEmployeeMeProfileSummaryUrl(baseUrl) {
    return new URL(EMPLOYEE_ME_PROFILE_SUMMARY_PATH, baseUrl);
}
export async function fetchEmployeeMeProfileSummary(baseUrl, params, init = {}) {
    const url = buildEmployeeMeProfileSummaryUrl(baseUrl);
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "GET",
        headers
    });
    if (!response.ok) {
        throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export const EMPLOYEE_ME_CONTACT_PATH = "/api/v1/employee-registrations/me/contact";
export function buildEmployeeMeContactUrl(baseUrl) {
    return new URL(EMPLOYEE_ME_CONTACT_PATH, baseUrl);
}
export async function fetchEmployeeMeContactUpdate(baseUrl, params, init = {}) {
    const url = buildEmployeeMeContactUrl(baseUrl);
    const headers = new Headers(init.headers);
    if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
    }
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "PATCH",
        headers,
        body: JSON.stringify(params.body)
    });
    if (!response.ok) {
        throw new Error(`PATCH ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export const DIAGNOSTIC_ME_DRAFT_PATH = "/api/v1/diagnostics/me/draft";
export function buildDiagnosticMeDraftUrl(baseUrl) {
    return new URL(DIAGNOSTIC_ME_DRAFT_PATH, baseUrl);
}
export async function fetchDiagnosticMeDraft(baseUrl, params, init = {}) {
    const url = buildDiagnosticMeDraftUrl(baseUrl);
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "GET",
        headers
    });
    if (!response.ok) {
        throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export async function saveDiagnosticMeDraft(baseUrl, params, init = {}) {
    const url = buildDiagnosticMeDraftUrl(baseUrl);
    const headers = new Headers(init.headers);
    if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
    }
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "PUT",
        headers,
        body: JSON.stringify(params.body)
    });
    if (!response.ok) {
        throw new Error(`PUT ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export const DIAGNOSTIC_ME_SUBMIT_PATH = "/api/v1/diagnostics/me/submit";
export function buildDiagnosticMeSubmitUrl(baseUrl) {
    return new URL(DIAGNOSTIC_ME_SUBMIT_PATH, baseUrl);
}
export async function submitDiagnosticMeDraft(baseUrl, params, init = {}) {
    const url = buildDiagnosticMeSubmitUrl(baseUrl);
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "POST",
        headers
    });
    if (!response.ok) {
        throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
export const LEARNING_ME_LESSON_START_PATH_TEMPLATE = "/api/v1/learning/me/lessons/{lessonId}/start";
export function buildLearningMeLessonStartUrl(baseUrl, params) {
    return new URL(LEARNING_ME_LESSON_START_PATH_TEMPLATE.replace("{lessonId}", encodeURIComponent(params.lessonId)), baseUrl);
}
export async function startLearningMeLesson(baseUrl, params, init = {}) {
    const url = buildLearningMeLessonStartUrl(baseUrl, params);
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${params.profileSessionToken}`);
    const response = await fetch(url, {
        ...init,
        method: "POST",
        headers
    });
    if (!response.ok) {
        throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);
    }
    return (await response.json());
}
