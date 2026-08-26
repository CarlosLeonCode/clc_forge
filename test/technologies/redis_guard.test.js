/**
 * CLC Forge — Redis guard integration tests.
 * Tests redis_guard.py via subprocess against fixture projects.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createTmpProject, teardown } = require('../helpers');

function runRedisGuard(targetDir) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, '../../tools/redis_guard.py');
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

describe('redis_guard', () => {
  it('skips when no git repo', async () => {
    const dir = createTmpProject({});
    try {
      const result = await runRedisGuard(dir);
      assert.strictEqual(result.skipped, true);
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: decode_responses=True without password', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'cache.py'),
      `from redis import Redis\nr = Redis(host="localhost", port=6379, decode_responses=True)\n`
    );
    spawnSync('git', ['add', 'cache.py'], { cwd: dir });

    try {
      const result = await runRedisGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('decode_responses_without_password'), 'should detect decode_responses without password');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: missing socket_connect_timeout', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'cache.py'),
      `from redis import Redis\nr = Redis(host="localhost", port=6379, decode_responses=False, password="secret")\n`
    );
    spawnSync('git', ['add', 'cache.py'], { cwd: dir });

    try {
      const result = await runRedisGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('missing_socket_connect_timeout'), 'should detect missing timeout');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: hardcoded Redis host without timeout', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'cache.py'),
      `from redis import Redis\nr = Redis(host="localhost", port=6379)\n`
    );
    spawnSync('git', ['add', 'cache.py'], { cwd: dir });

    try {
      const result = await runRedisGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('missing_socket_connect_timeout'), 'should detect missing timeout');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: no Redis in project', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'main.py'),
      `def hello():\n    return "world"\n`
    );
    spawnSync('git', ['add', 'main.py'], { cwd: dir });

    try {
      const result = await runRedisGuard(dir);
      assert.strictEqual(result.exit_code, 0);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });
});
