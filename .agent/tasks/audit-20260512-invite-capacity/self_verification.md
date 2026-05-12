# Self-verification: P1 Invite issuance capacity

## Verdict

PASS

## Checks

- `issueBatch` now locks the target `access_pools` row inside the existing transaction before capacity count and invite insertion.
- Concurrent test proves the second batch waits before raw code generation while the first batch holds the lock.
- After lock release, one batch succeeds and one batch fails on capacity; persisted invite count does not exceed capacity.
- No API, Flyway, admin status, or expired-count files were changed.

## Commands

- `cd apps/api && JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" ./mvnw -q -Dit.test=InviteCodeAccessServiceIT verify`
- `cd apps/api && JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" ./mvnw -q verify`
