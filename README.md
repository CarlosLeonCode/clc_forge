# 🔨 CLC Forge (`clc-forge`) v1.1.0

[![npm version](https://img.shields.io/npm/v/clc-forge.svg)](https://www.npmjs.com/package/clc-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> **CLC Forge:** The Universal Polyglot AI Agent Governance & Quality Engineering Engine by Carlos Leon Code.
> **Official NPM Package:** [https://www.npmjs.com/package/clc-forge](https://www.npmjs.com/package/clc-forge)

---

## 🌐 Universal Polyglot & Multi-Stack Adapters

`clc-forge` is 100% framework and language agnostic. It features an automated **Polyglot Stack Adapter Engine** that detects repository signatures and provisions tailored safeguards:

| Ecosystem | Auto-Detected Signatures | Test Runner | Provisioned Safeguards & Linters |
|---|---|---|---|
| 💎 **Ruby on Rails** | `Gemfile`, `config/routes.rb` | `RSpec` / `Minitest` | RuboCop AST Linter, Brakeman Security, Rails Migration Idempotency, RSpec TDD. |
| 🚀 **Astro** | `astro.config.mjs`, `astro` | `Vitest` / `Playwright` | Astro Component Reuse, Tailwind v4 Tokens, A11y & ARIA, Vitest TDD. |
| 🐹 **Go (Golang)** | `go.mod` | `go test` | `golangci-lint` AST Linter, Go Clean Architecture (Domain/UseCase), `go test` TDD. |
| 🦀 **Rust Engine** | `Cargo.toml` | `cargo test` | `cargo clippy` AST Linter, `cargo audit` Security, `cargo test` TDD. |
| 🐘 **PHP (Laravel)** | `composer.json`, `artisan` | `Pest` / `PHPUnit` | PHPStan AST Linter, Laravel Migration Idempotency, Pest/PHPUnit TDD. |
| ⚛️ **Next.js / React** | `package.json` (`next`) | `Vitest` | UI Reuse, Semantic Tokens, Server Components, Zod Contracts, A11y, Next/Image. |
| 🐍 **FastAPI / Python** | `pyproject.toml`, `requirements.txt` | `Pytest` | AST Clean Architecture, Alembic Migration Idempotency, Scope Guard, Pytest TDD. |

---

## 💡 Why CLC Forge Exists & The Problem It Solves

AI coding agents (such as Claude Code, Cursor, Antigravity, and Gemini CLI) generate code extraordinarily fast. However, without strict behavioral boundaries, AI agents introduce **technical debt and silent production failures**:

- ❌ **Hardcoded Design Tokens & Broken Dark Mode:** Inventing arbitrary hex colors (`#1a2b3c`) or palette classes (`bg-slate-50`, `text-blue-600`) instead of semantic theme tokens (`bg-primary`, `text-muted-foreground`, `border-border`).
- ❌ **UI Primitive Duplication:** Writing raw `<button>`, `<input>`, or `<select>` HTML elements instead of reusing existing atomic components in `components/ui/`.
- ❌ **Runtime API Type Crashes:** Consuming backend HTTP responses directly without schema validation, causing `TypeError: Cannot read properties of undefined`.
- ❌ **Accessibility (A11y) Neglect:** Omitting `alt` tags on images or `aria-label` attributes on icon-only buttons.
- ❌ **Secret & Credential Leaks:** Accidentally committing private API keys, JWT secrets, or RSA keys to client-side bundles or repositories.
- ❌ **Clean Architecture Violations:** Importing state managers (`zustand`, `react-query`) inside presentational UI primitives or placing `"use client"` directives on root Next.js `layout.tsx` Server Components.
- ❌ **False-Positive Tests & Hallucinated Passes:** Claiming features work without executing automated TDD verification cycles (Red-to-Green transition).

---

## ⚡ Quick Start & Usage

### 1. Initialize or Provision CLC Forge in Any Repository
Navigate to any repository (Rails, Astro, Go, Rust, Next.js, FastAPI, Laravel) and execute:

```bash
npx clc-forge
```

### 2. Audit Existing Repository Health
To verify if a repository complies 100% with the CLC Forge Quality Standard:

```bash
npx clc-forge doctor
```

---

## 👨‍💻 Author & License

Created and maintained by **Carlos Leon Code** ([@carlosleoncode](https://github.com/carlosleoncode)).

Released under the **MIT License**.
