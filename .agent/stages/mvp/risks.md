# MVP risks

Updated: 2026-05-06

| ID | Risk | Status | Mitigation |
|----|------|--------|------------|
| R-001 | Custom stage subagents may remain unavailable in the current runtime. | Resolved for current session | Removed unsupported fixed service tier; fresh verifier spawned and returned `PASS`. |
| R-002 | Docker daemon is not running, so live `make init` and `make dev` cannot prove PostgreSQL startup in this session. | Resolved for current session | Docker Desktop was started; live `make dev`, first `make init` and idempotent second `make init` raw outputs are recorded. |
| R-003 | Java runtime is not installed on host. | Resolved for current slice | User-scoped Temurin JDK 21.0.11 is available; `java -version` and Maven Wrapper proof are recorded in current MVP-02 raw evidence. |
| R-004 | Bootstrap currently validates synthetic fixture metadata, not domain table imports. | Accepted for MVP-01 | Domain seed import becomes enforceable after MVP-02/API schema creates tenant/cohort/invite/reward tables. |
| R-005 | Human-gated reward/legal/content decisions are not approvable by agent. | Ongoing | No human-gated wording or real reward operations were marked DONE in this slice. |
| R-006 | First MVP-02 slice could expand into activation, registration or admin UI. | Active | `MVP-02-tenant-domain-001` explicitly excludes those flows and limits builder acceptance to backend/domain bootstrap. |
| R-007 | Backend PASS could be claimed without real Java/Maven proof. | Resolved for current slice | Builder and fresh verifier recorded Java/Maven proof, backend commands and Testcontainers verification before `MVP-02-tenant-domain-001` was marked PASS. |
| R-008 | Maven Wrapper is absent under `apps/api`, so backend package checks cannot run. | Resolved for current slice | Maven Wrapper was added under `apps/api`; `./mvnw -q test`, `./mvnw -q verify`, root `make verify`, `make test-unit` and `make build` passed. |
| R-009 | Harness legacy-token scan can produce false positives from local dependencies or stage proof artifacts. | Resolved for current slice | `stage_fixer` scoped the scan away from `.agent`, dependency directories and generated outputs; fresh verifier after fixer recorded `make verify` PASS. |
| R-010 | Builder evidence may be mistaken for final verification. | Resolved for current slice | Fresh `stage_verifier` returned `PASS`; status now distinguishes completed `MVP-02.01` from still-open `MVP-02.02` / `MVP-02.03` / `MVP-02.04`. |
| R-011 | Invite issuance can accidentally persist raw invite codes in DB/logs/evidence. | Resolved for current slice | Fresh verifier raw-code scan and DB column tests found no raw/plain invite-code persistence; raw codes are one-time issuance output only. |
| R-012 | Invite activation can race and bind one code to multiple users. | Resolved for current slice | Fresh verifier accepted PostgreSQL/Testcontainers concurrency proof: one different-subject activation binds; same-subject retry is idempotent. |
| R-013 | MVP-02.02 could silently expand into registration, public API or admin UI. | Resolved for current slice | Fresh verifier scope guardrail scan found no contact fields, REST/OpenAPI/controller surface, generated client, HR report or UI changes. |
| R-014 | Builder evidence could be mistaken for final sprint completion. | Resolved for current slice | Durable `verdict.json`/`problems.md` record fresh verifier PASS for `MVP-02-invite-issuance-activation-001`; only `MVP-02.02` is marked complete. |
| R-015 | MVP-02.03 registration could introduce personal/contact data before privacy and API boundaries are frozen. | Active for next slice | Next step must freeze a narrow `MVP-02.03` contract before implementation, including explicit contact-field, consent/privacy and API/client evidence requirements. |
| R-016 | Content spec ingestion could be mistaken for final content approval. | Active until human review | `content-mvp-spec-v0.1.md`, harness evidence and status artifacts mark the document as `draft_with_human_gates`; `MVP-05.01` through `MVP-05.05` remain open. |
| R-017 | Imported raw GetCourse content could carry unreviewed financial, customer-specific or legally sensitive claims into production. | Ongoing | `CONTENT_BRIEF.md` remains raw baseline only; production source of truth stays CMS/PostgreSQL, and final lesson/question/challenge publication requires human review. |
