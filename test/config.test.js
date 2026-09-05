/**
 * CLC Forge — Config tests for the extracted zero-dependency YAML parser.
 * Covers: parser reuse (src/yaml.js), unsupported anchor/alias syntax,
 * existing custom-rules behavior via tools/check_custom.js subprocess,
 * and `../src/yaml.js` resolution from a generated-style layout.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createTmpProject, teardown } = require('./helpers');

const { parseYaml } = require('../src/yaml.js');

const CHECK_CUSTOM = path.join(__dirname, '..', 'tools', 'check_custom.js');

const VALID_CONFIG = `rules:
  - name: no-debugger
    pattern: 'debugger'
    message: 'No debugger statements'
    severity: error
    scope: '**/*.js'
    meta: {owner: team, tier: 1}
  - name: no-todo
    pattern: 'TODO'
    message: 'No TODOs'
    severity: warning
    exclude: ['**/docs/**']
`;

const EXPECTED_CONFIG = {
  rules: [
    {
      name: 'no-debugger',
      pattern: 'debugger',
      message: 'No debugger statements',
      severity: 'error',
      scope: '**/*.js',
      meta: { owner: 'team', tier: 1 },
    },
    {
      name: 'no-todo',
      pattern: 'TODO',
      message: 'No TODOs',
      severity: 'warning',
      exclude: ['**/docs/**'],
    },
  ],
};

/**
 * Run tools/check_custom.js (or a copy at the given path) against a
 * target directory. Resolves with { parsed, exitCode }.
 * @param {string} script - Absolute path to check_custom.js
 * @param {string} targetDir - Directory to scan
 * @returns {Promise<{parsed: object, exitCode: number}>}
 */
function runCheckCustom(script, targetDir) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [script, targetDir], { cwd: targetDir });
    let stdout = '';
    proc.stdout.on('data', (d) => (stdout += d));
    proc.on('close', (code) => {
      try {
        resolve({ parsed: JSON.parse(stdout), exitCode: code });
      } catch {
        reject(new Error(`Failed to parse output: ${stdout}`));
      }
    });
    proc.on('error', reject);
  });
}

/**
 * Initialize a git repo with an initial commit, so
 * `git diff --name-only HEAD~1` fails and check_custom
 * falls back to `git diff --name-only --cached`.
 * @param {string} dir - Target directory
 */
function initGitRepo(dir) {
  spawnSync('git', ['init'], { cwd: dir });
  spawnSync('git', ['config', 'user.email', 'test@test.com'], { cwd: dir });
  spawnSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['commit', '-m', 'initial'], { cwd: dir });
}

describe('config: src/yaml.js parser reuse', () => {
  it('parses a valid .clc-forge.yml with scalars, block sequence, flow mapping', () => {
    assert.deepStrictEqual(parseYaml(VALID_CONFIG), EXPECTED_CONFIG);
  });

  it('parses quoted and unquoted scalars into their typed values', () => {
    const cfg = 'enabled: true\ncount: 42\nratio: 1.5\nnothing: null\n';
    assert.deepStrictEqual(parseYaml(cfg), {
      enabled: true,
      count: 42,
      ratio: 1.5,
      nothing: null,
    });
  });

  it('strips comments and skips blank lines', () => {
    const cfg = '# top comment\nkey: value # trailing\n\nother: x\n';
    assert.deepStrictEqual(parseYaml(cfg), { key: 'value', other: 'x' });
  });
});

describe('config: unsupported YAML syntax', () => {
  it('throws on anchor syntax (&name)', () => {
    assert.throws(
      () => parseYaml('defaults: &defaults\n  a: 1\n'),
      /Unsupported YAML syntax at line 1: anchors\/aliases are not supported/
    );
  });

  it('throws on alias syntax (*name)', () => {
    assert.throws(
      () => parseYaml('db: *defaults\n'),
      /Unsupported YAML syntax at line 1: anchors\/aliases are not supported/
    );
  });

  it('throws on anchor inside a sequence item', () => {
    assert.throws(
      () => parseYaml('rules:\n  - &item name: x\n'),
      /Unsupported YAML syntax at line 2: anchors\/aliases are not supported/
    );
  });

  it('reports the exact line number for nested content', () => {
    assert.throws(
      () => parseYaml('rules:\n  - name: a\n    template: &tpl shared\n'),
      /Unsupported YAML syntax at line 3/
    );
  });

  it('does not false-positive on regex patterns or globs', () => {
    const cfg = `rules:
  - name: r
    pattern: 'a*b'
    message: 'm'
    scope: '**/*.js'
    exclude: ['**/docs/**', '*.min.js']
