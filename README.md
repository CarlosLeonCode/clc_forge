<img width="1254" height="1254" alt="clc_forge_logo" src="https://github.com/user-attachments/assets/fb78ba72-2c30-42d2-a738-c97c283b122c" />

# 🤖 CLC Forge (`clc-forge`)

[![npm version](https://img.shields.io/npm/v/clc-forge.svg)](https://www.npmjs.com/package/clc-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img width="1536" height="1024" alt="clc_forge_comparison" src="https://github.com/user-attachments/assets/2602679a-0927-4712-9ac9-793ec0c566e7" />


> **The Universal Polyglot AI Agent Governance Engine & AIUP Orchestrator.**
> Built by [Carlos Leon Code](https://github.com/carlosleoncode).

AI coding agents (Claude, Cursor, Gemini) generate code extraordinarily fast, but without strict boundaries, they introduce technical debt, hallucinated tests, and architecture violations. **CLC Forge** is the definitive harness to tame them. 

It implements an **AI Unified Process (AIUP)**—forcing LLMs to follow strict software engineering lifecycles (SDD, TDD, Clean Architecture) regardless of the programming language.

---

## ⚙️ The Dual-Engine: SDD & TDD (Configurable)
The backbone of the CLC Forge methodology is built on two core pillars that force agents to think before they type:
- 📝 **SDD (Spec-Driven Development):** Agents are forbidden from writing code without first generating a local specification (under `sdds/`) and passing a Human-in-the-Loop (HIT) approval gate.
- 🧪 **TDD (Test-Driven Development):** Agents must prove a Red-to-Green test transition. If the test doesn't fail first, the implementation is rejected by the harness.

*Don't like TDD? Prefer BDD or a custom lifecycle?* Because CLC Forge is an interactive Orchestrator, when you run `clc_forge start`, the agent will ask you about your preferred methodology and adjust the `.clc-forge.yaml` execution phases dynamically.

---

## 💡 Why CLC Forge Exists
Left to their own devices, AI agents suffer from "immediacy bias"—rushing to write code without planning. This leads to silent production failures:
- ❌ **Architectural Decay:** Mixing routing logic with database calls instead of respecting layer isolation (Clean Architecture).
- ❌ **UI Duplication:** Inventing arbitrary hex colors and raw HTML instead of reusing your semantic design tokens.
- ❌ **False-Positive TDD:** Claiming a feature works without ever proving a Red-to-Green test transition.
- ❌ **Security Leaks:** Accidentally committing API keys or exposing private backend DTOs to the client.

CLC Forge solves this by shifting the LLM from a "code autocomplete tool" into a disciplined **Software Engineer** bound by deterministic AST linters and mandatory planning gates.

---

## 🤝 Synergy with Engram (Memory + Governance)
To build truly autonomous AI systems, an agent needs two things: **Process** and **Memory**. 
- **CLC Forge** provides the *Process* (The AIUP Governance, SDD/TDD lifecycles, and execution guardrails).
- **Engram (MCP)** provides the *Memory* (Long-term project context, ADRs, and session persistence).

They are designed to be the perfect symbiotic stack. While **Engram** remembers *why* an architectural decision was made three months ago, **CLC Forge** enforces *how* the agent writes the code today to respect that decision.

---

## 🧠 The Conversational CLI Paradigm
CLC Forge is not just a terminal CLI; it operates natively within your LLM. When initialized, it injects an **Agentic Playbook (`SKILL.md`)** into your repository, turning any AI IDE into an interactive governance wizard.

Just open your AI chat and type these intents:
- 🚀 **`clc_forge start`**: The agent auto-detects your stack, proposes a governance lifecycle, and materializes a declarative `.clc-forge.yaml` specification.
- 🛠️ **`clc_forge create_guard`**: The agent writes a custom AST linter in your stack's **native language** (Ruby, Go, Rust, Python, JS).
- 🔄 **`clc_forge add_phase` / `remove_guard`**: Interactively mutate the AIUP lifecycle without touching YAML manually.

---

## 🔗 Universal IDE Symlinking (Zero-Config)
Initialize once, govern everywhere. CLC Forge automatically generates cross-platform symlinks mapped to the Single Source of Truth (`AGENTS.md`), ensuring instant context absorption for:
- 💠 **Cursor** (`.cursorrules` & `.cursor/rules/clc_forge_context.mdc`)
- 🧠 **Claude Desktop / Windsurf** (`CLAUDE.md`)
- 🌌 **Gemini CLI / Project IDX** (`GEMINI.md`)
- ✈️ **GitHub Copilot** (`.github/copilot-instructions.md`)
- 🛸 **Antigravity** (`.antigravity/rules.md`)

---

## 🌐 Polyglot Stack Adapters
CLC Forge is 100% framework-agnostic. It features dedicated adapters that auto-detect your stack and enforce native rules:

| Ecosystem | Detection Signature | Test Runner | Enforced Safeguards |
|---|---|---|---|
| ⚛️ **Next.js** | `next` | Vitest / Jest | UI Reuse, Semantic Tokens, RSC Rules, Zod, A11y |
| ⚡ **FastAPI** | `fastapi` | Pytest | Pydantic V2, Alembic Idempotency, Clean Arch AST |
| 💎 **Rails** | `Gemfile` | RSpec | RuboCop AST, Brakeman Security, Migration Idempotency |
| 🐹 **Golang** | `go.mod` | `go test` | `golangci-lint` AST, Domain/UseCase Clean Architecture |
| 🦀 **Rust** | `Cargo.toml` | `cargo test`| `cargo clippy` AST, `cargo audit`, Strict Memory Safety |
| 🐘 **Laravel** | `artisan` | Pest / PHPUnit | PHPStan AST, Eloquent N+1 Detection, Migrations |
| 🎸 **Django** | `manage.py` | `pytest-django`| Django ORM Idempotency, Ruff AST, Scope Guard |
| 🚀 **Astro** | `astro.config` | Playwright | Tailwind v4 Tokens, Content Collection Schema Guard |

---

## ⚡ Quick Start

### 1. Bootstrap the Harness (Terminal)
Navigate to any repository and run:
```bash
npx clc-forge init
```
*This generates the core `AGENTS.md`, the AIUP Skill, and IDE symlinks.*

### 2. Enter the Conversational CLI (LLM Chat)
Open your favorite AI IDE (Cursor, Claude, Gemini) and prompt:
> "clc_forge start"

### 3. Audit Repository Health (Terminal)
To verify if a repository complies with the CLC Forge Quality Standard:
```bash
npx clc-forge doctor
```
