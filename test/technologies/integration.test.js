/**
 * CLC Forge — Technology detection integration tests.
 * Tests the full autoDetectStack pipeline with Phase-1 technology signatures.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { autoDetectStack } = require('../../src/detector');
const { createTmpProject, teardown } = require('../helpers');

describe('TechnologyDetector integration', () => {
  describe('autoDetectStack — techTools for Celery project', () => {
    it('populates techTools with celery_guard for a Django+Celery project', () => {
      const dir = createTmpProject({
        'manage.py': '',
        'requirements.txt': 'celery>=5.3\ndjango>=4.0\npsycopg2-binary',
      });
      try {
        const config = autoDetectStack(dir);
        assert.ok(config.techTools, 'techTools should be populated');
        const names = config.techTools.map((t) => t.name);
        assert.ok(names.includes('celery_guard'), 'should include celery_guard');
        assert.ok(names.includes('postgres_guard'), 'should include postgres_guard');
        assert.strictEqual(names.includes('redis_guard'), false, 'should not include redis_guard');
        assert.strictEqual(names.includes('docker_guard'), false, 'should not include docker_guard');
      } finally {
        teardown(dir);
      }
    });

    it('populates techTools with all four guards for full-stack project', () => {
      const dir = createTmpProject({
        'manage.py': '',
        'requirements.txt': 'celery>=5.3\nredis>=5.0\npsycopg2-binary\ndjango>=4.0',
        'Dockerfile': 'FROM python:3.11-alpine',
      });
      try {
        const config = autoDetectStack(dir);
        assert.ok(Array.isArray(config.techTools), 'techTools should be an array');
        const names = config.techTools.map((t) => t.name);
        assert.strictEqual(names.includes('celery_guard'), true, 'should include celery_guard');
        assert.strictEqual(names.includes('redis_guard'), true, 'should include redis_guard');
        assert.strictEqual(names.includes('postgres_guard'), true, 'should include postgres_guard');
        assert.strictEqual(names.includes('docker_guard'), true, 'should include docker_guard');
        assert.strictEqual(config.techTools.length, 4, 'should have exactly 4 tech tools');
      } finally {
        teardown(dir);
      }
    });

    it('populates techTools with docker_guard for Docker-only detection', () => {
      const dir = createTmpProject({
        'Dockerfile': 'FROM node:18-alpine\nCMD ["node", "server.js"]',
        'package.json': JSON.stringify({ name: 'myapp', version: '1.0.0' }),
      });
      try {
        const config = autoDetectStack(dir);
        const names = config.techTools.map((t) => t.name);
        assert.ok(names.includes('docker_guard'), 'should include docker_guard');
        assert.strictEqual(config.techTools.length, 1, 'should have exactly 1 tech tool');
      } finally {
        teardown(dir);
      }
    });

    it('returns empty techTools for project with no Phase-1 signatures', () => {
      const dir = createTmpProject({
        'package.json': JSON.stringify({ name: 'myapp', version: '1.0.0' }),
        'README.md': '# My Project',
      });
      try {
        const config = autoDetectStack(dir);
        assert.ok(Array.isArray(config.techTools), 'techTools should be an array');
        assert.strictEqual(config.techTools.length, 0, 'techTools should be empty');
      } finally {
        teardown(dir);
      }
    });

    it('returns empty techTools for non-existent directory', () => {
      const config = autoDetectStack('/non/existent/path');
      assert.ok(Array.isArray(config.techTools));
      assert.strictEqual(config.techTools.length, 0, 'techTools should be empty');
    });

    it('tool entries have correct language, path, command, and description', () => {
      const dir = createTmpProject({
        'Dockerfile': 'FROM node:18-alpine',
        'package.json': JSON.stringify({ name: 'myapp' }),
      });
      try {
        const config = autoDetectStack(dir);
        const dockerTool = config.techTools.find((t) => t.name === 'docker_guard');
        assert.ok(dockerTool, 'should have docker_guard tool');
        assert.strictEqual(dockerTool.language, 'py', 'language should be py');
        assert.strictEqual(dockerTool.path, 'docker_guard.py', 'path should be docker_guard.py');
        assert.ok(dockerTool.command.startsWith('python3 tools/'), 'command should run python3');
        assert.ok(dockerTool.description.length > 0, 'description should be non-empty');
      } finally {
        teardown(dir);
      }
    });

    it('Redis + Docker project returns redis_guard and docker_guard', () => {
      const dir = createTmpProject({
        'requirements.txt': 'redis>=5.0\ncelery>=5.3',
        'Dockerfile': 'FROM python:3.11-slim',
        'docker-compose.yml': 'version: "3.8"\nservices:\n  app:\n    build: .',
      });
      try {
        const config = autoDetectStack(dir);
        const names = config.techTools.map((t) => t.name);
        assert.ok(names.includes('celery_guard'), 'should include celery_guard');
        assert.ok(names.includes('redis_guard'), 'should include redis_guard');
        assert.ok(names.includes('docker_guard'), 'should include docker_guard');
        assert.strictEqual(names.includes('postgres_guard'), false, 'should not include postgres_guard');
      } finally {
        teardown(dir);
      }
    });
  });
});
