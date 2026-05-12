/*
 * Auto-generated from packages/api-client/openapi/finrhythm-api.openapi.json.
 * Do not edit manually. Run `pnpm --filter @finrhythm/api-client generate`.
 */

export const INVITE_CODE_STATUSES = ["CREATED","ISSUED","RESERVED","ACTIVATED","REVOKED","EXPIRED"] as const;
export type InviteCodeStatus = (typeof INVITE_CODE_STATUSES)[number];

export const ACCESS_POOL_STATUSES = ["PLANNED","ACTIVE","CLOSED","ARCHIVED"] as const;
export type AccessPoolStatus = (typeof ACCESS_POOL_STATUSES)[number];

export const PILOT_LAUNCH_STATUSES = ["PLANNED","ACTIVE","CLOSED","ARCHIVED"] as const;
export type PilotLaunchStatus = (typeof PILOT_LAUNCH_STATUSES)[number];

export const LEGAL_DOCUMENT_TYPES = ["PRIVACY_POLICY","PERSONAL_DATA_CONSENT","TERMS_OF_USE","FINANCIAL_DISCLAIMER"] as const;
export type LegalDocumentType = (typeof LEGAL_DOCUMENT_TYPES)[number];

export type ApiFieldError = {
  field: string;
  code: string;
  message: string;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
  fieldErrors: ApiFieldError[];
};

export type EmployeeRegistrationRequest = {
  fullName: string;
  email: string;
  phone: string;
  inviteCode: string;
};

export type EmployeeRegistrationResponse = {
  employeeRegistrationId: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  inviteCodeId: string;
  registeredAt: string;
  idempotentRetry: boolean;
};

export type EmployeeProfileSummaryRequest = {
  fullName: string;
  email: string;
  phone: string;
  inviteCode: string;
};

export type EmployeeProfileSummaryResponse = {
  employeeRegistrationId: string;
  fullName: string;
  email: string;
  phone: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  registeredAt: string;
  contactVerifiedByRegistrationMatch: boolean;
};

export type EmployeeProfileSessionRequest = {
  fullName: string;
  email: string;
  phone: string;
  inviteCode: string;
};

export type EmployeeProfileSessionResponse = {
  profileSessionToken: string;
  expiresAt: string;
  employeeRegistrationId: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  contactVerifiedByRegistrationMatch: boolean;
};

export type LegalDocumentVersionRequest = {
  documentType: string;
  documentVersion: string;
};

export type LegalDocumentAcceptanceRequest = {
  documents: LegalDocumentVersionRequest[];
  source?: string;
};

export type AcceptedLegalDocumentResponse = {
  documentType: LegalDocumentType;
  documentVersion: string;
  acceptedAt: string;
  source: string;
};

export type LegalDocumentAcceptanceResponse = {
  employeeRegistrationId: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  acceptedDocuments: AcceptedLegalDocumentResponse[];
  createdCount: number;
  idempotentRetry: boolean;
};

export type AdminCodeStatusSummary = {
  issuedCount: number;
  activatedCount: number;
  registeredCount: number;
  revokedCount: number;
  expiredCount: number;
  totalCodeCount: number;
  remainingCapacity: number;
};

export type AdminCodeStatusCount = {
  status: InviteCodeStatus;
  count: number;
};

export type AdminCodeStatusRow = {
  inviteCodeId: string;
  status: InviteCodeStatus;
  issuedAt: string | null;
  expiresAt: string | null;
  activatedAt: string | null;
  registeredAt: string | null;
  registered: boolean;
};

export type AdminCodeStatusPage = {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  items: AdminCodeStatusRow[];
};

export type AdminCodeStatusResponse = {
  tenantId: string;
  pilotLaunchId: string;
  pilotLaunchKey: string;
  pilotLaunchName: string;
  pilotLaunchStatus: PilotLaunchStatus;
  accessPoolId: string;
  accessPoolKey: string;
  accessPoolName: string;
  accessPoolStatus: AccessPoolStatus;
  poolCapacity: number;
  summary: AdminCodeStatusSummary;
  statusCounts: AdminCodeStatusCount[];
  codes: AdminCodeStatusPage;
};

export type AdminCodeStatusPathParams = {
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
};

export type AdminCodeStatusQuery = {
  status?: InviteCodeStatus;
  page?: number;
  size?: number;
};

export type AdminCodeStatusRequest = AdminCodeStatusPathParams & AdminCodeStatusQuery;

