# Task: MVP-02-remove-cohort-domain-001

Stage: `mvp`
Parent unit: `MVP-02`
Status: `BUILDER_COMPLETE_AWAITING_FRESH_VERIFIER`
Created: 2026-05-11
Builder updated: 2026-05-11
Owner role for implementation: `stage_builder`

## Goal

Refactor MVP-02 so `cohort` is fully removed from the MVP domain.

Target MVP model:

- one corporate pilot `tenant`;
- one pilot launch / access pool for invite codes;
- invite-code and registration statuses;
- no `cohort` or `wave` operator/product concept.

The task is not complete if `cohort` survives as public API wording, admin UI wording, active Java domain, active repository boundary, active DB final-schema model or undocumented compatibility path.

## Context

Latest verified state before this freeze:

- `MVP-02-04-closure-audit-001` is `PASS`;
- `MVP-02.01`, `MVP-02.02`, `MVP-02.03` are `PASS` under the old model;
- `MVP-02.04` is `DONE_WITH_HUMAN_PENDING` under the old admin cohort/code status model;
- full `MVP-02`, the MVP stage and all human gates remain open.

Canonical docs currently still mention `cohort/wave`; this task must sync them during implementation because the product decision changed. This freezer did not edit canonical docs.

## Implementation Scope

### DB / Flyway

- Add an append-only migration after the current MVP-02 migrations.
- Migrate active schema from `cohorts` / `cohort_id` to the chosen replacement model (`pilot_launch` and/or `access_pool`).
- Preserve existing synthetic/dev data by backfilling or renaming rows.
- Remove active runtime dependency on cohort table/columns/FKs/indexes/constraints.
- Remove `WAVE_0`, `WAVE_1`, `CUSTOM` as domain enum semantics for the MVP access path.
- Any temporary DB bridge must be documented in evidence with reason, no public exposure, tests and removal criteria.

### Backend

- Replace active references to `Cohort`, `CohortKind`, `CohortStatus`, `CohortRepository` and `cohortId`.
- Update invite code domain, issuance, activation and repository methods.
- Update employee registration domain/service/repository/result/response.
- Update admin code-status service/read model/controller/error wording.
- Update backend tests that seed or assert waves/cohorts.
- Preserve guardrails:
  - no raw invite-code persistence/exposure;
  - no `lookup_hash` exposure;
  - no `activation_subject_ref` exposure;
  - no employee full name/email/phone in admin status response;
  - no real employee/customer data in tests/fixtures/evidence.

### API / OpenAPI

- Replace `/api/v1/admin/tenants/{tenantId}/cohorts/{cohortId}/code-status`.
- Remove `cohort*` response/request fields from public/admin DTOs.
- Choose final replacement names once and use them consistently, for example `accessPoolId` and/or `pilotLaunchId`.
- Update OpenAPI annotations/examples and generated-client notes or explicit no-op.

### Admin UI

- Replace copy:
  - `Статус кодов по когорте`;
  - `ID когорты`;
  - `Когорта`;
  - `Волна` / `wave`.
- Rename local types, fixture fields, env vars and fetch path away from `cohort*`.
- Update tests and screenshots for success, empty, error and loading states.
- Keep the surface read-only and operator-focused.

### Docs / Artifacts

- Update the narrowest canonical docs that own the decision:
  - `docs/stages/MVP.md`;
  - `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`;
  - `docs/architecture/source-of-truth.md` if its MVP baseline still names `cohort/wave`;
  - access docs only if their MVP boundary wording still permits `tenant/cohort/invite` as the current slice.
- Update stage artifacts and evidence for this task.
- Do not close full `MVP-02` automatically.

## Out Of Scope

- SSO/SCIM.
- Billing, subscriptions, seats, pricing or paywall implementation.
- Full `OrgMembership` rollout unless required by a narrow migration invariant.
- HR reporting expansion.
- Admin auth/session/role/audit production policy.
- Real employee/customer data.
- Legal/privacy/consent approval.
- Financial content, rewards, fulfillment, HR wording or production content approval.
- Full `MVP-02`, MVP stage or human-gate closure.

## Acceptance Criteria

1. `cohort`/`wave` no longer appears in active production API/backend/admin code as MVP domain/API/UI terminology.
2. Final Flyway schema has no active first-class cohort model or `cohort_id` runtime contract.
3. Existing invite issuance/activation behavior is preserved for a 500-code pilot access pool.
4. Employee registration keeps the same user-facing capability and returns replacement identifiers instead of `cohortId`.
5. Admin code-status/funnel view uses replacement API path, DTO shape and Russian operator copy.
6. OpenAPI and generated-client notes are synchronized.
7. Canonical docs and stage artifacts are synchronized with the no-cohort MVP decision.
8. Any remaining `cohort`/`wave` match is historical evidence, old immutable migration text, or an explicitly documented temporary migration detail with no product/API/UI exposure.
9. Human gates remain open.
10. Full `MVP-02` remains open after this task unless a separate closure task is frozen and verified.

## Required Evidence

- Migration/schema inspection output.
- Backend test command output, including invite/access, registration and admin status tests.
- API/OpenAPI inspection and generated-client note.
- Admin typecheck/test/build/browser smoke output and screenshots.
- Focused term scan for:
  - `cohort`;
  - `Cohort`;
  - `COHORT`;
  - `wave`;
  - `Wave`;
  - `WAVE`;
  - `когорт`;
  - `волна`.
- Classification of all remaining matches.
- JSON validation for edited JSON artifacts.
- `git diff --check`.
- Harness validation when possible:
  - `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`.
- Fresh verifier verdict scoped only to `MVP-02-remove-cohort-domain-001`.

## Human Gates

Keep all existing human gates open:

- legal/privacy wording and consent copy;
- real employee/customer data processing;
- customer-specific HR/reporting boundaries;
- admin auth/role/audit policy for production use;
- personal employee contact/financial/diagnostic disclosure requests;
- financial correctness, rewards, fulfillment, HR wording and production content approval outside this refactor.
