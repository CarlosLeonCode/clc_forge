/**
 * CLC Kernel — Pro Terminal UI & ANSI Renderer
 * Brand Identity: The AI Agent Governance & Quality Engineering Engine
 */

const readline = require('readline');

// ANSI Color Palette
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  cyan: '\x1b[36m',
  emerald: '\x1b[32m',
  violet: '\x1b[35m',
  amber: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bgCyan: '\x1b[46m\x1b[30m',
  bgViolet: '\x1b[45m\x1b[30m',
  bgEmerald: '\x1b[42m\x1b[30m'
};

function printBanner() {
  console.clear();
  console.log(`${colors.cyan}
   ██████╗██╗      ██████╗     ██╗  ██╗███████╗██████╗ ███╗   ██╗███████╗██╗     
  ██╔════╝██║     ██╔════╝     ██║ ██╔╝██╔════╝██╔══██╗████╗  ██║██╔════╝██║     
  ██║     ██║     ██║    █████╗█████═╝ █████╗  ██████╔╝██╔██╗ ██║█████╗  ██║     
  ██║     ██║     ██║    ╚════╝██╔═██╗ ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝  ██║     
  ╚██████╗███████╗╚██████╗     ██║ ╚██╗███████╗██║  ██║██║ ╚████║███████╗███████╗
   ╚═════╝╚══════╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
${colors.reset}`);
  console.log(`  ${colors.bgCyan} CLC KERNEL ${colors.reset} ${colors.bold}The AI Agent Governance & Quality Engineering Engine${colors.reset} ${colors.gray}v1.2.4${colors.reset}\n`);
}

function printBox(title, items) {
  const width = 68;
  console.log(`${colors.dim}┌${'─'.repeat(width)}┐${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}  ${colors.bold}${colors.cyan}${title.padEnd(width - 4)}${colors.reset}  ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}├${'─'.repeat(width)}┤${colors.reset}`);

  items.forEach(({ label, value, badgeColor = colors.emerald }) => {
    const line = ` ${colors.gray}${label.padEnd(22)}:${colors.reset} ${badgeColor}${colors.bold}${value}${colors.reset}`;
    const plainLength = `${label} : ${value}`.length;
    const padding = Math.max(0, width - plainLength - 3);
    console.log(`${colors.dim}│${colors.reset} ${line}${' '.repeat(padding)}${colors.dim}│${colors.reset}`);
  });

  console.log(`${colors.dim}└${'─'.repeat(width)}┘${colors.reset}\n`);
}

function promptOptions(detected) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`${colors.bold}   \x1b[32m[1]\x1b[0m Confirmar e Instalar CLC Kernel ${colors.dim}(Recomendado)${colors.reset}`);
    console.log(`   \x1b[33m[2]\x1b[0m Forzar modo FRONTEND`);
    console.log(`   \x1b[33m[3]\x1b[0m Forzar modo BACKEND`);
    console.log(`   \x1b[90m[4] Cancelar${colors.reset}\n`);

    rl.question(`${colors.cyan}${colors.bold}➔ Seleccioná una opción [1]: ${colors.reset}`, (answer) => {
      const choice = answer.trim() || '1';
      rl.close();

      if (choice === '1') {
        resolve(detected);
      } else if (choice === '2') {
        detected.projectType = 'frontend';
        resolve(detected);
      } else if (choice === '3') {
        detected.projectType = 'backend';
        resolve(detected);
      } else {
        console.log(`\n${colors.red}❌ Instalación de CLC Kernel cancelada.${colors.reset}`);
        process.exit(0);
      }
    });
  });
}

function printSuccess(targetDir, isFront, config) {
  console.log(`\n${colors.bgEmerald} SUCCESS ${colors.reset} ${colors.bold}${colors.emerald}¡CLC Kernel instalado exitosamente!${colors.reset}\n`);
  console.log(` 🔨 ${colors.bold}Proyecto Inicializado:${colors.reset} ${colors.cyan}${targetDir}${colors.reset}`);
  console.log(` 🛡️  ${colors.bold}Salvaguardas:${colors.reset} ${isFront ? `${colors.emerald}10 Guardias Frontend (A11y, Zod, Next/Image, UI Reuse, Storybook)` : `${colors.violet}7 Guardias Backend (TDD, Architecture, Scope, Secret Scan)`}${colors.reset}`);
  console.log(` 📝 ${colors.bold}Leyes & SDD:${colors.reset} AGENTS.md, sdds/, docs/Journal/ precargados`);
  console.log(` 🔒 ${colors.bold}Git Hooks:${colors.reset} Configurados en ${colors.amber}${config.gitHooks === 'husky' ? '.husky/pre-commit' : '.githooks/pre-commit'}${colors.reset}\n`);
}

module.exports = {
  colors,
  printBanner,
  printBox,
  promptOptions,
  printSuccess
};
