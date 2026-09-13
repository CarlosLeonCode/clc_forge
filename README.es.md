<div align="center">
  <img width="120" alt="clc_forge_logo" src="https://github.com/user-attachments/assets/fb78ba72-2c30-42d2-a738-c97c283b122c" />
</div>

# 🤖 CLC Forge (`clc-forge`)

[![npm version](https://img.shields.io/npm/v/clc-forge.svg)](https://www.npmjs.com/package/clc-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![English](https://img.shields.io/badge/README-English-blue.svg)](./README.md)

> **El Motor Universal de Gobernanza para Agentes de IA & Orquestador AIUP.**
> Creado por [CarlosLeonCode](https://github.com/carlosleoncode).

Los agentes de IA (Claude, Cursor, Gemini) generan código a una velocidad extraordinaria, pero sin límites estrictos introducen deuda técnica, tests inventados y violaciones de arquitectura. **CLC Forge** es el arnés definitivo para dominarlos.

Implementa un **Proceso Unificado de IA (AIUP)**—obligando a los LLMs a seguir ciclos de vida rigurosos de ingeniería de software (SDD, TDD, Arquitectura Limpia) sin importar el lenguaje de programación.

---

## ⚙️ El Motor Dual: SDD & TDD (Configurable)
La columna vertebral de la metodología CLC Forge se apoya en dos pilares que obligan al agente a pensar antes de teclear:
- 📝 **SDD (Spec-Driven Development):** Los agentes tienen prohibido escribir código sin antes generar una especificación local (en `sdds/`) y pasar un gate de aprobación humana (Human-in-the-Loop / HIT).
- 🧪 **TDD (Test-Driven Development):** Los agentes deben demostrar una transición Rojo-a-Verde. Si el test no falla primero, el arnés rechaza la implementación.

*¿No te convence el TDD? ¿Preferís BDD o un ciclo de vida custom?* Como CLC Forge es un Orquestador interactivo, al correr `clc_forge start` el agente te preguntará cuál es tu metodología preferida y ajustará las fases de ejecución del `.clc-forge.yaml` de forma dinámica.

---

## 💡 Por Qué Existe CLC Forge
Librados a su suerte, los agentes de IA sufren del "sesgo de inmediatez"—se lanzan a escribir código sin planificar. Esto genera fallas silenciosas en producción:
- ❌ **Decaimiento Arquitectónico:** Mezclar lógica de rutas con llamadas a la base de datos en lugar de respetar el aislamiento de capas (Arquitectura Limpia).
- ❌ **Duplicación de UI:** Inventar colores hexadecimales arbitrarios y HTML crudo en lugar de reutilizar los tokens semánticos del sistema de diseño.
- ❌ **TDD de Falso Positivo:** Declarar que una feature funciona sin jamás demostrar la transición Rojo-a-Verde.
- ❌ **Fugas de Seguridad:** Commitear accidentalmente API Keys o exponer DTOs privados del backend al cliente.

CLC Forge resuelve esto transformando al LLM de una "herramienta de autocompletado" en un **Ingeniero de Software** disciplinado, atado a linters determinísticos de AST y gates de planificación obligatorios.

<div align="center">
  <img width="900" alt="clc_forge_comparison" src="https://github.com/user-attachments/assets/2602679a-0927-4712-9ac9-793ec0c566e7" />
  <p><em>Izquierda: Agente de IA sin gobernanza — código caótico y alucinado. Derecha: Agente con CLC Forge AIUP — estructurado, seguro y arquitectónicamente correcto.</em></p>
</div>

---

## 🤝 Sinergia con Engram (Memoria + Gobernanza)
Para construir sistemas de IA verdaderamente autónomos, un agente necesita dos cosas: **Proceso** y **Memoria**.
- **CLC Forge** aporta el *Proceso* (Gobernanza AIUP, ciclos de vida SDD/TDD, y salvaguardas de ejecución).
- **Engram (MCP)** aporta la *Memoria* (Contexto de largo plazo, ADRs, y persistencia de sesión).

Están diseñados para ser el stack simbiótico perfecto. Mientras **Engram** recuerda *por qué* se tomó una decisión arquitectónica hace tres meses, **CLC Forge** impone *cómo* el agente escribe el código hoy para respetar esa decisión.

---

## 🧠 El Paradigma de la CLI Conversacional
CLC Forge no es solo una CLI de terminal; opera de forma nativa dentro de tu LLM. Al inicializarse, inyecta un **Agentic Playbook (`SKILL.md`)** en tu repositorio, convirtiendo cualquier IDE con IA en un asistente interactivo de gobernanza.

Simplemente abrí el chat de tu IA y escribí estos intents:
- 🚀 **`clc_forge start`**: El agente detecta tu stack automáticamente, propone un ciclo de gobernanza, y materializa una especificación declarativa `.clc-forge.yaml`.
- 🛠️ **`clc_forge create_guard`**: El agente escribe un linter AST personalizado en el **lenguaje nativo de tu ecosistema** (Ruby, Go, Rust, Python, JS).
- 🔄 **`clc_forge add_phase` / `remove_guard`**: Mutá el ciclo de vida AIUP de forma interactiva sin tocar YAML manualmente.

---

## 🔗 Symlinking Universal de IDEs (Zero-Config)
Inicializá una vez, gobernás en todas partes. CLC Forge genera automáticamente symlinks multiplataforma apuntando al Single Source of Truth (`AGENTS.md`), asegurando absorción instantánea del contexto para:
- 💠 **Cursor** (`.cursorrules` & `.cursor/rules/clc_forge_context.mdc`)
- 🧠 **Claude Desktop / Windsurf** (`CLAUDE.md`)
- 🌌 **Gemini CLI / Project IDX** (`GEMINI.md`)
- ✈️ **GitHub Copilot** (`.github/copilot-instructions.md`)
- 🛸 **Antigravity** (`.antigravity/rules.md`)

---

## 🌐 Adaptadores Polyglot por Stack
CLC Forge es 100% agnóstico al framework. Cuenta con adaptadores dedicados que detectan tu stack automáticamente y aplican reglas nativas:

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
npx clc-forge   ───►   clc_forge start   ───►   "Feature X con harness"   ───►   Hooks Pre-commit
(Bootstrap)            (Setup Interactivo)          (SDD -> HIT -> Tests)         (Guardián AST & Secretos)
```

### 1️⃣ Paso 1: Inicializar el Repositorio (Terminal)
Navegá a la raíz de tu proyecto y ejecutá:
```bash
npx clc-forge
```
- **Qué sucede:** Detecta automáticamente tu stack (FastAPI, Next.js, Rails, etc.), genera el `AGENTS.md`, provisiona `.githooks/` o `.husky/`, crea los linters de AST en `tools/` y enlaza las reglas para todos los IDEs (`.cursorrules`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.antigravity/rules.md`).

### 2️⃣ Paso 2: Abrir tu IDE con IA & Activar (CLI Conversacional)
Abrí el proyecto en Cursor, Claude Code, Gemini CLI, Windsurf o Copilot. En el chat del agente, escribí:
> `clc_forge start`
- **Qué sucede:** El agente escanea tu código en silencio, propone un plan de gobernanza AIUP adaptado a tu stack y genera tu archivo `.clc-forge.yaml` tras tu confirmación.

### 3️⃣ Paso 3: Desarrollo Diario con el Arnés
Cuando pidas una funcionalidad, fix o refactor, invocá siempre el disparador del arnés:
> *"Creá el endpoint de autenticación de usuarios. **Usá el workflow / harness**."*
- **Qué sucede:** El agente ejecuta de forma autónoma el ciclo de 10 pasos:
  1. **SDD & Research:** Escribe la especificación técnica en `sdds/{feature}/`.
  2. **HIT Gate (Human-in-the-Loop):** Presenta los escenarios de prueba para tu validación antes de tocar código.
  3. **TDD (Fase Roja):** Escribe los tests que fallan primero.
  4. **Implementación (Fase Verde):** Escribe código limpio en capas hasta que los tests pasen.
  5. **Auditoría:** Ejecuta `tools/audit` asegurando cero fugas de capas o secretos.

### 4️⃣ Paso 4: Verificación Determinística en Commit
Agregá tus cambios y hacé el commit:
```bash
git add .
git commit -m "feat(auth): add user authentication endpoint"
```
- **Qué sucede:** Los hooks de pre-commit ejecutan los scanners de AST (Arquitectura Limpia, Escaneo de Secretos, Scope Guard, Idempotencia de Migraciones). Cualquier violación bloquea el commit de inmediato.

### 5️⃣ Paso 5: Auditar la Salud del Repositorio en Cualquier Momento (Terminal)
Para verificar que el repositorio cumple con el estándar de calidad CLC Forge:
```bash
npx clc-forge doctor
```

