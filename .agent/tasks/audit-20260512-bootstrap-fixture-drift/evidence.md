# audit-20260512-bootstrap-fixture-drift

Статус: PASS
Issue: P2 Bootstrap fixture drift

## Scope

Исправлен только drift в bootstrap fixture: `content/fixtures/demo-bootstrap.json` больше не использует `cohorts`/`wave`, а отражает активную модель `tenant/pilotLaunch/accessPool/invite`.

Не трогал:

- `.agent/stages/**/raw/**`;
- stage aliases;
- `Makefile`;
- production CMS/PostgreSQL import implementation.

## Changed Files

- `content/fixtures/demo-bootstrap.json` — миграция synthetic access fixture на `pilotLaunches`, `accessPools`, `accessPoolKey`.
- `scripts/verify-bootstrap.mjs` — focused guard для active shape, связей `accessPool -> pilotLaunch`, `inviteCode -> accessPool` и запрет legacy `cohort`/`wave` в ключах/строках fixture.
- `scripts/init/version.json` — bump `local_init` версии/checksum из-за seed-contract change.
- `docs/architecture/init-and-dev-contract.md` — узкая фиксация bootstrap fixture contract и guard.

## Verification

```text
node scripts/verify-bootstrap.mjs
PASS
```

Ключевые PASS checks:

- `fixture-active-access-shape`;
- `fixture-no-legacy-access-terms`;
- `fixture-access-pool-launch-links`;
- `fixture-invite-access-pool-links`.

```text
rg -n "cohort|wave" content/fixtures/demo-bootstrap.json scripts/verify-bootstrap.mjs docs/architecture/init-and-dev-contract.md scripts/init/version.json
PASS: matches only in the intentional guard/doc wording; no matches in content/fixtures/demo-bootstrap.json.
```

```text
git diff --check -- content/fixtures/demo-bootstrap.json scripts/verify-bootstrap.mjs scripts/init/version.json docs/architecture/init-and-dev-contract.md
PASS
```

## Human Gate

Фикстура остаётся synthetic demo data. Я не заявляю human approval для production/public copy, legal text, financial correctness или real reward operations.

Blockers: none.
