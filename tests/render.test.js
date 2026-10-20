import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readTokens } from '../lib/registry.js';
import { renderPreset } from '../lib/render/preset.js';
import { renderThemeCss } from '../lib/render/themeCss.js';
import { renderV4Css } from '../lib/render/v4Css.js';

const tokens = readTokens('aurora');

test('preset is loadable CommonJS with semantic colours and surface variables', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'desys-preset-'));
  try {
    const file = join(dir, 'preset.cjs');
    writeFileSync(file, renderPreset(tokens));
    const preset = (await import(file)).default;
    const { colors, fontFamily, zIndex, borderRadius } = preset.theme.extend;

    assert.equal(colors.primary.DEFAULT, tokens.colors.primary['600']);
    assert.equal(colors.primary['500'], '#6366f1');
    assert.equal(colors.surface, 'var(--ds-surface)');
    assert.equal(colors.fg, 'var(--ds-fg)');
    assert.equal(colors['edge-strong'], 'var(--ds-edge-strong)');
    assert.deepEqual(fontFamily.sans, tokens.fonts.sans);
    assert.equal(zIndex.modal, '40');
    assert.equal(borderRadius.lg, '12px');
    assert.ok(Array.isArray(preset.darkMode));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('theme.css defines resolved light and dark variables', () => {
  const css = renderThemeCss(tokens);
  assert.match(css, /:root \{[^}]*--ds-surface: #ffffff;/);
  assert.match(css, /:root \{[^}]*--ds-fg: #0f172a;/);
  assert.match(css, /\.dark,\n\[data-theme="dark"\] \{[^}]*--ds-surface: #020617;/);
  assert.match(css, /fonts\.googleapis\.com\/css2\?family=Manrope/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /neutral\.\d+/, 'references must be resolved to hex');
});

test('theme.css skips the font import when no google font is set', () => {
  const css = renderThemeCss({ ...tokens, fonts: { sans: ['system-ui'] } });
  assert.doesNotMatch(css, /googleapis/);
  assert.match(css, /font-family: system-ui;/);
});

test('tailwind v4 css contains @theme with every scale step and inline surfaces', () => {
  const css = renderV4Css(tokens);
  assert.match(css, /^\/\*.*\*\/\n@import "tailwindcss";/);
  assert.match(css, /@custom-variant dark/);
  assert.match(css, /--color-primary-600: #4f46e5;/);
  assert.match(css, /--color-primary: #4f46e5;/);
  assert.match(css, /--font-display: Manrope, ui-sans-serif/);
  assert.match(css, /--radius-xl: 16px;/);
  assert.match(css, /--z-toast: 50;/);
  assert.match(css, /@theme inline \{[^}]*--color-surface: var\(--ds-surface\);/);
  assert.match(css, /--ds-fg: #f8fafc;/, 'dark fg from themeCss should be included');
});

test('ember hard shadows reference the ink variable in every output', () => {
  const ember = readTokens('ember');
  assert.match(renderPreset(ember), /4px 4px 0 0 var\(--ds-ink\)/);
  assert.match(renderThemeCss(ember), /--ds-ink: #1c1917;/);
  assert.match(renderV4Css(ember), /--shadow-md: 4px 4px 0 0 var\(--ds-ink\);/);
});
