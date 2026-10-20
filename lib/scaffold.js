import { mkdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { systemDir, systemExists, templateDir } from './registry.js';

const NAME_PATTERN = /^[a-z][a-z0-9-]{1,30}$/;

const titleCase = (name) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

/**
 * Create systems/<name>/ from the template, or from an existing system
 * when `from` is given. Replaces {{name}} / {{title}} placeholders.
 */
export const scaffoldSystem = (name, { from } = {}) => {
  if (!NAME_PATTERN.test(name)) {
    throw new Error('Name must be kebab-case: lowercase letters, digits and dashes (e.g. "ocean-blue").');
  }
  if (systemExists(name)) {
    throw new Error(`Design system "${name}" already exists.`);
  }
  if (from && !systemExists(from)) {
    throw new Error(`Cannot copy from unknown system "${from}".`);
  }

  const source = from ? systemDir(from) : templateDir();
  const target = systemDir(name);
  mkdirSync(target, { recursive: true });

  const files = ['DESIGN.md', 'tokens.json', 'components.md'];
  const created = [];
  for (const file of files) {
    const sourcePath = join(source, file);
    if (!existsSync(sourcePath)) continue;
    const targetPath = join(target, file);

    if (from) {
      copyFileSync(sourcePath, targetPath);
    } else {
      const content = readFileSync(sourcePath, 'utf8')
        .replaceAll('{{name}}', name)
        .replaceAll('{{title}}', titleCase(name));
      writeFileSync(targetPath, content);
    }
    created.push(targetPath);
  }

  if (from) {
    const tokensPath = join(target, 'tokens.json');
    const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));
    tokens.name = name;
    tokens.title = titleCase(name);
    writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`);
  }

  return created;
};
