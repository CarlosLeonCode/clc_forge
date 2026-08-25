const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('DjangoAdapter', () => {
  const DjangoAdapter = require('../../src/adapters/django');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new DjangoAdapter();
      assert.strictEqual(adapter.name, 'Django Framework');
      assert.strictEqual(adapter.projectType, 'backend');
    });
  });

  describe('detect()', () => {
    it('returns true when manage.py exists', () => {
      const dir = createTmpProject({ 'manage.py': '#!/usr/bin/env python' });
      try {
        const adapter = new DjangoAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when requirements.txt contains django', () => {
      const dir = createTmpProject({ 'requirements.txt': 'django>=4.0\npsycopg2' });
      try {
        const adapter = new DjangoAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns true when pyproject.toml contains django', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\nname = "myapp"\ndependencies = ["django>=4.0"]',
      });
      try {
        const adapter = new DjangoAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when no django indicators present', () => {
      const dir = createTmpProject({
        'requirements.txt': 'flask>=2.0',
      });
      try {
        const adapter = new DjangoAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when directory is empty', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new DjangoAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new DjangoAdapter();
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
      const adapter = new DjangoAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
