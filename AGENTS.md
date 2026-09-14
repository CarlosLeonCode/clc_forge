# CLC Kernel FastAPI (BACKEND) — AGENTS

This document is the **authoritative law** for AI agents working in this repository.
Forged by **CLC Kernel: The AI Agent Governance Engine**.

> **RULE #0: MANDATORY EXECUTION OVERRIDE RULE (UNBYPASSABLE)**
> Even when the user issues a direct or urgent fix request ("fix this bug", "fix this error", "quick fix"):
> YOU ARE STRICTLY FORBIDDEN from modifying source code directly without completing the full quality harness:
> 1. **Research & Root Cause Analysis:** Investigate tracebacks and inspect affected files before editing.
> 2. **TDD Verification (Red Phase):** Write a failing regression test first (Pytest).
> 3. **Clean Architecture Implementation (Green Phase):** Make the test pass maintaining layer isolation.
> 4. **Mandatory Educational Audit Gate:** Execute `node tools/audit.js` or `python tools/audit.py` and output the Educational Code Summary to stdout.
> NEVER declare success or skip verification commands for quick fixes.

## 1. The Loop (Every Task)
1. **Research** — Inspect codebase / docs before writing code.
2. **Plan** — Write an SDD under `sdds/{change-name}/`. SDDs live 100% locally and are gitignored.
3. **Test** (TDD) — Write failing test first (Pytest).
4. **Implement** — Make test pass.
5. **Verify & Audit** — Run `node tools/audit.js` or `python tools/audit.py`.
6. **DoD** — Lint, typecheck, tests, coverage, docs, memory.
7. **Commit** — Pre-commit hook runs automated guards.
8. **PR** — Generate PR body.

## 2. Core AI Safeguards
- Wait for Audit Gate
- Scope Guardrail
- Real TDD Validation (Red -> Green)
- Secret Leak Guard
- Clean Architecture AST Guard
- Database Efficiency & N+1 Performance Guard
- Database Migration Idempotency Guard
- Memory Guard (Engram / Graphify)
