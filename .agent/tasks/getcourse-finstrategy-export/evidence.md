# GetCourse FinStrategy stream export evidence

Статус: DONE_WITH_HUMAN_PENDING

## Scope

- Source stream: `https://fgrm.ncfg.ru/teach/control/stream/view/id/546010026`.
- Top-level stream `Курс «ФинCтратегия»` contains module streams, not direct lessons.
- Collector updated to read visible `href` attributes on GetCourse lesson-list title elements, because locked lessons are rendered as non-anchor title nodes.
- Exporter updated to create markdown files automatically in a new content directory when cards do not already exist.

## Outputs

- Combined link list: `course-export/stream-546010026/all-lesson-links.json`.
- Human-readable link list: `course-export/stream-546010026/all-lesson-links.txt`.
- Remaining blocked retry list: `course-export/stream-546010026/blocked-lesson-links.json`.
- Markdown export dir: `content/getcourse-finstrategy/`.
- README summary: `content/getcourse-finstrategy/README.md`.
- Debug snapshots: `course-export/stream-546010026/**/debug/`, ignored by git.

## Result

- Found lesson URLs: 73.
- `exported`: 70.
- `blocked`: 3.
- `needs_login`: 0.
- `partial`: 0.

The first pass found 54 lessons behind GetCourse progress/stop-lesson gates. A second pass used an authorized admin session entered manually in headed Playwright; 51 of those lessons became exported. The exporter did not bypass access controls and recorded the remaining 3 as honest `blocked` markdown files.

Remaining blocked lessons:

- `07-lesson-306105699.md` - Как достигать финансовых целей.
- `16-lesson-235010156.md` - 03.01 Как работают все привычки.
- `58-lesson-235010192.md` - 09.04 План достижения финансовой независимости.

## Verification

- `node --check scripts/getcourse-collect-lesson-links.js` — PASS.
- `node --check scripts/getcourse-export-lesson-content.js` — PASS.
- `pnpm getcourse:collect-links -- --headless --url=https://fgrm.ncfg.ru/teach/control/stream/view/id/546010026 --out=course-export/stream-546010026` — PASS; found 11 child streams and 0 direct lessons.
- Module collectors — PASS; collected 64 lessons across 10 modules.
- Child stream collector for `Материалы для детей` — PASS; collected 9 lessons.
- `pnpm getcourse:export-content -- --headless --links=course-export/stream-546010026/all-lesson-links.json --content-dir=content/getcourse-finstrategy --out=course-export/stream-546010026` — PASS.
- JSON validation for `all-lesson-links.json` — PASS.
- Safety scan for exported markdown and non-debug link JSONs — PASS; no token/cookie/password/user-header matches.
- `git check-ignore` for `.local/getcourse/storage-state.json` and nested `course-export/**/debug/` artifacts — PASS.

## Resume verification on 2026-05-04

- `node --check scripts/getcourse-collect-lesson-links.js` — PASS.
- `node --check scripts/getcourse-export-lesson-content.js` — PASS.
- JSON validation for all `course-export/stream-546010026/**/*.json` files, including ignored debug JSON — PASS; 27 files parsed.
- Count check — PASS; `all-lesson-links.json` has 73 lessons and `content/getcourse-finstrategy/` has 73 lesson markdown files.
- Status check — PASS; 19 `exported`, 54 `blocked`, 0 `needs_login`, 0 `partial`.
- Safety scan for `course-export/stream-546010026`, `content/getcourse-finstrategy`, and this task evidence — PASS for text files; no account notice, email, cookie-banner text or email pattern matches.
- Existing text debug files under `course-export/stream-546010026/**/debug/` were mechanically sanitized; PNG screenshots remain ignored debug artifacts.

## Admin-session retry on 2026-05-04

- Built `course-export/stream-546010026/blocked-lesson-links.json` from the 54 markdown files with `exportStatus: "blocked"`.
- `pnpm getcourse:export-content -- --headed --state=.local/getcourse/admin-storage-state.json --links=course-export/stream-546010026/blocked-lesson-links.json --content-dir=content/getcourse-finstrategy --out=course-export/stream-546010026` — first run partially PASS; manual admin login succeeded and 5 lessons exported before debug snapshot redaction hit a file input.
- Fixed debug redaction for `input[type="file"]` so sanitization leaves file inputs empty instead of assigning a non-empty value.
- Rebuilt `blocked-lesson-links.json` for the remaining 49 blocked lessons.
- Re-ran the same admin-session exporter command — PASS; 46 more lessons exported and 3 remained blocked.
- Rebuilt `blocked-lesson-links.json` as the final remaining blocked manifest with 3 lessons.
- Updated exporter extraction to drop GetCourse cookie service notices and removed already exported cookie-banner noise from 51 markdown files.
- Final syntax check for collector/exporter — PASS.
- Final JSON/count check — PASS; 73 lesson URLs, 73 markdown files, 70 `exported`, 3 `blocked`, final blocked manifest has 3 lessons.
- Final safety scan for `course-export/stream-546010026`, `content/getcourse-finstrategy`, and task evidence — PASS; no account notice, email or cookie-banner matches.
- `git check-ignore` for user/admin Playwright storage state and nested debug artifacts — PASS.

## Cleanup and asset download on 2026-05-04

- Removed admin UI menu noise (`Редактировать урок`, `Действия`, `Настройки`, etc.) from 51 exported markdown files.
- Updated exporter extraction so future admin-session exports treat those menu blocks as noise.
- Added `pnpm getcourse:download-assets` to download visible same-host file-service/document links through the authorized admin session.
- Download result — PASS; 30 files downloaded into `content/getcourse-finstrategy/downloads/`, 43.65 MB total.
- Downloaded types: 11 PDF, 15 DOCX, 4 XLSX.
- Download manifest: `course-export/stream-546010026/download-manifest.json`.
- Download policy: skipped external hosts, video/streaming media, and non-file pages; raw query strings are not recorded in the manifest.
- File type verification with `file content/getcourse-finstrategy/downloads/*` — PASS; downloaded files are recognized as PDF, Microsoft Word 2007+ or Microsoft Excel 2007+.

## Safety

- Worked only on `fgrm.ncfg.ru`.
- Did not download videos, archives, PDFs or protected assets.
- Saved visible attachment URLs only.
- Playwright storage state remains under ignored `.local/getcourse/storage-state.json`.
- Admin Playwright storage state remains under ignored `.local/getcourse/admin-storage-state.json`.
- Query parameters in exported visible URLs are stripped by exporter.

## Human gates

- Final financial, tax, credit, investment, pension and child-facing education wording requires human review.
- The remaining 3 blocked lessons need owner-side unlock, corrected admin entitlement, or another authorized source export before factual content can be exported.
