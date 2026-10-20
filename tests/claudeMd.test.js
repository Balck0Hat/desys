import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { upsertClaudeMdSection } from '../lib/claudeMd.js';

const withTempDir = (fn) => {
  const dir = mkdtempSync(join(tmpdir(), 'desys-claude-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

test('creates CLAUDE.md with the section when none exists', () => {
  withTempDir((dir) => {
    const path = upsertClaudeMdSection(dir, 'aurora');
    const content = readFileSync(path, 'utf8');
    assert.match(content, /^<!-- desys:start -->\n## Design System/);
    assert.match(content, /\*\*aurora\*\* design system/);
    assert.match(content, /<!-- desys:end -->\n$/);
  });
});

test('appends the section after existing content', () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, 'CLAUDE.md'), '# My project\n\nSome rules.\n');
    const content = readFileSync(upsertClaudeMdSection(dir, 'ledger'), 'utf8');
    assert.match(content, /^# My project\n\nSome rules\.\n\n<!-- desys:start -->/);
    assert.match(content, /\*\*ledger\*\*/);
  });
});

test('replaces an existing section instead of duplicating it', () => {
  withTempDir((dir) => {
    upsertClaudeMdSection(dir, 'aurora');
    const content = readFileSync(upsertClaudeMdSection(dir, 'ember'), 'utf8');
    assert.equal(content.match(/<!-- desys:start -->/g).length, 1);
    assert.match(content, /\*\*ember\*\*/);
    assert.doesNotMatch(content, /\*\*aurora\*\*/);
  });
});
