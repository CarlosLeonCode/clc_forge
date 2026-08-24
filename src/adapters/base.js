/**
 * CLC Forge — Base Stack Adapter Interface
 * All framework-specific adapters (Rails, Astro, Next.js, FastAPI, Go, Rust, Laravel)
 * inherit from this interface to ensure universal polyglot harness behavior.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BaseAdapter {
  constructor(name, projectType, testRunner) {
    this.name = name;
    this.projectType = projectType;
    this.testRunner = testRunner;
  }

  detect(targetDir) {
    return false;
  }

  getSafeguards() {
    return [];
  }

  provision(targetDir, config) {
    // 1. Create docs/ and sdds/
    fs.mkdirSync(path.join(targetDir, 'docs', 'Journal'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'docs', 'Architecture'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'docs', 'Development'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'sdds'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'tools'), { recursive: true });

    // 2. Gitignore sdds/*
    const gitignorePath = path.join(targetDir, '.gitignore');
    let gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf-8') : '';
    if (!gitignore.includes('sdds/*')) {
      gitignore += '\n\n# Local Spec-Driven Development (SDD) files\nsdds/*\n!sdds/.gitkeep\nopenspec/*\n!openspec/.gitkeep\n.ruff_cache/\n';
      fs.writeFileSync(gitignorePath, gitignore, 'utf-8');
    }
    fs.writeFileSync(path.join(targetDir, 'sdds', '.gitkeep'), '', 'utf-8');

    // 3. Write AGENTS.md
    const isFront = this.projectType === 'frontend';
    const agentsContent = `# 🔨 CLC Forge ${this.name} (${this.projectType.toUpperCase()}) — AGENTS

This document is the **authoritative law** for AI agents working in this repository.
Forged by **CLC Forge: The AI Agent Governance Engine**.

## 1. The Loop (Every Task)
1. **Research** — Inspect codebase / docs before writing code.
2. **Plan** — Write an SDD under \`sdds/{change-name}/\`. SDDs live 100% locally and are gitignored.
3. **Test** (TDD) — Write failing test first (${this.testRunner}).
4. **Implement** — Make test pass.
5. **Verify & Audit** — Run \`node tools/audit.js\` or \`python tools/audit.py\`.
6. **DoD** — Lint, typecheck, tests, coverage, docs, memory.
7. **Commit** — Pre-commit hook runs automated guards.
8. **PR** — Generate PR body.

## 2. Core AI Safeguards (${this.name})
${this.getSafeguards().map(s => `- ${s}`).join('\n')}
`;
    fs.writeFileSync(path.join(targetDir, 'AGENTS.md'), agentsContent, 'utf-8');
  }
}

module.exports = BaseAdapter;
