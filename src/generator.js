/**
 * CLC Forge — Universal Provisioning Engine
 * Manifest-driven tool installation and dynamic pre-commit hook generation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generates a pre-commit hook dynamically from the adapter's tool manifest.
 * Frontend projects use .husky; backend projects use .githooks.
 * @param {object} adapter - Adapter with getTools() and projectType
 * @param {string} targetDir - Target project root
 */
function generateHookFromManifest(adapter, targetDir) {
  const tools = adapter.getTools();
  const isFront = adapter.projectType === 'frontend';

  const hookDir = isFront
    ? path.join(targetDir, '.husky')
    : path.join(targetDir, '.githooks');
  const hookFile = path.join(hookDir, 'pre-commit');

  const lines = [];
  if (isFront) {
    lines.push('#!/usr/bin/env sh');
    lines.push('. "$(dirname -- "$0")/_/husky.sh"');
    lines.push('');
  } else {
    lines.push('#!/usr/bin/env bash');
    lines.push(`echo "Running CLC Forge ${adapter.name} Safeguards..."`);
    lines.push('');
  }

  tools.forEach(tool => {
    if (!tool.command) return;
    lines.push(tool.command);
  });

  fs.mkdirSync(hookDir, { recursive: true });
  fs.writeFileSync(hookFile, lines.join('\n'), 'utf-8');
  try { fs.chmodSync(hookFile, '755'); } catch (e) {}

  if (!isFront) {
    try {
      execSync('git config core.hooksPath .githooks', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {}
  }
}

/**
 * Installs tools from an adapter's manifest into the target tools/ directory.
 * Only copies tools with valid descriptors. External CLIs are skipped (no file to copy).
 * Always copies the audit orchestrator for the project type.
 * @param {string} targetDir - Target project root
 * @param {Array} manifest - Tool manifest from adapter.getTools()
 * @param {object} config - Project config (projectType, framework, testRunner)
 */
function installToolsFromManifest(targetDir, manifest, config) {
  const sourceToolsDir = path.join(__dirname, '..', 'tools');
  const isFront = config.projectType === 'frontend';

  // Validate descriptors: skip + warn tools missing required fields
  const validTools = manifest.filter(tool => {
    if (!tool.name || !tool.language || !tool.command) {
      console.warn(`Warning: tool "${tool.name || '(unnamed)'}" skipped - missing name, language, or command`);
      return false;
    }
    return true;
  });

  // Always copy the audit orchestrator for the right language
  const orchestrator = isFront ? 'audit.js' : 'audit.py';
  const orchestratorSrc = path.join(sourceToolsDir, orchestrator);
  const orchestratorDest = path.join(targetDir, 'tools', orchestrator);
  if (fs.existsSync(orchestratorSrc)) {
    fs.copyFileSync(orchestratorSrc, orchestratorDest);
    try { fs.chmodSync(orchestratorDest, '755'); } catch (e) {}
  }

  // Copy only custom tools with valid paths (skip external CLIs and empty paths)
  validTools.forEach(tool => {
    if (tool.language === 'external' || !tool.path) return;
    const srcFile = path.join(sourceToolsDir, tool.path);
    const destFile = path.join(targetDir, 'tools', tool.path);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      try { fs.chmodSync(destFile, '755'); } catch (e) {}
    } else {
      console.warn(`Warning: tool "${tool.path}" declared by adapter but not found in bundled tools/. Skipping.`);
    }
  });
}

/**
 * Installs a minimal fallback tool set when no adapter is provided.
 * Copies audit.js, audit.py, scan_secrets.js, scan_secrets.py.
 * @param {string} targetDir - Target project root
 */
function installFallbackTools(targetDir) {
  const sourceToolsDir = path.join(__dirname, '..', 'tools');
  const fallbackFiles = ['audit.js', 'audit.py', 'scan_secrets.js', 'scan_secrets.py', 'check_custom.js', 'check_custom.py'];

  fallbackFiles.forEach(file => {
    const srcFile = path.join(sourceToolsDir, file);
    const destFile = path.join(targetDir, 'tools', file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      try { fs.chmodSync(destFile, '755'); } catch (e) {}
    }
  });
}

/**
 * Generates a minimal generic pre-commit hook when no adapter is available.
 * @param {string} targetDir - Target project root
 * @param {string} projectType - 'frontend' or 'backend'
 */
function generateFallbackHook(targetDir, projectType) {
  const isFront = projectType === 'frontend';

  if (isFront) {
    const hookDir = path.join(targetDir, '.husky');
    fs.mkdirSync(hookDir, { recursive: true });
    const hookFile = path.join(hookDir, 'pre-commit');
    fs.writeFileSync(hookFile, `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

node tools/scan_secrets.js || true
`, 'utf-8');
    try { fs.chmodSync(hookFile, '755'); } catch (e) {}
  } else {
    const hookDir = path.join(targetDir, '.githooks');
    fs.mkdirSync(hookDir, { recursive: true });
    const hookFile = path.join(hookDir, 'pre-commit');
    fs.writeFileSync(hookFile, `#!/usr/bin/env bash
echo "Running CLC Forge Safeguards..."
python3 tools/scan_secrets.py || true
`, 'utf-8');
    try { fs.chmodSync(hookFile, '755'); } catch (e) {}
    try {
      execSync('git config core.hooksPath .githooks', { cwd: targetDir, stdio: 'ignore' });
    } catch (e) {}
  }
}

function generateHarness(targetDir, config) {
  // Step 1: Provision directories + AGENTS.md
  if (config.adapter) {
    config.adapter.provision(targetDir, config);
  } else {
    // Fallback: create directory structure + AGENTS.md
    const isFront = config.projectType === 'frontend';

    fs.mkdirSync(path.join(targetDir, 'docs', 'Journal'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'docs', 'Architecture'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'docs', 'Development'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'sdds'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'tools'), { recursive: true });

    const gitignorePath = path.join(targetDir, '.gitignore');
    let gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';
    if (!gitignoreContent.includes('sdds/*')) {
      gitignoreContent += '\n\n# Local Spec-Driven Development (SDD) files\nsdds/*\n!sdds/.gitkeep\nopenspec/*\n!openspec/.gitkeep\n.ruff_cache/\n';
      fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
    }
    fs.writeFileSync(path.join(targetDir, 'sdds', '.gitkeep'), '', 'utf-8');

    const agentsContent = `# CLC Forge ${config.framework} (${config.projectType.toUpperCase()}) — AGENTS

This document is the **authoritative law** for AI agents working in this repository.
Forged by **CLC Forge: The AI Agent Governance Engine**.

> **RULE #0: MANDATORY EXECUTION OVERRIDE RULE (UNBYPASSABLE)**
> Even when the user issues a direct or urgent fix request ("fix this bug", "fix this error", "quick fix"):
> YOU ARE STRICTLY FORBIDDEN from modifying source code directly without completing the full quality harness:
> 1. **Research & Root Cause Analysis:** Investigate tracebacks and inspect affected files before editing.
> 2. **TDD Verification (Red Phase):** Write a failing regression test first (${config.testRunner}).
> 3. **Clean Architecture Implementation (Green Phase):** Make the test pass maintaining layer isolation.
> 4. **Mandatory Educational Audit Gate:** Execute \`node tools/audit.js\` or \`python tools/audit.py\` and output the Educational Code Summary to stdout.
> NEVER declare success or skip verification commands for quick fixes.

## 1. The Loop (Every Task)
1. **Research** — Inspect codebase / docs before writing code.
2. **Plan** — Write an SDD under \`sdds/{change-name}/\`. SDDs live 100% locally and are gitignored.
3. **Test** (TDD) — Write failing test first (${config.testRunner}).
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
  }

  // Step 2: Install tools (manifest-driven or fallback)
  if (config.adapter) {
    const manifest = config.adapter.getTools();
    installToolsFromManifest(targetDir, manifest, config);
  } else {
    installFallbackTools(targetDir);
  }

  // Step 3: Generate pre-commit hook (manifest-driven or fallback)
  if (config.adapter) {
    generateHookFromManifest(config.adapter, targetDir);
  } else {
    generateFallbackHook(targetDir, config.projectType);
  }
}

module.exports = { generateHarness, generateHookFromManifest };
