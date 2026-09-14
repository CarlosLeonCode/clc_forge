# 🔨 CLC Kernel (Node.js / Polyglot Core) — AGENTS

This document is the **authoritative law** for AI agents working in this repository.
Forged by **CLC Kernel: The AI Agent Governance Engine**.

---

## 🎯 Project Identity & Category
**CLC Kernel (`clckernel`)** is the Universal Polyglot AI Agent Governance Engine & AIUP Orchestrator.
It creates and owns a new category in software engineering: **Deterministic AI Agent Governance**.

Unlike prompt-based rules (`.cursorrules`) or backend agent runtimes (LangGraph), CLC Kernel provides an **in-repo developer harness** that deterministically forces AI coding agents to follow strict engineering lifecycles (SDD, TDD, Clean Architecture AST Linters) across multiple tech stacks (Next.js, FastAPI, Rails, Go, Rust, Laravel, Django, Astro).

---

> 🚨 **RULE #0: MANDATORY EXECUTION OVERRIDE RULE (UNBYPASSABLE)**
> Even when the user issues a direct or urgent fix request ("fix this bug", "fix this error", "quick fix"):
> YOU ARE STRICTLY FORBIDDEN from modifying source code directly without completing the full quality harness:
> 1. **Research & Root Cause Analysis:** Investigate tracebacks and inspect affected files before editing.
> 2. **TDD Verification (Red Phase):** Write a failing regression test first (`npm test`).
> 3. **Clean Architecture Implementation (Green Phase):** Make the test pass maintaining layer isolation.
> 4. **Mandatory Educational Audit Gate:** Execute `npm test` and verify zero lint/test regressions.
> NEVER declare success or skip verification commands for quick fixes.

---

