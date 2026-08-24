/**
 * CLC Harness — Auto-Discovery Engine
 * Inspects package.json, pyproject.toml, requirements.txt, alembic.ini, .husky, etc.
 * to automatically determine Frontend vs Backend, Next.js, FastAPI, Tailwind v4, Vitest, Pytest, etc.
 */

const fs = require('fs');
const path = require('path');

function autoDetectStack(targetDir) {
  const config = {
    projectType: 'unknown',
    framework: 'unknown',
    styling: 'none',
    uiLibrary: 'none',
    testRunner: 'unknown',
    gitHooks: 'native',
    orm: 'none'
  };

  const hasPkgJson = fs.existsSync(path.join(targetDir, 'package.json'));
  const hasPyproject = fs.existsSync(path.join(targetDir, 'pyproject.toml'));
  const hasRequirements = fs.existsSync(path.join(targetDir, 'requirements.txt'));
  const hasHusky = fs.existsSync(path.join(targetDir, '.husky'));

  if (hasHusky) {
    config.gitHooks = 'husky';
  } else {
    config.gitHooks = 'githooks';
  }

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
