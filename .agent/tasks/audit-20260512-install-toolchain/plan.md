# Audit 2026-05-12: P2 Install/toolchain

## Заморозка scope

- Issue: `make install` ставил только JS-зависимости и не проверял Java/Corepack readiness, поэтому fresh setup мог ломаться позже на `verify` или `init`.
- In scope: `Makefile` install/help, toolchain readiness script, bootstrap self-check wiring, узкие setup docs, task evidence.
- Out of scope: stage aliases, approval policy, destructive commands, child agents, API client/shared package implementation, `.agent/stages/**/raw/**`.

## План

1. Добавить non-destructive toolchain readiness script для Node.js, Corepack, pinned `pnpm`, Java 21 и API Maven Wrapper files.
2. Запустить скрипт перед `pnpm install --frozen-lockfile` и обновить `make help`.
3. Расширить `scripts/verify-bootstrap.mjs`, чтобы bootstrap verification защищал install readiness wiring.
4. Синхронизировать README и `docs/architecture/init-and-dev-contract.md` с новым install contract.
5. Проверить script syntax, install dry-run, actual readiness, bootstrap verification, scoped whitespace checks и записать evidence.
