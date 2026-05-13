# Evidence: MVP-03-legal-drafts-001

Stage: `mvp`
Parent unit: `MVP-03.01`
Status: `SCOPED_PASS`
Updated: 2026-05-13

## Scope Built

Created the four tracked draft legal artifacts required by the frozen slice:

- `docs/legal/mvp/drafts/privacy-policy-draft.md` — draft MVP privacy policy and HR/sponsor reporting boundary.
- `docs/legal/mvp/drafts/terms-of-use-draft.md` — draft B2B pilot educational Terms of Use.
- `docs/legal/mvp/drafts/personal-data-consent-draft.md` — draft personal-data processing consent template.
- `docs/legal/mvp/drafts/financial-disclaimer-draft.md` — draft educational financial disclaimer.

Each draft includes `DRAFT_WAITING_HUMAN_REVIEW`, version/date, MVP/B2B pilot scope, owner expectation, required human reviewer expectation, production-use limitation and a prominent `NOT_APPROVED / НЕ УТВЕРЖДЕНО` warning near the top.

## Privacy And Legal Boundaries

- HR/wellbeing sponsor reporting is aggregate by default.
- Personal diagnostic answers, individual weak zones, exact sums, reflection details and personal tax/debt circumstances are not personal HR reports by default.
- Real employee/customer data processing is not approved by these drafts.
- The terms and disclaimer keep the product educational and avoid guaranteed outcomes.
- The financial disclaimer states that the product does not provide personalized investment, tax, credit, insurance, accounting or legal advice.
- Cookie policy, cookie banner and cookie/tracking consent are explicitly deferred/out of scope because this slice found no active cookie/tracking implementation scope in `apps/` or `packages/`.

## Human Gates

| Gate | Status | Reviewer files |
|---|---|---|
| `legal-privacy-consent-wording-and-real-pii-processing` | `WAITING_HUMAN` | `privacy-policy-draft.md`, `terms-of-use-draft.md`, `personal-data-consent-draft.md`, `financial-disclaimer-draft.md` |
| Real employee/customer data processing approval | `WAITING_HUMAN` | all four draft files plus production privacy/security process |
| Customer-specific HR/reporting boundaries | `WAITING_HUMAN` | privacy policy draft and consent draft |
| Final financial correctness of lessons, diagnostics, quizzes and explanations | `WAITING_HUMAN` | financial disclaimer draft plus future lesson/diagnostic content |
| Reward economy, stock, prices and fulfillment | `WAITING_HUMAN` | terms draft and financial disclaimer draft |

No human gate, full `MVP-03`, or MVP stage completion is claimed by this builder evidence.

## Acceptance Mapping

| Criterion | Builder status | Evidence |
|---|---|---|
| Four draft files exist at exact paths. | `BUILDER_CHECK_PASS` | `legal-draft-path-check.txt` |
| Drafts include required metadata and non-approval warning. | `BUILDER_CHECK_PASS` | `legal-draft-metadata-scan.txt` |
| Privacy/consent preserve aggregate HR/sponsor boundary. | `BUILDER_CHECK_PASS` | draft text and `legal-draft-privacy-boundary-scan.txt` |
| No approval, guarantee or personalized-advice claim found by targeted scan. | `BUILDER_CHECK_PASS` | `legal-draft-forbidden-claim-scan.txt` |
| Cookie/tracking consent deferred unless active scope exists. | `BUILDER_CHECK_PASS_NO_ACTIVE_IMPL_FOUND` | `active-cookie-tracking-scope-scan.txt` |
| Evidence references all four draft files. | `BUILDER_CHECK_PASS` | `legal-draft-evidence-ref-check.txt` |
| Changed JSON artifacts validate. | `BUILDER_CHECK_PASS` | `json-validation.txt` |
| `git diff --check` excluding raw is clean. | `BUILDER_CHECK_PASS` | `git-diff-check-excluding-raw.txt` |
| Harness validation is evaluated honestly. | `EXPECTED_FAIL_PENDING_FRESH_VERIFIER` | `harness-validation.json` |

## Docs Sync And Diagram

- Canonical docs: `NOOP`. This slice creates draft legal artifacts requested by the existing frozen scope; it does not change product behavior, architecture, workflow, API contract, schema, setup/runtime behavior or stage baseline.
- Mermaid: `NONE`. No flow, state machine or cross-module interaction changed.

## Backend/UI Baseline

Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc are untouched. No production code, app/package files, schemas, migrations, OpenAPI/generated-client artifacts, UI routes, screenshots or browser tests are required for this docs/legal-draft-only slice.

## Commands

Full outputs are under `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/`.

