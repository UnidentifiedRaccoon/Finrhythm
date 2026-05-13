# Task: MVP-04-employee-app-ia-nav-001

Stage: `mvp`
Sprint contract: `MVP-04-employee-app-ia-nav-001`
Parent unit: `MVP-04.02`
Status: `VERIFIED_PASS`
Proof status: `FRESH_VERIFIER_PASS`
Functional passes: `false`
Owner role: `stage_builder`
Created: 2026-05-13

## Slice

Build the smallest `apps/web` mobile employee app IA/navigation layer that makes Learning, Challenges, Rewards/Store, Profile and Support reachable while preserving the verified MVP-03 profile path:

`/start -> /onboarding/privacy -> /profile/session -> legal acknowledgement -> generated legal acceptance POST -> contact update screen`

This is a UI/navigation shell slice. It is not a challenge implementation, rewards/store implementation, support ticket workflow, backend/API/schema/OpenAPI/generated-client slice or full MVP-04 closure.

## Baseline

- Latest verified sprint: `MVP-03-post-legal-acceptance-closure-audit-001` = `PASS`.
- Full `MVP-03` is `DONE_WITH_HUMAN_PENDING`; legal/privacy and real-data human gates remain open.
- Full `MVP-04` remains open.
- `MVP-04-mobile-learning-shell-001`, `MVP-04-design-system-tokenization-001` and narrow `MVP-04.04` have scoped PASS.
- Current `apps/web` route baseline includes `/`, `/learning`, `/learning/lessons/[lessonId]`, `/start`, `/onboarding/privacy`, `/profile/session` and `/profile/contact`.
- Backend baseline remains unchanged: Spring Boot, Java 21, Maven Wrapper, PostgreSQL, Flyway and OpenAPI/springdoc.

## Builder First Touch

The first meaningful build step must edit `apps/web` production/test code, not `.agent`, docs, evidence, verdict, problems or harness files.

Expected targets:

- shared employee app shell/navigation component under `apps/web/components` or a narrow refactor of existing shell components;
- route files under `apps/web/app` for missing Home, Challenges, Rewards/Store and Support hubs/placeholders;
- `apps/web/tests/learning-shell.test.mjs`;
- `apps/web/tests/browser-smoke.mjs`;
- `apps/web/app/globals.css` only if current design-system token classes are insufficient.

## Implementation Requirements

- Use mobile-first layout and existing Calm Progress Fintech/design-system tokens.
- Keep bottom navigation to at most five items.
- Bottom-nav slots must be the design-system five: `Главная`, `Обучение` or `Маршрут`, `Челлендж`, `Награды`, `Профиль`.
- Make Learning, Challenges, Rewards/Store and Profile reachable from bottom navigation.
- Keep Support out of bottom nav and make it visibly reachable from Home and Profile.
- Preserve existing `/learning` and `/learning/lessons/N1|N2|N3` proof.
- Preserve `/start`, `/onboarding/privacy`, `/profile/session`, legal acceptance ordering and direct `/profile/contact` safe missing-session behavior.
- Challenges, Rewards/Store and Support may be placeholder/hub routes only.
- Use Russian neutral copy, no customer brand and no financial promises.
- Support copy must clearly limit the surface to access/product/navigation help and must not promise personal financial, legal, tax, credit, debt or investment advice.

## Out Of Scope

- Challenge participation, check-ins, persistence, reminders, reward accrual or challenge result logic.
- Store redemption, merch orders, order status, wallet, points ledger/history/balance or reward economy rules.
- Support ticket submission, admin/support queue, SLA, operator tooling or personal advice.
- Diagnostics, scoring, route assignment, HR reporting, CMS/admin publishing, production content approval or analytics/event taxonomy.
- Backend/API/schema/Flyway/OpenAPI/generated-client source changes.
- Manual generated-client edits.
- New auth/login/password, `User`, `OrgMembership`, organization codes, subscriptions, seats, entitlements, billing or paywall.
- Real employee/customer/personal/financial data.
- Customer brand in employee UI.
- Money/cash-equivalence wording for points, guaranteed results, quick income, risk-free or guaranteed debt-relief claims.
- Required exact sums, photos, documents or bank screenshots.
- Full `MVP-04`, full MVP stage or human-gate closure.

