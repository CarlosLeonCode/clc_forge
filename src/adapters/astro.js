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

  /**
   * Returns the tool manifest for Astro projects.
   * Includes JS guard scripts and external CLI tools (astro check, vitest).
   * @returns {Array<{name: string, language: string, path: string, command: string, description: string, extCLI?: string}>}
   */
  getTools() {
    return [
      { name: 'scan_secrets', language: 'js',       path: 'scan_secrets.js', command: 'node tools/scan_secrets.js', description: 'Scans for leaked secrets and API keys' },
      { name: 'check_a11y',   language: 'js',       path: 'check_a11y.js',   command: 'node tools/check_a11y.js',   description: 'Validates ARIA and accessibility rules' },
      { name: 'astro_check',  language: 'external', path: '', command: 'npx astro check', description: 'Astro type checking', extCLI: 'astro' },
      { name: 'vitest',       language: 'external', path: '', command: 'npx vitest run',  description: 'Test runner', extCLI: 'vitest' },
    ];
  }

  provision(targetDir, config) {
    super.provision(targetDir, config);
    // Pre-commit hook generation moved to generator.js via getTools() manifest
  }
}

module.exports = AstroAdapter;
