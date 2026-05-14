# Evidence: MVP-07-n1-readonly-resume-continuation-001

Latest evidence alias for the active sprint. Immutable refs:

- `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.md`
- `.agent/stages/mvp/evidence/MVP-07-n1-readonly-resume-continuation-001.json`

Status: `PASS_AFTER_FRESH_VERIFIER_PARENT_SYNC`
Functional passes: `true`
Builder checks: passed
Fresh verifier: `PASS`
Publish after pass: `true`, ready for post-PASS publish

Summary: mounted `/profile/session` now renders already-started N1 from generated `GET route-progress` plus generated `GET lesson detail` when route-progress says `RESUME_N1`, without calling generated `startLearningMeLesson` or `POST /api/v1/learning/me/lessons/N1/start`. `START_N1` first-start path remains working through the existing start mutation.

Key proof:

- Browser network summary: `.agent/stages/mvp/raw/builder-MVP-07-n1-readonly-resume-continuation-001-20260514/browser-smoke/MVP-07-n1-readonly-resume-continuation-001-browser-smoke.json`
- Read-only resume screenshot: `.agent/stages/mvp/raw/builder-MVP-07-n1-readonly-resume-continuation-001-20260514/browser-smoke/MVP-07-n1-readonly-resume-continuation-001-mobile-profile-session-diagnostic-n1-readonly-resume.png`
- Guardrails: `.agent/stages/mvp/raw/builder-MVP-07-n1-readonly-resume-continuation-001-20260514/guardrail-scans-2.txt`
- Fresh verifier verdict: `.agent/stages/mvp/verdicts/MVP-07-n1-readonly-resume-continuation-001.json`
- Fresh verifier problems: `.agent/stages/mvp/problems/MVP-07-n1-readonly-resume-continuation-001.md`
- Fresh verifier browser summary: `.agent/stages/mvp/raw/verifier-MVP-07-n1-readonly-resume-continuation-001-20260514-fresh/browser-smoke/MVP-07-n1-readonly-resume-continuation-001-verifier-browser-smoke.json`
- Fresh verifier read-only resume screenshot: `.agent/stages/mvp/raw/verifier-MVP-07-n1-readonly-resume-continuation-001-20260514-fresh/browser-smoke/MVP-07-n1-readonly-resume-continuation-001-verifier-mobile-profile-session-diagnostic-n1-readonly-resume.png`
- Full command refs and human gates are listed in the immutable evidence file above.

Latest verified sprint is now `MVP-07-n1-readonly-resume-continuation-001`; full MVP-06, full MVP-07, MVP stage and human gates remain open.
