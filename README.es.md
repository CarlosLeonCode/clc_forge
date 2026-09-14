<div align="center">
  <img width="120" alt="clckernel_logo" src="https://github.com/user-attachments/assets/fb78ba72-2c30-42d2-a738-c97c283b122c" />
</div>

# 🤖 CLC Kernel (`clckernel`)

[![npm version](https://img.shields.io/npm/v/clckernel.svg)](https://www.npmjs.com/package/clckernel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![English](https://img.shields.io/badge/README-English-blue.svg)](./README.md)

> **El Motor Universal de Gobernanza para Agentes de IA & Orquestador AIUP.**
> Creado por [CarlosLeonCode](https://github.com/carlosleoncode).

Los agentes de IA (Claude, Cursor, Gemini) generan código a una velocidad extraordinaria, pero sin límites estrictos introducen deuda técnica, tests inventados y violaciones de arquitectura. **CLC Kernel** es el arnés definitivo para dominarlos.

Implementa un **Proceso Unificado de IA (AIUP)**—obligando a los LLMs a seguir ciclos de vida rigurosos de ingeniería de software (SDD, TDD, Arquitectura Limpia) sin importar el lenguaje de programación.

---

## 🎯 Posicionamiento: Una Nueva Categoría — AI Agent Governance

CLC Kernel **no** es "otro framework de IA" ni una colección de prompts. Define una categoría de ingeniería propia: **Gobernanza Determinística de Agentes de IA (AI Agent Governance)**.

| Categoría de Herramienta | Qué Hace | Dónde se Queda Corta | Ventaja de CLC Kernel |
|---|---|---|---|
| **Reglas de Prompt** (`.cursorrules`, `.mdc`) | Inyecta sugerencias en markdown en el contexto del chat. | **No determinístico:** El LLM las ignora en contextos largos o pedidos rápidos. | Impone **AST Linters nativos** que bloquean físicamente commits no conformes. |
| **Herramientas de Specs** (OpenSpec, Specs en MD) | Documenta especificaciones y requerimientos. | **Estático:** No comprueba tests fallidos ni custodia cambios de código en Git. | Ciclo completo **AIUP:** Spec -> Gate Humano -> TDD Rojo-a-Verde -> AST Guard. |
| **Runtimes de Agentes** (LangGraph, CrewAI) | Construye apps de backend con agentes autónomos. | **Problema distinto:** No gobierna el desarrollo en el repositorio del programador. | **Arnés para Devs:** Se integra nativamente en el flujo diario de tu IDE. |

---

## ⚙️ El Motor Dual: SDD & TDD (Configurable)
La columna vertebral de la metodología CLC Kernel se apoya en dos pilares que obligan al agente a pensar antes de teclear:
- 📝 **SDD (Spec-Driven Development):** Los agentes tienen prohibido escribir código sin antes generar una especificación local (en `sdds/`) y pasar un gate de aprobación humana (Human-in-the-Loop / HIT).
- 🧪 **TDD (Test-Driven Development):** Los agentes deben demostrar una transición Rojo-a-Verde. Si el test no falla primero, el arnés rechaza la implementación.

*¿No te convence el TDD? ¿Preferís BDD o un ciclo de vida custom?* Como CLC Kernel es un Orquestador interactivo, al correr `clckernel start` el agente te preguntará cuál es tu metodología preferida y ajustará las fases de ejecución del `.clckernel.yaml` de forma dinámica.

---

## 💡 Por Qué Existe CLC Kernel
Librados a su suerte, los agentes de IA sufren del "sesgo de inmediatez"—se lanzan a escribir código sin planificar. Esto genera fallas silenciosas en producción:
- ❌ **Decaimiento Arquitectónico:** Mezclar lógica de rutas con llamadas a la base de datos en lugar de respetar el aislamiento de capas (Arquitectura Limpia).
- ❌ **Duplicación de UI:** Inventar colores hexadecimales arbitrarios y HTML crudo en lugar de reutilizar los tokens semánticos del sistema de diseño.
- ❌ **TDD de Falso Positivo:** Declarar que una feature funciona sin jamás demostrar la transición Rojo-a-Verde.
- ❌ **Fugas de Seguridad:** Commitear accidentalmente API Keys o exponer DTOs privados del backend al cliente.

CLC Kernel resuelve esto transformando al LLM de una "herramienta de autocompletado" en un **Ingeniero de Software** disciplinado, atado a linters determinísticos de AST y gates de planificación obligatorios.

<div align="center">
  <img width="900" alt="clckernel_comparison" src="https://github.com/user-attachments/assets/2602679a-0927-4712-9ac9-793ec0c566e7" />
  <p><em>Izquierda: Agente de IA sin gobernanza — código caótico y alucinado. Derecha: Agente con CLC Kernel AIUP — estructurado, seguro y arquitectónicamente correcto.</em></p>
</div>

---

## 🤝 Sinergia con Engram (Memoria + Gobernanza)
Para construir sistemas de IA verdaderamente autónomos, un agente necesita dos cosas: **Proceso** y **Memoria**.
- **CLC Kernel** aporta el *Proceso* (Gobernanza AIUP, ciclos de vida SDD/TDD, y salvaguardas de ejecución).
- **Engram (MCP)** aporta la *Memoria* (Contexto de largo plazo, ADRs, y persistencia de sesión).

Están diseñados para ser el stack simbiótico perfecto. Mientras **Engram** recuerda *por qué* se tomó una decisión arquitectónica hace tres meses, **CLC Kernel** impone *cómo* el agente escribe el código hoy para respetar esa decisión.

---

## 🧩 Dependencias Deseadas del Ecosistema (Opcionales y Modulares)
CLC Kernel se enfoca estrictamente en **Gobernanza, Proceso y Salvaguardas de Calidad**. Intencionalmente **no** empaqueta un motor de grafos propietario ni una base de datos de persistencia monolítica. En su lugar, delega esas capacidades en herramientas complementarias especializadas (con degradación elegante si no se encuentran instaladas en el entorno):

| Herramienta Complementaria | Rol | Por Qué es Deseada | Comportamiento si no está |
|---|---|---|---|
| 🧠 **[Engram (MCP)](https://github.com/Gentleman-Programming/gentle-ai)** | Memoria de Largo Plazo & ADRs | Preserva el contexto arquitectónico, justificaciones de diseño y memoria entre sesiones de agentes. | Salteo elegante (la auditoría continúa sin persistencia). |
| 🕸️ **[Graphify](https://github.com/carlosleoncode/graphify)** | Grafo de Conocimiento de Código | Genera mapas topológicos y grafos de dependencias para que el agente entienda relaciones arquitectónicas. | Salteo elegante (`verify_memory_graph` pasa como advisory). |
| 🛡️ **[Gentle AI (RDD)](https://github.com/Gentleman-Programming/gentle-ai)** | Gate de Revisión Adversaria | Aplica Review-Driven Development (RDD) con inspección multi-lente antes de commitear cambios. | Salteo elegante (`verify_rdd_review_gate` pasa como advisory). |
| ⚡ **Linters Nativos por Stack** | AST & Seguridad de Tipos | `ruff` (Python), `golangci-lint` (Go), `cargo clippy` (Rust), `phpstan` (PHP), `tsc` (TypeScript). | Utiliza las herramientas CLI instaladas en el entorno local del proyecto. |

---

## 🧠 El Paradigma de la CLI Conversacional
CLC Kernel no es solo una CLI de terminal; opera de forma nativa dentro de tu LLM. Al inicializarse, inyecta un **Agentic Playbook (`SKILL.md`)** en tu repositorio, convirtiendo cualquier IDE con IA en un asistente interactivo de gobernanza.

Simplemente abrí el chat de tu IA y escribí estos intents:
- 🚀 **`clckernel start`**: El agente detecta tu stack automáticamente, propone un ciclo de gobernanza, y materializa una especificación declarativa `.clckernel.yaml`.
- 🛠️ **`clckernel create_guard`**: El agente escribe un linter AST personalizado en el **lenguaje nativo de tu ecosistema** (Ruby, Go, Rust, Python, JS).
- 🔄 **`clckernel add_phase` / `remove_guard`**: Mutá el ciclo de vida AIUP de forma interactiva sin tocar YAML manualmente.

---

## 🔗 Symlinking Universal de IDEs (Zero-Config)
Inicializá una vez, gobernás en todas partes. CLC Kernel genera automáticamente symlinks multiplataforma apuntando al Single Source of Truth (`AGENTS.md`), asegurando absorción instantánea del contexto para:
- 💠 **Cursor** (`.cursorrules` & `.cursor/rules/clckernel_context.mdc`)
- 🧠 **Claude Desktop / Windsurf** (`CLAUDE.md`)
- 🌌 **Gemini CLI / Project IDX** (`GEMINI.md`)
- ✈️ **GitHub Copilot** (`.github/copilot-instructions.md`)
- 🛸 **Antigravity** (`.antigravity/rules.md`)

---

## 🌐 Adaptadores Polyglot por Stack
CLC Kernel es 100% agnóstico al framework. Cuenta con adaptadores dedicados que detectan tu stack automáticamente y aplican reglas nativas:

| Ecosistema | Firma de Detección | Test Runner | Salvaguardas Aplicadas |
|---|---|---|---|
| ⚛️ **Next.js** | `next` | Vitest / Jest | Reutilización de UI, Tokens Semánticos, Reglas RSC, Zod, A11y |
| ⚡ **FastAPI** | `fastapi` | Pytest | Pydantic V2, Idempotencia Alembic, AST Arquitectura Limpia |
| 💎 **Rails** | `Gemfile` | RSpec | AST RuboCop, Seguridad Brakeman, Idempotencia de Migraciones |
| 🐹 **Golang** | `go.mod` | `go test` | AST `golangci-lint`, Arquitectura Domain/UseCase |
| 🦀 **Rust** | `Cargo.toml` | `cargo test` | AST `cargo clippy`, `cargo audit`, Seguridad de Memoria Estricta |
| 🐘 **Laravel** | `artisan` | Pest / PHPUnit | AST PHPStan, Detección de N+1 Eloquent, Migraciones |
| 🎸 **Django** | `manage.py` | `pytest-django` | Idempotencia ORM Django, AST Ruff, Scope Guard |
| 🚀 **Astro** | `astro.config` | Playwright | Tokens Tailwind v4, Guard de Content Collection Schema |

---

## ⚡ Guía Paso a Paso (Ciclo de Vida Completo)

```
[1. Terminal]           [2. Chat del LLM]            [3. Bucle TDD]                [4. Git Commit]
npx clckernel   ───►   clckernel start   ───►   "Feature X con harness"   ───►   Hooks Pre-commit
(Bootstrap)            (Setup Interactivo)          (SDD -> HIT -> Tests)         (Guardián AST & Secretos)
```

### 1️⃣ Paso 1: Inicializar el Repositorio (Terminal)
Navegá a la raíz de tu proyecto y ejecutá:
```bash
npx clckernel
```
- **Qué sucede:** Detecta tu stack automáticamente (e.g. FastAPI, Next.js, Rails), genera `AGENTS.md`, provisiona `.githooks/` o `.husky/`, crea herramientas AST determinísticas en `tools/`, y enlaza reglas de IDE (`.cursorrules`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.antigravity/rules.md`).

### 2️⃣ Paso 2: Abrir tu IDE con IA e Inicializar (CLI Conversacional)
Abrí el proyecto en Cursor, Claude Code, Gemini CLI, Windsurf, o Copilot. En el chat, pedí:
> `clckernel start`
- **Qué sucede:** El agente escanea tu código silenciosamente, propone un plan de gobernanza AIUP a medida de tu framework, y genera tu especificación `.clckernel.yaml` tras tu confirmación.

### 3️⃣ Paso 3: Desarrollo Diario con el Arnés
Al solicitar features, correcciones o refactors, invocá el trigger del harness:
> *"Agregá el endpoint de autenticación. **Usá el workflow / harness**."*
- **Qué sucede:** El agente ejecuta automáticamente el ciclo AIUP de 10 pasos:
  1. **SDD & Research:** Escribe la especificación en `sdds/{feature}/`.
  2. **Gate HIT (Human-in-the-Loop):** Presenta los escenarios de test para tu revisión antes de tocar código.
  3. **TDD (Fase Roja):** Escribe primero los tests de regresión fallidos.
  4. **Implementación (Fase Verde):** Escribe código limpio en capas hasta que los tests pasen.
  5. **Auditoría:** Ejecuta `tools/audit` para garantizar cero fugas de capas o secretos.

### 4️⃣ Paso 4: Verificación Determinística de Guards (Commit)
Stageá y commiteá tus cambios:
```bash
git add .
git commit -m "feat(auth): add user authentication endpoint"
```
- **Qué sucede:** Los hooks pre-commit ejecutan escáneres AST automáticos (Arquitectura Limpia, Fuga de Secretos, Scope Guard, Idempotencia de Migraciones). Cualquier violación bloquea el commit determinísticamente.

### 5️⃣ Paso 5: Verificar la Salud del Repositorio en Cualquier Momento (Terminal)
Para verificar si un repositorio cumple con el Estándar de Calidad de CLC Kernel:
```bash
npx clckernel doctor
```