| Command | Status | Raw ref |
|---|---|---|
| `for path in docs/legal/mvp/drafts/{privacy-policy-draft.md,terms-of-use-draft.md,personal-data-consent-draft.md,financial-disclaimer-draft.md}; do test -f "$path" && printf "FOUND %s\n" "$path"; done` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/legal-draft-path-check.txt` |
| `rg -n "DRAFT_WAITING_HUMAN_REVIEW|NOT_APPROVED|НЕ УТВЕРЖДЕНО|Version / date|Owner expectation|Required human reviewer expectation|Production use|Scope" docs/legal/mvp/drafts/*.md` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/legal-draft-metadata-scan.txt` |
| `rg -n -i "aggregate|агрегирован|HR|sponsor|diagnostic answers|weak zones|exact sums|reflection details|персональные diagnostic answers|индивидуальные weak zones" docs/legal/mvp/drafts/privacy-policy-draft.md docs/legal/mvp/drafts/personal-data-consent-draft.md docs/legal/mvp/drafts/financial-disclaimer-draft.md` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/legal-draft-privacy-boundary-scan.txt` |
| `(rg -n -i "(гарантируем|гарантированн[а-я]*\\s+(доход|выгод|сбереж|эконом|списан|избав|результат)|безрисков|быстрый доход|юридически одобрен|одобрен[а-я]*\\s+юрист|утвержден[а-я]*\\s+юрист|approved for production|production legal readiness confirmed|разрешен[а-я]*\\s+(обработка|использование)\\s+реальн|это\\s+(персональн|индивидуальн)[а-я ]*(инвестиционн|налогов|кредитн|юридическ)[а-я ]*(совет|рекомендац)|мы\\s+предоставляем\\s+(персональн|индивидуальн))" docs/legal/mvp/drafts/*.md || true) \| rg -v -i "(не обещает|не предоставляет|не подтверждает|не разрешает|не является|не утверждает|NOT_APPROVED|НЕ УТВЕРЖДЕНО)"` | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/legal-draft-forbidden-claim-scan.txt` |
| `rg -n -i "document\\.cookie|cookieStore|cookies\\(|next/headers.*cookies|gtag|google-analytics|posthog|plausible|metrika|ym\\(" apps packages` | `PASS_NO_MATCHES` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/active-cookie-tracking-scope-scan.txt` |
| `rg -n "docs/legal/mvp/drafts/(privacy-policy-draft.md|terms-of-use-draft.md|personal-data-consent-draft.md|financial-disclaimer-draft.md)" .agent/stages/mvp/evidence/MVP-03-legal-drafts-001.md .agent/stages/mvp/evidence/MVP-03-legal-drafts-001.json .agent/stages/mvp/evidence.md .agent/stages/mvp/evidence.json` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/legal-draft-evidence-ref-check.txt` |
| `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json .agent/stages/mvp/evidence/MVP-03-legal-drafts-001.json .agent/stages/mvp/evidence.json` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/json-validation.txt` |
| `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` | `PASS` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/git-diff-check-excluding-raw.txt` |
| `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp` | `EXPECTED_FAIL_PENDING_FRESH_VERIFIER` | `.agent/stages/mvp/raw/builder-MVP-03-legal-drafts-001-20260513/harness-validation.json` |
| Parent sync: `jq empty .agent/stages/mvp/status.json .agent/stages/mvp/feature_list.json .agent/stages/mvp/evidence/MVP-03-legal-drafts-001.json .agent/stages/mvp/evidence.json .agent/stages/mvp/verdict.json .agent/stages/mvp/verdicts/MVP-03-legal-drafts-001.json` | `PASS` | `.agent/stages/mvp/raw/orchestrator-MVP-03-legal-drafts-001-parent-sync-20260513/json-validation.txt` |
| Parent sync: `git diff --check -- . ':(exclude).agent/stages/**/raw/**'` | `PASS` | `.agent/stages/mvp/raw/orchestrator-MVP-03-legal-drafts-001-parent-sync-20260513/git-diff-check-excluding-raw.txt` |
| Parent sync: `python3 .agents/skills/stage-launch-proof-loop/scripts/verify_harness.py --stage-id mvp` | `PASS` | `.agent/stages/mvp/raw/orchestrator-MVP-03-legal-drafts-001-parent-sync-20260513/verify-harness.json` |

## Fresh Verifier

Fresh verifier for `MVP-03-legal-drafts-001`: `PASS`.

- Verdict: `.agent/stages/mvp/verdicts/MVP-03-legal-drafts-001.json`
- Problems summary: `.agent/stages/mvp/problems/MVP-03-legal-drafts-001.md`
- Raw verification logs: `.agent/stages/mvp/raw/verifier-MVP-03-legal-drafts-001-20260513/`

The verifier independently confirmed the four draft paths, required draft/not-approved metadata, aggregate-by-default HR/sponsor boundary, no blocking legal-approval / real-data-approval / guaranteed-outcome / personalized-advice claims, cookie/tracking deferral, JSON validation and diff check.

Parent sync moved latest `evidence`, `verdict`, `problems` and `status` aliases to `MVP-03-legal-drafts-001`. `mvp_03_legal_drafts_proven=true` for tracked draft artifacts only. Legal/human review remains `WAITING_HUMAN` even after technical verification.

## Known Limitations

- Draft wording is not legally approved.
- Real employee/customer data processing is not approved.
- Cookie/banner/tracking policy is deferred because no active implementation scope was found in this slice.
- Backend, UI, schema, OpenAPI and generated-client tests were not run because they are out of scope for docs/legal-draft-only work.
- Full `MVP-03` and the MVP stage remain open. A separate closure audit is required before any full `MVP-03` `DONE_WITH_HUMAN_PENDING` decision.
