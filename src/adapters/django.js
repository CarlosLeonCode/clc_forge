/**
 * CLC Forge — Django Stack Adapter
 * Supports Django, pytest-django / manage.py test, Django ORM migration idempotency, and Flake8/Black linters.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class DjangoAdapter extends BaseAdapter {
  constructor() {
    super('Django Framework', 'backend', 'pytest-django / manage.py test');
  }

  detect(targetDir) {
    const hasManagePy = fs.existsSync(path.join(targetDir, 'manage.py'));
    const hasPyproject = fs.existsSync(path.join(targetDir, 'pyproject.toml'));
    const hasRequirements = fs.existsSync(path.join(targetDir, 'requirements.txt'));

    if (hasManagePy) return true;

    if (hasPyproject || hasRequirements) {
      try {
        const pyproject = hasPyproject ? fs.readFileSync(path.join(targetDir, 'pyproject.toml'), 'utf-8') : '';
        const reqs = hasRequirements ? fs.readFileSync(path.join(targetDir, 'requirements.txt'), 'utf-8') : '';
        return pyproject.toLowerCase().includes('django') || reqs.toLowerCase().includes('django');
      } catch (e) {}
    }

    return false;
  }

  getSafeguards() {
    return [
      'Flake8 / Ruff AST Python Code Quality Linter',
      'Django ORM Migration Idempotency & Schema Drift Guard',
      'pytest-django Red-to-Green TDD Validator',
      'Secret & Private Key Leak Scanner',
      'Scope Guardrail (git diff vs SDD affected files)',
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
echo "🎸 Running CLC Forge Django Safeguards..."
python3 -m ruff check .
python3 manage.py test
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = DjangoAdapter;
