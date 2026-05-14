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

export type EmployeeContactUpdateRequest = {
  email?: string;
  phone?: string;
};

export type EmployeeContactUpdateResponse = {
  employeeRegistrationId: string;
  fullName: string;
  email: string;
  phone: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  registeredAt: string;
  changed: boolean;
  outcome: "updated" | "noop";
  changedFields: string[];
  contactVerifiedByProfileSession: boolean;
};

export const DIAGNOSTIC_ATTEMPT_STATES = ["DRAFT","SUBMITTED"] as const;
export type DiagnosticAttemptState = (typeof DIAGNOSTIC_ATTEMPT_STATES)[number];

export type DiagnosticQ0MetadataRequest = {
  selectedOptionIds?: string[];
};

export type DiagnosticSelfAssessmentAnswerRequest = {
  id: string;
  value: number;
};

export type DiagnosticRoutingAnswerRequest = {
  id: string;
  optionId: string;
};

export type DiagnosticDraftUpdateRequest = {
  q0?: DiagnosticQ0MetadataRequest;
  selfAssessment?: DiagnosticSelfAssessmentAnswerRequest[];
  routingAnswers?: DiagnosticRoutingAnswerRequest[];
};

export type DiagnosticAllowedRoutingOptionsResponse = {
  id: string;
  optionIds: string[];
};

export type DiagnosticAllowedAnswerIdsResponse = {
  q0QuestionIds: string[];
  q0OptionIds: string[];
  selfAssessmentQuestionIds: string[];
  routingQuestionOptions: DiagnosticAllowedRoutingOptionsResponse[];
};

export type DiagnosticQ0MetadataResponse = {
  id: string;
  selectedOptionIds: string[];
};

export type DiagnosticSelfAssessmentAnswerResponse = {
  id: string;
  value: number;
};

export type DiagnosticRoutingAnswerResponse = {
  id: string;
  optionId: string;
};

export type DiagnosticAttemptResponse = {
  attemptId: string | null;
  employeeRegistrationId: string;
  tenantId: string;
  pilotLaunchId: string;
  accessPoolId: string;
  state: DiagnosticAttemptState;
  allowedAnswerIds: DiagnosticAllowedAnswerIdsResponse;
  q0: DiagnosticQ0MetadataResponse;
  selfAssessment: DiagnosticSelfAssessmentAnswerResponse[];
  routingAnswers: DiagnosticRoutingAnswerResponse[];
  routePreview: boolean;
  recommendedFirstLessonId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  submittedAt: string | null;
};

export type DiagnosticSubmitResponse = {
  state: DiagnosticAttemptState;
  routePreview: boolean;
  recommendedFirstLessonId: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
};

export type LessonProgressResponse = {
  lessonId: string;
  status: "STARTED";
  startedAt: string;
  lastOpenedAt: string;
  idempotentResume: boolean;
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

export type EmployeeMeContactUpdateClientRequest = {
  profileSessionToken: string;
  body: EmployeeContactUpdateRequest;
};

export const EMPLOYEE_ME_CONTACT_PATH = "/api/v1/employee-registrations/me/contact";

export function buildEmployeeMeContactUrl(baseUrl: string | URL): URL {
  return new URL(EMPLOYEE_ME_CONTACT_PATH, baseUrl);
}

export async function fetchEmployeeMeContactUpdate(
  baseUrl: string | URL,
  params: EmployeeMeContactUpdateClientRequest,
  init: ApiJsonClientRequestInit = {}
): Promise<EmployeeContactUpdateResponse> {
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
  return (await response.json()) as EmployeeContactUpdateResponse;
}

export type DiagnosticMeAuthRequest = {
  profileSessionToken: string;
};

export type DiagnosticMeDraftUpdateClientRequest = DiagnosticMeAuthRequest & {
  body: DiagnosticDraftUpdateRequest;
};

export const DIAGNOSTIC_ME_DRAFT_PATH = "/api/v1/diagnostics/me/draft";

export function buildDiagnosticMeDraftUrl(baseUrl: string | URL): URL {
  return new URL(DIAGNOSTIC_ME_DRAFT_PATH, baseUrl);
}

export async function fetchDiagnosticMeDraft(
  baseUrl: string | URL,
  params: DiagnosticMeAuthRequest,
  init: ApiClientRequestInit = {}
): Promise<DiagnosticAttemptResponse> {
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
  return (await response.json()) as DiagnosticAttemptResponse;
}

export async function saveDiagnosticMeDraft(
  baseUrl: string | URL,
  params: DiagnosticMeDraftUpdateClientRequest,
  init: ApiJsonClientRequestInit = {}
): Promise<DiagnosticAttemptResponse> {
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
  return (await response.json()) as DiagnosticAttemptResponse;
}

export const DIAGNOSTIC_ME_SUBMIT_PATH = "/api/v1/diagnostics/me/submit";

export function buildDiagnosticMeSubmitUrl(baseUrl: string | URL): URL {
  return new URL(DIAGNOSTIC_ME_SUBMIT_PATH, baseUrl);
}

export async function submitDiagnosticMeDraft(
  baseUrl: string | URL,
  params: DiagnosticMeAuthRequest,
  init: ApiClientRequestInit = {}
): Promise<DiagnosticSubmitResponse> {
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
  return (await response.json()) as DiagnosticSubmitResponse;
}

export type LearningMeLessonStartClientRequest = DiagnosticMeAuthRequest & {
  lessonId: string;
};

export const LEARNING_ME_LESSON_START_PATH_TEMPLATE = "/api/v1/learning/me/lessons/{lessonId}/start";

export function buildLearningMeLessonStartUrl(
  baseUrl: string | URL,
  params: Pick<LearningMeLessonStartClientRequest, "lessonId">
): URL {
  return new URL(
    LEARNING_ME_LESSON_START_PATH_TEMPLATE.replace("{lessonId}", encodeURIComponent(params.lessonId)),
    baseUrl
  );
}

export async function startLearningMeLesson(
  baseUrl: string | URL,
  params: LearningMeLessonStartClientRequest,
  init: ApiClientRequestInit = {}
): Promise<LessonProgressResponse> {
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
  return (await response.json()) as LessonProgressResponse;
}
