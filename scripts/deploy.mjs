import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = resolve(ROOT, 'dist');

// ── configuration ────────────────────────────────────────────────────
// Override with env vars or edit defaults here.
const DEPLOY_REPO   = process.env.DEPLOY_REPO   || 'git@github.com:serpapps/serpdownloaders.com.git';
const DEPLOY_BRANCH = process.env.DEPLOY_BRANCH || 'gh-pages';
const COMMIT_MSG    = process.env.COMMIT_MSG    || `Deploy ${new Date().toISOString().slice(0, 19)}Z`;

// ── helpers ──────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

// ── main ─────────────────────────────────────────────────────────────

function deploy() {
  if (!existsSync(resolve(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `npm run build` first.');
    process.exit(1);
  }

  console.log(`Deploying dist/ → ${DEPLOY_REPO} (${DEPLOY_BRANCH})\n`);

  // work inside dist/
  const opts = { cwd: DIST };

  // init a throwaway git repo in dist/
  run('git init', opts);
  run('git checkout --orphan ' + DEPLOY_BRANCH, opts);
  run('git add -A', opts);
  run(`git commit -m "${COMMIT_MSG}"`, opts);

  // push to the deploy repo
  run(`git remote add deploy ${DEPLOY_REPO}`, opts);
  run(`git push deploy ${DEPLOY_BRANCH} --force`, opts);

  console.log('\n✓ Deployed successfully.');
}

deploy();
