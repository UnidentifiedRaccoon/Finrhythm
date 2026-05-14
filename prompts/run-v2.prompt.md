Используй $stage-launch-proof-loop для выполнения stage в этом репозитории. Use subagents only when the slice risk/ambiguity needs them.

Stage file: docs/stages/v2.md
Stage ID: v2

Профиль и политика:
- parent session и custom subagents: model `gpt-5.5`, reasoning `xhigh`;
- approval_policy должен оставаться `on-request`;
- держи shallow delegation: parent orchestrates, children are leaf roles;
- сначала классифицируй slice as Tier C/B/A;
- one sprint contract at a time.

Перед реализацией:
1. прочитай `AGENTS.md`;
2. прочитай `docs/architecture/source-of-truth.md`;
3. прочитай `docs/architecture/documentation-workflow.md`;
4. прочитай linked product foundation `docs/product/b2b-mvp/lemanapro/product-foundation-v1.md`, если нет более нового product baseline;
5. прочитай `docs/stages/v2.md`;
6. проверь `.agent/stages/v2/`, если она уже есть;
7. заморозь/обнови `stage_spec.md`, `backlog.md`, `feature_list.json`, `sprint_contract.md` only when Tier A or ambiguous Tier B scope requires it.

Product baseline:
- B2B pilot/rollout baseline already belongs to MVP/v1;
- v2 enterprise work means self-service multi-tenant maturity, SSO/SCIM and advanced platform capabilities;
- do not treat basic B2B pilot launch as deferred to v2.

Execution loop:
1. выбери следующий ready execution unit;
2. зафиксируй scope, acceptance criteria, non-goals, doc targets, human gates by tier;
3. реализуй slice через integration builder and relevant domain workers;
4. собери compact/full evidence by tier; raw outputs stay ignored and are read by exact ref only;
5. обнови canonical docs only if public API, schema, security/privacy boundary, legal/financial/product policy, stage scope, setup/developer workflow or reusable operating contract changed;
6. запусти fresh verifier for Tier A/stage-close; for Tier B/C use focused tests and compact independent proof unless risk escalates;
7. при FAIL используй minimal fixer and fresh verifier again when required by tier;
8. обнови progress/decisions/risks/status only when handoff needs them.

Post-PASS publish:
1. do not set `publish_after_pass=true` or `merge_after_pr=true` unless the user/stage prompt explicitly asks to publish;
2. if publish is requested, prepare compact publish proof in `publish_manifest.json` or PR body and invoke repo-local `$push-main` for publish-only flow по verified slice;
3. если `$push-main` сообщает blocker по checks/protection/permissions/conflicts, зафиксируй blocker and stop after the last successful publish step;
4. в финальном ответе напечатай следующий copyable continuation prompt only when continuation handoff was requested.

Не объявляй stage or slice complete without proof. Human-gated items may only be `DONE_WITH_HUMAN_PENDING` or `WAITING_HUMAN` until human approval.
