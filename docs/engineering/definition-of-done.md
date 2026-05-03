# Definition of done

Эта проверка обязательна перед закрытием execution unit, sprint contract and PR.

## 1. Общие требования

Задача не считается завершённой, пока одновременно не выполнены:

- acceptance criteria закрыты and mapped to evidence;
- diff is focused and does not contain unrelated changes;
- relevant verification commands were run or limitations are explicit;
- fresh verifier pass is PASS, or non-pass status is honestly recorded;
- canonical docs are updated if behavior, contract, architecture, setup or workflow changed;
- human gates are represented with honest status.

## 2. Minimum for code changes

Expected minimum:

- `make verify`;
- relevant `make test-unit`;
- relevant `make build`.

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

- canonical docs updated;
- no contradiction with `AGENTS.md`, source-of-truth, stage docs and local `AGENTS.md`;
- diagrams updated when text alone is not enough;
- self-check run if harness files changed.

## 7. Final agent report

Include:

- what changed;
- where exactly;
- commands/tests run and outcomes;
- evidence artifacts;
- docs updated;
- remaining risks;
- human gates;
- latest verifier verdict.

## 8. `DONE_WITH_HUMAN_PENDING`

Use this when code/docs/content are ready and verified, but final human approval is required, for example legal copy, financial content, reward rules, pricing/paywall or partner operations.
