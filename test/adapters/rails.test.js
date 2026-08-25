const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTmpProject, teardown } = require('../helpers');

describe('RailsAdapter', () => {
  const RailsAdapter = require('../../src/adapters/rails');

  describe('constructor', () => {
    it('creates adapter with correct name and projectType', () => {
      const adapter = new RailsAdapter();
      assert.strictEqual(adapter.name, 'Ruby on Rails');
      assert.strictEqual(adapter.projectType, 'backend');
      assert.strictEqual(adapter.testRunner, 'RSpec / Minitest');
    });
  });

  describe('detect()', () => {
    it('returns true when Gemfile and config/routes.rb exist', () => {
      const dir = createTmpProject({
        'Gemfile': "source 'https://rubygems.org'\ngem 'rails', '~> 7.0'",
        'config/routes.rb': 'Rails.application.routes.draw do end',
      });
      try {
        const adapter = new RailsAdapter();
        assert.strictEqual(adapter.detect(dir), true);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when only Gemfile exists (no routes.rb)', () => {
      const dir = createTmpProject({
        'Gemfile': "source 'https://rubygems.org'",
      });
      try {
        const adapter = new RailsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when only routes.rb exists (no Gemfile)', () => {
      const dir = createTmpProject({
        'config/routes.rb': 'Rails.application.routes.draw do end',
      });
      try {
        const adapter = new RailsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });

    it('returns false when directory is empty', () => {
      const dir = createTmpProject({});
      try {
        const adapter = new RailsAdapter();
        assert.strictEqual(adapter.detect(dir), false);
      } finally {
        teardown(dir);
      }
    });
  });

  describe('getTools()', () => {
    it('returns array of tool objects with required fields', () => {
      const adapter = new RailsAdapter();
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
      const adapter = new RailsAdapter();
      const tools = adapter.getTools();
      const externalTools = tools.filter((t) => t.language === 'external');
      for (const tool of externalTools) {
        assert.strictEqual(tool.language, 'external');
        assert.strictEqual(tool.path, '');
      }
    });

    it('includes custom rules guard', () => {
      const adapter = new RailsAdapter();
      const tools = adapter.getTools();
      const customTool = tools.find((t) => t.name === 'check_custom');
      assert.ok(customTool, 'check_custom tool should exist');
      assert.strictEqual(customTool.language, 'js');
      assert.strictEqual(customTool.path, 'check_custom.js');
    });
  });

  describe('getSafeguards()', () => {
    it('returns non-empty array of strings', () => {
      const adapter = new RailsAdapter();
      const guards = adapter.getSafeguards();
      assert.ok(Array.isArray(guards));
      assert.ok(guards.length >= 5);
    });
  });
});
