# Task file: MVP-03-onboarding-privacy-screen-001

Stage: `mvp`
Parent unit: `MVP-03.02`
Status: `FROZEN`
Owner role: stage_spec_freezer
Created: 2026-05-12

## Objective

Build one narrow employee-facing onboarding/privacy screen in `apps/web`, preferred route `/onboarding/privacy`, that explains before future diagnostics what HR/employer sees and does not see.

This task is not a diagnostics, consent, backend, reporting or legal-approval slice.

## Current State Preserved

- Latest verified sprint remains `MVP-06-learning-n3-fixture-001` with scoped `PASS`.
- Full `MVP-03`, full `MVP-04`, full `MVP-06`, full MVP stage and all human gates remain open.
- `MVP-02` remains `DONE_WITH_HUMAN_PENDING`.
- MVP-05 docs remain draft/human-gated.
- Onboarding/privacy/consent is not implemented before this slice.
- Unqualified `java` may fail; Java-backed root verification must not be claimed without explicit proof.

## In Scope

- Add the smallest `apps/web` privacy route/screen, preferably `/onboarding/privacy`.
- Use Russian calm mentor copy, neutral product wording and no customer brand.
- Explain that HR/employer sees aggregate program analytics by default, not personal diagnostic answers.
- Explain that HR/employer does not see personal diagnostic answers, individual weak zones, exact sums, reflection details or personal tax/debt circumstances by default.
- Mention that operational personal data may be used only for access, communication, support or merch fulfillment in later scoped slices.
- Mark wording as draft/legal-human-gated and avoid final legal approval claims.
- Use the existing design-system/privacy-card baseline.
- Provide a safe handoff toward future diagnostics without creating diagnostics; optional `/learning` link to this privacy route is allowed.
- Add focused web tests and browser/mobile smoke evidence for the route and linked learning route if `/learning` changes.

## Out Of Scope

- Final legal approval.
- Consent acceptance, consent version persistence/logging or audit trail.
- Backend/API/schema/OpenAPI/generated-client changes.
- Diagnostics questions, scoring, routing, route explanations or submissions.
- Progress persistence, scored quiz submission, practice submission, points/wallet.
- CMS/admin publishing, production content approval, HR dashboard/reporting or analytics/event tracking.
- Real data or customer brand.
- Required exact sums, photos, documents or bank screenshots.
- Closing full `MVP-03`, `MVP-04`, `MVP-06`, `MVP-07`, MVP stage or human gates.

## Acceptance

- Route renders in `apps/web` without diagnostics or persistence behavior.
- Copy has clear "what HR sees" and "what HR does not see" boundaries.
- Copy is draft/legal-human-gated and does not act as consent acceptance.
- No customer brand appears in employee UI.
- No old `cohort` terms appear in active changed employee-facing code.
- No promise says HR sees personal answers or personal weak zones.
- No required exact sums/photos/documents/bank screenshots.
- If `/learning` is changed, existing learning routes remain preserved and the new link is navigation only.

## Required Validation

- `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json`
- `git diff --check -- <changed files>`
- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- Browser/mobile smoke screenshots for `/onboarding/privacy` and linked `/learning` route if changed.
- Guardrail scans for customer brand, old `cohort` terms in active employee UI, HR personal-answer promises, required exact sums/photos/docs/bank screenshots and final legal approval claims.
- `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp`
- Honest Java blocker/proof.

## Handoff Notes

Do not edit `.agent/stages/**/raw/**` during this freezer task, and do not read raw evidence without an exact read-gated reference. The builder must create evidence and fresh verifier artifacts after implementation; this freezer does not claim implementation or PASS for this new slice.
