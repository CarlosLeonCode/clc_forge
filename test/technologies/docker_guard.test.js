/**
 * CLC Forge — Docker guard integration tests.
 * Tests docker_guard.py via subprocess against fixture projects.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createTmpProject, teardown } = require('../helpers');

function runDockerGuard(targetDir) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, '../../tools/docker_guard.py');
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

describe('docker_guard', () => {
  it('skips when no git repo', async () => {
    const dir = createTmpProject({});
    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.skipped, true);
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: missing USER directive', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'Dockerfile'),
      `FROM node:18-alpine\nRUN apk add --no-cache python3\nCMD ["node", "server.js"]\n`
    );
    spawnSync('git', ['add', 'Dockerfile'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('missing_user'), 'should detect missing USER directive');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: USER runs as root', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'Dockerfile'),
      `FROM node:18-alpine\nUSER root\nCMD ["node", "server.js"]\n`
    );
    spawnSync('git', ['add', 'Dockerfile'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('user_is_root'), 'should detect root USER');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: missing HEALTHCHECK', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'Dockerfile'),
      `FROM node:18-alpine\nUSER node\nCMD ["node", "server.js"]\n`
    );
    spawnSync('git', ['add', 'Dockerfile'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('missing_healthcheck'), 'should detect missing HEALTHCHECK');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: ENV secret exposure', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'Dockerfile'),
      `FROM node:18-alpine\nENV AWS_SECRET_ACCESS_KEY=abcd1234\nENV DB_PASSWORD=secret\nUSER node\nHEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1\nCMD ["node", "server.js"]\n`
    );
    spawnSync('git', ['add', 'Dockerfile'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('env_secret'), 'should detect ENV secrets');
    } finally {
      teardown(dir);
    }
  });

  it('finds violations: docker-compose env secret', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'docker-compose.yml'),
      `version: "3.8"\nservices:\n  web:\n    image: node:18\n    environment:\n      - DB_PASSWORD="secret123"\n      - API_KEY="key456"\n`
    );
    spawnSync('git', ['add', 'docker-compose.yml'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 1);
      const issues = result.data.findings.map((f) => f.issue);
      assert.ok(issues.includes('compose_env_secret'), 'should detect compose env secrets');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: properly configured Dockerfile', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'Dockerfile'),
      `FROM node:18-alpine\nUSER node\nHEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1\nCMD ["node", "server.js"]\n`
    );
    spawnSync('git', ['add', 'Dockerfile'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 0);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });

  it('no violations: no docker files in project', async () => {
    const dir = createTmpProject({});
    initGitRepo(dir);

    fs.writeFileSync(
      path.join(dir, 'main.py'),
      `def hello():\n    return "world"\n`
    );
    spawnSync('git', ['add', 'main.py'], { cwd: dir });

    try {
      const result = await runDockerGuard(dir);
      assert.strictEqual(result.exit_code, 0);
      assert.strictEqual(result.data.findings.length, 0, 'should have no findings');
    } finally {
      teardown(dir);
    }
  });
});
