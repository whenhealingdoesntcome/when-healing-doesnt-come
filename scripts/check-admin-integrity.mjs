// Run from repository root: node scripts/check-admin-integrity.mjs
// Static regression checks for the admin code split. Does not modify app data.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = p => readFileSync(p, 'utf8');
const files = [
  'src/private.js',
  'src/admin/dashboard-html.js',
  'src/admin/dashboard-script.js',
  'src/admin/outline-html.js',
  'src/admin/outline-script.js',
  'src/admin/shared-header.js',
  'src/admin/team-management-script.js',
];
let failed = false;
function check(condition, message) {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${message}`);
  if (!condition) failed = true;
}
for (const file of files) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); check(true, `${file} syntax`); }
  catch { check(false, `${file} syntax`); }
}
const entry = read('src/private.js');
const dashboard = read('src/admin/dashboard-script.js');
const html = read('src/admin/dashboard-html.js');
const team = read('src/admin/team-management-script.js');
const header = read('src/admin/shared-header.js');
check(entry.includes("from './admin/dashboard-script.js'"), 'Dashboard export remains wired');
check(entry.includes("from './admin/outline-script.js'"), 'Outline export remains wired');
check(dashboard.includes("from './team-management-script.js'"), 'Team management module is imported');
check(dashboard.includes('" + TEAM_MANAGEMENT_JS + "'), 'Team management code is included in dashboard output');
check(team.includes('Manage Writers / Editors'), 'Combined team manager exists');
check(html.includes('whdcAdminAlert'), 'Admin notification bell markup exists');
check(dashboard.includes('openPublishedPreview'), 'Published preview remains available');
check(html.includes('SHARED_ADMIN_HEADER') && read('src/admin/outline-html.js').includes('SHARED_ADMIN_HEADER'), 'Shared navigation used by both pages');
check(header.includes('SHARED_ADMIN_HEADER'), 'Shared navigation is defined');
if (failed) process.exitCode = 1;
