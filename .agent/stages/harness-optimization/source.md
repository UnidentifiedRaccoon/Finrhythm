# Source: harness-optimization

This harness-only stage was created from the user request on 2026-05-08 to optimize the repo-local FinLit stage harness without weakening proof-loop, evidence, fresh verifier or doc-sync rules.

Primary inputs:

- user-provided harness optimization recommendations;
- `AGENTS.md`;
- `docs/architecture/source-of-truth.md`;
- `docs/architecture/documentation-workflow.md`;
- `.agents/skills/stage-launch-proof-loop/SKILL.md`;
- `.agents/skills/stage-launch-proof-loop/references/ARTIFACTS.md`;
- `.agents/skills/stage-launch-proof-loop/references/PROTOCOL.md`;
- `.agents/skills/stage-launch-proof-loop/scripts/verify_harness.py`;
- current `.agent/stages/mvp` artifacts.

The itemized recommendation list and coverage decision for this slice are preserved in `recommendation_coverage.md`.

This is not a product stage and does not change MVP scope or human gates.
