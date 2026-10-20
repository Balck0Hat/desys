import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const START = '<!-- desys:start -->';
const END = '<!-- desys:end -->';

export const claudeMdSection = (name) =>
  [
    START,
    '## Design System',
    '',
    `This project uses the **${name}** design system from desys.`,
    '',
    '- Read `design-system/DESIGN.md` before touching any UI. It overrides generic styling choices.',
    '- Tokens live in `design-system/tokens.json`; never hardcode colours, radii, shadows or fonts.',
    '- Tailwind v3: `presets: [require("./design-system/tailwind.preset.cjs")]` + import `design-system/theme.css`.',
    '- Tailwind v4: import `design-system/tailwind.v4.css` instead of `@import "tailwindcss"`.',
    '- Use only semantic utilities: `bg-primary-600`, `bg-surface`, `text-fg`, `border-edge`, `shadow-md`, `z-modal`.',
    `- To refresh after the system changes upstream: \`desys use ${name}\`.`,
    END,
  ].join('\n');

/**
 * Insert or replace the desys section in <dir>/CLAUDE.md.
 * Returns the path written.
 */
export const upsertClaudeMdSection = (dir, name) => {
  const path = join(dir, 'CLAUDE.md');
  const section = claudeMdSection(name);
  const existing = existsSync(path) ? readFileSync(path, 'utf8') : '';

  const hasSection = existing.includes(START) && existing.includes(END);
  let next;
  if (hasSection) {
    const pattern = new RegExp(`${START}[\\s\\S]*?${END}`);
    next = existing.replace(pattern, section);
  } else {
    const separator = existing.trim() ? '\n\n' : '';
    next = `${existing.trimEnd()}${separator}${section}\n`;
  }

  writeFileSync(path, next);
  return path;
};
