/**
 * CLC Forge — FastAPI Stack Adapter
 * Supports FastAPI, Pytest, Alembic migration idempotency, Pydantic V2 schemas, and Clean Architecture AST linters.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class FastApiAdapter extends BaseAdapter {
  constructor() {
    super('FastAPI Framework', 'backend', 'Pytest');
  }

  detect(targetDir) {
    const hasPyproject = fs.existsSync(path.join(targetDir, 'pyproject.toml'));
    const hasRequirements = fs.existsSync(path.join(targetDir, 'requirements.txt'));

    if (hasPyproject || hasRequirements) {
      try {
        const pyproject = hasPyproject ? fs.readFileSync(path.join(targetDir, 'pyproject.toml'), 'utf-8') : '';
        const reqs = hasRequirements ? fs.readFileSync(path.join(targetDir, 'requirements.txt'), 'utf-8') : '';
        return pyproject.toLowerCase().includes('fastapi') || reqs.toLowerCase().includes('fastapi');
      } catch (e) {}
    }

    return false;
  }

  getSafeguards() {
    return [
      'Ruff / Flake8 Python AST Code Quality Linter',
      'Clean Architecture AST Guard (Domain -> Application -> Routes)',
      'Alembic Migration Idempotency & Schema Drift Guard',
      'Pytest Red-to-Green TDD Validator',
      'Pydantic V2 Response Schema Validation Guard',
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
echo "⚡ Running CLC Forge FastAPI Safeguards..."
python3 tools/scan_secrets.py
python3 tools/check_scope.py
python3 tools/check_architecture.py
python3 tools/check_migrations.py
pytest
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = FastApiAdapter;
