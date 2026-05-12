# audit-20260512-expired-invites — scope freeze

Статус: DONE

## Issue

Admin code-status funnel занижает истечения, потому что истекший по времени invite code может оставаться в storage status `ISSUED`, а admin read model считает `expiredCount` только по persisted `EXPIRED`.

## Frozen scope

- Исправить только admin read model для code-status.
- Effective admin status: persisted `ISSUED` with `expires_at <= asOf` is reported and counted as `EXPIRED`.
- Storage lifecycle remains unchanged: no expiry job, no migration, no mutation of `invite_codes.status`.
- Apply effective status consistently to summary, `statusCounts`, rows and status filters.
- Add focused `AdminCodeStatusControllerIT` coverage.

## Out of scope

- Invite capacity lock implementation.
- Auth/security boundary changes.
- API contract shape changes or generated client updates.
- Stage aliases and `.agent/stages/**/raw/**`.

## Docs decision

Canonical docs were read for source-of-truth and doc-sync policy. No canonical doc update is planned because this is a bug fix inside the already documented privacy-safe admin code-status read boundary and does not add a new endpoint, DTO field, lifecycle transition, role, subscription or operating flow. This task evidence records the implementation decision.
