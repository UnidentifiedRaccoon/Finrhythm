Spawn subagents. Используй $stage-launch-proof-loop для выполнения stage в этом репозитории.

Stage file: docs/stages/MVP.md
Stage ID: mvp

Профиль и политика:
- parent session и custom subagents: model `gpt-5.5`, reasoning `xhigh`;
- approval_policy должен оставаться `on-request`;
- держи shallow delegation: parent orchestrates, children are leaf roles;
- one sprint contract at a time.

Перед реализацией:
1. прочитай `AGENTS.md`;
2. прочитай `docs/architecture/source-of-truth.md`;
3. прочитай `docs/architecture/documentation-workflow.md`;
4. прочитай `docs/stages/MVP.md`;
5. проверь `.agent/stages/mvp/`, если она уже есть;
6. заморозь/обнови `stage_spec.md`, `backlog.md`, `feature_list.json`, `sprint_contract.md`.

Execution loop:
1. выбери следующий ready execution unit;
2. зафиксируй scope, acceptance criteria, non-goals, doc targets, human gates;
3. реализуй slice через integration builder and relevant domain workers;
4. собери `evidence.md`, `evidence.json` and raw outputs;
5. обнови canonical docs, если изменились behavior, architecture, workflow, setup or API contract;
6. запусти fresh verifier;
7. при FAIL используй minimal fixer and fresh verifier again;
8. обнови progress/decisions/risks/status.

Не объявляй stage or slice complete without proof. Human-gated items may only be `DONE_WITH_HUMAN_PENDING` or `WAITING_HUMAN` until human approval.
