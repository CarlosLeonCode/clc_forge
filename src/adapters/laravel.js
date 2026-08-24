/**
 * CLC Forge — PHP / Laravel Stack Adapter
 * Supports Laravel, Pest / PHPUnit, PHPStan, and Laravel Migration Idempotency.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class LaravelAdapter extends BaseAdapter {
  constructor() {
    super('PHP / Laravel', 'backend', 'Pest / PHPUnit');
  }

  detect(targetDir) {
    const hasComposer = fs.existsSync(path.join(targetDir, 'composer.json'));
    const hasArtisan = fs.existsSync(path.join(targetDir, 'artisan'));
    return hasComposer && hasArtisan;
  }

  getSafeguards() {
    return [
      'PHPStan / PHP_CodeSniffer AST Code Quality Linter',
      'Laravel Migration Idempotency & Schema Guard',
      'Pest / PHPUnit Red-to-Green TDD Validator',
      'Secret & Private Key Leak Scanner',
      'Educational Audit Gate (05-audit-report.md)',
      'Memory Guard (Engram / Graphify ADR Sync)'
    ];
  }

  provision(targetDir, config) {
    super.provision(targetDir, config);

    const githooksDir = path.join(targetDir, '.githooks');
    fs.mkdirSync(githooksDir, { recursive: true });
    const preCommitPath = path.join(githooksDir, 'pre-commit');
    const content = `#!/usr/bin/env bash
echo "🐘 Running CLC Forge Laravel Safeguards..."
./vendor/bin/phpstan analyse
php artisan test
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = LaravelAdapter;
