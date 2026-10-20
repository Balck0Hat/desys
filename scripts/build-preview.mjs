#!/usr/bin/env node
/**
 * Builds preview/index.html: a single page that renders sample UI for every
 * bundled design system, using the real values from each tokens.json.
 * Usage: node scripts/build-preview.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSystems, readTokens } from '../lib/registry.js';
import { resolveSurfaces } from '../lib/tokens.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const template = readFileSync(join(root, 'preview', 'template.html'), 'utf8');

const SCALE_PREFIX = { primary: 'p', secondary: 's', neutral: 'n', success: 'ok', warning: 'warn', error: 'err', info: 'info' };

const quoteFont = (font) => (font.includes(' ') ? `"${font}"` : font);

const scaleVars = (colors) =>
  Object.entries(colors).flatMap(([name, scale]) =>
    Object.entries(scale).map(([step, hex]) => `  --${SCALE_PREFIX[name] ?? name}-${step}: ${hex};`),
  );

const surfaceVars = (surfaces, colors) =>
  Object.entries(resolveSurfaces(surfaces, colors)).map(([key, value]) => `  --${key}: ${value};`);

const staticVars = (tokens) => [
  ...Object.entries(tokens.radius).map(([key, value]) => `  --r-${key}: ${value};`),
  ...Object.entries(tokens.shadows).map(([key, value]) => `  --sh-${key}: ${value.replaceAll('--ds-ink', '--ink')};`),
  `  --font-sans: ${tokens.fonts.sans.map(quoteFont).join(', ')};`,
  `  --font-display: ${(tokens.fonts.display ?? tokens.fonts.sans).map(quoteFont).join(', ')};`,
  `  --dur: ${tokens.motion?.base ?? '200ms'};`,
  `  --ease-out: ${tokens.motion?.easeOut ?? 'ease-out'};`,
];

const systemCss = (tokens) => {
  const cls = `.sys-${tokens.name}`;
  const light = [...scaleVars(tokens.colors), ...surfaceVars(tokens.surfaces.light, tokens.colors), ...staticVars(tokens)];
  const dark = surfaceVars(tokens.surfaces.dark, tokens.colors);
  if (!('ink' in tokens.surfaces.light)) {
    light.push('  --ink: transparent;');
    dark.push('  --ink: transparent;');
  }
  return [
    `${cls} {\n${light.join('\n')}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) ${cls} {\n${dark.join('\n')}\n  }\n}`,
    `:root[data-theme="dark"] ${cls} {\n${dark.join('\n')}\n}`,
  ].join('\n');
};

const fontFamilies = (systems) =>
  [...new Set(systems.flatMap((t) => (t.fonts.google ? t.fonts.google.split('&family=') : [])))].join('&family=');

const systems = listSystems().map(readTokens);
const html = template
  .replace('/*__SYSTEM_CSS__*/', systems.map(systemCss).join('\n\n'))
  .replace('__GOOGLE_FONTS__', fontFamilies(systems))
  .replace('__SYSTEMS_JSON__', JSON.stringify(
    systems.map(({ name, title, tagline, personality, bestFor, fonts }) => ({
      name, title, tagline, personality, bestFor, fonts: { sans: fonts.sans[0], display: (fonts.display ?? fonts.sans)[0] },
    })),
  ));

mkdirSync(join(root, 'preview'), { recursive: true });
writeFileSync(join(root, 'preview', 'index.html'), html);
console.log(`preview/index.html built for: ${systems.map((s) => s.name).join(', ')}`);
