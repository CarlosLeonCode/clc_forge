/**
 * CLC Forge — Celery guard integration tests.
 * Tests celery_guard.py via subprocess against fixture projects.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { createTmpProject, teardown } = require('../helpers');

/**
 * Run celery_guard.py against a target directory.
 * Returns a promise resolving to the parsed JSON result.
 */
function runCeleryGuard(targetDir) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, '../../tools/celery_guard.py');
    const proc = spawn('python3', [script, targetDir], { cwd: targetDir });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => (stdout += d));
    proc.stderr.on('data', (d) => (stderr += d));
    proc.on('close', (code) => {
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch {
        reject(new Error(`Failed to parse guard output: ${stderr || stdout}`));
      }
    });
    proc.on('error', reject);
  });
}

/**
 * Create a git repo in dir and commit an initial empty file.
 */
function initGitRepo(dir) {
    fs.writeFileSync(path.join(dir, '.gitkeep'), '');
    spawnSync('git', ['init'], { cwd: dir });
    spawnSync('git', ['config', 'user.email', 'test@test.com'], { cwd: dir });
    spawnSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
    spawnSync('git', ['add', '.'], { cwd: dir });
    spawnSync('git', ['commit', '-m', 'initial'], { cwd: dir });
}

describe('celery_guard', () => {
  it('skips when no git diff is available (no git repo)', async () => {
    const dir = createTmpProject({});
    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.skipped, true, 'should be skipped');
      assert.strictEqual(result.name, 'celery_guard');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: hardcoded broker_url in Celery()', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    // Create a new file with a violation
    fs.writeFileSync(
      path.join(dir, 'tasks.py'),
      `from celery import Celery\napp = Celery("myapp", broker_url="redis://localhost")\n`
    );
    spawnSync('git', ['add', 'tasks.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 1, 'should exit with error code');
      assert.strictEqual(result.skipped, false);
      assert.ok(result.data.findings.length > 0, 'should have findings');
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('hardcoded_broker_url'), 'should detect hardcoded broker_url');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: hardcoded result_backend', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'tasks.py'),
      `from celery import Celery\napp = Celery(broker_url="redis://localhost", result_backend="redis://localhost")\n`
    );
    spawnSync('git', ['add', 'tasks.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('hardcoded_result_backend'), 'should detect hardcoded result_backend');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: Celery with both broker_url and result_backend', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'tasks.py'),
      `from celery import Celery\napp = Celery("myapp", broker_url="redis://localhost", result_backend="redis://localhost")\n`
    );
    spawnSync('git', ['add', 'tasks.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('hardcoded_broker_url'), 'should detect hardcoded broker_url');
      assert.ok(issues.includes('hardcoded_result_backend'), 'should detect hardcoded result_backend');
      assert.strictEqual(result.data.findings.length, 2, 'should find both violations');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: properly configured @shared_task with ignore_result=True', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'tasks.py'),
      `from celery import shared_task\n@shared_task(ignore_result=True)\ndef add(x, y):\n    return x + y\n`
    );
    spawnSync('git', ['add', 'tasks.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 0, 'should exit cleanly');
      assert.strictEqual(result.skipped, false);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: properly configured Celery without hardcoded URLs', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'tasks.py'),
      `import os\nfrom celery import Celery\napp = Celery("myapp")\napp.conf.broker_url = os.environ.get("BROKER_URL")\napp.conf.result_backend = os.environ.get("RESULT_BACKEND")\n`
    );
    spawnSync('git', ['add', 'tasks.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 0, 'should exit cleanly');
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: no celery in project (empty findings)', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'main.py'),
      `def hello():\n    return "world"\n`
    );
    spawnSync('git', ['add', 'main.py'], { cwd: dir });

    try {
      const result = await runCeleryGuard(dir);
      assert.strictEqual(result.exit_code, 0, 'should exit cleanly');
      assert.strictEqual(result.skipped, false);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });
});
