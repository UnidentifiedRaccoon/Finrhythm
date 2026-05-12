export declare const INVITE_CODE_STATUSES: readonly ["CREATED", "ISSUED", "RESERVED", "ACTIVATED", "REVOKED", "EXPIRED"];
export type InviteCodeStatus = (typeof INVITE_CODE_STATUSES)[number];
export declare const ACCESS_POOL_STATUSES: readonly ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export type AccessPoolStatus = (typeof ACCESS_POOL_STATUSES)[number];
export declare const PILOT_LAUNCH_STATUSES: readonly ["PLANNED", "ACTIVE", "CLOSED", "ARCHIVED"];
export type PilotLaunchStatus = (typeof PILOT_LAUNCH_STATUSES)[number];
export declare const LEGAL_DOCUMENT_TYPES: readonly ["PRIVACY_POLICY", "PERSONAL_DATA_CONSENT", "TERMS_OF_USE", "FINANCIAL_DISCLAIMER"];
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
export declare const ADMIN_CODE_STATUS_PATH_TEMPLATE = "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";
export declare function buildAdminCodeStatusUrl(baseUrl: string | URL, params: AdminCodeStatusRequest): URL;
export declare function fetchAdminCodeStatus(baseUrl: string | URL, params: AdminCodeStatusRequest, init?: ApiClientRequestInit): Promise<AdminCodeStatusResponse>;
export type LegalDocumentAcceptancePathParams = {
    employeeRegistrationId: string;
};
export type LegalDocumentAcceptanceClientRequest = LegalDocumentAcceptancePathParams & {
    body: LegalDocumentAcceptanceRequest;
};
export type ApiJsonClientRequestInit = Omit<RequestInit, "method" | "body">;
export declare const LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION = "draft-2026-05-12";
export declare const LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE = "/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances";
export declare function buildLegalDocumentAcceptanceUrl(baseUrl: string | URL, params: LegalDocumentAcceptancePathParams): URL;
export declare function fetchLegalDocumentAcceptance(baseUrl: string | URL, params: LegalDocumentAcceptanceClientRequest, init?: ApiJsonClientRequestInit): Promise<LegalDocumentAcceptanceResponse>;
