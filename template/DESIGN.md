# {{title}} — design system spec

> One sentence that captures the look. (e.g. "Calm SaaS. Indigo on cool slate. Depth from borders.")
> This file is the source of truth for UI decisions. The global frontend rules
> (`~/.claude/rules/frontend.md`) still apply; where they conflict, this file wins.

## 1. Identity

- **Personality:** three adjectives + one metaphor. (corporate / playful / minimal / bold / editorial / technical)
- **Best for:** the kinds of products this system suits.
- **The one memorable thing:** the single element people will remember. Spend all boldness here.
- **Everything else is:** what stays quiet so the memorable thing can read.

## 2. Hard rules

1. Only semantic utilities from `tokens.json`: `bg-primary-600`, `bg-surface`, `text-fg`, `border-edge`. Never a raw colour or hex in a component.
2. Where does depth come from? (borders / soft shadows / hard shadows) — and where is it forbidden?
3. Motion policy: what animates, what never does.
4. Typography policy: casing, number of weights, anything banned (all-caps labels, eyebrows, gradient text…).
5. Status colours mean status. Never decorative.
6. Dark mode: what swaps (surfaces) and what stays (brand steps).
7. Add 1–2 rules unique to this system.

## 3. Colour

| Role | Light | Dark | Use |
|---|---|---|---|
| Page background | `bg-surface` | | |
| Muted areas | `bg-surface-muted` | | Sidebar, table headers |
| Cards / panels | `bg-surface-elevated` | | |
| Borders | `border-edge` / `border-edge-strong` | | |
| Body / secondary / muted text | `text-fg` / `text-fg-secondary` / `text-fg-muted` | | |
| Action | `bg-primary-600` → hover `700` → active `800` | | Buttons |
| Links | `text-primary-700` | `text-primary-400` | |
| Selected / active nav | | | |
| Focus ring | `ring-2 ring-focus ring-offset-2` | | Every interactive element |

- When is `secondary` allowed? Status badge recipe?

## 4. Typography — {{font}}

| Token | Size / line | Weight | Notes |
|---|---|---|---|
| display | 48 / 56 | 700 | Marketing only |
| h1 | 36 / 40 | 700 | One per page |
| h2 | 30 / 36 | 700 | |
| h3 | 24 / 32 | 600 | |
| h4 | 20 / 28 | 600 | |
| body | 16 / 26 | 400 | `max-w-prose` |
| small | 14 / 20 | 400–500 | |
| caption | 12 / 16 | 500 | `text-fg-muted` |

## 5. Shape, depth, spacing

- Radius: which token for buttons/inputs · cards · modals · avatars/pills.
- Borders: width and token on cards, inputs, tables. Hover treatment.
- Spacing rhythm: card padding, form gap, between cards, between sections (app vs marketing).
- Layout: container width, sidebar width, grid, alignment (start / centre).

## 6. Motion

- Durations and easings from `tokens.motion`. Only `opacity` and `transform`.
- The one orchestrated moment per page (if any). Hover feedback style. Skeleton style. Always `motion-safe:`.

## 7. Components (deltas from the global rules)

- **Button** — sizes, radius, weight; primary / secondary / ghost / danger recipes; loading behaviour.
- **Input** — height, border, focus, label style, error style.
- **Card** — recipe. Interactive vs static.
- **Top nav / Sidebar** — heights, backgrounds, active item.
- **Table** — header, rows, hover, numbers, pagination defaults.
- **Badge / Chip** — shape and tints.
- **Dropdown / Modal / Toast** — surfaces, shadows, backdrop.
- **Empty state / KPI tile** — recipe.

## 8. Icons, imagery, charts

- Icon library, size, stroke width. Illustration style. Photo treatment.
- Chart series order (5 tokens), grid colour, stroke width. Never colour alone.

## 9. Voice

Tone in one line. Button wording rule. Error wording rule. Empty-state wording rule.

## 10. Ship checklist

- [ ] No raw colours, radii or shadows outside `tokens.json`
- [ ] The memorable element appears once, not everywhere
- [ ] Dark mode checked; focus rings visible on both
- [ ] 320px width works, no horizontal scroll
- [ ] All 7 states handled (empty, loading, partial, error, success, offline, denied)
