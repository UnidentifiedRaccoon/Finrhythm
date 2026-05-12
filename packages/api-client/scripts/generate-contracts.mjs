#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "..");
const openApiPath = resolve(packageRoot, "openapi/finrhythm-api.openapi.json");
const generatedPath = resolve(packageRoot, "src/generated/contracts.ts");
const checkOnly = process.argv.includes("--check");

const enumConstNames = new Map([
  ["InviteCodeStatus", "INVITE_CODE_STATUSES"],
  ["AccessPoolStatus", "ACCESS_POOL_STATUSES"],
  ["PilotLaunchStatus", "PILOT_LAUNCH_STATUSES"],
  ["LegalDocumentType", "LEGAL_DOCUMENT_TYPES"]
]);

const openApi = JSON.parse(await readFile(openApiPath, "utf8"));
const schemas = openApi.components?.schemas ?? {};
const source = generateContracts(openApi, schemas);

if (checkOnly) {
  const existing = await readFile(generatedPath, "utf8");
  if (existing !== source) {
    throw new Error("Generated contracts are stale. Run: pnpm --filter @finrhythm/api-client generate");
  }
  console.log("Generated contracts are current.");
} else {
  await writeFile(generatedPath, source, "utf8");
  console.log(`Generated ${generatedPath}`);
}

function generateContracts(document, schemaMap) {
  const lines = [
    "/*",
    " * Auto-generated from packages/api-client/openapi/finrhythm-api.openapi.json.",
    " * Do not edit manually. Run `pnpm --filter @finrhythm/api-client generate`.",
    " */",
    "",
    ...Object.entries(schemaMap).flatMap(([name, schema]) => emitSchema(name, schema)),
    ...emitAdminCodeStatusClient(document),
    ...emitLegalDocumentAcceptanceClient(document),
    ...emitEmployeeProfileSummaryClient(document),
    ...emitEmployeeProfileSessionClient(document),
    ...emitEmployeeMeProfileSummaryClient(document),
    ""
  ];
  return `${lines.join("\n").trimEnd()}\n`;
}

function emitSchema(name, schema) {
  if (Array.isArray(schema.enum)) {
    const constName = enumConstNames.get(name) ?? toScreamingPlural(name);
    return [
      `export const ${constName} = ${JSON.stringify(schema.enum)} as const;`,
      `export type ${name} = (typeof ${constName})[number];`,
      ""
    ];
  }

  if (schema.type !== "object") {
    return [`export type ${name} = ${schemaToTs(schema)};`, ""];
  }

  const required = new Set(schema.required ?? []);
  const properties = Object.entries(schema.properties ?? {});
  const body = properties.map(([propertyName, propertySchema]) => {
    const optional = required.has(propertyName) ? "" : "?";
    return `  ${propertyName}${optional}: ${schemaToTs(propertySchema)};`;
  });
  return [`export type ${name} = {`, ...body, "};", ""];
}

function emitAdminCodeStatusClient(document) {
  const path = "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";
  const operation = document.paths?.[path]?.get;
  if (!operation) {
    throw new Error(`Missing OpenAPI operation for ${path}`);
  }

  return [
    "export type AdminCodeStatusPathParams = {",
    "  tenantId: string;",
    "  pilotLaunchId: string;",
    "  accessPoolId: string;",
    "};",
    "",
    "export type AdminCodeStatusQuery = {",
    "  status?: InviteCodeStatus;",
    "  page?: number;",
    "  size?: number;",
    "};",
    "",
    "export type AdminCodeStatusRequest = AdminCodeStatusPathParams & AdminCodeStatusQuery;",
    "",
    "export type ApiClientRequestInit = Omit<RequestInit, \"method\">;",
    "",
    `export const ADMIN_CODE_STATUS_PATH_TEMPLATE = ${JSON.stringify(path)};`,
    "",
    "export function buildAdminCodeStatusUrl(baseUrl: string | URL, params: AdminCodeStatusRequest): URL {",
    "  const url = new URL(",
    "    ADMIN_CODE_STATUS_PATH_TEMPLATE",
    "      .replace(\"{tenantId}\", encodeURIComponent(params.tenantId))",
    "      .replace(\"{pilotLaunchId}\", encodeURIComponent(params.pilotLaunchId))",
    "      .replace(\"{accessPoolId}\", encodeURIComponent(params.accessPoolId)),",
    "    baseUrl",
    "  );",
    "  if (params.status) {",
    "    url.searchParams.set(\"status\", params.status);",
    "  }",
    "  if (params.page !== undefined) {",
    "    url.searchParams.set(\"page\", String(params.page));",
    "  }",
    "  if (params.size !== undefined) {",
    "    url.searchParams.set(\"size\", String(params.size));",
    "  }",
    "  return url;",
    "}",
    "",
    "export async function fetchAdminCodeStatus(",
    "  baseUrl: string | URL,",
    "  params: AdminCodeStatusRequest,",
    "  init: ApiClientRequestInit = {}",
    "): Promise<AdminCodeStatusResponse> {",
    "  const url = buildAdminCodeStatusUrl(baseUrl, params);",
    "  const response = await fetch(url, {",
    "    ...init,",
    "    method: \"GET\"",
    "  });",
    "  if (!response.ok) {",
    "    throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);",
    "  }",
    "  return (await response.json()) as AdminCodeStatusResponse;",
    "}",
    ""
  ];
}

