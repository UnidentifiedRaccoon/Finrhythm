# Evidence: MVP-06-learning-n3-fixture-001

Status: `PASS`
Updated: 2026-05-12
Stage: `mvp`
Parent unit: `MVP-06.03`

This immutable evidence matches the latest alias `.agent/stages/mvp/evidence.md` for the N3 fixture slice. Fresh verifier returned scoped `PASS`; full `MVP-04`, full `MVP-06`, the MVP stage and all human gates remain open.

## Implemented

- Synthetic `N3_DECLUTTER_TO_GOAL` fixture with seven blocks: situation, why, rule, example, mini_test, practice, reward.
- Direct `/learning/lessons/N3` route through the existing resolver.
- Existing full lesson-id alias `/learning/lessons/N3_DECLUTTER_TO_GOAL`.
- Visible `/learning` CTA for N3 while preserving N1 and N2.
- Q10/Q11/Q12 display-only safe-sale mini-test.
- Non-persistent checklist+choice practice for item range, safety checklist and destination category.
- Reward guardrail copy using the existing amber/warning-soft renderer pattern.
- `editorial_draft` and `humanReviewRequired: true`.

## Source Mapping

- `docs/product/b2b-mvp/lemanapro/learning-methodology-v0.2.md`: N3, C4/C3/C9, Q10/Q11/Q12, sensitive-data policy.
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md`: `N3_DECLUTTER_TO_GOAL`, `DC_DECLUTTER_ONE`, checklist+choice practice, sensitive-data policy.
- `content/getcourse-finstrategy/12-lesson-235010153.md`: raw source with `humanReview: "required"`.
- `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`: reward and warning-soft guardrails.

## Changed Files

- `apps/web/lib/learning-fixtures.ts`
- `apps/web/components/learning-shell.ts`
- `apps/web/tests/learning-shell.test.mjs`
- `apps/web/tests/browser-smoke.mjs`
- `.agent/stages/mvp/evidence.md`
- `.agent/stages/mvp/evidence.json`
- `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.md`
- `.agent/stages/mvp/evidence/MVP-06-learning-n3-fixture-001.json`
- `.agent/stages/mvp/status.json`
- `.agent/stages/mvp/progress.md`
- `.agent/stages/mvp/decisions.md`
- `.agent/stages/mvp/risks.md`
- `.agent/stages/mvp/backlog.md`
- `.agent/stages/mvp/feature_list.json`
- `.agent/stages/mvp/verdict.json`
- `.agent/stages/mvp/problems.md`
- `.agent/stages/mvp/verdicts/MVP-06-learning-n3-fixture-001.json`
- `.agent/stages/mvp/problems/MVP-06-learning-n3-fixture-001.md`
- `.agent/stages/mvp/raw/mvp-06-learning-n3-fixture-001-screenshots-20260512/`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-*.txt`

## Validation

- JSON validation: PASS.
- Web typecheck: PASS.
- Web tests: PASS.
- Web build: PASS.
- Browser smoke: PASS for `/learning`, N1, N2, N3, loading, empty and error.
- Guardrail scan: PASS for sensitive-data request patterns, customer brand, old cohort terms and unsafe reward claims.
- Java: BLOCKED for unqualified `java -version`; Java-backed `make verify` was not run or claimed.
- `git diff --check`: PASS.
- Harness validation: FAIL with expected active/latest mismatch because fresh N3 verifier is pending and verifier-owned aliases remain on N2.
- Fresh verifier: PASS, `.agent/stages/mvp/verdicts/MVP-06-learning-n3-fixture-001.json` and `.agent/stages/mvp/problems/MVP-06-learning-n3-fixture-001.md`.
- Verifier browser smoke with system Chrome: PASS for `/learning`, N1, N2, N3, loading, empty and error; screenshots under `.agent/stages/mvp/raw/mvp-06-learning-n3-fixture-001-verifier-screenshots-20260512/`.
- Parent final `verify_harness.py --stage-id mvp`: PASS, `.agent/stages/mvp/raw/orchestrator-mvp-06-learning-n3-fixture-001-verify-harness-final-20260512.json`.
- Parent final JSON validation and `git diff --check`: PASS, `.agent/stages/mvp/raw/orchestrator-mvp-06-learning-n3-fixture-001-json-validation-final-20260512.txt` and `.agent/stages/mvp/raw/orchestrator-mvp-06-learning-n3-fixture-001-git-diff-check-final-20260512.txt`.

## Evidence Refs

- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-web-typecheck-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-web-test-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-web-build-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-browser-smoke-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-guardrail-scan-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-java-version-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-git-diff-check-20260512.txt`
- `.agent/stages/mvp/raw/stage-builder-mvp-06-learning-n3-fixture-001-verify-harness-20260512.json`
- `.agent/stages/mvp/raw/mvp-06-learning-n3-fixture-001-screenshots-20260512/`

## Limits

This builder evidence does not implement or close CMS/admin publishing, content states, production content approval, progress persistence, scored quiz submission, practice submission, saved listing/challenge/daily challenge, points/wallet, diagnostics/routing, onboarding/consent, backend/API/schema/OpenAPI/generated-client, `packages/ui`, admin/HR analytics/event tracking, real data, full MVP-04, full MVP-06, the MVP stage or human gates.

Fresh verifier returned scoped PASS. Parent accepted the scoped PASS and synchronized latest stage status to `MVP-06-learning-n3-fixture-001`; this does not close CMS/admin publishing, production content approval, progress persistence, scored quiz submission, practice submission, points/wallet, diagnostics/routing, onboarding/consent, full `MVP-04`, full `MVP-06`, the MVP stage or any human gate.