## 1. The Engineering Loop (Every Task)
1. **Research** — Inspect codebase / docs / existing AST linters before writing code.
2. **Plan** — Write an SDD under `sdds/{change-name}/` when introducing features or architectural refactors.
3. **Test (TDD)** — Write failing tests first in `test/`.
4. **Implement** — Write modular, zero-external-dependency code in `src/` or `tools/`.
5. **Verify & Audit** — Run `npm test` (all 236+ test cases across catalog, adapters, generator, and detector).
6. **DoD (Definition of Done)** — Clean code, zero regressions, full test coverage, docs updated in English and Spanish.
7. **Commit** — Pre-commit hook runs automated guards. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`). Never add AI co-authorship.

---

## 2. Core Repository Architecture & Layout

```
clckernel/
├── bin/
│   └── cli.js                  # Executable CLI entrypoint (clckernel, clc-kernel, clc-forge)
├── src/
│   ├── index.js                # CLI controller orchestration
│   ├── catalog.js              # Central 26-guard registry (Single Source of Truth)
│   ├── config.js               # .clckernel.yml loader & validator (ConfigError)
│   ├── detector.js             # Stack auto-detection heuristics
│   ├── doctor.js               # Repository health check engine (CLC KERNEL DOCTOR)
│   ├── generator.js            # Universal harness, hook, and symlink provisioner
│   ├── ui.js                   # Terminal UI, ASCII banner & ANSI renderer
│   ├── yaml.js                 # Zero-dependency YAML parser & glob-to-regex engine
│   ├── adapters/               # Polyglot stack adapters (Next.js, FastAPI, Rails, Go, Rust, Laravel, Django, Astro)
│   └── technologies/           # Technology-specific detectors (Celery, Redis, Postgres, Docker)
├── tools/                      # Deterministic AST linters & safeguard scripts (Node.js & Python stdlib)
│   ├── audit.js / audit.py     # Multi-guard orchestrator gates
│   ├── scan_secrets.js / .py   # Secret leak scanners
│   ├── check_architecture.*    # Clean Architecture layer isolation checkers
│   ├── check_custom.js / .py   # User-defined regex rules from .clckernel.yml
│   ├── check_a11y.js           # ARIA & accessibility linter
│   ├── check_ui_reuse.js       # UI primitive reuse enforcer
│   ├── check_performance.js    # Next/Image & tree-shaking linter
│   ├── check_responsive.js     # Mobile-first & touch target linter
│   ├── check_seo.js            # OpenGraph, SEO & Core Web Vitals linter
│   ├── check_storybook.js      # Storybook coverage guard
│   ├── check_api_contracts.js  # Zod schema validation guard
│   ├── check_migrations.py     # Alembic / Django migration idempotency guard
│   ├── check_db_efficiency.py  # ORM N+1 & query efficiency guard
│   ├── check_scope.py          # Git diff vs SDD authorized scope guard
│   ├── verify_tdd.py           # Red-to-Green transition proof checker
│   ├── celery_guard.py         # Celery broker & result backend safety guard
│   ├── redis_guard.py          # Redis decode_responses & timeout guard
│   ├── postgres_guard.py       # PostgreSQL raw query & injection guard
│   └── docker_guard.py         # Docker non-root USER & healthcheck guard
├── test/                       # Comprehensive node:test runner suites
├── README.md                   # Primary documentation (English)
├── README.es.md                # Primary documentation (Spanish)
└── package.json                # Package manifest (@clckernel)
```

---

## 3. Active Safeguard Catalog & Deterministic Rules

All AI agents operating in repositories provisioned by CLC Kernel are deterministically governed by the following safeguard layers:

### 📱 Frontend & UX Quality Safeguards
- **`check_responsive.js`**: Enforces mobile-first responsive design, warns against fixed-width pixel overflows (`width: >400px` without media queries), and requires minimum touch targets (44x44px or 48x48px) for buttons and interactive controls.
- **`check_seo.js`**: Validates essential SEO title/description tags, OpenGraph (`og:title`, `og:image`), GEO tags (`geo.position`, `ICBM`), heading hierarchy (`<h1>` uniqueness), and LCP image `priority` / `fetchpriority="high"`.
- **`check_a11y.js`**: Audits ARIA roles, missing `alt` attributes on images, and keyboard navigable interactive controls.
- **`check_ui_reuse.js`**: Prevents duplicate UI classes and arbitrary styling by enforcing the reuse of design system primitives in `components/ui/`.
- **`check_performance.js`**: Enforces framework-native image optimization (`next/image`, `astro:assets`) and prevents barrel-file imports that break tree-shaking.
- **`check_api_contracts.js`**: Enforces runtime schema validation (Zod) on all external HTTP requests and API boundaries.
- **`check_storybook.js`**: Audits Storybook `.stories.tsx` coverage for all new UI primitives.

### 🏛️ Backend, Architecture & Data Safeguards
- **`check_architecture.js / .py`**: Validates Clean Architecture layer boundaries (Domain -> Use Case -> Interface -> Infrastructure) and prevents presentation/route handlers from calling DB queries directly.
- **`check_db_efficiency.py`**: Detects N+1 query patterns in loops and enforces eager loading (`select_related`, `prefetch_related` in Django; `joinedload` in SQLAlchemy).
- **`check_migrations.py`**: Ensures database migrations (Alembic / Django) are idempotent, reversible, and do not drop tables/columns destructively without down-revisions.
- **`scan_secrets.js / .py`**: Scans diffs for private keys, AWS/Stripe credentials, JWT secrets, and hardcoded connection strings.
- **`check_scope.py`**: Compares modified files against the authorized scope defined in the local SDD specification.
- **`verify_tdd.py`**: Validates the transition proof from a failing regression test (Red Phase) to a passing implementation (Green Phase).

### 🐳 Infrastructure & Technology Guards
- **`docker_guard.py`**: Checks Dockerfiles for non-root `USER` directives, prevents `ENV` secret exposures, and requires `HEALTHCHECK` definitions.
- **`celery_guard.py`**: Enforces broker URL isolation via environment variables, `@shared_task(ignore_result=True)` defaults, and secure backend configs.
- **`redis_guard.py`**: Enforces `decode_responses=True`, mandatory `socket_connect_timeout`, and prevents hardcoded Redis host strings.
- **`postgres_guard.py`**: Blocks raw SQL string formatting / Python f-strings in queries to prevent SQL injection vulnerabilities.

---

## 4. Recommended Ecosystem Companions
CLC Kernel is strictly focused on **Governance, Process & Quality Guards**. It relies modularly on companion tools with graceful degradation:
- 🧠 **Engram (MCP):** Long-term memory, session state, and architectural decision records (ADRs).
- 🕸️ **Graphify:** Repository knowledge graphs and visual topology mapping.
- 🛡️ **Gentle AI (RDD):** Review-Driven Development with adversarial dual-lens review gates.

---

## 5. Coding & Design Principles
- **CONCEPTS > CODE:** Never add boilerplate without understanding architectural layer boundaries.
- **Zero-Dependency Core:** The CLI engine and tool scripts must use native Node.js / Python built-ins wherever possible (zero runtime npm dependencies for the parser and linters).
- **Polyglot Fidelity:** Native guards must be written in the ecosystem's native idioms (Go AST for Go, Python AST for Python, JS/TS AST for Node).
- **Graceful Fallbacks:** If optional companion tools or optional linters are missing from the host machine, guards must degrade gracefully with advisory warnings rather than hard crashes.