function emitLegalDocumentAcceptanceClient(document) {
  const path = "/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances";
  const operation = document.paths?.[path]?.post;
  if (!operation) {
    throw new Error(`Missing OpenAPI operation for ${path}`);
  }
  const currentDraftVersion = legalDocumentCurrentDraftVersion(document);

  return [
    "export type LegalDocumentAcceptancePathParams = {",
    "  employeeRegistrationId: string;",
    "};",
    "",
    "export type LegalDocumentAcceptanceClientRequest = LegalDocumentAcceptancePathParams & {",
    "  body: LegalDocumentAcceptanceRequest;",
    "};",
    "",
    "export type ApiJsonClientRequestInit = Omit<RequestInit, \"method\" | \"body\">;",
    "",
    `export const LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION = ${JSON.stringify(currentDraftVersion)};`,
    "",
    `export const LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE = ${JSON.stringify(path)};`,
    "",
    "export function buildLegalDocumentAcceptanceUrl(",
    "  baseUrl: string | URL,",
    "  params: LegalDocumentAcceptancePathParams",
    "): URL {",
    "  return new URL(",
    "    LEGAL_DOCUMENT_ACCEPTANCE_PATH_TEMPLATE.replace(",
    "      \"{employeeRegistrationId}\",",
    "      encodeURIComponent(params.employeeRegistrationId)",
    "    ),",
    "    baseUrl",
    "  );",
    "}",
    "",
    "export async function fetchLegalDocumentAcceptance(",
    "  baseUrl: string | URL,",
    "  params: LegalDocumentAcceptanceClientRequest,",
    "  init: ApiJsonClientRequestInit = {}",
    "): Promise<LegalDocumentAcceptanceResponse> {",
    "  const url = buildLegalDocumentAcceptanceUrl(baseUrl, params);",
    "  const headers = new Headers(init.headers);",
    "  if (!headers.has(\"content-type\")) {",
    "    headers.set(\"content-type\", \"application/json\");",
    "  }",
    "  const response = await fetch(url, {",
    "    ...init,",
    "    method: \"POST\",",
    "    headers,",
    "    body: JSON.stringify(params.body)",
    "  });",
    "  if (!response.ok) {",
    "    throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);",
    "  }",
    "  return (await response.json()) as LegalDocumentAcceptanceResponse;",
    "}",
    ""
  ];
}

function emitEmployeeProfileSummaryClient(document) {
  const path = "/api/v1/employee-registrations/profile-summary";
  const operation = document.paths?.[path]?.post;
  if (!operation) {
    throw new Error(`Missing OpenAPI operation for ${path}`);
  }

  return [
    "export type EmployeeProfileSummaryClientRequest = {",
    "  body: EmployeeProfileSummaryRequest;",
    "};",
    "",
    `export const EMPLOYEE_PROFILE_SUMMARY_PATH = ${JSON.stringify(path)};`,
    "",
    "export function buildEmployeeProfileSummaryUrl(baseUrl: string | URL): URL {",
    "  return new URL(EMPLOYEE_PROFILE_SUMMARY_PATH, baseUrl);",
    "}",
    "",
    "export async function fetchEmployeeProfileSummary(",
    "  baseUrl: string | URL,",
    "  params: EmployeeProfileSummaryClientRequest,",
    "  init: ApiJsonClientRequestInit = {}",
    "): Promise<EmployeeProfileSummaryResponse> {",
    "  const url = buildEmployeeProfileSummaryUrl(baseUrl);",
    "  const headers = new Headers(init.headers);",
    "  if (!headers.has(\"content-type\")) {",
    "    headers.set(\"content-type\", \"application/json\");",
    "  }",
    "  const response = await fetch(url, {",
    "    ...init,",
    "    method: \"POST\",",
    "    headers,",
    "    body: JSON.stringify(params.body)",
    "  });",
    "  if (!response.ok) {",
    "    throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);",
    "  }",
    "  return (await response.json()) as EmployeeProfileSummaryResponse;",
    "}",
    ""
  ];
}

