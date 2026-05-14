# Definition of done

Эта проверка обязательна перед закрытием execution unit, sprint contract and PR.

## 1. Общие требования

Задача не считается завершённой, пока одновременно не выполнены:

- acceptance criteria закрыты and mapped to evidence;
- diff is focused and does not contain unrelated changes;
- relevant verification commands were run or limitations are explicit;
- Tier A/stage-close fresh verifier pass is PASS, or non-pass status is honestly recorded;
- Tier B/C have focused test evidence and compact proof unless risk escalates;
- canonical docs are updated if public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract changed;
- human gates are represented with honest status.

## 1.1 Risk tiers

- Tier C: low-risk code-first UI/copy/test/refactor/component behavior without API/schema/security/privacy/legal/financial/content-publish/reward/admin-sensitive/access-control impact.
- Tier B: integration work across web/API/client or endpoints without regulated boundary changes.
- Tier A: schema, auth/session/access, diagnostics scoring, HR/privacy/reporting, legal/financial wording, content/CMS publish approval, points/rewards/redemption, real data, destructive admin or production operations.

## 2. Minimum for code changes

Expected minimum for Tier A or pre-merge full validation:

- `make verify`;
- relevant `make test-unit`;
- relevant `make build`.

For Tier C/B, run affected package/Maven/browser checks first. Root `make build` is not required unless CI/pre-merge policy, changed scope or reviewer asks for it.
Useful focused wrappers: `make proof-lite`, `make verify-web`, `make verify-api`. Use `make verify-full`/`make verify` for Tier A or pre-merge full validation.

For backend/API/schema changes, include relevant Maven command evidence, for example:

```bash
cd apps/api && ./mvnw verify
```

If the repository does not yet have wrappers, record exact available package/Maven commands and create wrappers in the appropriate bootstrap slice.

## 3. User-facing changes

- browser smoke or `make test-e2e` for the changed scenario;
- screenshot evidence for key states;
- note any public wording changes and human-gate status.

## 4. Backend/schema/API changes

- migration notes;
- OpenAPI contract notes;
- generated client regeneration notes if API contract changed;
- Testcontainers/integration test evidence for critical flows when available;
- explicit idempotency/auditability notes for points, redemption, support, CMS publishing and jobs.

## 5. Content/CMS changes

- affected entities/IDs;
- preview/admin screenshots when useful;
- wording review status;
- unresolved legal/content caveats;
- human sign-off requirement.

## 6. Docs/workflow changes

- canonical docs updated when the changed decision has a canonical owner;
- no contradiction with `AGENTS.md`, source-of-truth, stage docs and local `AGENTS.md`;
- product foundation docs and stage docs are synchronized when product intent changed;
- diagrams updated when text alone is not enough;
- self-check run if harness files changed.

## 7. B2B/privacy/reporting/reward changes

Expected minimum for B2B-first MVP and later corporate rollout slices:

- tenant/pilot-launch/access-pool/invite-code assumptions and edge cases recorded;
- HR/sponsor reporting visibility mapped to privacy model;
- anonymity thresholds, role access and admin audit implications tested or explicitly limited;
- merch/order/operator export flows include points ledger and refund/idempotency notes;
- real customer, real employee data and real fulfillment operations have human-gate status.

## 8. Final agent report

Include:

- what changed;
- where exactly;
- commands/tests run and outcomes;
- evidence artifacts;
- docs updated;
- remaining risks;
- human gates;
- latest verifier verdict.

## 9. `DONE_WITH_HUMAN_PENDING`

Use this when code/docs/content are ready and verified, but final human approval is required, for example legal copy, financial content, reward rules, pricing/paywall or partner operations.
