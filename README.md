<div align="center">
  <img width="350" height="350" alt="clckernel_logo" src="https://github.com/user-attachments/assets/ed631ce1-c996-4347-b818-97b8ab25e0ec" />
</div>

# 🤖 CLC Kernel (`clckernel`)

[![npm version](https://img.shields.io/npm/v/clckernel.svg)](https://www.npmjs.com/package/clckernel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Español](https://img.shields.io/badge/README-Español-blue.svg)](./README.es.md)


> **The Universal Polyglot AI Agent Governance Engine & AIUP Orchestrator.**
> Built by [CarlosLeonCode](https://github.com/carlosleoncode).

AI coding agents (Claude, Cursor, Gemini) generate code extraordinarily fast, but without strict boundaries, they introduce technical debt, hallucinated tests, and architecture violations. **CLC Kernel** is the definitive harness to tame them. 

It implements an **AI Unified Process (AIUP)**—forcing LLMs to follow strict software engineering lifecycles (SDD, TDD, Clean Architecture) regardless of the programming language.

---

## 🎯 Positioning: A New Category — AI Agent Governance

CLC Kernel is **not** "just another AI framework" or prompt collection. It pioneers a distinct engineering category: **Deterministic AI Agent Governance**.

| Tool Category | What It Does | Where It Falls Short | CLC Kernel Advantage |
|---|---|---|---|
| **Prompt Rules** (`.cursorrules`, `.mdc`) | Injects markdown suggestions into chat context. | **Non-deterministic:** Ignored during large contexts or quick-fix prompts. | Enforces native **AST Linters** that physically block non-compliant Git commits. |
| **Spec Tools** (OpenSpec, Markdown specs) | Documents specifications & design requirements. | **Static:** Doesn't verify failing test transitions or guard code changes. | Full **AIUP lifecycle:** Spec -> Human Gate -> Red-to-Green TDD -> AST Verification. |
| **Agent Runtimes** (LangGraph, CrewAI) | Builds multi-agent production backend apps. | **Different problem:** Doesn't govern human-in-the-loop repo development. | **Developer Tooling Harness:** Injected directly into your daily IDE workflow. |

---

## ⚙️ The Dual-Engine: SDD & TDD (Configurable)
The backbone of the CLC Kernel methodology is built on two core pillars that force agents to think before they type:
- 📝 **SDD (Spec-Driven Development):** Agents are forbidden from writing code without first generating a local specification (under `sdds/`) and passing a Human-in-the-Loop (HIT) approval gate.
- 🧪 **TDD (Test-Driven Development):** Agents must prove a Red-to-Green test transition. If the test doesn't fail first, the implementation is rejected by the harness.

*Don't like TDD? Prefer BDD or a custom lifecycle?* Because CLC Kernel is an interactive Orchestrator, when you run `clckernel start`, the agent will ask you about your preferred methodology and adjust the `.clckernel.yaml` execution phases dynamically.

---

## 💡 Why CLC Kernel Exists
Left to their own devices, AI agents suffer from "immediacy bias"—rushing to write code without planning. This leads to silent production failures:
- ❌ **Architectural Decay:** Mixing routing logic with database calls instead of respecting layer isolation (Clean Architecture).
- ❌ **UI Duplication:** Inventing arbitrary hex colors and raw HTML instead of reusing your semantic design tokens.
- ❌ **False-Positive TDD:** Claiming a feature works without ever proving a Red-to-Green test transition.
- ❌ **Security Leaks:** Accidentally committing API keys or exposing private backend DTOs to the client.

CLC Kernel solves this by shifting the LLM from a "code autocomplete tool" into a disciplined **Software Engineer** bound by deterministic AST linters and mandatory planning gates.

<div align="center">
  <img width="900" alt="clckernel_comparison" src="https://github.com/user-attachments/assets/cb62753a-3e88-432d-9196-94eaa817864d" />
  <p><em>Left: AI agent without governance — chaotic, hallucinated code. Right: AI agent with CLC Kernel AIUP — structured, safe, architectural.</em></p>
</div>

---

## 🤝 Synergy with Engram (Memory + Governance)
To build truly autonomous AI systems, an agent needs two things: **Process** and **Memory**. 
- **CLC Kernel** provides the *Process* (The AIUP Governance, SDD/TDD lifecycles, and execution guardrails).
- **Engram (MCP)** provides the *Memory* (Long-term project context, ADRs, and session persistence).

They are designed to be the perfect symbiotic stack. While **Engram** remembers *why* an architectural decision was made three months ago, **CLC Kernel** enforces *how* the agent writes the code today to respect that decision.

---

## 🧩 Recommended Ecosystem Dependencies (Optional & Modular)
CLC Kernel focuses strictly on **Governance, Process, and Quality Guardrails**. It intentionally does **not** bundle a proprietary graph engine or persistence database. Instead, it delegates those capabilities to specialized companion tools (with graceful skip if they are not installed in the environment):

| Companion Tool | Role | Why It's Recommended | Fallback Behavior |
|---|---|---|---|
| 🧠 **[Engram (MCP)](https://github.com/Gentleman-Programming/gentle-ai)** | Long-Term Memory & ADRs | Preserves architectural context, design rationales, and cross-session knowledge for agents. | Graceful skip (audits proceed without persistent memory). |
| 🕸️ **[Graphify](https://github.com/carlosleoncode/graphify)** | Code Knowledge Graph | Generates dependency graphs and visual codebase topology for architecture-aware agents. | Graceful skip (`verify_memory_graph` advisory check passes). |
| 🛡️ **[Gentle AI (RDD)](https://github.com/Gentleman-Programming/gentle-ai)** | Adversarial Review Gate | Enforces Review-Driven Development (RDD) with multi-lens inspection before commits. | Graceful skip (`verify_rdd_review_gate` advisory check passes). |
| ⚡ **Native Stack Linters** | AST & Type Safety | `ruff` (Python), `golangci-lint` (Go), `cargo clippy` (Rust), `phpstan` (PHP), `tsc` (TypeScript). | Uses whatever CLI is available in the local repository environment. |

---

## 🧠 The Conversational CLI Paradigm
CLC Kernel is not just a terminal CLI; it operates natively within your LLM. When initialized, it injects an **Agentic Playbook (`SKILL.md`)** into your repository, turning any AI IDE into an interactive governance wizard.

Just open your AI chat and type these intents:
- 🚀 **`clckernel start`**: The agent auto-detects your stack, proposes a governance lifecycle, and materializes a declarative `.clckernel.yaml` specification.
- 🛠️ **`clckernel create_guard`**: The agent writes a custom AST linter in your stack's **native language** (Ruby, Go, Rust, Python, JS).
- 🔄 **`clckernel add_phase` / `remove_guard`**: Interactively mutate the AIUP lifecycle without touching YAML manually.

---

## 🔗 Universal IDE Symlinking (Zero-Config)
Initialize once, govern everywhere. CLC Kernel automatically generates cross-platform symlinks mapped to the Single Source of Truth (`AGENTS.md`), ensuring instant context absorption for:
- 💠 **Cursor** (`.cursorrules` & `.cursor/rules/clckernel_context.mdc`)
- 🧠 **Claude Desktop / Windsurf** (`CLAUDE.md`)
- 🌌 **Gemini CLI / Project IDX** (`GEMINI.md`)
- ✈️ **GitHub Copilot** (`.github/copilot-instructions.md`)
- 🛸 **Antigravity** (`.antigravity/rules.md`)

---

## 🌐 Polyglot Stack Adapters
CLC Kernel is 100% framework-agnostic. It features dedicated adapters that auto-detect your stack and enforce native rules:

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

## ⚡ Step-by-Step Guide (Full Lifecycle)

```
[1. Terminal]           [2. AI Chat]                 [3. TDD Loop]                 [4. Git Commit]
npx clckernel   ───►   clckernel start   ───►   "Feature X with harness"   ───►   Pre-commit Hooks
(Bootstrap)            (Interactive Setup)          (SDD -> HIT -> Tests)         (AST & Secret Guard)
```

### 1️⃣ Step 1: Bootstrap the Repository (Terminal)
Navigate to your project root and run:
```bash
npx clckernel
```
- **What happens:** Auto-detects your stack (e.g., FastAPI, Next.js, Rails), generates `AGENTS.md`, provisions `.githooks/` or `.husky/`, creates deterministic AST tools in `tools/`, and links IDE rules (`.cursorrules`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.antigravity/rules.md`).

### 2️⃣ Step 2: Open Your AI IDE & Initialize (Conversational CLI)
Open the project in Cursor, Claude Code, Gemini CLI, Windsurf, or Copilot. In the chat, prompt:
> `clckernel start`
- **What happens:** The agent scans your codebase silently, proposes an AIUP governance plan tailored to your framework, and generates your custom `.clckernel.yaml` specification after your confirmation.

### 3️⃣ Step 3: Daily Development with the Harness
When requesting features, bug fixes, or refactors, always invoke the harness trigger:
> *"Add user authentication endpoint. **Use the workflow / harness**."*
- **What happens:** The agent automatically runs the 10-step AIUP cycle:
  1. **SDD & Research:** Writes the specification under `sdds/{feature}/`.
  2. **HIT Gate (Human-in-the-Loop):** Presents test scenarios for your review before touching code.
  3. **TDD (Red Phase):** Writes failing regression tests first.
  4. **Implementation (Green Phase):** Writes layered, clean code until tests pass.
  5. **Audit:** Executes `tools/audit` to guarantee zero layer leaks or secret exposures.

### 4️⃣ Step 4: Deterministic Guard Verification (Commit)
Stage and commit your changes:
```bash
git add .
git commit -m "feat(auth): add user authentication endpoint"
```
- **What happens:** Pre-commit hooks run automated AST scanners (Clean Architecture, Secret Leak, Scope Guard, Migration Idempotency). Any violation blocks the commit deterministically.

### 5️⃣ Step 5: Verify Repository Health Anytime (Terminal)
To verify if a repository complies with the CLC Kernel Quality Standard at any moment:
```bash
npx clckernel doctor
```

