const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('GoAdapter', () => {
  const GoAdapter = require('../../src/adapters/go');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new GoAdapter();
      assert.strictEqual(adapter.name, 'Go (Golang)');
      assert.strictEqual(adapter.projectType, 'backend');
      assert.strictEqual(adapter.testRunner, 'go test');
    });
  });

  describe('detect()', () => {
    it('returns true when go.mod exists', () => {
      const dir = createTmpProject({ 'go.mod': 'module example.com/myapp\ngo 1.21' });
      try {
        const adapter = new GoAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when go.mod does not exist', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new GoAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new GoAdapter();
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

    it('all tools are external', () => {
      const adapter = new GoAdapter();
      const tools = adapter.getTools();
      for (const tool of tools) {
        assert.strictEqual(tool.language, 'external');
        assert.strictEqual(tool.path, '');
      }
    });
  });

  describe('getSafeguards()', () => {
    it('returns non-empty array of strings', () => {
      const adapter = new GoAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
