# Evidence: MVP-03-consent-version-logging-001

Status: `SCOPED_PASS`
Updated: 2026-05-12

This immutable evidence ref mirrors the latest alias for the scoped consent version logging build. See `.agent/stages/mvp/evidence.md` for the compact proof bundle.

Summary:

- append-only `V007__legal_document_acceptance_log.sql`;
- `apps/api/src/main/java/com/finrhythm/api/consent/**`;
- `apps/api/src/test/java/com/finrhythm/api/consent/LegalDocumentAcceptanceControllerIT.java`;
- idempotent same-version retry and safe rejection paths;
- OpenAPI runtime coverage;
- `packages/api-client` snapshot/generator/drift check/generated client updated for legal acceptance DTOs and path helper;
- `packages/api-client` exports `LEGAL_DOCUMENT_CURRENT_DRAFT_VERSION = "draft-2026-05-12"` and drift-checks it against backend `LegalAcceptanceService.CURRENT_DRAFT_VERSION`;
- generated api-client EOF formatting is fixed at generator source and new/untracked generated files pass no-index whitespace checks;
- no unsafe web mutation because employee auth/session identity bridge is absent;
- backend/root checks passed with explicit Homebrew JDK 21;
- fresh verifier PASS is recorded in `.agent/stages/mvp/verdicts/MVP-03-consent-version-logging-001.json`;
- parent sync and harness validation passed while full `MVP-03` and human gates remain open.