`;
    assert.deepStrictEqual(parseYaml(cfg), {
      rules: [
        {
          name: 'r',
          pattern: 'a*b',
          message: 'm',
          scope: '**/*.js',
          exclude: ['**/docs/**', '*.min.js'],
        },
      ],
    });
  });
});

describe('config: check_custom behavior preserved (subprocess)', () => {
  it('produces the same output shape (name, exitCode, skipped, data)', async () => {
    const dir = createTmpProject({
      '.clc-forge.yml': VALID_CONFIG,
      'src/app.js': 'module.exports = 1;\n',
    });
    initGitRepo(dir);

    try {
      // Introduce a violation, then stage it so check_custom's
      // fallback diff (`git diff --name-only --cached`) sees it.
      fs.writeFileSync(path.join(dir, 'src/app.js'), 'debugger;\nmodule.exports = 1;\n');
      spawnSync('git', ['add', 'src/app.js'], { cwd: dir });

      const { parsed, exitCode } = await runCheckCustom(CHECK_CUSTOM, dir);

      assert.strictEqual(parsed.name, 'check_custom');
      assert.strictEqual(parsed.skipped, false);
      assert.strictEqual(parsed.exitCode, 1);
      assert.strictEqual(exitCode, 1);
      assert.ok(parsed.data, 'data key present');
      assert.ok(parsed.data.violations, 'violations key present');
      assert.strictEqual(parsed.data.violations['src/app.js'].length, 1);
      assert.strictEqual(parsed.data.violations['src/app.js'][0].rule, 'no-debugger');
      assert.strictEqual(
        parsed.data.violations['src/app.js'][0].message,
        'No debugger statements'
      );
      assert.strictEqual(parsed.data.violations['src/app.js'][0].severity, 'error');
      assert.strictEqual(parsed.data.violations['src/app.js'][0].lineNo, 1);
      assert.strictEqual(parsed.data.message, '1 custom rule violation(s) in 1 file(s)');
    } finally {
      teardown(dir);
    }
  });

  it('ships src/yaml.js to generated projects so check_custom resolves', async () => {
    const { autoDetectStack } = require('../src/detector');
    const { generateHarness } = require('../src/generator');

    // Real end-to-end path: detect + generate a Next.js project.
    const dir = createTmpProject({
      'package.json': JSON.stringify({ dependencies: { next: '14.0.0' } }),
    });
    const config = autoDetectStack(dir);
    assert.strictEqual(config.framework, 'Next.js (App Router)');
    generateHarness(dir, config);

    try {
      // The generated project must ship src/yaml.js next to tools/check_custom.js.
      assert.ok(fs.existsSync(path.join(dir, 'src', 'yaml.js')), 'src/yaml.js shipped');

      const generatedCheck = path.join(dir, 'tools', 'check_custom.js');
      assert.ok(fs.existsSync(generatedCheck), 'tools/check_custom.js shipped');

      fs.writeFileSync(path.join(dir, '.clc-forge.yml'), VALID_CONFIG);
      fs.mkdirSync(path.join(dir, 'src', 'app'), { recursive: true });
      fs.writeFileSync(path.join(dir, 'src', 'app.js'), 'module.exports = 1;\n');
      initGitRepo(dir);

      fs.writeFileSync(path.join(dir, 'src', 'app.js'), 'debugger;\nmodule.exports = 1;\n');
      spawnSync('git', ['add', 'src/app.js'], { cwd: dir });

      const { parsed, exitCode } = await runCheckCustom(generatedCheck, dir);

      assert.strictEqual(parsed.name, 'check_custom');
      assert.strictEqual(parsed.skipped, false);
      assert.strictEqual(parsed.exitCode, 1);
      assert.strictEqual(exitCode, 1);
      assert.strictEqual(parsed.data.violations['src/app.js'][0].rule, 'no-debugger');
    } finally {
      teardown(dir);
    }
  });

  it('returns skipped:true with parse error message on unsupported anchor/alias config', async () => {
    const dir = createTmpProject({
      '.clc-forge.yml': 'rules:\n  - name: r\n    template: &tpl shared\n',
      'src/app.js': 'module.exports = 1;\n',
    });
    initGitRepo(dir);

    try {
      fs.writeFileSync(path.join(dir, 'src/app.js'), 'debugger;\n');
      spawnSync('git', ['add', 'src/app.js'], { cwd: dir });

      const { parsed, exitCode } = await runCheckCustom(CHECK_CUSTOM, dir);

      assert.strictEqual(parsed.name, 'check_custom');
      assert.strictEqual(parsed.skipped, true);
      assert.strictEqual(parsed.exitCode, 0);
      assert.ok(
        parsed.data.message.includes('Config parse error: Unsupported YAML syntax'),
        `unexpected message: ${parsed.data.message}`
      );
    } finally {
      teardown(dir);
    }
  });
});