# Evidence: repo-rename-finpulse

Status: `VERIFIED`
Date: 2026-05-11
Scope: переименование GitHub-репозитория, обновление локального remote URL и узкий documentation sync. В этом slice не выполнялась миграция production code namespace, Java package, database, API или UI.

## Objective

Переименовать repository identity с `Finrhythm` / `FinRhythm` на `FinPulse`, сохранив текущие runnable technical identifiers до отдельной code namespace migration.

## Changes

- GitHub repository переименован в `UnidentifiedRaccoon/FinPulse`.
- Local `origin` remote обновлен на `https://github.com/UnidentifiedRaccoon/FinPulse.git`.
- `README.md` фиксирует checkout/repository как `FinPulse` и явно указывает, что `finrhythm` / `FINRHYTHM_*` остаются текущими technical identifiers.
- `docs/setup/codex-setup.md` фиксирует ту же границу technical namespace рядом с admin commands.
- `docs/product/b2b-mvp/lemanapro/content-mvp-spec-v0.1.md` использует product naming `FinPulse / FinLit` и обновленные raw GitHub source URLs.

## Checks run

| Command | Result |
| --- | --- |
| `gh api -X PATCH repos/UnidentifiedRaccoon/Finrhythm -f name=FinPulse --jq '{name: .name, full_name: .full_name, html_url: .html_url}'` | PASS |
| `git remote set-url origin https://github.com/UnidentifiedRaccoon/FinPulse.git` | PASS |
| `gh repo view UnidentifiedRaccoon/FinPulse --json name,nameWithOwner,url,viewerPermission` | PASS |
| `git remote -v` | PASS |
| `rg -n "github\\.com/UnidentifiedRaccoon/Finrhythm|raw\\.githubusercontent\\.com/UnidentifiedRaccoon/Finrhythm|FinRhythm|Finrhythm" --glob '*.md' --glob '*.mdx' --glob '!**/raw/**' .` | PASS, stale public markdown references не найдены |
| `git diff --check` | PASS |

## Limitations

- Existing code/config identifiers вроде `com.finrhythm`, `@finrhythm/admin`, `FINRHYTHM_*`, Docker/database names и admin UI title не мигрировались в этом slice.
- GitHub сохраняет redirects со старого repository path; запрос к `UnidentifiedRaccoon/Finrhythm` может все еще резолвиться в `UnidentifiedRaccoon/FinPulse`.
