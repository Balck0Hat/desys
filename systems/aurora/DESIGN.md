# Aurora — design system spec

> Calm, product-grade SaaS UI. Indigo on cool slate. Depth comes from borders, not shadows.
> This file is the source of truth for UI decisions. The global frontend rules
> (`~/.claude/rules/frontend.md`) still apply; where they conflict, this file wins.

## 1. Identity

- **Personality:** focused, quiet, precise. A well-run cockpit, not a brochure.
- **Best for:** SaaS dashboards, B2B tools, developer products, admin panels.
- **The one memorable thing:** a single *aurora band* — a `135deg` gradient from
  `primary-600` to `secondary-500` — used **once per page**: the page/hero header
  background on marketing pages, or the primary CTA on a landing page.
  Never on cards, never as gradient text, never twice on one screen.
- **Everything else is flat.** White surfaces, hairline `edge` borders, slate text.

## 2. Hard rules

1. Only semantic utilities from `tokens.json`: `bg-primary-600`, `bg-surface`, `text-fg`, `border-edge`.
   Never `bg-indigo-500`, never a hex in a component.
2. Depth = borders. Shadows only on floating layers: `shadow-md` dropdowns/popovers, `shadow-lg` modals.
3. No per-card hover lift, no fade-up on every section. Motion answers a user action.
4. Sentence case everywhere. No all-caps labels, no tracked-out eyebrows, no numbered 01/02/03 markers unless it is a real sequence.
5. One font family (Manrope). Two weights per surface: 400 body + 600/700 headings.
6. Status colours (`success/warning/error/info`) mean status. Never decorative.
7. Dark mode swaps surface tokens; brand scale steps stay the same (600 fill, 400 text on dark).

## 3. Colour

