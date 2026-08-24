/**
 * CLC Forge — Next.js Stack Adapter
 * Supports Next.js (App Router), React 19, Tailwind CSS v4, Vitest, and the complete 10 Frontend Safeguards.
 */

const fs = require('fs');
const path = require('path');
const BaseAdapter = require('./base');

class NextjsAdapter extends BaseAdapter {
  constructor() {
    super('Next.js (App Router)', 'frontend', 'Vitest / Jest');
  }

  detect(targetDir) {
    const hasPkg = fs.existsSync(path.join(targetDir, 'package.json'));
    if (!hasPkg) return false;

    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      return Boolean(deps['next']);
    } catch (e) {
      return false;
    }
  }

  getSafeguards() {
    return [
      'UI Component Reuse First Guard (components/ui/ & atomic primitives)',
      'Tailwind v4 Semantic Design Token Guard (bg-primary, text-muted-foreground)',
      'Next.js Clean Architecture & Server Components Guard (layout.tsx protection)',
      'Secret & Client Token Exposure Guard',
      'Accessibility & ARIA Guard (A11y & alt tags)',
      'Zod API Contract Guard (services response schema parsing)',
      'Performance & Next/Image Guard (next/image & tree-shaking)',
      'Storybook Story Coverage Guard (.stories.tsx)',
      'Educational Audit Gate (05-audit-report.md)',
      'Memory Guard & PR Generator (.github/pull_request_body.md)'
    ];
  }

  provision(targetDir, config) {
    super.provision(targetDir, config);

    const huskyDir = path.join(targetDir, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    const content = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

node tools/check_ui_reuse.js
node tools/check_architecture.js
node tools/scan_secrets.js
node tools/check_a11y.js
node tools/check_api_contracts.js
node tools/check_performance.js
node tools/check_storybook.js
npx tsc --noEmit
npx lint-staged
`;
    fs.writeFileSync(preCommitPath, content, 'utf-8');
    try { fs.chmodSync(preCommitPath, '755'); } catch (e) {}
  }
}

module.exports = NextjsAdapter;
