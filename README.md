# 🔨 CLC Forge (`clc-forge`)

[![npm version](https://img.shields.io/npm/v/clc-forge.svg)](https://www.npmjs.com/package/clc-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> **CLC Forge:** The AI Agent Governance & Quality Engineering Engine by Carlos Leon Code.
> **Official NPM Package:** [https://www.npmjs.com/package/clc-forge](https://www.npmjs.com/package/clc-forge)

---

## 💡 Why CLC Forge Exists & The Problem It Solves

AI coding agents (such as Claude Code, Cursor, Antigravity, and Gemini CLI) are extraordinarily fast at generating code. However, without strict behavioral boundaries, AI agents frequently introduce **technical debt and silent production failures**:

- ❌ **Hardcoded Design Tokens & Broken Dark Mode:** Inventing arbitrary hex colors (`#1a2b3c`) or palette classes (`bg-slate-50`, `text-blue-600`) instead of semantic theme tokens (`bg-primary`, `text-muted-foreground`, `border-border`).
- ❌ **UI Primitive Duplication:** Writing raw `<button>`, `<input>`, or `<select>` HTML elements instead of reusing existing atomic components in `components/ui/`.
- ❌ **Runtime API Type Crashes:** Consuming backend HTTP responses directly without schema validation, causing `TypeError: Cannot read properties of undefined`.
- ❌ **Accessibility (A11y) Neglect:** Omitting `alt` tags on images or `aria-label` attributes on icon-only buttons.
- ❌ **Secret & Credential Leaks:** Accidentally committing private API keys, JWT secrets, or RSA keys to client-side bundles or repositories.
- ❌ **Clean Architecture Violations:** Importing state managers (`zustand`, `react-query`) inside presentational UI primitives or placing `"use client"` directives on root Next.js `layout.tsx` Server Components.
- ❌ **False-Positive Tests & Hallucinated Passes:** Claiming features work without executing automated TDD verification cycles (Red-to-Green transition).

**CLC Forge solves this problem completely.** In under 5 seconds, `clc-forge` auto-detects your repository's technology stack and provisions **17 automated safeguards, AST linters, local Spec-Driven Development (SDD) workflows, educational audit gates, and git hooks**.

---

## ⚡ Quick Start & Usage

### 1. Initialize or Provision CLC Forge in Any Repository
Navigate to any new or existing project directory (Frontend, Backend, or Monorepo) and execute:

```bash
npx clc-forge
```

### 2. Audit Existing Repository Health
To verify if a repository complies 100% with the CLC Forge Quality Standard:

```bash
npx clc-forge doctor
```

### 3. Local Script Execution (From Source)
```bash
# Run CLI directly against any target directory
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js /path/to/target-repo

# Run Health Check on target repository
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js doctor /path/to/target-repo
```

---

## 🔍 Stack Auto-Discovery & Interactive Terminal UI

When executed, `clc-forge` inspects your project files (`package.json`, `pyproject.toml`, `requirements.txt`, `alembic.ini`, `.husky`, etc.) and presents an executive confirmation box:

```text
  ██████╗██╗      ██████╗     ███████╗██████╗ ██████╗ ██╗███████╗
 ██╔════╝██║     ██╔════╝     ██╔════╝██╔══██╗██╔══██╗██║██╔════╝
 ██║     ██║     ██║    █████╗█████╗  ██║  ██║██████╔╝██║█████╗  
 ██║     ██║     ██║    ╚════╝██╔══╝  ██║  ██║██╔══██╗██║██╔══╝  
 ╚██████╗███████╗╚██████╗     ██║     ╚██████╔╝██║  ██║██║███████╗
  ╚═════╝╚══════╝ ╚═════╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝

   CLC FORGE  The AI Agent Governance & Quality Engineering Engine v1.0.0

┌──────────────────────────────────────────────────────────────────┐
│  🔍 AUTO-DETECTED STACK CONFIGURATION                            │
├──────────────────────────────────────────────────────────────────┤
│  📦 Project Type        : FRONTEND                               │
│  🚀 Framework           : Next.js (App Router)                   │
│  🎨 Styling & UI        : Tailwind CSS v4 (shadcn/ui)            │
│  🧪 Test Runner         : Vitest                                 │
│  🔒 Git Hooks           : husky                                  │
└──────────────────────────────────────────────────────────────────┘

   [1] Confirm & Provision CLC Forge (Recommended)
   [2] Force FRONTEND Mode
   [3] Force BACKEND Mode
   [4] Cancel
```

---

## 🛡️ The 17 Automated Safeguards & Quality Guards

`clc-forge` installs un-bypassable git pre-commit hooks and AST inspection scripts tailored for your project type:

### 🎨 Frontend Safeguards (10 Guards)
1. **UI Component Reuse First Guard (`tools/check_ui_reuse.js`):** Enforces reuse of atomic primitives (`Button`, `Input`, `Select`, `Dialog`) from `@/components/ui/`. If a required UI component is missing, the AI agent is **required to stop and prompt the user** before writing code.
2. **Semantic Design Token Guard (`tools/check_ui_reuse.js`):** Blocks direct Tailwind palette classes (`bg-slate-50`, `text-blue-600`) and hardcoded hex colors (`#1a2b3c`). Forces semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`) for theme & dark-mode compatibility.
3. **Clean Architecture & Server Components Guard (`tools/check_architecture.js`):** Ensures UI primitives in `components/ui/` remain decoupled from state managers (`zustand`, `@tanstack/react-query`) or direct `fetch` calls, and prevents `"use client"` directives on root Next.js `layout.tsx` Server Components.
4. **Secret & Client Token Exposure Guard (`tools/scan_secrets.js`):** Scans git diffs to block private API keys (GCP, OpenAI, Anthropic), hardcoded JWTs, and RSA keys from leaking into client-side bundles.
5. **Accessibility & ARIA Guard (`tools/check_a11y.js`):** Enforces `alt` attributes on images and requires `aria-label` or `sr-only` text on icon-only buttons (`size="icon"`).
6. **Zod API Contract Guard (`tools/check_api_contracts.js`):** Verifies that HTTP requests in `src/services/` validate backend JSON responses with Zod schemas to prevent runtime `undefined` crashes.
7. **Performance & Next/Image Guard (`tools/check_performance.js`):** Replaces raw `<img />` tags with `import Image from 'next/image'` and blocks non-tree-shakable star imports (`import * as Icons from 'lucide-react'`).
8. **Storybook Story Coverage Guard (`tools/check_storybook.js`):** Audits atomic UI components to ensure matching `.stories.tsx` files exist for visual regression testing.
9. **Educational Audit Gate (`tools/audit.js`):** Generates `05-audit-report.md` detailing **What was done, Why, and What for** before requesting human review.
10. **Memory Guard & PR Generator (`tools/generate_pr_body.js` & `tools/update_memory.js`):** Assembles pre-filled GitHub `.github/pull_request_body.md` descriptions and syncs architectural decisions to Engram MCP and Knowledge Graphs.

### ⚙️ Backend Safeguards (7 Guards)
1. **Scope Guardrail (`tools/check_scope.py`):** Cross-references `git diff` against SDD affected files to prevent out-of-scope edits.
2. **Real TDD Validation (`tools/verify_tdd.py`):** Validates that unit tests exhibit a genuine Red-to-Green transition against base code.
3. **Secret Leak Guard (`tools/scan_secrets.py`):** AST regex scanner blocking hardcoded keys, DB passwords, or tokens.
4. **Clean Architecture AST Guard (`tools/check_architecture.py`):** Enforces strict layer isolation (Domain $\rightarrow$ Application $\rightarrow$ Routes).
5. **Database Migration Guard (`tools/check_migrations.py`):** Enforces reversible `downgrade()`, idempotent `UPDATE` queries, and zero ORM schema drift.
6. **Audit Gate (`tools/audit.py`):** Requires human review approval in `00-state.md` before advancing stages.
7. **Memory Guard (`tools/update_memory.py`):** Syncs ADR decisions into Engram MCP with fallback to `docs/Journal/`.

---

## 📁 What Is Generated (Repository Artifacts)

When `clc-forge` runs, it provisions the following directory tree:

```text
target-repository/
├── AGENTS.md                   # Authoritative law & rules document for AI agents
├── .gitignore                  # Automatically configured to ignore sdds/* and .ruff_cache/
├── .husky/                     # Or .githooks/ pre-commit hooks configured
│   └── pre-commit              # Enforces all 10 or 7 guards before every commit
├── .github/
│   └── pull_request_body.md    # Pre-filled PR description with ADR links & test steps
├── docs/
│   ├── Journal/                # Durable Architectural Decision Records (ADRs)
│   ├── Architecture/           # High-level architecture & graph reports
│   └── Development/            # Conventions, testing standards, and SDD workflows
├── sdds/                       # Local Spec-Driven Development directory (gitignored)
│   └── .gitkeep
└── tools/                      # Executable CLI tools suite (Node.js or Python)
    ├── check_ui_reuse.js
    ├── check_architecture.js
    ├── scan_secrets.js
    ├── check_a11y.js
    ├── check_api_contracts.js
    ├── check_performance.js
    ├── check_storybook.js
    ├── audit.js
    ├── generate_pr_body.js
    └── update_memory.js
```

---

## 🔄 Daily Developer Loop (The CLC Forge Loop)

1. **Research Phase:** Query Knowledge Graph / codebase before writing code.
2. **Planning Phase:** Create local spec under `sdds/{change-name}/` (`01-proposal.md` $\rightarrow$ `04-tasks.md`).
3. **TDD Phase:** Write failing unit test first (`npm test` / `pytest` exits 1).
4. **Implementation Phase:** Write clean code until test passes.
5. **Verification & Audit:** Execute `node tools/audit.js` to build `05-audit-report.md`.
6. **Commit Phase:** Git pre-commit hook runs all safeguards automatically.
7. **PR Phase:** `node tools/generate_pr_body.js` populates GitHub PR body.

---

## 🛠️ CLI Modular Architecture

```text
clc-forge/
├── package.json          # Configured for `clc-forge` on NPM
├── bin/
│   └── cli.js            # Executable binary entry point (chmod +x)
├── src/
│   ├── index.js          # Main orchestrator controller
│   ├── detector.js       # Stack Auto-Discovery Engine (Next.js, FastAPI, Vitest, Pytest, etc.)
│   ├── ui.js             # Pro Terminal ANSI Renderer (ASCII Banner, Boxes, Tables, Badges)
│   ├── generator.js      # Provisioning Engine for Front & Back
│   └── doctor.js         # Repository Health Checker & Linter (clc-forge doctor)
└── README.md             # Detailed documentation
```

---

## 👨‍💻 Author & License

Created and maintained by **Carlos Leon Code** ([@carlosleoncode](https://github.com/carlosleoncode)).

Released under the **MIT License**.
