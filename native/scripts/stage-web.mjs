import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
const source = resolve(process.argv[2] || '../public');
const target = resolve('www');
if (!existsSync(join(source, 'index.html')) || !statSync(source).isDirectory()) {
  console.error('Provide the extracted WHDC public directory: npm run stage:web -- /absolute/path/to/public');
  process.exit(1);
}
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log(`Copied ${source} to ${target}. This is a static asset staging step, NOT a working native backend integration.`);
console.log('Before native testing, resolve same-origin /api calls, auth cookies, SW/push, and remote media URLs. See README.');
