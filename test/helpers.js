/**
 * Shared test utilities for CLC Forge test suite.
 * Provides temp directory creation, project scaffolding, and teardown.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Create a temporary project directory with the given file structure.
 * Returns the path to the temp directory.
 *
 * @param {Record<string, string>} files - Map of relative paths to file contents.
 * @returns {string} Path to the created temp directory.
 */
function createTmpProject(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clc-forge-test-'));
  for (const [rel, content] of Object.entries(files)) {
    const filePath = path.join(dir, rel);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  return dir;
}

/**
 * Recursively remove a temporary directory.
 *
 * @param {string} dir - Path to remove.
 */
function teardown(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

module.exports = { createTmpProject, teardown };
