const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('AstroAdapter', () => {
  const AstroAdapter = require('../../src/adapters/astro');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new AstroAdapter();
      assert.strictEqual(adapter.name, 'Astro Framework');
      assert.strictEqual(adapter.projectType, 'frontend');
      assert.strictEqual(adapter.testRunner, 'Vitest / Playwright');
    });
  });

  describe('detect()', () => {
    it('returns true when package.json has astro dependency', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ dependencies: { astro: '4.0.0' } }),
      });
      try {
        const adapter = new AstroAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when astro.config.mjs exists', () => {
      const dir = createTmpProject({
        'astro.config.mjs': 'export default {}',
        'package.json': JSON.stringify({ dependencies: {} }),
      });
      try {
        const adapter = new AstroAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when astro.config.js exists', () => {
      const dir = createTmpProject({
        'astro.config.js': 'module.exports = {}',
        'package.json': JSON.stringify({ dependencies: {} }),
      });
      try {
        const adapter = new AstroAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when no package.json exists', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new AstroAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when package.json has no astro and no config file', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ dependencies: { react: '18.0.0' } }),
      });
      try {
        const adapter = new AstroAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new AstroAdapter();
      const tools = adapter.getTools();
      assert.ok(Array.isArray(tools));
      assert.ok(tools.length > 0);
      for (const tool of tools) {
        assert.ok(tool.name);
        assert.ok(tool.language);
        assert.ok(typeof tool.command === 'string');
        assert.ok(tool.description);
      }
    });
  });

  describe('getSafeguards()', () => {
    it('returns non-empty array of strings', () => {
      const adapter = new AstroAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
