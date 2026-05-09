# Risks: harness-optimization

| Risk | Status | Mitigation |
|---|---|---|
| Legacy `feature_list.json` entries still include mutable latest verifier refs for older MVP-02 criteria. | OPEN_FOLLOW_UP | Current latest consistency is fixed; migrate legacy refs only where reliable historical verifier artifacts are available. |
| Root `AGENTS.md` still contains detailed repo/stack policy. | OPEN_FOLLOW_UP | Slim to router/non-negotiables in a separate docs policy slice. |
| Full contract archive semantics are not implemented. | OPEN_FOLLOW_UP | Verifier now rejects active sprint ids on passed stages; moving closed `sprint_contract.md` aliases into a contracts archive remains a separate migration. |
| Java-backed `make verify` cannot run in the current shell. | ACCEPTED_ENV_LIMITATION | Fresh verifier recorded `java -version` blocker; this slice has no backend/API/schema/runtime scope. |
