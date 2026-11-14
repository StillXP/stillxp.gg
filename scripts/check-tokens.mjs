// Fails if site CSS or TSX uses a raw color or a non-Lock In custom property.
// The portfolio is a Lock In consumer: semantic tokens only.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const rules = [
  [/#[0-9a-fA-F]{3,8}\b/, 'hex color'],
  [/\b(rgb|rgba|hsl|hsla|oklch)\(/, 'raw color function'],
  [/var\(--(?!ds-)/, 'non --ds-* variable'],
  [/--ds-color-(neutral|brand|blue|red|green|yellow|orange|violet|indigo)-\d/, 'base palette token'],
];

let failures = 0;
for (const file of readdirSync('src', { recursive: true })) {
  if (!/\.(css|tsx?)$/.test(file)) continue;
  const path = join('src', file);
  readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
    for (const [re, what] of rules) {
      if (re.test(line)) {
        console.error(`${path}:${i + 1}  ${what}: ${line.trim()}`);
        failures++;
      }
    }
  });
}
if (failures) process.exit(1);
console.log('Token check passed: only --ds-* tokens, no raw colors.');