function emitEmployeeProfileSessionClient(document) {
  const path = "/api/v1/employee-registrations/profile-sessions";
  const operation = document.paths?.[path]?.post;
  if (!operation) {
    throw new Error(`Missing OpenAPI operation for ${path}`);
  }

  return [
    "export type EmployeeProfileSessionClientRequest = {",
    "  body: EmployeeProfileSessionRequest;",
    "};",
    "",
    `export const EMPLOYEE_PROFILE_SESSIONS_PATH = ${JSON.stringify(path)};`,
    "",
    "export function buildEmployeeProfileSessionsUrl(baseUrl: string | URL): URL {",
    "  return new URL(EMPLOYEE_PROFILE_SESSIONS_PATH, baseUrl);",
    "}",
    "",
    "export async function fetchEmployeeProfileSession(",
    "  baseUrl: string | URL,",
    "  params: EmployeeProfileSessionClientRequest,",
    "  init: ApiJsonClientRequestInit = {}",
    "): Promise<EmployeeProfileSessionResponse> {",
    "  const url = buildEmployeeProfileSessionsUrl(baseUrl);",
    "  const headers = new Headers(init.headers);",
    "  if (!headers.has(\"content-type\")) {",
    "    headers.set(\"content-type\", \"application/json\");",
    "  }",
    "  const response = await fetch(url, {",
    "    ...init,",
    "    method: \"POST\",",
    "    headers,",
    "    body: JSON.stringify(params.body)",
    "  });",
    "  if (!response.ok) {",
    "    throw new Error(`POST ${url.pathname} failed with HTTP ${response.status}.`);",
    "  }",
    "  return (await response.json()) as EmployeeProfileSessionResponse;",
    "}",
    ""
  ];
}

function emitEmployeeMeProfileSummaryClient(document) {
  const path = "/api/v1/employee-registrations/me/profile-summary";
  const operation = document.paths?.[path]?.get;
  if (!operation) {
    throw new Error(`Missing OpenAPI operation for ${path}`);
  }

  return [
    "export type EmployeeMeProfileSummaryClientRequest = {",
    "  profileSessionToken: string;",
    "};",
    "",
    `export const EMPLOYEE_ME_PROFILE_SUMMARY_PATH = ${JSON.stringify(path)};`,
    "",
    "export function buildEmployeeMeProfileSummaryUrl(baseUrl: string | URL): URL {",
    "  return new URL(EMPLOYEE_ME_PROFILE_SUMMARY_PATH, baseUrl);",
    "}",
    "",
    "export async function fetchEmployeeMeProfileSummary(",
    "  baseUrl: string | URL,",
    "  params: EmployeeMeProfileSummaryClientRequest,",
    "  init: ApiClientRequestInit = {}",
    "): Promise<EmployeeProfileSummaryResponse> {",
    "  const url = buildEmployeeMeProfileSummaryUrl(baseUrl);",
    "  const headers = new Headers(init.headers);",
    "  headers.set(\"authorization\", `Bearer ${params.profileSessionToken}`);",
    "  const response = await fetch(url, {",
    "    ...init,",
    "    method: \"GET\",",
    "    headers",
    "  });",
    "  if (!response.ok) {",
    "    throw new Error(`GET ${url.pathname} failed with HTTP ${response.status}.`);",
    "  }",
    "  return (await response.json()) as EmployeeProfileSummaryResponse;",
    "}",
    ""
  ];
}

function legalDocumentCurrentDraftVersion(document) {
  const version = document.components?.schemas?.LegalDocumentVersionRequest?.properties?.documentVersion?.example;
  if (typeof version !== "string" || version.length === 0) {
    throw new Error("Missing LegalDocumentVersionRequest.documentVersion example for current draft version.");
  }
  return version;
}

function schemaToTs(schema) {
  if (schema.$ref) {
    return refName(schema.$ref);
  }

  let base;
  if (Array.isArray(schema.enum)) {
    base = schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  } else if (schema.type === "array") {
    base = `${schemaToTs(schema.items)}[]`;
  } else if (schema.type === "integer" || schema.type === "number") {
    base = "number";
  } else if (schema.type === "boolean") {
    base = "boolean";
  } else if (schema.type === "string") {
    base = "string";
  } else if (schema.type === "object") {
    base = "Record<string, unknown>";
  } else {
    base = "unknown";
  }

  return schema.nullable ? `${base} | null` : base;
}

function refName(ref) {
  const prefix = "#/components/schemas/";
  if (!ref.startsWith(prefix)) {
    throw new Error(`Unsupported OpenAPI ref: ${ref}`);
  }
  return ref.slice(prefix.length);
}

function toScreamingPlural(value) {
  return `${value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase()}S`;
}
