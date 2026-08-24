/**
 * CLC Forge — Astro Stack Adapter
 * Supports Astro components, Tailwind CSS v4, Vitest, A11y, and Storybook/MDX stories.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class AstroAdapter extends BaseAdapter {
  constructor() {
    super('Astro Framework', 'frontend', 'Vitest / Playwright');
  }

  detect(targetDir) {
    const hasAstroConfig = fs.existsSync(path.join(targetDir, 'astro.config.mjs')) || fs.existsSync(path.join(targetDir, 'astro.config.js'));
    const hasPkg = fs.existsSync(path.join(targetDir, 'package.json'));
    if (!hasPkg) return false;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      return hasAstroConfig || Boolean(deps['astro']);
    } catch (e) {
      return hasAstroConfig;
    }
  }

  getSafeguards() {
    return [
      'Astro Component & UI Primitive Reuse First Guard',
      'Tailwind v4 Semantic Design Token Guard',
      'Accessibility & ARIA Guard (A11y & alt tags)',
      'Secret & API Key Leak Scanner',
      'Content Collection Schema Validation Guard',
      'Vitest / Playwright Red-to-Green TDD Validator',
      'Educational Audit Gate (05-audit-report.md)',
      'Memory Guard (Engram / Graphify ADR Sync)'
    ];
  }

  provision(targetDir, config) {
    super.provision(targetDir, config);

    const huskyDir = path.join(targetDir, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    const content = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx astro check
npx vitest run
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = AstroAdapter;
