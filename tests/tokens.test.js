import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveColor, resolveSurfaces, validateTokens, isColorRef } from '../lib/tokens.js';
import { listSystems, readTokens } from '../lib/registry.js';

const colors = { neutral: { 900: '#0f172a', 50: '#f8fafc' }, primary: { 500: '#6366f1' } };

test('isColorRef detects scale references only', () => {
  assert.equal(isColorRef('neutral.900'), true);
  assert.equal(isColorRef('#ffffff'), false);
  assert.equal(isColorRef('var(--x)'), false);
});

test('resolveColor resolves a reference and passes literals through', () => {
  assert.equal(resolveColor('neutral.900', colors), '#0f172a');
  assert.equal(resolveColor('#ffffff', colors), '#ffffff');
});

test('resolveColor throws on an unknown reference', () => {
  assert.throws(() => resolveColor('brand.500', colors), /does not exist/);
});

test('resolveSurfaces resolves every entry', () => {
  const out = resolveSurfaces({ surface: '#fff', fg: 'neutral.900', focus: 'primary.500' }, colors);
  assert.deepEqual(out, { surface: '#fff', fg: '#0f172a', focus: '#6366f1' });
});

test('validateTokens rejects missing keys and mismatched light/dark', () => {
  assert.throws(() => validateTokens({ name: 'x' }), /missing/);
  const base = {
    name: 'x', fonts: {}, colors: {}, radius: {}, shadows: {}, zIndex: {},
    surfaces: { light: { surface: '#fff' }, dark: { surface: '#000', fg: '#fff' } },
  };
  assert.throws(() => validateTokens(base), /same keys/);
});

test('every bundled system has valid tokens', () => {
  const systems = listSystems();
  assert.ok(systems.length >= 3, 'expected at least three bundled systems');
  for (const name of systems) {
    const tokens = validateTokens(readTokens(name));
    assert.equal(tokens.name, name);
    for (const scale of ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info']) {
      assert.ok(tokens.colors[scale]?.['600'], `${name}: colors.${scale}.600 missing`);
    }
    resolveSurfaces(tokens.surfaces.light, tokens.colors);
    resolveSurfaces(tokens.surfaces.dark, tokens.colors);
  }
});
