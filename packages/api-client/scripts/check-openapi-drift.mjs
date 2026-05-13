#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "..");
const repoRoot = resolve(packageRoot, "../..");
const openApiPath = resolve(packageRoot, "openapi/finrhythm-api.openapi.json");

const openApi = JSON.parse(await readFile(openApiPath, "utf8"));
const schemas = openApi.components?.schemas ?? {};

await checkEnums();
await checkRecords();
await checkLegalDocumentCurrentDraftVersion();
checkOperations();

console.log("OpenAPI admin/public contract drift check passed.");

async function checkEnums() {
  const checks = [
    {
      schema: "InviteCodeStatus",
      file: "apps/api/src/main/java/com/finrhythm/api/tenant/domain/InviteCodeStatus.java"
    },
    {
      schema: "AccessPoolStatus",
      file: "apps/api/src/main/java/com/finrhythm/api/tenant/domain/AccessPoolStatus.java"
    },
    {
      schema: "PilotLaunchStatus",
      file: "apps/api/src/main/java/com/finrhythm/api/tenant/domain/PilotLaunchStatus.java"
    },
    {
      schema: "LegalDocumentType",
      file: "apps/api/src/main/java/com/finrhythm/api/consent/domain/LegalDocumentType.java"
    }
  ];

  for (const check of checks) {
    const source = await readFile(resolve(repoRoot, check.file), "utf8");
    const actual = readJavaEnumValues(source, check.schema);
    const expected = schemas[check.schema]?.enum ?? [];
    assertSameArray(`${check.schema} enum`, actual, expected);
  }
}

async function checkRecords() {
  const checks = [
    {
      schema: "ApiFieldError",
      file: "apps/api/src/main/java/com/finrhythm/api/common/web/ApiFieldError.java"
    },
    {
      schema: "ApiErrorResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/common/web/ApiErrorResponse.java"
    },
    {
      schema: "EmployeeRegistrationRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeRegistrationRequest.java"
    },
    {
      schema: "EmployeeRegistrationResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeRegistrationResponse.java"
    },
    {
      schema: "EmployeeProfileSummaryRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeProfileSummaryRequest.java"
    },
    {
      schema: "EmployeeProfileSummaryResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeProfileSummaryResponse.java"
    },
    {
      schema: "EmployeeProfileSessionRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeProfileSessionRequest.java"
    },
    {
      schema: "EmployeeProfileSessionResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeProfileSessionResponse.java"
    },
    {
      schema: "EmployeeContactUpdateRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeContactUpdateRequest.java",
      requiredFields: []
    },
    {
      schema: "EmployeeContactUpdateResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/registration/web/EmployeeContactUpdateResponse.java"
    },
    {
      schema: "LegalDocumentVersionRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/consent/web/LegalDocumentVersionRequest.java"
    },
    {
      schema: "LegalDocumentAcceptanceRequest",
      file: "apps/api/src/main/java/com/finrhythm/api/consent/web/LegalDocumentAcceptanceRequest.java",
      requiredFields: ["documents"]
    },
    {
      schema: "AcceptedLegalDocumentResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/consent/web/AcceptedLegalDocumentResponse.java"
    },
    {
      schema: "LegalDocumentAcceptanceResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/consent/web/LegalDocumentAcceptanceResponse.java"
    },
    {
      schema: "AdminCodeStatusSummary",
      file: "apps/api/src/main/java/com/finrhythm/api/admin/readmodel/AdminCodeStatusSummary.java"
    },
    {
      schema: "AdminCodeStatusCount",
      file: "apps/api/src/main/java/com/finrhythm/api/admin/readmodel/AdminCodeStatusCount.java"
    },
    {
      schema: "AdminCodeStatusRow",
      file: "apps/api/src/main/java/com/finrhythm/api/admin/readmodel/AdminCodeStatusRow.java"
    },
    {
      schema: "AdminCodeStatusPage",
      file: "apps/api/src/main/java/com/finrhythm/api/admin/readmodel/AdminCodeStatusPage.java"
    },
    {
      schema: "AdminCodeStatusResponse",
      file: "apps/api/src/main/java/com/finrhythm/api/admin/readmodel/AdminCodeStatusResponse.java"
    }
  ];

  for (const check of checks) {
    const source = await readFile(resolve(repoRoot, check.file), "utf8");
    const actual = readJavaRecordFields(source, check.schema);
    const schema = schemas[check.schema];
    const expectedProperties = Object.keys(schema?.properties ?? {});
    const expectedRequired = schema?.required ?? [];
    assertSameArray(`${check.schema} properties`, actual, expectedProperties);
    assertSameArray(`${check.schema} required`, check.requiredFields ?? actual, expectedRequired);
  }
}

