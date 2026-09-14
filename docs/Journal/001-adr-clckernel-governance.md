# ADR 001: Deterministic AI Agent Governance Engine

## Status
Accepted

## Context
AI coding agents generate code rapidly but introduce technical debt, layer violations, and false-positive test transitions when operating without deterministic guardrails.

## Decision
Establish **CLC Kernel** (`clckernel`) as a polyglot AI Agent Governance harness implementing the AI Unified Process (AIUP):
1. **Spec-Driven Development (SDD)** with Human-in-the-Loop gates.
2. **Test-Driven Development (TDD)** requiring verified failing tests prior to implementation.
3. **Deterministic AST Linters** tailored per tech stack (Go, Python, Rust, Ruby, JS/TS, PHP).
4. **Universal IDE Symlinking** from `AGENTS.md` to all AI IDEs (Cursor, Claude, Gemini, Copilot, Antigravity).

## Consequences
- Guarantees architectural integrity and zero secret leaks.
- Seamlessly integrates with Engram (memory) and Graphify (knowledge graph).