export type ApiClientRequestInit = Omit<RequestInit, "method">;

export const ADMIN_CODE_STATUS_PATH_TEMPLATE = "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";

export function buildAdminCodeStatusUrl(baseUrl: string | URL, params: AdminCodeStatusRequest): URL {
  const url = new URL(
    ADMIN_CODE_STATUS_PATH_TEMPLATE
      .replace("{tenantId}", encodeURIComponent(params.tenantId))
      .replace("{pilotLaunchId}", encodeURIComponent(params.pilotLaunchId))
      .replace("{accessPoolId}", encodeURIComponent(params.accessPoolId)),
    baseUrl
  );
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

export async function fetchAdminCodeStatus(
  baseUrl: string | URL,
  params: AdminCodeStatusRequest,
  init: ApiClientRequestInit = {}
): Promise<AdminCodeStatusResponse> {
  const url = buildAdminCodeStatusUrl(baseUrl, params);
  const response = await fetch(url, {
    ...init,
    method: "GET"
  });
  if (!response.ok) {
    throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);
  }
  return (await response.json()) as AdminCodeStatusResponse;
}

export type LegalDocumentAcceptancePathParams = {
  employeeRegistrationId: string;
};

export type LegalDocumentAcceptanceClientRequest = LegalDocumentAcceptancePathParams & {
  body: LegalDocumentAcceptanceRequest;
};

export type ApiJsonClientRequestInit = Omit<RequestInit, "method" | "body">;

export const LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION = "draft-2026-05-12";

export const LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE = "/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances";

export function buildLegalDocumentAcceptanceUrl(
  baseUrl: string | URL,
  params: LegalDocumentAcceptancePathParams
): URL {
  return new URL(
    LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE.replace(
      "{employeeRegistrationId}",
      encodeURIComponent(params.employeeRegistrationId)
    ),
    baseUrl
  );
}

export async function fetchLegalDocumentAcceptance(
  baseUrl: string | URL,
  params: LegalDocumentAcceptanceClientRequest,
  init: ApiJsonClientRequestInit = {}
): Promise<LegalDocumentAcceptanceResponse> {
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
  return (await response.json()) as LegalDocumentAcceptanceResponse;
}

export type EmployeeProfileSummaryClientRequest = {
  body: EmployeeProfileSummaryRequest;
};

export const EMPLOYEE_PROFILE_SUMMARY_PATH = "/api/v1/employee-registrations/profile-summary";

export function buildEmployeeProfileSummaryUrl(baseUrl: string | URL): URL {
  return new URL(EMPLOYEE_PROFILE_SUMMARY_PATH, baseUrl);
}

export async function fetchEmployeeProfileSummary(
  baseUrl: string | URL,
  params: EmployeeProfileSummaryClientRequest,
  init: ApiJsonClientRequestInit = {}
): Promise<EmployeeProfileSummaryResponse> {
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
  return (await response.json()) as EmployeeProfileSummaryResponse;
}

export type EmployeeProfileSessionClientRequest = {
  body: EmployeeProfileSessionRequest;
};

export const EMPLOYEE_PROFILE_SESSIONS_PATH = "/api/v1/employee-registrations/profile-sessions";

export function buildEmployeeProfileSessionsUrl(baseUrl: string | URL): URL {
  return new URL(EMPLOYEE_PROFILE_SESSIONS_PATH, baseUrl);
}

export async function fetchEmployeeProfileSession(
  baseUrl: string | URL,
  params: EmployeeProfileSessionClientRequest,
  init: ApiJsonClientRequestInit = {}
): Promise<EmployeeProfileSessionResponse> {
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
  return (await response.json()) as EmployeeProfileSessionResponse;
}

export type EmployeeMeProfileSummaryClientRequest = {
  profileSessionToken: string;
};

export const EMPLOYEE_ME_PROFILE_SUMMARY_PATH = "/api/v1/employee-registrations/me/profile-summary";

export function buildEmployeeMeProfileSummaryUrl(baseUrl: string | URL): URL {
  return new URL(EMPLOYEE_ME_PROFILE_SUMMARY_PATH, baseUrl);
}

export async function fetchEmployeeMeProfileSummary(
  baseUrl: string | URL,
  params: EmployeeMeProfileSummaryClientRequest,
  init: ApiClientRequestInit = {}
): Promise<EmployeeProfileSummaryResponse> {
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
  return (await response.json()) as EmployeeProfileSummaryResponse;
}
