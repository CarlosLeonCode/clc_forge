/**
 * CLC Forge — Health Doctor & Linter
 * Scans a target repository to verify if all required safeguards, AGENTS.md,
 * docs structure, and git hooks are active and compliant with CLC Forge Standards.
 */

const fs = require('fs');
const path = require('path');
const { colors } = require('./ui');

function runDoctor(targetDir) {
  console.log(`\n🏥 ${colors.bold}${colors.cyan}CLC FORGE DOCTOR — HEALTH CHECK${colors.reset}\n`);
  console.log(` 📍 Target Repository: ${colors.cyan}${targetDir}${colors.reset}\n`);

  const checks = [];

  const hasAgentsMd = fs.existsSync(path.join(targetDir, 'AGENTS.md'));
  checks.push({ name: 'AGENTS.md law document', status: hasAgentsMd });

  const hasSdds = fs.existsSync(path.join(targetDir, 'sdds'));
  checks.push({ name: 'sdds/ local spec directory', status: hasSdds });

  const hasJournal = fs.existsSync(path.join(targetDir, 'docs', 'Journal'));
  checks.push({ name: 'docs/Journal/ ADR directory', status: hasJournal });

  const toolsDir = path.join(targetDir, 'tools');
  const hasTools = fs.existsSync(toolsDir) && fs.readdirSync(toolsDir).length > 0;
  checks.push({ name: 'tools/ safeguard suite', status: hasTools });

  const hasHusky = fs.existsSync(path.join(targetDir, '.husky', 'pre-commit'));
  const hasGithooks = fs.existsSync(path.join(targetDir, '.githooks', 'pre-commit'));
  checks.push({ name: 'pre-commit git hooks', status: hasHusky || hasGithooks });

  let passedCount = 0;
  checks.forEach(({ name, status }) => {
    if (status) {
      passedCount++;
      console.log(`  ${colors.emerald}✔ [PASS]${colors.reset} ${name}`);
    } else {
      console.log(`  ${colors.red}✖ [FAIL]${colors.reset} ${name}`);
    }
  });

  console.log('\n---------------------------------------------------------------');
  if (passedCount === checks.length) {
    console.log(` ${colors.bgEmerald} HEALTHY ${colors.reset} ${colors.emerald}${colors.bold}El repositorio cumple al 100% con el estándar CLC Forge.${colors.reset}\n`);
  } else {
    console.log(` ${colors.amber}⚠️  Se detectaron ${checks.length - passedCount} faltantes. Corré \`npx create-clc-forge\` para reparar.${colors.reset}\n`);
  }
}

module.exports = { runDoctor };
