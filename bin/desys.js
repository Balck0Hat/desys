#!/usr/bin/env node
import { resolve } from 'node:path';
import { listSystems, readTokens, readDesignDoc } from '../lib/registry.js';
import { applySystem, buildOutputs } from '../lib/use.js';
import { scaffoldSystem } from '../lib/scaffold.js';

const HELP = `desys — personal design-system registry

Usage:
  desys list                          List available design systems
  desys show <name>                   Print the DESIGN.md spec for a system
  desys use <name> [dir] [--no-claude-md]
                                      Apply a system to a project (default: current dir)
  desys build <name>                  Print generated files to stdout (dry run)
  desys new <name> [--from <system>]  Scaffold a new system from the template or an existing one
  desys path                          Print the registry root (DESYS_HOME)

Environment:
  DESYS_HOME   Override the registry location (defaults to this repo)
`;

const flag = (args, name) => args.includes(`--${name}`);
const option = (args, name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};
const positional = (args) => args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--from');

const commands = {
  list() {
    const systems = listSystems();
    if (!systems.length) return console.log('No design systems found.');
    for (const name of systems) {
      const { title = name, tagline = '' } = readTokens(name);
      console.log(`${name.padEnd(14)} ${title} — ${tagline}`);
    }
  },
  show([name]) {
    if (!name) throw new Error('Usage: desys show <name>');
    process.stdout.write(readDesignDoc(name));
  },
  use([name, dir], args) {
    if (!name) throw new Error('Usage: desys use <name> [dir]');
    const target = resolve(dir ?? process.cwd());
    const written = applySystem(name, target, { claudeMd: !flag(args, 'no-claude-md') });
    console.log(`Applied "${name}" to ${target}:`);
    for (const file of written) console.log(`  ${file}`);
  },
  build([name]) {
    if (!name) throw new Error('Usage: desys build <name>');
    for (const [file, content] of Object.entries(buildOutputs(name))) {
      console.log(`\n===== ${file} =====\n${content}`);
    }
  },
  new([name], args) {
    if (!name) throw new Error('Usage: desys new <name> [--from <system>]');
    const created = scaffoldSystem(name, { from: option(args, 'from') });
    console.log(`Created design system "${name}":`);
    for (const file of created) console.log(`  ${file}`);
    console.log('\nNext: edit DESIGN.md and tokens.json, then `desys use ' + name + '` in a project.');
  },
  path() {
    console.log(resolve(process.env.DESYS_HOME ?? new URL('..', import.meta.url).pathname));
  },
};

const run = () => {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    return console.log(HELP);
  }
  const handler = commands[command];
  if (!handler) throw new Error(`Unknown command "${command}".\n\n${HELP}`);
  handler(positional(rest), rest);
};

try {
  run();
} catch (error) {
  console.error(`desys: ${error.message}`);
  process.exit(1);
}
