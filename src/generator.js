/**
 * CLC Forge — Provisioning Engine
 * Copies tools, sets permissions, provisions git hooks, creates docs/ & sdds/,
 * and writes the project AGENTS.md document for CLC Forge.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateHarness(targetDir, config) {
  const isFront = config.projectType === 'frontend';

  // 1. Create docs/ and sdds/ directories
  fs.mkdirSync(path.join(targetDir, 'docs', 'Journal'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'docs', 'Architecture'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'docs', 'Development'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'sdds'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'tools'), { recursive: true });

  // 2. Ensure sdds/ is gitignored
  const gitignorePath = path.join(targetDir, '.gitignore');
  let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';
  if (!gitignoreContent.includes('sdds/*')) {
    gitignoreContent += '\n\n# Local Spec-Driven Development (SDD) files\nsdds/*\n!sdds/.gitkeep\nopenspec/*\n!openspec/.gitkeep\n.ruff_cache/\n';
    fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
  }
  fs.writeFileSync(path.join(targetDir, 'sdds', '.gitkeep'), '', 'utf-8');

  // 3. Generate AGENTS.md
  const agentsContent = `# 🔨 CLC Forge ${isFront ? 'Frontend' : 'Backend'} — AGENTS

This document is the **authoritative law** for AI agents working in this repository.
Forged by **CLC Forge: The AI Agent Governance Engine**.

## 1. The Loop (Every Task)
1. **Research** — Inspect codebase / docs before writing code.
2. **Plan** — Write an SDD under \`sdds/{change-name}/\`. SDDs live 100% locally and are gitignored.
3. **Test** (TDD) — Write failing test first.
4. **Implement** — Make test pass.
5. **Verify & Audit** — Run \`node tools/audit.js\` or \`python tools/audit.py\`.
6. **DoD** — Lint, typecheck, tests, coverage, docs, memory.
7. **Commit** — Pre-commit hook runs automated guards.
8. **PR** — Generate PR body.

## 2. Core AI Safeguards
${isFront ? `- UI Component Reuse First (components/ui/ & semantic tokens)
- Next.js Clean Architecture Guard
- Secret & Client Exposure Guard
- Accessibility & ARIA Guard (A11y)
- Zod API Contract Guard
- Next/Image & Tree-Shaking Guard
- Storybook Coverage Guard
- Educational Audit Gate
- Memory Guard (Engram / Graphify)` : `- Wait for Audit Gate
- Scope Guardrail
- Real TDD Validation (Red -> Green)
- Secret Leak Guard
- Clean Architecture AST Guard
- Database Migration Idempotency Guard
- Memory Guard (Engram / Graphify)`}
`;
  fs.writeFileSync(path.join(targetDir, 'AGENTS.md'), agentsContent, 'utf-8');

  // 4. Copy tools from source template
  const sourceToolsDir = isFront
    ? path.join('/Users/carlosleoncodepro/Dev/kino/Kino-front', 'tools')
    : path.join('/Users/carlosleoncodepro/Dev/kino/Kino-back', 'tools');

  if (fs.existsSync(sourceToolsDir)) {
    fs.readdirSync(sourceToolsDir).forEach(file => {
      const srcFile = path.join(sourceToolsDir, file);
      const destFile = path.join(targetDir, 'tools', file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        if (file.endsWith('.js') || file.endsWith('.py') || file.endsWith('.sh')) {
          try { fs.chmodSync(destFile, '755'); } catch (e) {}
        }
      }
    });
  }

  // 5. Setup Git Hooks
  if (config.gitHooks === 'husky' || isFront) {
    const huskyDir = path.join(targetDir, '.husky');
    fs.mkdirSync(huskyDir, { recursive: true });
    const huskyPreCommit = path.join(huskyDir, 'pre-commit');
    const huskyContent = `#!/usr/bin/env sh
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
    fs.writeFileSync(huskyPreCommit, huskyContent, 'utf-8');
    try { fs.chmodSync(huskyPreCommit, '755'); } catch (e) {}
  } else {
    const githooksDir = path.join(targetDir, '.githooks');
    fs.mkdirSync(githooksDir, { recursive: true });
    const backPreCommit = path.join(githooksDir, 'pre-commit');
    const backContent = `#!/usr/bin/env bash
python3 tools/scan_secrets.py
python3 tools/check_scope.py
python3 tools/check_architecture.py
python3 tools/check_migrations.py
`;
    fs.writeFileSync(backPreCommit, backContent, 'utf-8');
    try { fs.chmodSync(backPreCommit, '755'); } catch (e) {}

    try {
      execSync('git config core.hooksPath .githooks', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {}
  }
}

module.exports = { generateHarness };
