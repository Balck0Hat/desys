# Ember — design system spec

> Bold and playful. Orange on warm stone, thick ink borders, hard offset shadows, oversized headlines.
> This file is the source of truth for UI decisions. The global frontend rules
> (`~/.claude/rules/frontend.md`) still apply; where they conflict, this file wins.

## 1. Identity

- **Personality:** loud, friendly, tactile. Stickers on printed cardstock. Confident, never corporate.
- **Best for:** consumer apps, events and communities, creative studios, food and lifestyle brands.
- **The one memorable thing:** *ink*. Interactive surfaces (buttons, inputs, cards, modals) get a
  `2px` border in `edge` and a hard offset shadow (`shadow-md` = `4px 4px 0 0 var(--ds-ink)`).
  Press → the surface moves into its shadow. Everything non-interactive stays flat so the ink reads.
- **Second voice:** Space Grotesk display headlines set big and tight. Body stays calm in DM Sans.

## 2. Hard rules

1. Only semantic utilities from `tokens.json`. Never a raw palette colour or hex in a component.
2. **Never white text on `primary-500`.** Orange fills take `text-fg` (dark). Orange *as text* must be `primary-700` or darker on light.
3. Ink borders are 2px (`border-2 border-edge`) on interactive surfaces, 1px for dividers. Never 1px around a button.
4. Hard shadows only (`shadow-sm/md/lg`). No blurred drop shadows anywhere.
5. One rotated sticker element per page at most (`-rotate-3` to `rotate-2`). No rotation on text blocks.
6. No gradients. Big flat tinted blocks (`primary-100`, `secondary-100`) are the decoration.
7. Sentence case. No all-caps labels, no eyebrows. Headlines carry the energy, labels stay quiet.
8. Motion is springy but short (`ease-out` = overshoot curve, ≤ 320ms) and only `transform`/`opacity`.

## 3. Colour

