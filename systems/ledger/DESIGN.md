# Ledger — design system spec

> Dense, trustworthy, corporate. Deep blue on neutral zinc. Hierarchy through weight and rules, not decoration.
> This file is the source of truth for UI decisions. The global frontend rules
> (`~/.claude/rules/frontend.md`) still apply; where they conflict, this file wins.

## 1. Identity

- **Personality:** sober, exact, unhurried. A well-typeset annual report you can click on.
- **Best for:** finance and accounting, ERP and back-office, government and legal, data-heavy admin.
- **The one memorable thing:** the *ledger line* — a `3px` rule in `primary-700` under the page title
  (`border-b-[3px] border-primary-700`). It is the only thick line on the screen. Every other
  divider is 1px `edge`.
- **Everything else is restrained.** 1px borders, 4px radius, no gradients, no shadows at rest.

## 2. Hard rules

1. Only semantic utilities from `tokens.json`. Never a raw palette colour or hex in a component.
2. No shadows at rest. `shadow-md` only on dropdowns/popovers, `shadow-lg` only on modals.
3. No entrance animations. Motion is for state change only (expand, open, sort) and under 150ms.
4. Body text is 14px by default inside the app. 16px only in docs/marketing content.
5. Every number uses `tabular-nums` and is aligned to the end. Units and currency symbols are always shown.
6. Two weights only: 400 and 600 (500 allowed for table headers). No letter-spacing tricks, no all-caps.
7. Sections are separated by a 1px rule, not by large whitespace. Dense is correct here.
8. Colour never carries meaning alone: pair it with an icon, a sign (+/−) or text.

## 3. Colour

