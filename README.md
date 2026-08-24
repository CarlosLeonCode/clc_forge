# 🔨 CLC Forge (`clc-forge`) — The AI Agent Governance Engine

[![npm version](https.img.shields.io/npm/v/clc-forge.svg)](https://www.npmjs.com/package/clc-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CLC Forge:** The Pro AI Agent Governance & Quality Engineering Engine by Carlos Leon Code.
> Official NPM Package: [https://www.npmjs.com/package/clc-forge](https://www.npmjs.com/package/clc-forge)

Detecta automáticamente el stack de tecnologías (Next.js, FastAPI, Tailwind v4, Vitest, Pytest, Husky, Git Hooks) y provisiona el arnés completo de seguridad, salvaguardas y workflows de desarrollo en menos de 5 segundos.

---

## ⚡ Uso Rápido (vía NPX de NPM)

### 1. Inicializar o Instalar Harness en un Repositorio:
Navegá a la carpeta de tu proyecto (nuevo o existente) y ejecutá:

```bash
npx clc-forge
```

### 2. Auditar la Salud de un Repositorio Existente:
Para chequear si un proyecto cumple al 100% con los estándares de salvaguardas:

```bash
npx clc-forge doctor
```

---

## 💻 Uso Local (Desde Código Fuente)

```bash
# Navegá a cualquier carpeta e inicializá el harness
cd /path/a/tu-proyecto
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js

# Para chequear la salud del repositorio:
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js doctor
```

---

## 🔍 Arquitectura Modular del CLI (`clc-forge`)

```text
carlosleoncode-templates/
├── package.json          # Configurado para `clc-forge` en NPM
├── bin/
│   └── cli.js            # Entrypoint ejecutable (chmod +x)
├── src/
│   ├── index.js          # Orquestador principal
│   ├── detector.js       # Motor de Auto-Descubrimiento (Next.js, FastAPI, Vitest, Pytest, etc.)
│   ├── ui.js             # Renderizador Pro ANSI (ASCII Banner, Boxes, Tablas, Badges)
│   ├── generator.js      # Motor de aprovisionamiento de herramientas y git hooks
│   └── doctor.js         # Linter y auditor de salud de proyectos (clc-forge doctor)
└── README.md             # Guía de instalación y uso
```

---

## 🛡️ Salvaguardas que provisiona automáticamente

- **Frontend (10 Guardias):** Reutilización de UI, Tokens Semánticos, Clean Architecture, Fuga de Secretos, Accesibilidad ARIA, Contratos Zod API, Rendimiento Next/Image, Cobertura Storybook, Auditoría Educativo, Memory Guard.
- **Backend (7 Guardias):** Real TDD Red-to-Green, Scope Guardrail, Fuga de Secretos, Clean Architecture AST, Idempotencia de Migraciones DB, Audit Gate, Memory Guard.