## Acceptance Criteria

- Bottom nav has no more than five items and does not include Support as a sixth item.
- Bottom nav exposes Home, Learning/Route, Challenge, Rewards and Profile.
- Home or equivalent app hub exposes visible secondary Support entry.
- Profile surface exposes visible secondary Support entry without bypassing `/profile/session` safety.
- Challenges route/hub renders as placeholder-only and does not allow participation or persistence.
- Rewards/Store route/hub renders as placeholder-only and does not allow redemption, ordering, wallet or points mutation.
- Support route/hub renders informationally and does not submit tickets or promise personal advice.
- `/start -> /onboarding/privacy -> /profile/session` still passes browser smoke.
- Existing learning route and N1/N2/N3 lesson routes still render.
- Profile-session legal acceptance still happens before contact update.
- Direct `/profile/contact` still renders safe missing-session state.
- No backend/API/schema/OpenAPI/generated-client files are changed.
- No real data, raw invite code, token leakage, customer brand, money/cash-equivalence wording or forbidden financial claims appear in source/tests/screenshots/evidence.
- Functional `passes=false` remains until builder evidence and fresh verifier PASS exist.

## Required Checks

- `pnpm --filter @finrhythm/web typecheck`
- `pnpm --filter @finrhythm/web test`
- `pnpm --filter @finrhythm/web build`
- `pnpm --filter @finrhythm/web smoke:browser` or the existing browser-smoke command with explicit `WEB_SMOKE_*` refs.
- Browser/mobile screenshots for Home, Learning, Challenges, Rewards/Store, Profile, Support and `/start -> /onboarding/privacy -> /profile/session`.
- Guardrail scans for max-five bottom nav, Support secondary placement, placeholder-only Challenges/Rewards/Support, no support submission, no redemption/order/wallet/points mutation, no backend/API/generated-client scope, no token URL/storage leakage, no raw invite echo, no real data, no customer brand, no money/cash-equivalence wording and no forbidden claims.
- `jq empty` for changed JSON artifacts.
- `git diff --check -- . ':(exclude).agent/stages/**/raw/**' ':(exclude).agent/tasks/**/raw/**'`.
- Root checks if feasible: `make verify`, `make test-unit`, `make build`.
- Fresh `stage_verifier` after builder evidence.

## Evidence Required From Builder

- changed production/test files;
- route/IA map and Mermaid diagram in stage evidence;
- browser-smoke raw refs and screenshots;
- web/root command raw refs;
- guardrail scan raw refs;
- docs-sync decision;
- backend baseline unchanged note;
- human gates preserved;
- immutable evidence/verdict/problems refs for `MVP-04-employee-app-ia-nav-001`.

## Doc Targets And Diagram Expectations

- Canonical docs: `NOOP_EXPECTED` while following current `docs/stages/MVP.md` and `design-system-v0.1.md` IA baseline.
- Update `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md` only if nav labels, max-five rule or support placement changes.
- Update `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md` only if the builder changes product IA beyond existing employee loop and support/store/challenge reachability.
- Mermaid: `EXPECTED_IN_EVIDENCE` for a small employee app shell route/IA map.

## Human Gates

- Brand naming approval and final voice/anti-shame review: `WAITING_HUMAN`.
- Accessibility contrast audit: `WAITING_HUMAN`.
- Final legal/privacy wording review: `WAITING_HUMAN`.
- Design QA on real mobile screens: `WAITING_HUMAN`.
- Real employee/customer data processing: `WAITING_HUMAN`.
- Customer-specific HR/reporting boundaries: `WAITING_HUMAN`.
- Final financial correctness: `WAITING_HUMAN`.
- Reward economy and real fulfillment: `WAITING_HUMAN`.
- Support answer policy for sensitive topics: `WAITING_HUMAN`.
