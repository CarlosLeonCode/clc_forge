#!/usr/bin/env node
/**
 * CLC Forge — Executable Binary Entry Point
 * Invokes the main controller module for CLC Forge.
 */

const { runCli } = require('../src/index');

runCli().catch((err) => {
  console.error('\n❌ Error ejecutando clc-forge:', err);
  process.exit(1);
});
