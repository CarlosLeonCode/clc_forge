/**
 * CLC Forge — PostgreSQL guard integration tests.
 * Tests postgres_guard.py via subprocess against fixture projects.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createTmpProject, teardown } = require('../helpers');

function runPostgresGuard(targetDir) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, '../../tools/postgres_guard.py');
    const proc = spawn('python3', [script, targetDir], { cwd: targetDir });
    let stdout = '';
    proc.stdout.on('data', (d) => (stdout += d));
    proc.on('close', () => {
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Failed to parse: ${stdout}`));
      }
    });
    proc.on('error', reject);
  });
}

function initGitRepo(dir) {
  fs.writeFileSync(path.join(dir, '.gitkeep'), '');
  spawnSync('git', ['init'], { cwd: dir });
  spawnSync('git', ['config', 'user.email', 'test@test.com'], { cwd: dir });
  spawnSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['commit', '-m', 'initial'], { cwd: dir });
}

describe('postgres_guard', () => {
  it('skips when no git repo', async () => {
    const dir = createTmpProject({});
    try {
      const result = await runPostgresGuard(dir);
      assert.strictEqual(result.skipped, true);
    } finally {
      teardown(dir);
    }
  });

  it('no violations: no SQL queries in project', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'main.py'),
      `def hello():\n    return "world"\n`
    );
    spawnSync('git', ['add', 'main.py'], { cwd: dir });

    try {
      const result = await runPostgresGuard(dir);
      assert.strictEqual(result.exit_code, 0);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: no postgres in project', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'main.py'),
      `def hello():\n    return "world"\n`
    );
    spawnSync('git', ['add', 'main.py'], { cwd: dir });

    try {
      const result = await runPostgresGuard(dir);
      assert.strictEqual(result.exit_code, 0);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });
});
