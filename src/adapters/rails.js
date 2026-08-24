/**
 * CLC Forge — Ruby on Rails Stack Adapter
 * Supports Ruby on Rails, RSpec/Minitest, RuboCop, Brakeman, and Rails migration idempotency.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class RailsAdapter extends BaseAdapter {
  constructor() {
    super('Ruby on Rails', 'backend', 'RSpec / Minitest');
  }

  detect(targetDir) {
    const hasGemfile = fs.existsSync(path.join(targetDir, 'Gemfile'));
    const hasRailsRoute = fs.existsSync(path.join(targetDir, 'config', 'routes.rb'));
    return hasGemfile && hasRailsRoute;
  }

  getSafeguards() {
    return [
      'RuboCop Code Style & AST Security Guard',
      'Brakeman Rails Vulnerability Scanner',
      'Rails Migration Idempotency Guard (schema drift protection)',
      'RSpec / Minitest Red-to-Green TDD Validator',
      'Secret & Private Credential Leak Scanner',
      'Educational Audit Gate (05-audit-report.md)',
      'Memory Guard (Engram / Graphify ADR Sync)'
    ];
  }

  provision(targetDir, config) {
    super.provision(targetDir, config);

    // Create Rails pre-commit hook
    const githooksDir = path.join(targetDir, '.githooks');
    fs.mkdirSync(githooksDir, { recursive: true });
    const preCommitPath = path.join(githooksDir, 'pre-commit');
    const content = `#!/usr/bin/env bash
echo "💎 Running CLC Forge Rails Safeguards..."
bundle exec rubocop --parallel
bundle exec brakeman -q
bundle exec rspec
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = RailsAdapter;