async function checkLegalDocumentCurrentDraftVersion() {
  const source = await readFile(
    resolve(repoRoot, "apps/api/src/main/java/com/finrhythm/api/consent/service/LegalAcceptanceService.java"),
    "utf8"
  );
  const actual = readJavaStringConstant(source, "CURRENT_DRAFT_VERSION");
  const expected = schemas.LegalDocumentVersionRequest?.properties?.documentVersion?.example;
  if (actual !== expected) {
    throw new Error(
      `Legal document current draft version drift:\nactual:   ${JSON.stringify(actual)}\nexpected: ${JSON.stringify(expected)}`
    );
  }
}

function readJavaStringConstant(source, constantName) {
  const pattern = new RegExp(`public\\s+static\\s+final\\s+String\\s+${constantName}\\s*=\\s*\"([^\"]+)\"\\s*;`);
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Cannot find Java string constant ${constantName}`);
  }
  return match[1];
}

function checkOperations() {
  const adminPath = "/api/v1/admin/tenants/{tenantId}/pilot-launches/{pilotLaunchId}/access-pools/{accessPoolId}/code-status";
  const adminOperation = openApi.paths?.[adminPath]?.get;
  if (!adminOperation) {
    throw new Error(`Missing admin code-status operation at ${adminPath}`);
  }

  assertRef(
    "admin status 200 response",
    adminOperation.responses?.["200"]?.content?.["application/json"]?.schema,
    "#/components/schemas/AdminCodeStatusResponse"
  );
  assertRef(
    "admin status query",
    adminOperation.parameters?.find((parameter) => parameter.name === "status")?.schema,
    "#/components/schemas/InviteCodeStatus"
  );

  const registrationOperation = openApi.paths?.["/api/v1/employee-registrations"]?.post;
  if (!registrationOperation) {
    throw new Error("Missing employee registration operation.");
  }
  assertRef(
    "employee registration request",
    registrationOperation.requestBody?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeRegistrationRequest"
  );
  assertRef(
    "employee registration 201 response",
    registrationOperation.responses?.["201"]?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeRegistrationResponse"
  );

  const profileSummaryPath = "/api/v1/employee-registrations/profile-summary";
  const profileSummaryOperation = openApi.paths?.[profileSummaryPath]?.post;
  if (!profileSummaryOperation) {
    throw new Error(`Missing employee profile summary operation at ${profileSummaryPath}`);
  }
  assertRef(
    "employee profile summary request",
    profileSummaryOperation.requestBody?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeProfileSummaryRequest"
  );
  assertRef(
    "employee profile summary 200 response",
    profileSummaryOperation.responses?.["200"]?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeProfileSummaryResponse"
  );

  const profileSessionsPath = "/api/v1/employee-registrations/profile-sessions";
  const profileSessionsOperation = openApi.paths?.[profileSessionsPath]?.post;
  if (!profileSessionsOperation) {
    throw new Error(`Missing employee profile session operation at ${profileSessionsPath}`);
  }
  assertRef(
    "employee profile session request",
    profileSessionsOperation.requestBody?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeProfileSessionRequest"
  );
  assertRef(
    "employee profile session 201 response",
    profileSessionsOperation.responses?.["201"]?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeProfileSessionResponse"
  );

  const meProfileSummaryPath = "/api/v1/employee-registrations/me/profile-summary";
  const meProfileSummaryOperation = openApi.paths?.[meProfileSummaryPath]?.get;
  if (!meProfileSummaryOperation) {
    throw new Error(`Missing employee me profile summary operation at ${meProfileSummaryPath}`);
  }
  assertRef(
    "employee me profile summary 200 response",
    meProfileSummaryOperation.responses?.["200"]?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeProfileSummaryResponse"
  );
  if (!meProfileSummaryOperation.security?.some((requirement) => requirement.employeeProfileSessionBearerAuth)) {
    throw new Error("Employee me profile summary operation is missing employeeProfileSessionBearerAuth security.");
  }

  const meContactPath = "/api/v1/employee-registrations/me/contact";
  const meContactOperation = openApi.paths?.[meContactPath]?.patch;
  if (!meContactOperation) {
    throw new Error(`Missing employee me contact update operation at ${meContactPath}`);
  }
  assertRef(
    "employee me contact request",
    meContactOperation.requestBody?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeContactUpdateRequest"
  );
  assertRef(
    "employee me contact 200 response",
    meContactOperation.responses?.["200"]?.content?.["application/json"]?.schema,
    "#/components/schemas/EmployeeContactUpdateResponse"
  );
  if (!meContactOperation.security?.some((requirement) => requirement.employeeProfileSessionBearerAuth)) {
    throw new Error("Employee me contact update operation is missing employeeProfileSessionBearerAuth security.");
  }

  const legalAcceptancePath = "/api/v1/employee-registrations/{employeeRegistrationId}/legal-acceptances";
  const legalAcceptanceOperation = openApi.paths?.[legalAcceptancePath]?.post;
  if (!legalAcceptanceOperation) {
    throw new Error(`Missing legal acceptance operation at ${legalAcceptancePath}`);
  }
  assertRef(
    "legal acceptance request",
    legalAcceptanceOperation.requestBody?.content?.["application/json"]?.schema,
    "#/components/schemas/LegalDocumentAcceptanceRequest"
  );
  assertRef(
    "legal acceptance 201 response",
    legalAcceptanceOperation.responses?.["201"]?.content?.["application/json"]?.schema,
    "#/components/schemas/LegalDocumentAcceptanceResponse"
  );
  assertRef(
    "legal acceptance 200 response",
    legalAcceptanceOperation.responses?.["200"]?.content?.["application/json"]?.schema,
    "#/components/schemas/LegalDocumentAcceptanceResponse"
  );
}

function readJavaEnumValues(source, enumName) {
  const match = source.match(new RegExp(`enum\\s+${enumName}\\s*\\{([\\s\\S]*?)\\}`));
  if (!match) {
    throw new Error(`Cannot find Java enum ${enumName}`);
  }
  return match[1]
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(",")
    .map((item) => item.replace(/;.*/, "").trim())
    .filter(Boolean);
}

function readJavaRecordFields(source, recordName) {
  const block = extractRecordComponentBlock(source, recordName);
  return splitTopLevel(block)
    .map(stripAnnotations)
    .map((component) => component.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((component) => {
      const match = component.match(/(.+)\s+([A-Za-z_][A-Za-z0-9_]*)$/);
      if (!match) {
        throw new Error(`Cannot parse record component for ${recordName}: ${component}`);
      }
      return match[2];
    });
}

function extractRecordComponentBlock(source, recordName) {
  const recordIndex = source.indexOf(`record ${recordName}`);
  if (recordIndex === -1) {
    throw new Error(`Cannot find Java record ${recordName}`);
  }
  const openParen = source.indexOf("(", recordIndex);
  if (openParen === -1) {
    throw new Error(`Cannot find component list for Java record ${recordName}`);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = openParen; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openParen + 1, index);
      }
    }
  }
  throw new Error(`Cannot close component list for Java record ${recordName}`);
}

function splitTopLevel(value) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "(" || char === "<") {
      depth += 1;
    } else if (char === ")" || char === ">") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}

function stripAnnotations(value) {
  let output = "";
  let index = 0;
  while (index < value.length) {
    if (value[index] !== "@") {
      output += value[index];
      index += 1;
      continue;
    }

    index += 1;
    while (/[A-Za-z0-9_.]/.test(value[index] ?? "")) {
      index += 1;
    }
    while (/\s/.test(value[index] ?? "")) {
      index += 1;
    }
    if (value[index] === "(") {
      index = skipBalanced(value, index);
    }
    while (/\s/.test(value[index] ?? "")) {
      index += 1;
    }
  }
  return output;
}

function skipBalanced(value, openIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = openIndex; index < value.length; index += 1) {
    const char = value[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        return index + 1;
      }
    }
  }
  return value.length;
}

function assertRef(label, schema, ref) {
  if (schema?.$ref !== ref) {
    throw new Error(`${label} drift: expected ${ref}, got ${schema?.$ref ?? "missing"}`);
  }
}

function assertSameArray(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} drift:\nactual:   ${JSON.stringify(actual)}\nexpected: ${JSON.stringify(expected)}`);
  }
}