| Role | Light | Dark | Use |
|---|---|---|---|
| App background | `bg-surface-muted` (neutral-100) | neutral-900 | Behind panels in dashboards |
| Panels / content | `bg-surface` (#ffffff) | neutral-950 | Cards, tables, forms |
| Borders | `border-edge` (neutral-200) | neutral-800 | Dividers, panels |
| Strong borders | `border-edge-strong` (neutral-400) | neutral-600 | Inputs, totals row, secondary buttons |
| Body text | `text-fg` (neutral-900) | neutral-50 | |
| Labels | `text-fg-secondary` (neutral-600) | neutral-300 | Form labels, table headers |
| Muted text | `text-fg-muted` (neutral-500) | neutral-400 | Help text, timestamps |
| Action | `bg-primary-700` → hover `800` → active `900` | `bg-primary-600` → `700` | Buttons |
| Links | `text-primary-700 underline` | `text-primary-400` | Always underlined in body text |
| Active nav | `bg-primary-50 text-primary-800` + 2px start bar `primary-700` | `bg-primary-950 text-primary-200` | |
| Focus ring | `ring-2 ring-focus ring-offset-1` | | Every interactive element |

- Secondary (teal) is reserved for the second data series in charts and for "informational" callouts in reports.
- Status: `bg-{status}-50 text-{status}-800 border border-{status}-200`. Positive delta = `success-700` + "+", negative = `error-700` + "−".

## 4. Typography — IBM Plex Sans

| Token | Size / line | Weight | Notes |
|---|---|---|---|
| h1 | 24 / 32 | 600 | Page title, sits on the ledger line |
| h2 | 20 / 28 | 600 | Panel group titles |
| h3 | 16 / 24 | 600 | Panel titles |
| body | 14 / 22 | 400 | App default |
| body-lg | 16 / 26 | 400 | Docs, marketing, long reading. `max-w-prose` (70ch) |
| small | 13 / 20 | 400–500 | Form labels (500), table header (500) |
| caption | 12 / 16 | 400 | Help text, footnotes in `text-fg-muted` |
| kpi | 28 / 32 | 600 | `tabular-nums` |

No display sizes above 36px anywhere, including marketing.

## 5. Shape, depth, spacing

- Radius: `rounded-md` (4) buttons, inputs, badges · `rounded-lg` (6) panels, popovers · `rounded-xl` (8) modals · `rounded-full` avatars only. Tags are not pills.
- Borders: 1px `edge` around panels and between rows. Inputs use `edge-strong` so they read as fields.
- Spacing: dense scale 4 / 8 / 12 / 16 / 24. Panel padding `p-4`. Form row gap `gap-3`. Between panels `gap-4`. Page padding `p-6` (`p-4` mobile).
- Layout: `max-w-container` (1440). Sidebar 240px fixed, collapsible to 56px. Forms may use two columns from `md`. Everything aligned to start; centred text only in empty states.

## 6. Motion

- `duration-fast` (100ms) for hover/focus, `duration` (150ms) for expand/collapse and menus, `duration-slow` (200ms) for modals. Easing `ease-out`.
- Nothing animates on page load. Skeletons `animate-pulse` in `bg-surface-muted`; row skeletons match row height exactly.
- Table sort and filter changes swap content instantly (no fade).

## 7. Components (deltas from the global rules)

- **Button** — sm `h-8 px-3 text-xs` (toolbars only) · md `h-11 lg:h-10 px-4 text-sm` · lg `h-11 px-5`. `rounded-md font-semibold`.
  primary `bg-primary-700 text-fg-inverse hover:bg-primary-800` · secondary `border border-edge-strong bg-surface text-fg hover:bg-surface-muted` ·
  tertiary `text-primary-700 hover:bg-primary-50` · danger `border border-error-300 text-error-700 hover:bg-error-50` (destructive actions are never filled red).
- **Input** — `h-11 lg:h-10 rounded-md border border-edge-strong bg-surface px-3 text-sm`. Label `text-[13px] font-medium text-fg-secondary` above; help `text-xs text-fg-muted`; error `border-error-600` + `text-xs text-error-700`.
  Numeric inputs: `text-end tabular-nums`. Required marker is the word "Required" in the label, not an asterisk.
- **Panel (card)** — `rounded-lg border border-edge bg-surface`. Header `h-12 px-4 border-b border-edge` with h3 + optional actions at the end. Body `p-4`.
- **Table** — the core component. Header `h-10 bg-surface-muted text-[13px] font-medium text-fg-secondary sticky top-0`. Rows `h-10 border-b border-edge hover:bg-surface-muted`. No zebra stripes.
  Totals row `font-semibold border-t-2 border-edge-strong`. Default 25 per page; filter bar above, pagination with total count below. Columns: text to start, numbers to end, dates to start.
- **KPI tile** — label `text-[13px] text-fg-secondary`, value kpi token, delta `text-xs` with icon + sign + colour.
- **Top nav** — `h-16 border-b border-edge bg-surface` (no blur). Product name `text-sm font-semibold`, no logo mark larger than 24px.
- **Sidebar** — `w-60 border-e border-edge bg-surface`. Items `h-9 px-3 text-sm rounded-md`. Groups separated by a 1px rule with a `text-xs text-fg-muted` group name.
- **Badge** — `rounded-md px-2 py-0.5 text-xs font-medium` with status tints above.
- **Modal** — `rounded-xl border border-edge bg-surface shadow-lg max-w-lg`. Header `px-6 h-14 border-b`, body `p-6`, footer `px-6 h-16 border-t` with actions at the end. Backdrop `bg-neutral-950/50`.
- **Toast** — `rounded-md border border-edge bg-surface shadow-lg p-3` with a 3px start border in the status colour.
- **Empty state** — `text-sm text-fg-secondary` centred, one sentence, one secondary button. No illustration.

## 8. Icons, imagery, charts

- Lucide `size-4` (16px) stroke 1.75 everywhere; `size-5` only in the sidebar and empty states.
- No illustrations. Photos only on marketing pages, `rounded-lg`, no filters.
- Charts: series `primary-700`, `secondary-600`, `neutral-500`, `info-600`, `warning-600`. Lines 2px, no area fills above 10% opacity, grid lines `edge`, axis labels `text-xs text-fg-muted`. Always a title and legend.

## 9. Voice

Formal and neutral. Precise nouns: "Invoice", "Reconciliation", not "Stuff". Buttons name the exact action: "Export CSV", "Approve invoice".
Errors cite the field and the rule ("Amount must be greater than 0"). Dates follow the user's locale; currencies always show the code or symbol.

## 10. Ship checklist

- [ ] No raw colours, radii or shadows outside `tokens.json`
- [ ] Exactly one ledger line per page
- [ ] All numbers tabular and end-aligned, with units
- [ ] Dark mode checked; focus rings visible
- [ ] Tables: sticky header, hover, pagination with total, mobile fallback
