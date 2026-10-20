/**
 * Helpers for working with a system's tokens.json.
 * A surface value may be a literal ("#ffffff") or a reference
 * into a colour scale ("neutral.900").
 */

const REF_PATTERN = /^([a-z]+)\.(\d{2,3})$/i;

export const isColorRef = (value) => REF_PATTERN.test(String(value));

/** Resolve "neutral.900" → "#0f172a" using the system's colour scales. */
export const resolveColor = (value, colors) => {
  const match = REF_PATTERN.exec(String(value));
  if (!match) return value;
  const [, scale, step] = match;
  const hex = colors?.[scale]?.[step];
  if (!hex) {
    throw new Error(`Token reference "${value}" does not exist in colors.${scale}`);
  }
  return hex;
};

/** Resolve every value of a surface map ({ surface: 'neutral.50', ... }). */
export const resolveSurfaces = (surfaces, colors) =>
  Object.fromEntries(
    Object.entries(surfaces).map(([key, value]) => [key, resolveColor(value, colors)]),
  );

/** CSS custom property name for a surface token. */
export const cssVar = (key) => `--ds-${key}`;

/** Validate the minimum shape every tokens.json must have. */
export const validateTokens = (tokens) => {
  const required = ['name', 'fonts', 'colors', 'surfaces', 'radius', 'shadows', 'zIndex'];
  const missing = required.filter((key) => !(key in tokens));
  if (missing.length) {
    throw new Error(`tokens.json is missing: ${missing.join(', ')}`);
  }
  for (const mode of ['light', 'dark']) {
    if (!tokens.surfaces[mode]) throw new Error(`surfaces.${mode} is required`);
  }
  const lightKeys = Object.keys(tokens.surfaces.light).sort().join();
  const darkKeys = Object.keys(tokens.surfaces.dark).sort().join();
  if (lightKeys !== darkKeys) {
    throw new Error('surfaces.light and surfaces.dark must define the same keys');
  }
  return tokens;
};
