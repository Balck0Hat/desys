import { mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readTokens, readDesignDoc, systemDir } from './registry.js';
import { validateTokens } from './tokens.js';
import { renderPreset } from './render/preset.js';
import { renderThemeCss } from './render/themeCss.js';
import { renderV4Css } from './render/v4Css.js';
import { upsertClaudeMdSection } from './claudeMd.js';

export const OUTPUT_DIR = 'design-system';

/** Build every output file for a system, in memory. */
export const buildOutputs = (name) => {
  const tokens = validateTokens(readTokens(name));
  return {
    'DESIGN.md': readDesignDoc(name),
    'tokens.json': `${JSON.stringify(tokens, null, 2)}\n`,
    'tailwind.preset.cjs': renderPreset(tokens),
    'theme.css': renderThemeCss(tokens),
    'tailwind.v4.css': renderV4Css(tokens),
  };
};

/**
 * Apply a design system to a project:
 *  - writes <target>/design-system/{DESIGN.md,tokens.json,tailwind.preset.cjs,theme.css,tailwind.v4.css}
 *  - copies optional systems/<name>/components.md
 *  - adds/updates a "## Design System" section in <target>/CLAUDE.md
 */
export const applySystem = (name, targetDir = process.cwd(), { claudeMd = true } = {}) => {
  const outputs = buildOutputs(name);
  const outDir = join(targetDir, OUTPUT_DIR);
  mkdirSync(outDir, { recursive: true });

  const written = [];
  for (const [file, content] of Object.entries(outputs)) {
    writeFileSync(join(outDir, file), content);
    written.push(join(OUTPUT_DIR, file));
  }

  const components = join(systemDir(name), 'components.md');
  if (existsSync(components)) {
    copyFileSync(components, join(outDir, 'components.md'));
    written.push(join(OUTPUT_DIR, 'components.md'));
  }

  if (claudeMd) {
    const claudePath = upsertClaudeMdSection(targetDir, name);
    written.push(relative(targetDir, claudePath));
  }

  return written;
};
