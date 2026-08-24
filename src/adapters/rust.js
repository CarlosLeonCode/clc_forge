/**
 * CLC Forge — Rust Stack Adapter
 * Supports Rust (Actix/Axum), `cargo test`, `cargo clippy`, and Cargo Audit.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class RustAdapter extends BaseAdapter {
  constructor() {
    super('Rust Engine', 'backend', 'cargo test');
  }

  detect(targetDir) {
    return fs.existsSync(path.join(targetDir, 'Cargo.toml'));
  }

  getSafeguards() {
    return [
      'cargo clippy AST Code Quality Linter',
      'cargo audit Security Vulnerability Scanner',
      'cargo test Red-to-Green TDD Validator',
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
echo "🦀 Running CLC Forge Rust Safeguards..."
cargo clippy -- -D warnings
cargo test
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = RustAdapter;
