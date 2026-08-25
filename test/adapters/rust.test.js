const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('RustAdapter', () => {
  const RustAdapter = require('../../src/adapters/rust');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new RustAdapter();
      assert.strictEqual(adapter.name, 'Rust Engine');
      assert.strictEqual(adapter.projectType, 'backend');
      assert.strictEqual(adapter.testRunner, 'cargo test');
    });
  });

  describe('detect()', () => {
    it('returns true when Cargo.toml exists', () => {
      const dir = createTmpProject({
        'Cargo.toml': '[package]\nname = "myapp"\nversion = "0.1.0"\nedition = "2021"',
      });
      try {
        const adapter = new RustAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when Cargo.toml does not exist', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new RustAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new RustAdapter();
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

    it('all external tools have language=external and empty path', () => {
      const adapter = new RustAdapter();
      const tools = adapter.getTools();
      const externalTools = tools.filter((t) => t.language === 'external');
      for (const tool of externalTools) {
        assert.strictEqual(tool.language, 'external');
        assert.strictEqual(tool.path, '');
      }
    });

    it('includes custom rules guard', () => {
      const adapter = new RustAdapter();
      const tools = adapter.getTools();
      const customTool = tools.find((t) => t.name === 'check_custom');
      assert.ok(customTool, 'check_custom tool should exist');
      assert.strictEqual(customTool.language, 'js');
      assert.strictEqual(customTool.path, 'check_custom.js');
    });
  });

  describe('getSafeguards()', () => {
    it('returns non-empty array of strings', () => {
      const adapter = new RustAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
