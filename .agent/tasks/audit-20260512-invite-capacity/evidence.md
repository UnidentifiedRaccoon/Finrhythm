# Evidence: P1 Invite issuance capacity

## Summary

Added an atomic capacity guard for invite-code batch issuance by locking the target `access_pools` row before counting existing `invite_codes` and before minting one-time raw codes.

## Changed files

- `apps/api/src/main/java/com/finrhythm/api/tenant/persistence/AccessPoolRepository.java`
- `apps/api/src/main/java/com/finrhythm/api/tenant/service/InviteCodeAccessService.java`
- `apps/api/src/test/java/com/finrhythm/api/tenant/service/InviteCodeAccessServiceIT.java`
- `.agent/tasks/audit-20260512-invite-capacity/spec_freeze.md`
- `.agent/tasks/audit-20260512-invite-capacity/evidence.md`

## Implementation evidence

- Added `AccessPoolRepository.lockById(...)` with `LockModeType.PESSIMISTIC_WRITE`.
- `InviteCodeAccessService.issueBatch(...)` now loads the access pool via the locking repository method inside the existing `@Transactional` boundary before `countByTenantIdAndAccessPoolId(...)`.
- Added `concurrentBatchIssuanceSerializesCapacityCheckBeforeMintingCodes`.
  - First batch pauses after passing capacity validation and before first raw code is returned.
  - Second batch is started while the first transaction holds the access-pool row lock.
  - Test asserts the second batch is still waiting and no additional raw code has been generated.
  - After releasing the first batch, exactly one batch succeeds, the other fails with `Invite batch exceeds access pool capacity.`, and persisted count remains `2` for capacity `3`.

## Verification

Environment:

- `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`
- `PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH`
- Java: OpenJDK `21.0.11` Homebrew
- PostgreSQL: Testcontainers `postgres:16-alpine`

Commands:

```bash
cd apps/api
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" \
./mvnw -q -Dit.test=InviteCodeAccessServiceIT verify
```

Result: PASS. `InviteCodeAccessServiceIT`: 6 tests, 0 failures, 0 errors.

```bash
cd apps/api
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" \
./mvnw -q verify
```

Result: PASS.

## Notes

- First Maven attempt without explicit `JAVA_HOME` failed because the shell could not locate a Java runtime. JDK 21 was present via Homebrew and subsequent runs used explicit Java 21.
- No API contract change.
- No Flyway migration needed.
- No changes to `AdminCodeStatusService` or expired-count behavior.
- No raw evidence was read.
