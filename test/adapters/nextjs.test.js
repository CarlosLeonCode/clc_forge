const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('NextjsAdapter', () => {
  const NextjsAdapter = require('../../src/adapters/nextjs');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new NextjsAdapter();
      assert.strictEqual(adapter.name, 'Next.js (App Router)');
      assert.strictEqual(adapter.projectType, 'frontend');
      assert.strictEqual(adapter.testRunner, 'Vitest / Jest');
    });
  });

  describe('detect()', () => {
    it('returns true when package.json has next dependency', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ dependencies: { next: '14.0.0' } }),
      });
      try {
        const adapter = new NextjsAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when next is in devDependencies', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ devDependencies: { next: '14.0.0' } }),
      });
      try {
        const adapter = new NextjsAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when package.json has no next dependency', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ dependencies: { react: '18.0.0' } }),
      });
      try {
        const adapter = new NextjsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when no package.json exists', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new NextjsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when package.json is malformed JSON', () => {
      const dir = createTmpProject({
        'package.json': '{invalid json',
      });
      try {
        const adapter = new NextjsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new NextjsAdapter();
      const tools = adapter.getTools();
      assert.ok(Array.isArray(tools));
      assert.ok(tools.length > 0);
      for (const tool of tools) {
        assert.ok(tool.name, 'tool must have name');
        assert.ok(tool.language, 'tool must have language');
        assert.ok(typeof tool.command === 'string', 'tool must have command string');
        assert.ok(tool.description, 'tool must have description');
      }
    });

    it('external tools have language=external and empty path', () => {
      const adapter = new NextjsAdapter();
      const tools = adapter.getTools();
      const external = tools.filter((t) => t.language === 'external');
      assert.ok(external.length > 0, 'should have external tools');
      for (const tool of external) {
        assert.strictEqual(tool.path, '');
      }
    });
  });

  describe('getSafeguards()', () => {
    it('returns non-empty array of strings', () => {
      const adapter = new NextjsAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5, 'should have at least 5 safeguards');
      for (const g of guards) {
        assert.strictEqual(typeof g, 'string');
      }
    });
  });
});
