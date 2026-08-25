#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
/**
 * Frontend Audit Generator — Kino-front
 * Generates an educational 05-audit-report.md summarizing UI reuse, architecture,
 * secret security, and Vitest coverage before code review.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { checkUiReuse } = require('./check_ui_reuse');
const { checkArchitecture } = require('./check_architecture');
const { scanSecrets } = require('./scan_secrets');
const { checkA11y } = require('./check_a11y');
const { checkApiContracts } = require('./check_api_contracts');
const { checkPerformance } = require('./check_performance');
const { checkStorybook } = require('./check_storybook');

const REPO_ROOT = path.resolve(__dirname, '..');

function getActiveSddDir() {
  const sddsDir = path.join(REPO_ROOT, 'sdds');
  if (!fs.existsSync(sddsDir)) {
    fs.mkdirSync(sddsDir, { recursive: true });
  }
  const dirs = fs.readdirSync(sddsDir).filter(f => fs.statSync(path.join(sddsDir, f)).isDirectory());
  if (dirs.length > 0) {
    return path.join(sddsDir, dirs[0]);
  }
  const defaultDir = path.join(sddsDir, 'frontend-audit');
  fs.mkdirSync(defaultDir, { recursive: true });
  return defaultDir;
}

function analyzeFrontendPatterns() {
  const details = [];
  const gitCmd = 'git diff --name-only origin/staging...HEAD || git diff --name-only HEAD~1';
  let files = [];
  try {
    const out = execSync(gitCmd, { cwd: REPO_ROOT, encoding: 'utf-8' });
    files = out.split('\n').filter(f => f.trim() && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')));
  } catch (e) {
    return details;
  }

  const seen = new Set();
  files.forEach(f => {
    const filepath = path.join(REPO_ROOT, f);
    if (!fs.existsSync(filepath)) return;
    const content = fs.readFileSync(filepath, 'utf-8');

    // 1. Atomic Design / UI Reuse
    if (content.includes('@/components/ui/') && !seen.has(`ui:${f}`)) {
      seen.add(`ui:${f}`);
      details.push(`  • 🎨 **Atomic Design / UI Primitive Reuse (` + f + `):** Reutiliza primitivas atómicas estandarizadas de \`@/components/ui/\` garantizando consistencia visual y A11y.`);
    }

    // 2. Compound Components Pattern
    if (/<[A-Z][a-zA-Z]+\.[A-Z]/.test(content) && !seen.has(`compound:${f}`)) {
      seen.add(`compound:${f}`);
      details.push(`  • 🧩 **Compound Components (` + f + `):** Utiliza subcomponentes compuestos que comparten estado implícito para una interfaz flexible.`);
    }

    // 3. Custom Hooks Pattern
    if (/const\s+use[A-Z][a-zA-Z]+\s*=/.test(content) || /function\s+use[A-Z][a-zA-Z]/.test(content)) {
      if (!seen.has(`hook:${f}`)) {
        seen.add(`hook:${f}`);
        details.push(`  • 🪝 **Custom Hook Pattern (` + f + `):** Extrae lógica de estado y efectos secundarios fuera del JSX para modularidad y testeo.`);
      }
    }

    // 4. Server Components / Actions
    if (content.includes('"use server"') || content.includes("'use server'")) {
      if (!seen.has(`server-action:${f}`)) {
        seen.add(`server-action:${f}`);
        details.push(`  • ⚡ **Server Actions (` + f + `):** Ejecuta mutaciones directamente en el servidor Next.js reduciendo boilerplate de API REST.`);
      }
    }

    // 5. Zod Data Contract Validation
    if ((content.includes('z.object') || content.includes('.safeParse')) && !seen.has(`zod:${f}`)) {
      seen.add(`zod:${f}`);
      details.push(`  • 📑 **Data Contract (Zod Validation en ` + f + `):** Valida esquemas de entrada/salida HTTP evitando runtime crashes por data no tipada.`);
    }

    // 6. Semantic Theme Tokens
    if ((content.includes('bg-primary') || content.includes('text-muted-foreground') || content.includes('border-border')) && !seen.has(`tokens:${f}`)) {
      seen.add(`tokens:${f}`);
      details.push(`  • 🎨 **Semantic Design Tokens (Tailwind v4 en ` + f + `):** Utiliza tokens de diseño semánticos asegurando compatibilidad nativa con modo oscuro.`);
    }
  });

  return details;
}

function runVitestSummary() {
  try {
    const out = execSync('npx vitest run', { cwd: REPO_ROOT, encoding: 'utf-8' });
    return '✅ **Vitest:** Todas las pruebas unitarias pasaron exitosamente.';
  } catch (e) {
    return '⚠️ **Vitest:** Se detectaron advertencias o fallas en la ejecución de pruebas.';
  }
}

function main() {
  console.log('\n📝 Generando Reporte de Auditoría Educativo...');

  const sddDir = getActiveSddDir();
  const taskName = path.basename(sddDir);

  const uiRes = checkUiReuse();
  const archRes = checkArchitecture();
  const secretRes = scanSecrets();
  const a11yRes = checkA11y();
  const apiRes = checkApiContracts();
  const perfRes = checkPerformance();
  const sbRes = checkStorybook();
  const vitestSummary = runVitestSummary();

  const uiLines = uiRes.exitCode === 0
    ? ['✅ **Certificado:** Todos los componentes reutilizan las primitivas de @/components/ui/ y usan tokens semánticos del tema.']
    : ['❌ **Desvíos Detectados:**', ...Object.keys(uiRes.violations).flatMap(f => uiRes.violations[f].map(item => `  - ${f} (Línea ${item.lineNo}): [${item.tag}] -> ${item.message}`))];

  const archLines = archRes.exitCode === 0
    ? ['✅ **Certificado:** Reglas de Server Components y desacoplamiento de capas de UI verificadas.']
    : ['❌ **Violaciones Detectadas:**', ...Object.keys(archRes.violations).flatMap(f => archRes.violations[f].map(item => `  - ${f} (Línea ${item.lineNo}): [${item.module}] -> ${item.reason}`))];

  const secretLines = secretRes.exitCode === 0
    ? ['✅ **Certificado:** No se encontraron credenciales ni secretos en el bundle.']
    : ['❌ **Posibles Fugas:**', ...Object.keys(secretRes.findings).flatMap(f => secretRes.findings[f].map(item => `  - ${f} (Línea ${item.lineNo}): [${item.label}]`))];

  const a11yLines = a11yRes.exitCode === 0
    ? ['✅ **Certificado:** Reglas de accesibilidad A11y y etiquetas ARIA verificadas.']
    : ['⚠️ **Observaciones A11y:**', ...Object.keys(a11yRes.violations).flatMap(f => a11yRes.violations[f].map(item => `  - ${f} (Línea ${item.lineNo}): [${item.rule}] -> ${item.message}`))];

  const apiLines = apiRes.exitCode === 0
    ? ['✅ **Certificado:** Servicios de API validan esquemas de respuesta con Zod.']
    : ['⚠️ **Sin Validación Zod:**', ...Object.keys(apiRes.violations).flatMap(f => apiRes.violations[f].map(item => `  - ${f} (Línea ${item.lineNo}): -> ${item.message}`))];

  const perfLines = perfRes.exitCode === 0
    ? ['✅ **Certificado:** Reglas de optimización de imágenes Next/Image y tree-shaking cumplidas.']
    : ['⚠️ **Optimizaciones de Performance:**', ...Object.keys(perfRes.violations).flatMap(f => perfRes.violations[f].map(item => `  - ${f} (Línea ${item.lineNo}): -> ${item.message}`))];

  const sbLines = sbRes.exitCode === 0
    ? ['✅ **Certificado:** Cobertura de historias de Storybook completa para componentes de UI.']
    : ['⚠️ **Historias de Storybook Pendientes:**', ...Object.keys(sbRes.violations).flatMap(f => sbRes.violations[f].map(item => `  - ${f} -> ${item.message}`))];

  const reportContent = `# 📝 Reporte de Auditoría de Código Frontend: ${taskName}

> **Nota para el Revisor:** Este reporte resume las decisiones de UI, arquitectura, accesibilidad, contratos de API, rendimiento y seguridad para facilitar la revisión.

---

## 🎯 Resumen Educativo (Qué, Por qué y Para qué)
- **Qué se hizo:** Implementación de componentes React 19 / Next.js 16 y servicios de datos.
- **Por qué:** Garantizar accesibilidad A11y, validación estricta Zod en APIs, optimización Next/Image y cero fugas de secretos.
- **Para qué:** Mantener calidad de software de nivel industrial, resiliencia ante el backend y velocidad de carga.

---

## 🎨 Reutilización de UI & Tokens Semánticos
${uiLines.join('\n')}

---

## 🏛️ Arquitectura de Componentes Next.js
${archLines.join('\n')}

---

## ♿ Accesibilidad & ARIA (A11y)
${a11yLines.join('\n')}

---

## 🛡️ Contratos de API & Zod
${apiLines.join('\n')}

---

## ⚡ Rendimiento & Next/Image
${perfLines.join('\n')}

---

## 📚 Cobertura de Storybook
${sbLines.join('\n')}

---

## 🔐 Auditoría de Seguridad & Bundle
${secretLines.join('\n')}

---

## 🧪 Pruebas Unitarias (Vitest)
${vitestSummary}
`;

  const reportPath = path.join(sddDir, '05-audit-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf-8');

  const patternDetails = analyzeFrontendPatterns();

  console.log('\n=================================================================');
  console.log('  🎓 RESUMEN EDUCATIVO DE AUDITORÍA FRONTEND & PATRONES UI');
  console.log('=================================================================');
  console.log(`📍 SDD Activo: ${taskName}\n`);

  console.log('🧠 ANÁLISIS DE PATRONES DE UI & ARQUITECTURA FRONTEND:');
  if (patternDetails.length > 0) {
    patternDetails.forEach(d => console.log(d));
  } else {
    console.log('  • *No se detectaron cambios complejos de componentes en este diff.*');
  }

  console.log('\n🛡️ SALVAGUARDAS FRONTEND VERIFICADAS:');
  console.log(`  • Reutilización de UI (components/ui): ${uiRes.exitCode === 0 ? '✔ Pasó (0 componentes duplicados)' : '❌ Desvíos Detectados'}`);
  console.log(`  • Tokens Semánticos Tailwind v4    : ${uiRes.exitCode === 0 ? '✔ Pasó (0 colores palette directos)' : '❌ Colores Directos Usados'}`);
  console.log(`  • Accesibilidad A11y & ARIA        : ${a11yRes.exitCode === 0 ? '✔ Pasó (0 fallas ARIA)' : '⚠️ Observaciones A11y'}`);
  console.log(`  • Contratos Zod API Schema         : ${apiRes.exitCode === 0 ? '✔ Pasó (Validación Estricta)' : '⚠️ Faltan Esquemas Zod'}`);
  console.log(`  • Fuga de Secretos & Bundle        : ${secretRes.exitCode === 0 ? '✔ Pasó (0 secretos expuestos)' : '❌ Posible Fuga Detectada'}`);

  console.log(`\n📄 Reporte completo generado en: ${reportPath}`);
  console.log('=================================================================\n');
}

if (require.main === module) {
  main();
}

module.exports = { main, getActiveSddDir };
