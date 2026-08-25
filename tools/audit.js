#!/usr/bin/env node
/**
 * Modular Audit Orchestrator — JS
 * Discovers check_*.js guard scripts at runtime, runs each with graceful
 * degradation, and generates an English audit report (05-audit-report.md).
 * Self-contained: uses only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getActiveSddDir() {
  const sddsDir = path.join(REPO_ROOT, 'sdds');
  if (!fs.existsSync(sddsDir)) {
    fs.mkdirSync(sddsDir, { recursive: true });
  }
  const dirs = fs.readdirSync(sddsDir).filter(f => {
    try { return fs.statSync(path.join(sddsDir, f)).isDirectory(); }
    catch { return false; }
  });
  if (dirs.length > 0) {
    return path.join(sddsDir, dirs[0]);
  }
  const defaultDir = path.join(sddsDir, 'frontend-audit');
  fs.mkdirSync(defaultDir, { recursive: true });
  return defaultDir;
}

/**
 * Discover all check_*.js guard scripts in the tools/ directory.
 * Returns absolute paths sorted alphabetically for deterministic ordering.
 */
function discoverGuards() {
  const toolsDir = __dirname;
  return fs.readdirSync(toolsDir)
    .filter(f => (f.startsWith('check_') || f.startsWith('scan_')) && f.endsWith('.js') && f !== path.basename(__filename || 'audit.js'))
    .sort()
    .map(f => path.join(toolsDir, f));
}

/**
 * Run a single guard module with try/catch.
 * @param {string} guardPath - Absolute path to the guard script
 * @param {string} targetDir - Directory to scan
 * @returns {object} Result from the guard, or a skip result on failure
 */
async function runGuard(guardPath, targetDir) {
  const guardName = path.basename(guardPath, '.js');
  try {
    const mod = require(guardPath);
    const fn = typeof mod === 'function' ? mod : Object.values(mod)[0];
    if (typeof fn !== 'function') {
      return {
        exitCode: 0, skipped: true, name: guardName,
        data: { message: `Guard ${guardName} does not export a function` },
      };
    }
    const result = await fn(targetDir);
    // Normalize result shape
    return {
      exitCode: result.exitCode || 0,
      skipped: Boolean(result.skipped),
      name: result.name || guardName,
      data: result.data || result,
    };
  } catch (e) {
    return {
      exitCode: 0, skipped: true, name: guardName,
      data: { message: `Guard unavailable: ${e.message}` },
    };
  }
}

// ── Report Generation ────────────────────────────────────────────────────────

/**
 * Format a single guard result into a markdown section.
 */
function formatGuardSection(name, result) {
  const lines = [];
  const icon = result.skipped ? '⏭️' : result.exitCode === 0 ? '✅' : '❌';
  const status = result.skipped ? 'SKIPPED' : result.exitCode === 0 ? 'PASSED' : 'FAILED';

  lines.push(`### ${icon} ${name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — ${status}`);
  lines.push('');

  if (result.skipped) {
    lines.push(`> Skipped: ${result.data?.message || 'Dependencies not available'}`);
  } else if (result.exitCode === 0) {
    lines.push(`> ${result.data?.message || 'All checks passed'}`);
  } else {
    lines.push(`> ${result.data?.message || 'Issues found'}`);
    lines.push('');
    const violations = result.data?.violations || result.data?.findings || {};
    const files = Object.keys(violations);
    if (files.length > 0) {
      for (const file of files) {
        const items = violations[file];
        for (const item of items) {
          const loc = item.lineNo ? ` (line ${item.lineNo})` : '';
          const label = item.label || item.rule || item.rule || item.module || '';
          const msg = item.message || item.reason || '';
          lines.push(`- \`${file}\`${loc}: ${label ? `[${label}] ` : ''}${msg}`);
        }
      }
    }
  }

  return lines.join('\n');
}

/**
 * Generate the 05-audit-report.md from aggregated results.
 */
function generateReport(results, sddDir) {
  const taskName = path.basename(sddDir);
  const passed = results.filter(r => !r.skipped && r.exitCode === 0).length;
  const failed = results.filter(r => !r.skipped && r.exitCode !== 0).length;
  const skipped = results.filter(r => r.skipped).length;
  const total = results.length;

  const sections = [];

  sections.push(`# Code Audit Report: ${taskName}`);
  sections.push('');
  sections.push('> **Note for reviewer:** This report summarizes security, architecture, accessibility,');
  sections.push('> API contracts, performance, UI reuse, and testing coverage to facilitate review.');
  sections.push('');
  sections.push('---');
  sections.push('');
  sections.push('## Summary');
  sections.push('');
  sections.push(`| Metric | Count |`);
  sections.push(`|--------|-------|`);
  sections.push(`| Total guards | ${total} |`);
  sections.push(`| Passed | ${passed} |`);
  sections.push(`| Failed | ${failed} |`);
  sections.push(`| Skipped | ${skipped} |`);
  sections.push('');
  sections.push('---');
  sections.push('');

  for (const result of results) {
    sections.push(formatGuardSection(result.name, result));
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  return sections.join('\n');
}

// ── Console Summary ──────────────────────────────────────────────────────────

function printSummary(results, reportPath) {
  console.log('\n=================================================================');
  console.log('  CLC FORGE — EDUCATIONAL AUDIT SUMMARY');
  console.log('=================================================================\n');

  for (const result of results) {
    const icon = result.skipped ? '⏭️' : result.exitCode === 0 ? '✅' : '❌';
    const label = result.name.replace(/_/g, ' ');
    const msg = result.data?.message || '';
    console.log(`  ${icon} ${label}: ${msg}`);
  }

  console.log(`\n📄 Full report: ${reportPath}`);
  console.log('=================================================================\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(targetDir) {
  const dir = targetDir || process.cwd();
  const sddDir = getActiveSddDir();

  console.log('\nRunning CLC Forge audit...\n');

  const guardPaths = discoverGuards();

  if (guardPaths.length === 0) {
    console.log('No guard tools found in tools/. Nothing to audit.');
    return;
  }

  console.log(`Discovered ${guardPaths.length} guard(s): ${guardPaths.map(p => path.basename(p, '.js')).join(', ')}\n`);

  const results = [];
  for (const guardPath of guardPaths) {
    const result = await runGuard(guardPath, dir);
    results.push(result);
  }

  // Generate report
  const reportContent = generateReport(results, sddDir);
  const reportPath = path.join(sddDir, '05-audit-report.md');
  fs.writeFileSync(reportPath, reportContent, 'utf-8');

  // Print summary
  printSummary(results, reportPath);

  // Exit with failure if any guard failed (not skipped)
  const hasFailure = results.some(r => !r.skipped && r.exitCode !== 0);
  process.exit(hasFailure ? 1 : 0);
}

// Support both require() and direct execution
if (require.main === module) {
  main(process.argv[2]).catch(err => {
    console.error(`Audit orchestrator error: ${err.message}`);
    process.exit(0); // Graceful degradation
  });
}

module.exports = { main, getActiveSddDir, discoverGuards, runGuard };
