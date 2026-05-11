# Task: MVP-02-employee-registration-001

Status: `PASS`
Stage: `mvp`
Parent execution unit: `MVP-02.03`
Role to run next: none; fresh verifier PASS recorded

## Objective

Implement backend/API employee registration by `fullName`, `email`, `phone` and `inviteCode`, using the existing tenant/cohort/invite activation core.

## Inputs

- `AGENTS.md`
- `.agents/skills/stage-launch-proof-loop/SKILL.md`
- `.agents/skills/stage-launch-proof-loop/references/READ_MATRIX.md`
- `docs/architecture/source-of-truth.md`
- `docs/architecture/documentation-workflow.md`
- `docs/engineering/definition-of-done.md`
- `docs/engineering/human-gates.md`
- `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`
- `docs/stages/MVP.md`
- `apps/api/AGENTS.md`
- `.agent/stages/mvp/stage_spec.md`
- `.agent/stages/mvp/sprint_contract.md`
- `.agent/stages/mvp/task-files/MVP-02-tenant-domain-001.md`
- `.agent/stages/mvp/task-files/MVP-02-invite-issuance-activation-001.md`
- current `apps/api` tenant/cohort/invite model and `InviteCodeAccessService`

## Owned repo areas for implementation

- `apps/api/pom.xml` if springdoc/OpenAPI dependency/configuration is needed.
- `apps/api/src/main/java/com/finrhythm/api/**` for registration controller, DTOs, service/domain and repository code.
- `apps/api/src/main/resources/db/migration/V004__*.sql` or the next append-only Flyway migration after `V003`.
- `apps/api/src/test/java/com/finrhythm/api/**`.
- `apps/api/src/test/resources/**`.
- `packages/api-client/**` only if generated from OpenAPI source; otherwise record a no-op and leave it untouched.
- `.agent/stages/mvp/evidence.*`, `.agent/stages/mvp/raw/**`, `.agent/stages/mvp/verdict.*`, `.agent/stages/mvp/problems.*` and current stage handoff artifacts.

## Non-goals

- No employee web UI or admin UI.
- No admin view for cohorts, code statuses or activation funnel.
- No onboarding/privacy/consent screens or legal copy approval.
- No auth/session tokens, password login, SSO, SCIM or identity recovery.
- No HR reporting, diagnostics, learning, event taxonomy, points, rewards, merch, support or feedback.
- No raw invite-code persistence.
- No real customer/employee/personal/financial data.
- No customer brand in employee-facing examples.

## Acceptance criteria

Use the exact criteria in `.agent/stages/mvp/sprint_contract.md`.

Important implementation constraints:

- Keep controller thin.
- Keep registration rules in service/domain code.
- Use append-only Flyway migration only.
- Represent public contract through springdoc/OpenAPI source.
- Do not manually invent generated client artifacts.
- Keep `activation_subject_ref` opaque and non-PII.
- Preserve legal/privacy and real-data human gates.

## Verification plan

Run and record:

- `git status --short`
- `java -version`
- `cd apps/api && ./mvnw -v`
- `cd apps/api && ./mvnw -q test`
- `cd apps/api && ./mvnw -q verify`
- `make verify`
- `make test-unit`
- `make build`
- append-only migration inspection
- OpenAPI/springdoc endpoint/schema inspection
- generated-client regeneration output or explicit no-op note
- PII/raw invite code/customer-brand guardrail scan
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`

Then run a fresh `stage_verifier` scoped to `MVP-02-employee-registration-001`.

## Evidence handoff required

The builder updated evidence artifacts and mapped every acceptance criterion to raw refs. Fresh `stage_verifier` recorded `PASS` on 2026-05-09.

## Human gates

Legal/privacy wording, consent text, use of real employee/customer data and customer-specific reporting remain `WAITING_HUMAN`. This task may prepare backend mechanics, but it cannot approve real-world processing or public legal copy.
