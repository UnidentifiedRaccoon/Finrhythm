# MVP-03 consent version logging spec freeze

Stage ID: `mvp`
Active slice: `MVP-03-consent-version-logging-001`
Parent stage unit: `MVP-03.03`
Status: `FROZEN`
Frozen at: 2026-05-12
Freezer role: `stage_spec_freezer`

## Objective

Freeze one narrow implementation slice after scoped PASS for `MVP-03-onboarding-privacy-screen-001`: add a backend/API technical foundation that records draft legal/consent document version acceptance for an employee registration.

This freeze does not implement production code, approve legal wording, close full `MVP-03`, close the MVP stage or close any human gate.

## Source Baseline

Read set used for this freeze:

- `AGENTS.md`;
- `.agents/skills/stage-launch-proof-loop/SKILL.md`;
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `docs/stages/MVP.md`, focused on `MVP-03.03`;
- `docs/engineering/definition-of-done.md`;
- `docs/engineering/human-gates.md`;
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, focused on privacy/legal minimum and version logging;
- `docs/architecture/access-and-subscriptions.md` and `docs/architecture/organization-access-subscription-model.md`, only for current identity/access guardrails;
- `apps/api/AGENTS.md`;
- `apps/web/AGENTS.md`;
- current `.agent/stages/mvp/status.json`, `evidence.json`, `verdict.json`, `sprint_contract.md`, `backlog.md`, `progress.md` and `feature_list.json`;
- current backend registration/API/security files and migrations;
- current web `/onboarding/privacy` route/component/tests.

No `.agent/**/raw/**` files were read.

## Current Verified State To Preserve

- Latest verified sprint is `MVP-03-onboarding-privacy-screen-001` with scoped fresh verifier `PASS`.
- That PASS covers only the employee-facing `/onboarding/privacy` privacy screen and `/learning` handoff.
- It explicitly does not implement consent acceptance, consent version logging, backend/API/schema/OpenAPI/generated-client changes, diagnostics or routing.
- Existing backend registration API returns `employeeRegistrationId`, `tenantId`, `pilotLaunchId`, `accessPoolId`, `inviteCodeId`, `registeredAt` and `idempotentRetry`.
- There is no employee auth/session implementation. Admin bearer auth exists only for `/api/v1/admin/**`.
- `packages/api-client` has no generator/artifacts.
- Full `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, the MVP stage and all human gates remain open.

## Scope Decision

Freeze `MVP-03-consent-version-logging-001` as a backend/API-first slice:

- append-only Flyway persistence for legal document acceptance log;
- service/domain allowlist for current draft privacy/consent/terms/disclaimer versions;
- thin Spring controller to record acceptance for an existing `employeeRegistrationId`;
- idempotent same-version retry;
- structured rejection for unknown document/version/registration inputs;
- OpenAPI/springdoc and generated-client decision evidence;
- minimal web handoff only if current identity flow is safe.

## Out Of Scope

- Final legal approval or production legal text approval.
- Cookie consent.
- Auth/session overhaul, `User`, `OrgMembership`, SSO/SCIM, subscription or seat model.
- Diagnostics/routing, profile/contact update, HR reporting, admin audit policy beyond the narrow append-only log.
- Real employee/customer/personal/financial data beyond synthetic registration fixtures.
- CMS/admin publishing, progress persistence, scored submissions, practice submission, points/wallet, rewards or merch.
- Closing full `MVP-03`, the MVP stage or any human gate.

## Acceptance Summary

The future builder must prove:

- append-only migration and persistence;
- `employee_registrations.id` anchoring with tenant/pilot/access-pool scope;
- allowlisted draft legal document types/versions;
- idempotent same-version retry without duplicate rows;
- rejection of unknown/unsupported inputs;
- safe API responses with no raw invite code, activation subject ref, full contact PII or legal body echoes;
- OpenAPI/runtime `/v3/api-docs` coverage;
- generated-client regeneration or explicit no-op;
- safe/non-mutating web handoff if no trustworthy identity bridge exists;
- docs-sync decision, Mermaid flow evidence, Java proof/blocker and fresh verifier PASS.

## Human Gates

No human gate is closed by this freeze or by the future implementation without separate approval. Legal/privacy wording, consent copy, real-data processing and customer-specific HR/reporting boundaries remain open.
