# audit-20260512-expired-invites — evidence

Статус: DONE

## Summary

Исправлен admin code-status read model для истекших по времени invite codes без изменения storage lifecycle:

- persisted `ISSUED` + `expires_at <= asOf` отображается как effective `EXPIRED`;
- computed status применяется к `summary.expiredCount`, `statusCounts`, rows and status filters;
- persisted `invite_codes.status` не мутируется;
- expiry job, migration and API DTO changes не добавлялись.

## Files

- `apps/api/src/main/java/com/finrhythm/api/admin/service/AdminCodeStatusService.java`
- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/InviteCodeRepository.java`
- `apps/api/src/test/java/com/finrhythm/api/admin/AdminCodeStatusControllerIT.java`
- `.agent/tasks/audit-20260512-expired-invites/spec_freeze.md`
- `.agent/tasks/audit-20260512-expired-invites/evidence.md`
- `.agent/tasks/audit-20260512-expired-invites/evidence.json`

## Verification

JDK used:

```bash
/opt/homebrew/opt/openjdk@21/bin/java -version
```

Result: OpenJDK 21.0.11 Homebrew.

Focused IT:

```bash
cd apps/api
JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q -Dtest=AdminCodeStatusControllerIT test
```

Result: PASS. `AdminCodeStatusControllerIT`: 7 tests, 0 failures, 0 errors, 0 skipped.

Full backend verification:

```bash
cd apps/api
JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH ./mvnw -q verify
```

Result: PASS. Failsafe/Testcontainers suites passed:

- `AdminCodeStatusControllerIT`: 7 tests, 0 failures, 0 errors, 0 skipped;
- `TenantPersistenceIT`: 7 tests, 0 failures, 0 errors, 0 skipped;
- `InviteCodeAccessServiceIT`: 6 tests, 0 failures, 0 errors, 0 skipped;
- `EmployeeRegistrationControllerIT`: 6 tests, 0 failures, 0 errors, 0 skipped;
- `LegalDocumentAcceptanceControllerIT`: 5 tests, 0 failures, 0 errors, 0 skipped.

Diff whitespace check:

```bash
git diff --check -- apps/api/src/main/java/com/finrhythm/api/admin/service/AdminCodeStatusService.java apps/api/src/main/java/com/finrhythm/api/tenant/persistence/InviteCodeRepository.java apps/api/src/test/java/com/finrhythm/api/admin/AdminCodeStatusControllerIT.java .agent/tasks/audit-20260512-expired-invites
```

Result: PASS.

## Notes

- Initial attempt with `/usr/libexec/java_home -v 21` failed because macOS `java_home` did not locate a runtime in this environment. The stuck shim process was stopped and checks were rerun with the Homebrew JDK 21 path.
- No `.agent/stages/**/raw/**` files were read.
- Existing unrelated worktree changes, including admin auth/security and invite capacity work, were not reverted.
- Canonical docs were not changed: this slice fixes behavior inside the existing privacy-safe admin code-status read boundary and does not alter DTO shape, endpoint shape, lifecycle storage or access model.
