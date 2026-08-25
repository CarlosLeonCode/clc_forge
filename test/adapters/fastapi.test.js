const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('FastApiAdapter', () => {
  const FastApiAdapter = require('../../src/adapters/fastapi');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new FastApiAdapter();
      assert.strictEqual(adapter.name, 'FastAPI Framework');
      assert.strictEqual(adapter.projectType, 'backend');
      assert.strictEqual(adapter.testRunner, 'Pytest');
    });
  });

  describe('detect()', () => {
    it('returns true when pyproject.toml contains fastapi', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\nname = "api"\ndependencies = ["fastapi>=0.100"]',
      });
      try {
        const adapter = new FastApiAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when requirements.txt contains fastapi', () => {
      const dir = createTmpProject({
        'requirements.txt': 'fastapi>=0.100\nuvicorn',
      });
      try {
        const adapter = new FastApiAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when no fastapi indicators present', () => {
      const dir = createTmpProject({
        'requirements.txt': 'flask>=2.0',
      });
      try {
        const adapter = new FastApiAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when directory is empty', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new FastApiAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new FastApiAdapter();
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
      const adapter = new FastApiAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
