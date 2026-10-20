import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** Root of the desys repo (override with DESYS_HOME). */
export const desysHome = () => process.env.DESYS_HOME || join(here, '..');

export const systemsDir = () => join(desysHome(), 'systems');
export const templateDir = () => join(desysHome(), 'template');

export const systemDir = (name) => join(systemsDir(), name);

export const systemExists = (name) =>
  existsSync(join(systemDir(name), 'tokens.json')) &&
  existsSync(join(systemDir(name), 'DESIGN.md'));

/** Every system that has both tokens.json and DESIGN.md. */
export const listSystems = () => {
  if (!existsSync(systemsDir())) return [];
  return readdirSync(systemsDir())
    .filter((entry) => statSync(join(systemsDir(), entry)).isDirectory())
    .filter(systemExists)
    .sort();
};

export const readTokens = (name) => {
  if (!systemExists(name)) {
    throw new Error(`Unknown design system "${name}". Run "desys list" to see available systems.`);
  }
  return JSON.parse(readFileSync(join(systemDir(name), 'tokens.json'), 'utf8'));
};

export const readDesignDoc = (name) => {
  if (!systemExists(name)) {
    throw new Error(`Unknown design system "${name}". Run "desys list" to see available systems.`);
  }
  return readFileSync(join(systemDir(name), 'DESIGN.md'), 'utf8');
};
