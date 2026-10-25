// Run from the repository root: node scripts/check-admin-integrity.mjs
// Static checks plus assembled dashboard output fingerprint. Does not modify application data.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const read = path => readFileSync(path, 'utf8');
const modules = [
  'src/private.js',
  'src/admin/dashboard-html.js',
  'src/admin/dashboard-script.js',
  'src/admin/dashboard-init-script.js',
  'src/admin/dashboard-render-script.js',
  'src/admin/selection-controls-script.js',
  'src/admin/publishing-tools-script.js',
  'src/admin/admin-reader-script.js',
  'src/admin/editor-form-script.js',
  'src/admin/editor-utilities-script.js',
  'src/admin/multi-writer-admin-script.js',
  'src/admin/published-preview-script.js',
  'src/admin/team-management-script.js',
  'src/admin/outline-html.js',
  'src/admin/outline-script.js',
  'src/admin/shared-header.js',
];
let failures = 0;
function check(ok, name) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failures++;
}
for (const file of modules) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    check(true, `${file} syntax`);
  } catch { check(false, `${file} syntax`); }
}
const dashboard = read('src/admin/dashboard-script.js');
const imports = [
  'dashboard-init-script.js', 'dashboard-render-script.js',
  'selection-controls-script.js', 'publishing-tools-script.js',
  'admin-reader-script.js', 'editor-form-script.js',
  'editor-utilities-script.js', 'multi-writer-admin-script.js',
  'published-preview-script.js', 'team-management-script.js'
];
for (const name of imports) check(dashboard.includes(`from './${name}'`), `Dashboard imports ${name}`);
const entry = read('src/private.js');
check(entry.includes("from './admin/dashboard-script.js'"), 'Dashboard export wired');
check(entry.includes("from './admin/outline-script.js'"), 'Outline export wired');
check(read('src/admin/team-management-script.js').includes('Manage Writers / Editors'), 'Combined manager preserved');
check(read('src/admin/dashboard-html.js').includes('whdcAdminAlert'), 'Admin notification bell preserved');
check(read('src/admin/published-preview-script.js').includes('openPublishedPreview'), 'Published preview preserved');
check(read('src/admin/dashboard-html.js').includes('SHARED_ADMIN_HEADER') &&
      read('src/admin/outline-html.js').includes('SHARED_ADMIN_HEADER'), 'Shared header used on both pages');
check(read('src/admin/shared-header.js').includes('SHARED_ADMIN_HEADER'), 'Shared header defined');
try {
  const { ADMIN_JS } = await import(pathToFileURL(resolve('src/admin/dashboard-script.js')).href);
  const digest = createHash('sha256').update(ADMIN_JS).digest('hex');
  check(digest === '17f0f6f976c5ea9fc14c2156c2c7dc61d597496e4fdeb6f461c9ad1e52f490d6', 'Assembled dashboard output unchanged from Phase 2 Part 17');
} catch (error) {
  console.error(error.message);
  check(false, 'Assembled dashboard output loads');
}
if (failures) process.exitCode = 1;
