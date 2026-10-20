#!/usr/bin/env bash
# Install desys for local use:
#   1. link the `desys` CLI globally (npm link)
#   2. install the Claude Code skill into ~/.claude/skills/desys
#   3. add a pointer to ~/.claude/CLAUDE.md so Claude knows the registry exists
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
SKILL_TARGET="$CLAUDE_DIR/skills/desys"
CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"
MARKER="<!-- desys-registry -->"

echo "desys registry: $HERE"

# 1. CLI
if command -v npm >/dev/null 2>&1; then
  (cd "$HERE" && npm link >/dev/null 2>&1) && echo "✓ linked \`desys\` CLI (npm link)" \
    || echo "! npm link failed — run: node $HERE/bin/desys.js <command>"
else
  echo "! npm not found — run: node $HERE/bin/desys.js <command>"
fi

# 2. Skill (symlink so edits in the repo apply immediately)
mkdir -p "$CLAUDE_DIR/skills"
if [ -L "$SKILL_TARGET" ] || [ -d "$SKILL_TARGET" ]; then
  rm -rf "$SKILL_TARGET"
fi
ln -s "$HERE/skills/desys" "$SKILL_TARGET"
echo "✓ installed skill → $SKILL_TARGET  (use: /desys <name>)"

# 3. Pointer in the global CLAUDE.md (idempotent)
mkdir -p "$CLAUDE_DIR"
touch "$CLAUDE_MD"
if ! grep -qF "$MARKER" "$CLAUDE_MD"; then
  cat >> "$CLAUDE_MD" <<EOF

$MARKER
## Design Systems (desys)
- My design systems live in \`$HERE\` (\`DESYS_HOME\`). List: \`desys list\`.
- When I name a design system (e.g. "use aurora", "ديزاين سستم ember") → invoke the \`desys\` skill and follow \`systems/<name>/DESIGN.md\` exactly.
- New projects: ask which design system to use before building UI if none is set in the project CLAUDE.md.
EOF
  echo "✓ added desys section to $CLAUDE_MD"
else
  echo "✓ $CLAUDE_MD already references desys"
fi

# 4. Shell env hint
if [ -z "${DESYS_HOME:-}" ]; then
  echo
  echo "Optional: export DESYS_HOME=\"$HERE\"  (add to your shell profile)"
fi

echo
echo "Done. Try:  desys list   |   /desys aurora  (inside Claude Code)"
