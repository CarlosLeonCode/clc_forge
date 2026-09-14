const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const { createTmpProject, teardown } = require('./helpers');

function initGitRepo(dir) {
  fs.writeFileSync(path.join(dir, '.gitkeep'), '');
  execSync('git init && git config user.name "Test" && git config user.email "test@example.com" && git add . && git commit -m "initial"', { cwd: dir });
}

describe('New Automatic Safeguards', () => {
  const checkResponsive = require('../tools/check_responsive');
  const checkSeo = require('../tools/check_seo');

  describe('check_responsive.js', () => {
    it('returns exitCode 0 when no git diff is available (graceful degradation)', async () => {
      const dir = createTmpProject({});
      try {
        const res = await checkResponsive(dir);
        assert.strictEqual(res.exitCode, 0);
        assert.strictEqual(res.name, 'check_responsive');
      } finally {
        teardown(dir);
      }
    });

    it('detects hardcoded fixed desktop width in git diff', async () => {
      const dir = createTmpProject({});
      initGitRepo(dir);
      try {
        fs.writeFileSync(path.join(dir, 'component.tsx'), '<div className="w-[1200px]">Fixed</div>');
        execSync('git add component.tsx', { cwd: dir });

        const res = await checkResponsive(dir);
        assert.strictEqual(res.exitCode, 1);
        assert.ok(res.data.violations['component.tsx']);
        assert.strictEqual(res.data.violations['component.tsx'][0].rule, 'responsive-fixed-width');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('check_seo.js', () => {
    it('returns exitCode 0 when no git diff is available (graceful degradation)', async () => {
      const dir = createTmpProject({});
      try {
        const res = await checkSeo(dir);
        assert.strictEqual(res.exitCode, 0);
        assert.strictEqual(res.name, 'check_seo');
      } finally {
        teardown(dir);
      }
    });

    it('detects multiple <h1> tags in single page component', async () => {
      const dir = createTmpProject({});
      initGitRepo(dir);
      try {
        fs.writeFileSync(path.join(dir, 'page.tsx'), 'export default function Page() { return <div><h1>One</h1><h1>Two</h1></div>; }');
        execSync('git add page.tsx', { cwd: dir });

        const res = await checkSeo(dir);
        assert.strictEqual(res.exitCode, 1);
        assert.ok(res.data.violations['page.tsx']);
        assert.strictEqual(res.data.violations['page.tsx'][0].rule, 'seo-multiple-h1');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('check_db_efficiency.py', () => {
    it('detects database query inside for-loop via python AST', () => {
      const dir = createTmpProject({});
      initGitRepo(dir);
      try {
        fs.writeFileSync(path.join(dir, 'service.py'), 'def bad_loop(ids):\n    res = []\n    for i in ids:\n        res.append(db.query(User).filter(User.id == i).first())\n    return res\n');
        execSync('git add service.py', { cwd: dir });
        
        const scriptPath = path.resolve(__dirname, '../tools/check_db_efficiency.py');
        const proc = spawnSync('python3', [scriptPath, dir], { cwd: dir, encoding: 'utf-8' });
        assert.strictEqual(proc.status, 1);
        const parsed = JSON.parse(proc.stdout);
        assert.strictEqual(parsed.exit_code, 1);
        assert.ok(parsed.data.violations['service.py']);
        assert.strictEqual(parsed.data.violations['service.py'][0].rule, 'db-query-in-loop');
      } finally {
        teardown(dir);
      }
    });
  });
});