| Role | Light | Dark | Use |
|---|---|---|---|
| Page background | `bg-surface` (neutral-50, warm paper) | neutral-950 | |
| Muted areas | `bg-surface-muted` (neutral-100) | neutral-900 | Footers, code, table stripes |
| Cards / inputs | `bg-surface-elevated` (#ffffff) | neutral-900 | Always with ink border |
| Ink (borders + shadows) | `border-edge` (neutral-900) / `--ds-ink` | neutral-200 | |
| Body text | `text-fg` (neutral-950) | neutral-50 | |
| Secondary text | `text-fg-secondary` (neutral-700) | neutral-300 | |
| Muted text | `text-fg-muted` (neutral-500) | neutral-400 | |
| Primary action | `bg-primary-500 text-fg` → hover `primary-400` → active `primary-600` | same | Dark text on orange |
| Accent action / links | `bg-secondary-400 text-fg` · links `text-secondary-700 underline decoration-2` | links `secondary-300` | Teal |
| Tinted blocks | `bg-primary-100`, `bg-secondary-100` | `primary-950`, `secondary-950` | Alternate section backgrounds |
| Focus ring | `ring-2 ring-focus ring-offset-2 ring-offset-surface` | | Teal, visible on orange too |

- Status chips: `bg-{status}-100 text-{status}-800 border-2 border-edge`. Never filled status buttons.

## 4. Typography — Space Grotesk (display) + DM Sans (body)

| Token | Family | Size / line | Weight | Notes |
|---|---|---|---|---|
| display | Space Grotesk | 56 / 60 | 700 | `tracking-tight`, `max-w-[18ch]`, hero only |
| h1 | Space Grotesk | 44 / 48 | 700 | `tracking-tight`, `max-w-[20ch]` |
| h2 | Space Grotesk | 32 / 36 | 700 | |
| h3 | Space Grotesk | 24 / 28 | 700 | Card titles |
| h4 | DM Sans | 20 / 28 | 700 | |
| body | DM Sans | 16 / 26 | 400 | `max-w-prose` (60ch) |
| small | DM Sans | 14 / 20 | 500 | Labels, chips |
| caption | DM Sans | 13 / 16 | 500 | `text-fg-muted` |

Headlines may wrap tight and sit close to the edge of their container. Body text never does.

## 5. Shape, depth, spacing

- Radius: `rounded-md` (12) buttons · `rounded-lg` (16) inputs, small cards, toasts · `rounded-xl` (24) large cards, modals · `rounded-full` chips, tags, avatars.
- Ink: `border-2 border-edge` + `shadow-md` on buttons and interactive cards; `shadow-sm` on inputs and chips; `shadow-lg` on modals and popovers.
  Hover: `-translate-x-0.5 -translate-y-0.5 shadow-lg`. Active: `translate-x-1 translate-y-1 shadow-none`.
- Spacing: generous. Card padding `p-6`. Gaps `gap-6`/`gap-8`. Section padding `py-20 md:py-28`. Asymmetric splits (7/5, 8/4) are welcome.
- Layout: `max-w-container` (1200). Content aligned to start; hero may be centred. Mobile: single column, cards full-width, bottom nav for 3–5 sections.

## 6. Motion

- Press and hover: `duration` (200ms) `ease-out` (springy curve from tokens). Modals/drawers `duration-slow` (320ms).
- One playful entrance per page: the hero headline and its sticker pop in (scale 0.96 → 1, 320ms). Nothing else animates on load.
- Toggles and chips snap (120ms). Skeletons `animate-pulse` in `bg-surface-muted` with ink border kept.
- Always `motion-safe:`; reduced motion removes the overshoot and the entrance.

## 7. Components (deltas from the global rules)

- **Button** — sm `h-10 px-5 text-sm` · md `h-12 px-6` · lg `h-14 px-8 text-lg`. `rounded-md border-2 border-edge font-bold shadow-md` + hover/active transforms above.
  primary `bg-primary-500 text-fg` · secondary `bg-surface-elevated text-fg` · accent `bg-secondary-400 text-fg` ·
  ghost `border-transparent shadow-none hover:bg-surface-muted` · danger `bg-error-100 text-error-800`. Loading: label dims, spinner at the start, no transform.
- **Input** — `h-12 rounded-lg border-2 border-edge bg-surface-elevated px-4 shadow-sm focus:ring-2 focus:ring-focus`. Label `text-sm font-bold text-fg` above. Error: `border-error-600` + `text-sm font-medium text-error-700`.
- **Card** — interactive: `rounded-xl border-2 border-edge bg-surface-elevated p-6 shadow-md` + hover transform. Static content card: same without shadow.
- **Chip / tag** — `rounded-full border-2 border-edge px-3 py-1 text-sm font-medium bg-{tint}-100 text-fg shadow-sm`.
- **Top nav** — `h-16 border-b-2 border-edge bg-surface`. Wordmark in Space Grotesk 700. Mobile menu = full-screen drawer `bg-primary-100` with h2-sized links.
- **Sidebar (apps)** — `w-64 border-e-2 border-edge bg-surface`; active item `bg-primary-100 border-2 border-edge rounded-md`.
- **Modal** — `rounded-xl border-2 border-edge bg-surface-elevated shadow-lg max-w-lg p-8`; backdrop `bg-neutral-950/60 backdrop-blur-sm`.
- **Toast** — `rounded-lg border-2 border-edge bg-surface-elevated shadow-md p-4`; status shown by a `size-8 rounded-md bg-{status}-100` icon tile at the start.
- **Table** — outer `rounded-lg border-2 border-edge overflow-hidden`; header `bg-primary-100 font-bold`; rows `border-b border-edge/20`. Stacks into cards on mobile.
- **Sticker badge** — `rounded-full bg-secondary-400 border-2 border-edge px-4 py-2 font-bold -rotate-3 shadow-sm`. One per page, usually beside the hero headline.
- **Empty state** — h2 headline (Space Grotesk), one friendly sentence, one primary button, optional sticker. No grey illustrations.

## 8. Icons, imagery, charts

- Lucide `size-[22px]` stroke 2.25 (bolder to match the ink); `size-[18px]` inline in text and chips.
- Photos: `rounded-xl border-2 border-edge`, may carry `shadow-md`. Illustrations: flat, 2px ink outlines, fills from `primary-100/300`, `secondary-100/300`.
- Charts: `primary-500`, `secondary-500`, `info-500`, `warning-400`, `neutral-700`. Strokes 3px, bars with `rounded-sm` caps, grid lines `edge/20`. Always title + legend.

## 9. Voice

Warm, short, direct. Contractions are fine ("You're in!"). One exclamation mark per screen at most.
Buttons are verb-first and concrete: "Grab a ticket", "Save recipe". Errors are friendly but exact about the fix. Empty states sound like an invitation, not an apology.

## 10. Ship checklist

- [ ] No raw colours, radii or shadows outside `tokens.json`
- [ ] No white text on orange; contrast ≥ 4.5:1 checked on tinted blocks
- [ ] Ink borders 2px on every interactive surface; hard shadows only
- [ ] At most one sticker and one entrance animation per page
- [ ] Dark mode: ink flips to light, orange fills keep dark text
