# 🔨 CLC Forge (`create-clc-forge`) — The AI Agent Governance Engine

> **CLC Forge:** The Pro AI Agent Governance & Quality Engineering Engine by Carlos Leon Code.

Detecta automáticamente el stack de tecnologías (Next.js, FastAPI, Tailwind v4, Vitest, Pytest, Husky, Git Hooks) y provisiona el arnés completo de seguridad, salvaguardas y workflows de desarrollo en menos de 5 segundos.

---

## ⚡ Uso Rápido (Local o vía NPX)

### 1. Desde NPX (Una vez publicado en NPM):
```bash
# Inicializar o instalar harness en el directorio actual
npx create-clc-forge

# O chequear salud del harness existente
npx clc-forge doctor
```

### 2. Desde Script Local:
```bash
# Navegá a la carpeta de tu proyecto nuevo o existente
cd /path/a/tu-proyecto

# Ejecutá el CLI ejecutable de CLC Forge
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js

# Para chequear salud del harness en un repositorio:
node /Users/carlosleoncodepro/Dev/kino/carlosleoncode-templates/bin/cli.js doctor
```

---

## 🔍 Arquitectura Modular del CLI (`CLC Forge`)

```text
carlosleoncode-templates/
├── package.json          # Configurado para `create-clc-forge` y `clc-forge`
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

- **Frontend (10 Guardias):** Reutilización de UI, Tokens Semánticos, Clean Architecture, Fuga de Secretos, Accesibilidad ARIA, Contratos Zod API, Rendimiento Next/Image, Cobertura Storybook, Auditoría Educativa, Memory Guard.
- **Backend (7 Guardias):** Real TDD Red-to-Green, Scope Guardrail, Fuga de Secretos, Clean Architecture AST, Idempotencia de Migraciones DB, Audit Gate, Memory Guard.
