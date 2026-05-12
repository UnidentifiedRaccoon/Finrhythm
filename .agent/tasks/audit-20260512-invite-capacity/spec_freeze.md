# Audit issue: P1 Invite issuance capacity

## Scope

- Fix only `InviteCodeAccessService.issueBatch` capacity enforcement for concurrent batch issuance.
- Prefer row-level locking on `access_pools`.
- Add a focused concurrency integration test in `InviteCodeAccessServiceIT`.
- Record evidence under `.agent/tasks/audit-20260512-invite-capacity/`.

## Non-goals

- No API contract changes.
- No schema redesign or idempotency-key model in this slice.
- No changes to `AdminCodeStatusService` or expired-count behavior.
- No raw stage evidence reads.
- No child agents.

## Acceptance

- Concurrent batch issuance for one access pool is serialized before the capacity count.
- A losing concurrent batch must fail before minting additional raw codes when capacity is exhausted.
- Persisted invite count must not exceed `access_pools.capacity`.
- Focused Maven IT passes.
- Backend verify is attempted with Java 21 baseline and result recorded.
