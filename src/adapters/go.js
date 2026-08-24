/**
 * CLC Forge — Go Stack Adapter
 * Supports Go (Gin/Fiber/Chi/Axum), `go test`, `golangci-lint`, and Go Clean Architecture.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class GoAdapter extends BaseAdapter {
  constructor() {
    super('Go (Golang)', 'backend', 'go test');
  }

  detect(targetDir) {
    return fs.existsSync(path.join(targetDir, 'go.mod'));
  }

  getSafeguards() {
    return [
      'golangci-lint Code Quality & AST Linter',
      'Go Clean Architecture Guard (Domain -> UseCase -> Handler)',
      'go test Red-to-Green TDD Validator',
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
echo "🐹 Running CLC Forge Go Safeguards..."
golangci-lint run
go test ./...
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = GoAdapter;