| Role | Light | Dark | Use |
|---|---|---|---|
| Page background | `bg-surface` (#ffffff) | neutral-950 | Main canvas |
| Muted areas | `bg-surface-muted` (neutral-50) | neutral-900 | Sidebar, table headers, code |
| Cards / panels | `bg-surface-elevated` | neutral-900 | With `border-edge` |
| Borders | `border-edge` (neutral-200) | neutral-800 | `border-edge-strong` for hover/active |
| Body text | `text-fg` (neutral-900) | neutral-50 | |
| Secondary text | `text-fg-secondary` (neutral-600) | neutral-300 | Labels, descriptions |
| Muted text | `text-fg-muted` (neutral-500) | neutral-400 | Captions, placeholders |
| Action | `bg-primary-600` → hover `700` → active `800` | same steps | Buttons, toggles |
| Links | `text-primary-700` | `text-primary-400` | Underline on hover only |
| Selected / active nav | `bg-primary-50 text-primary-700` | `bg-primary-950 text-primary-300` | 2px start bar in `primary-600` |
| Focus ring | `ring-2 ring-focus ring-offset-2 ring-offset-surface` | | On every interactive element |

- Secondary (violet) appears only inside the aurora band and as the second series in charts.
- Status badges: `bg-{status}-50 text-{status}-700` light, `bg-{status}-950 text-{status}-300` dark.

## 4. Typography — Manrope

| Token | Size / line | Weight | Notes |
|---|---|---|---|
| display | 48 / 56 | 800 | `tracking-tight` (-0.02em). Marketing only. |
| h1 | 36 / 40 | 700 | Page title. One per page. |
| h2 | 30 / 36 | 700 | |
| h3 | 24 / 32 | 600 | Card and section titles |
| h4 | 20 / 28 | 600 | |
| body | 16 / 26 | 400 | Default. `max-w-prose` (65ch). |
| small | 14 / 20 | 400–500 | Table cells, form labels (500) |
| caption | 12 / 16 | 500 | Timestamps, helper text in `text-fg-muted` |

Numbers in tables and KPIs: `tabular-nums`, aligned to the end.

## 5. Shape, depth, spacing

- Radius: `rounded-md` (8) buttons/inputs/badges-with-icon · `rounded-lg` (12) cards, popovers · `rounded-xl` (16) modals, drawers · `rounded-full` avatars, pills, toggles.
- Borders: 1px `border-edge` on every card, input, table. Hover on interactive cards → `border-edge-strong` + `shadow-sm`.
- Spacing rhythm: 4-based. Card padding `p-6` (`p-4` on mobile). Stack gap `gap-4` in forms, `gap-6` between cards, `gap-8`/`gap-12` between app sections, `py-24`/`py-32` between marketing sections.
- Layout: `max-w-container` (1280) centred, `px-4 md:px-6 lg:px-8`. Dashboard = sidebar 256px + content. 12-col grid, `gap-6`. Content aligned to start; centre only hero headlines.

## 6. Motion

- Enter `duration` (200ms) `ease-out`; exit `duration-fast` (150ms) `ease-in`. Only `opacity` and `transform`.
- One orchestrated moment per page: the page header fades in on load. Nothing else animates on load.
- Hover feedback = colour/border change, never scale or lift. Skeletons `animate-pulse` in `bg-surface-muted`.
- Wrap in `motion-safe:`.

## 7. Components (deltas from the global rules)

- **Button** — sizes sm `h-9 px-4 text-sm` · md `h-11 px-5` · lg `h-12 px-6 text-base`; `rounded-md font-semibold`.
  primary `bg-primary-600 text-fg-inverse hover:bg-primary-700 active:bg-primary-800` ·
  secondary `bg-surface border border-edge text-fg hover:bg-surface-muted` ·
  ghost `text-fg-secondary hover:bg-surface-muted hover:text-fg` · danger `bg-error-600 text-white hover:bg-error-700`.
  Loading: spinner replaces the start icon, label stays, width locked.
- **Input** — `h-11 rounded-md border border-edge bg-surface px-3 text-fg placeholder:text-fg-muted focus:ring-2 focus:ring-focus`.
  Label above: `text-sm font-medium text-fg-secondary`. Error: `border-error-500` + `text-sm text-error-600` below.
- **Card** — `rounded-lg border border-edge bg-surface-elevated p-6`. No shadow. Title h3, optional description `text-fg-secondary`.
- **Top nav** — `h-16 border-b border-edge bg-surface/80 backdrop-blur` sticky `z-sticky`.
- **Sidebar** — `w-64 bg-surface-muted border-e border-edge`; items `h-10 rounded-md px-3 text-sm`; active state per colour table.
- **Table** — header `bg-surface-muted text-xs font-semibold text-fg-secondary h-10` sticky; rows `h-12 border-b border-edge hover:bg-surface-muted`.
- **Badge** — `rounded-full px-2.5 py-0.5 text-xs font-medium` with status tints above. Dot variant for tables.
- **Dropdown / popover** — `rounded-lg border border-edge bg-surface-elevated shadow-md p-1`; items `h-9 rounded-md px-2`.
- **Modal** — `rounded-xl bg-surface-elevated shadow-lg max-w-lg p-6`; backdrop `bg-neutral-950/40 backdrop-blur-sm`.
- **Toast** — `rounded-lg border border-edge bg-surface-elevated shadow-lg p-4` with a status icon at the start.
- **Empty state** — icon in a `size-12 rounded-full bg-primary-50 text-primary-600` circle, one-line title (h4), one-line help, one primary button.
- **KPI tile** — label `text-sm text-fg-secondary`, value `text-3xl font-bold tabular-nums`, delta with icon + sign + colour.

## 8. Icons, imagery, charts

- Lucide, `size-5` (20px) stroke 1.75 default; `size-4` in dense tables and badges. Always `currentColor`.
- Illustrations: flat, two-tone (`primary-100` + `primary-600`) on transparent. Photos get `rounded-lg`, no filters.
- Charts (recharts): series order `primary-500`, `secondary-500`, `info-500`, `success-500`, `warning-500`. Grid lines `edge`. Tooltips styled like popovers. Never colour alone — label or pattern as well.

## 9. Voice

Plain, direct, sentence case. Buttons are verbs that name the outcome: "Save changes", "Invite member".
Errors state what happened and how to fix it. Empty states invite action. No exclamation marks in the app UI.

## 10. Ship checklist

- [ ] No raw colours, radii or shadows outside `tokens.json`
- [ ] Aurora band appears at most once
- [ ] Dark mode checked; focus rings visible on both
- [ ] 320px width works, no horizontal scroll
- [ ] All 7 states handled (empty, loading, partial, error, success, offline, denied)
