# Task: MVP-03-legal-drafts-001

Stage: `mvp`
Parent unit: `MVP-03.01`
Status: `FROZEN`
Created: 2026-05-13
Owner role: stage_builder

## Goal

Create the tracked draft legal artifacts missing from `MVP-03.01`: privacy policy, terms of use, personal-data consent and financial disclaimer.

The result is draft-only. Legal wording/approval remains `WAITING_HUMAN`; no legal approval, real-data approval, full `MVP-03` closure or MVP stage closure may be claimed.

## Build Targets

- `docs/legal/mvp/drafts/privacy-policy-draft.md`
- `docs/legal/mvp/drafts/terms-of-use-draft.md`
- `docs/legal/mvp/drafts/personal-data-consent-draft.md`
- `docs/legal/mvp/drafts/financial-disclaimer-draft.md`

## Required Draft Metadata

Each file must include:

- draft status and explicit "not approved" warning;
- version and date;
- MVP/B2B pilot scope;
- owner expectation;
- human reviewer expectation;
- exact statement that the file requires human legal review before production use.

## Scope Rules

- Preserve the MVP privacy boundary: aggregate HR/sponsor reporting by default; no personal diagnostic answers, weak zones, exact sums or reflection details as personal HR reports by default.
- Avoid financial/legal guarantees, guaranteed outcomes and personalized investment, tax, credit or legal advice.
- Keep cookie/consent deferred and out of scope unless current repo evidence proves cookies/tracking are active MVP implementation scope.
- Do not edit production code, app/package files, schemas, OpenAPI/generated client, UI, raw evidence or prior immutable proof refs.
- Preserve backend baseline unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Acceptance Checklist

- Four draft files exist at the exact build target paths and are referenced in evidence.
- Each draft includes required metadata and a non-approval warning.
- Human gate record names the exact four files and stays `WAITING_HUMAN`.
- Draft scans show no approval claims, no guaranteed financial benefit/debt relief/savings and no personalized financial/tax/legal advice.
- Cookie/consent is explicitly deferred unless active cookies/tracking are proven in current repo scope.
- Full `MVP-03`, MVP stage and human gates remain open.
- Compact stage evidence/status artifacts are updated.
- JSON validation passes.
- Markdown/path checks pass for the four draft files.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` passes or records unrelated pre-existing issues.
- Harness validation is run if applicable.
- Fresh verifier is scoped only to `MVP-03-legal-drafts-001`.

## Doc Targets And Diagram Expectations

- Doc targets are the four draft legal files under `docs/legal/mvp/drafts/`.
- Canonical product/stage docs are `NOOP_EXPECTED` unless material drift is found.
- Mermaid expectation is `NONE_EXPECTED`; no flow/state/system behavior changes are in scope.

## Human Gate

`legal-privacy-consent-wording-and-real-pii-processing` remains `WAITING_HUMAN` after builder work. The human reviewer must review:

- `docs/legal/mvp/drafts/privacy-policy-draft.md`
- `docs/legal/mvp/drafts/terms-of-use-draft.md`
- `docs/legal/mvp/drafts/personal-data-consent-draft.md`
- `docs/legal/mvp/drafts/financial-disclaimer-draft.md`
