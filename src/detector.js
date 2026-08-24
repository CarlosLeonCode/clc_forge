/**
 * CLC Forge — Universal Auto-Discovery Engine
 * Inspects repository signatures to auto-match the right polyglot Stack Adapter
 * (Ruby on Rails, Astro, Go, Rust, Laravel, Next.js, FastAPI).
 */

const fs = require('fs');
const path = require('path');

const RailsAdapter = require('./adapters/rails');
const AstroAdapter = require('./adapters/astro');
const GoAdapter = require('./adapters/go');
const RustAdapter = require('./adapters/rust');
const LaravelAdapter = require('./adapters/laravel');

const adapters = [
  new RailsAdapter(),
  new AstroAdapter(),
  new GoAdapter(),
  new RustAdapter(),
  new LaravelAdapter()
];

function autoDetectStack(targetDir) {
  // 1. Check registered polyglot adapters first
  for (const adapter of adapters) {
    if (adapter.detect(targetDir)) {
      return {
        projectType: adapter.projectType,
        framework: adapter.name,
        styling: adapter.projectType === 'frontend' ? 'Tailwind CSS v4' : 'N/A',
        uiLibrary: adapter.projectType === 'frontend' ? 'Component Primitives' : 'N/A',
        testRunner: adapter.testRunner,
        gitHooks: fs.existsSync(path.join(targetDir, '.husky')) ? 'husky' : 'githooks',
        orm: 'Framework Native',
        adapter
      };
    }
  }

  // 2. Default JavaScript/TypeScript & Python detection
  const config = {
    projectType: 'unknown',
    framework: 'unknown',
    styling: 'none',
    uiLibrary: 'none',
    testRunner: 'unknown',
    gitHooks: fs.existsSync(path.join(targetDir, '.husky')) ? 'husky' : 'githooks',
    orm: 'none',
    adapter: null
  };

  const hasPkgJson = fs.existsSync(path.join(targetDir, 'package.json'));
  const hasPyproject = fs.existsSync(path.join(targetDir, 'pyproject.toml'));
  const hasRequirements = fs.existsSync(path.join(targetDir, 'requirements.txt'));

  if (hasPkgJson) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      if (deps['next']) {
        config.projectType = 'frontend';
        config.framework = 'Next.js (App Router)';
      } else if (deps['react'] || deps['vite']) {
        config.projectType = 'frontend';
        config.framework = 'React / Vite';
      } else if (deps['express']) {
        config.projectType = 'backend';
        config.framework = 'Express.js';
      } else if (deps['@nestjs/core']) {
        config.projectType = 'backend';
        config.framework = 'NestJS';
      }

      if (deps['@tailwindcss/postcss'] || deps['tailwindcss']) {
        config.styling = 'Tailwind CSS v4';
      }

      if (deps['@radix-ui/react-slot'] || fs.existsSync(path.join(targetDir, 'components.json'))) {
        config.uiLibrary = 'shadcn/ui (@/components/ui)';
      }

      if (deps['vitest']) {
        config.testRunner = 'Vitest';
      } else if (deps['jest']) {
        config.testRunner = 'Jest';
      }
    } catch (e) {}
  }

  if (hasPyproject || hasRequirements) {
    config.projectType = 'backend';
    config.framework = 'FastAPI / Python';
    config.testRunner = 'Pytest';

    if (fs.existsSync(path.join(targetDir, 'alembic.ini'))) {
      config.orm = 'SQLAlchemy + Alembic';
    }
  }

  if (config.projectType === 'unknown') {
    if (fs.existsSync(path.join(targetDir, 'src', 'app')) || fs.existsSync(path.join(targetDir, 'src', 'pages'))) {
      config.projectType = 'frontend';
      config.framework = 'Next.js';
      config.testRunner = 'Vitest';
      config.styling = 'Tailwind CSS v4';
    } else {
      config.projectType = 'backend';
      config.framework = 'FastAPI';
      config.testRunner = 'Pytest';
    }
  }

  return config;
}

module.exports = { autoDetectStack };
