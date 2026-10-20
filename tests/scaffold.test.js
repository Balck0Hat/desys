import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, rmSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
let registry;
let project;

// Point DESYS_HOME at a throwaway copy of the registry so tests never touch the real one.
beforeEach(() => {
  registry = mkdtempSync(join(tmpdir(), 'desys-registry-'));
  cpSync(join(repoRoot, 'template'), join(registry, 'template'), { recursive: true });
  mkdirSync(join(registry, 'systems'));
  cpSync(join(repoRoot, 'systems', 'aurora'), join(registry, 'systems', 'aurora'), { recursive: true });
  project = mkdtempSync(join(tmpdir(), 'desys-project-'));
  process.env.DESYS_HOME = registry;
});

afterEach(() => {
  delete process.env.DESYS_HOME;
  rmSync(registry, { recursive: true, force: true });
  rmSync(project, { recursive: true, force: true });
});

test('scaffoldSystem creates a system from the template with placeholders replaced', async () => {
  const { scaffoldSystem } = await import('../lib/scaffold.js');
  const { listSystems, readTokens } = await import('../lib/registry.js');

  scaffoldSystem('ocean-blue');
  assert.deepEqual(listSystems(), ['aurora', 'ocean-blue']);
  const tokens = readTokens('ocean-blue');
  assert.equal(tokens.name, 'ocean-blue');
  assert.equal(tokens.title, 'Ocean Blue');
  assert.match(readFileSync(join(registry, 'systems/ocean-blue/DESIGN.md'), 'utf8'), /^# Ocean Blue/);
});

test('scaffoldSystem forks an existing system and renames it', async () => {
  const { scaffoldSystem } = await import('../lib/scaffold.js');
  const { readTokens } = await import('../lib/registry.js');

  scaffoldSystem('aurora-dark', { from: 'aurora' });
  const tokens = readTokens('aurora-dark');
  assert.equal(tokens.name, 'aurora-dark');
  assert.equal(tokens.colors.primary['600'], readTokens('aurora').colors.primary['600']);
});

test('scaffoldSystem rejects bad names, duplicates and unknown sources', async () => {
  const { scaffoldSystem } = await import('../lib/scaffold.js');
  assert.throws(() => scaffoldSystem('Bad Name'), /kebab-case/);
  assert.throws(() => scaffoldSystem('aurora'), /already exists/);
  assert.throws(() => scaffoldSystem('fresh', { from: 'nope' }), /unknown system/);
});

test('applySystem writes generated files and the CLAUDE.md section into a project', async () => {
  const { applySystem } = await import('../lib/use.js');

  const written = applySystem('aurora', project);
  for (const file of ['DESIGN.md', 'tokens.json', 'tailwind.preset.cjs', 'theme.css', 'tailwind.v4.css']) {
    assert.ok(existsSync(join(project, 'design-system', file)), `${file} should exist`);
    assert.ok(written.includes(join('design-system', file)));
  }
  assert.match(readFileSync(join(project, 'CLAUDE.md'), 'utf8'), /\*\*aurora\*\* design system/);
});

test('applySystem can skip CLAUDE.md and fails on unknown systems', async () => {
  const { applySystem } = await import('../lib/use.js');
  applySystem('aurora', project, { claudeMd: false });
  assert.equal(existsSync(join(project, 'CLAUDE.md')), false);
  assert.throws(() => applySystem('missing', project), /Unknown design system/);
});
