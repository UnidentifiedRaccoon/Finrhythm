# Token Mapping: MVP-04-design-system-tokenization-001

Source: `docs/product/b2b-mvp/lemanapro/design-system-v0.1.md`

Implementation target: `apps/web/app/globals.css`

## Color Tokens

| Design-system token | Code token | Value |
|---|---|---:|
| `color-bg-primary` | `--color-bg-primary` | `#F6FAFE` |
| `color-bg-soft` | `--color-bg-soft` | `#EEF7FF` |
| `color-surface-primary` | `--color-surface-primary` | `#FFFFFF` |
| `color-surface-blue` | `--color-surface-blue` | `#EAF5FF` |
| `color-primary` | `--color-primary` | `#1677F2` |
| `color-primary-hover` | `--color-primary-hover` | `#0F63D8` |
| `color-primary-soft` | `--color-primary-soft` | `#D8ECFF` |
| `color-cyan` | `--color-cyan` | `#2CC6D3` |
| `color-teal` | `--color-teal` | `#2BBFA5` |
| `color-mint` | `--color-mint` | `#E5F8F3` |
| `color-success` | `--color-success` | `#22B573` |
| `color-amber` | `--color-amber` | `#F5B942`; used for reward/points emphasis only |
| `color-purple-soft` | `--color-purple-soft` | `#F0ECFF` |
| `color-error-soft` / `color-error` | `--color-error-soft` / `--color-error` | soft error state only |
| `color-warning-soft` / `color-warning` | `--color-warning-soft` / `--color-warning` | safety warning state only |
| neutral palette | `--color-text-*`, `--color-border`, `--color-divider`, `--color-icon-default` | canonical neutral values |

## Layout And Control Tokens

- Typography: `--text-display-sm-*`, `--text-h1-*`, `--text-h2-*`, `--text-h3-*`, `--text-body-*`, `--text-caption-*`, `--text-button-*`.
- Spacing: `--space-2xs` through `--space-4xl`.
- Layout: `--screen-padding-mobile`, `--screen-padding-desktop`, `--card-padding-*`, `--section-gap`, `--component-gap`, `--bottom-nav-height`.
- Radius: `--radius-xs` through `--radius-2xl`, plus `--radius-round`.
- Shadows: `--shadow-card`, `--shadow-soft`, `--shadow-floating`, `--shadow-none`.
- Controls: `--button-*`, `--input-*`, `--choice-*`, `--focus-ring`.

## Component Mapping

- Primary CTA: `.primary-action`, `.state-link` use `--button-primary-*`.
- Secondary action: `.secondary-action` uses `--button-secondary-*`.
- Cards: hero, track, lesson rows, preview, lesson blocks and state panels use `--card-*`.
- Privacy/sensitive panels: `.privacy-card`, `.lesson-block-sensitive`, `.privacy-subpanel` use `--privacy-card-*`, `--color-mint`, `--color-teal`.
- Chips/badges/meta: `.demo-pill`, `.status-badge`, `.lesson-meta span`, `.preview-meta span`, `.block-type`, `.sensitive-pill`.
- Progress: `.stepper`, `.lesson-stepper`, `.route-progress` use primary, teal/mint and disabled/pale-blue states.
- Reward panel: `.reward-block`, `.reward-panel`, `.reward-points` use reward gradient and `--color-amber`; no money-equivalent claim.

## Package Decision

`packages/ui` is still empty except `.gitkeep`, so this slice keeps the minimal token layer in `apps/web/app/globals.css` instead of creating a premature shared package/component library.
