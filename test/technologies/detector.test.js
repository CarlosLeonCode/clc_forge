/**
 * CLC Forge — TechnologyDetector unit tests.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { TechnologyDetector } = require('../../src/technologies/detector');
const { createTmpProject, teardown } = require('../helpers');

describe('TechnologyDetector', () => {
  describe('detect() — Celery', () => {
    it('detects Celery via requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'celery>=5.3.0\nredis>=5.0.0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery from requirements.txt');
      } finally {
        teardown(dir);
      }
    });

    it('detects Celery via pyproject.toml', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\nname = "myapp"\ndependencies = ["celery>=5.3"]',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery from pyproject.toml');
      } finally {
        teardown(dir);
      }
    });

    it('detects Celery via celery.py file', () => {
      const dir = createTmpProject({
        'celery.py': 'from celery import Celery\napp = Celery()',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery from celery.py');
      } finally {
        teardown(dir);
      }
    });

    it('detects Celery via celeryconfig.py', () => {
      const dir = createTmpProject({
        'celeryconfig.py': 'broker_url = "redis://localhost"',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery from celeryconfig.py');
      } finally {
        teardown(dir);
      }
    });

    it('detects Celery via celery_app.py', () => {
      const dir = createTmpProject({
        'celery_app.py': 'from celery import Celery\napp = Celery()',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery from celery_app.py');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — Redis', () => {
    it('detects Redis via requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'redis>=5.0.0\ncelery>=5.3',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('redis'), 'should detect redis from requirements.txt');
      } finally {
        teardown(dir);
      }
    });

    it('detects Redis via pyproject.toml', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\ndependencies = ["redis>=5.0"]',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('redis'), 'should detect redis from pyproject.toml');
      } finally {
        teardown(dir);
      }
    });

    it('detects Redis via redis.conf', () => {
      const dir = createTmpProject({
        'redis.conf': 'port 6379\nbind 127.0.0.1',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('redis'), 'should detect redis from redis.conf');
      } finally {
        teardown(dir);
      }
    });

    it('detects Redis via redis:// in .env', () => {
      const dir = createTmpProject({
        '.env': 'REDIS_URL=redis://localhost:6379/0\nSECRET_KEY=xyz',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('redis'), 'should detect redis from .env');
      } finally {
        teardown(dir);
      }
    });

    it('detects Redis via .env.development', () => {
      const dir = createTmpProject({
        '.env.development': 'REDIS_URL=redis://localhost:6379/0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('redis'), 'should detect redis from .env.development');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — PostgreSQL', () => {
    it('detects PostgreSQL via psycopg2 in requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'psycopg2>=2.9.0\ncelery>=5.3',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('postgresql'), 'should detect postgresql from psycopg2');
      } finally {
        teardown(dir);
      }
    });

    it('detects PostgreSQL via asyncpg in requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'asyncpg>=0.29.0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('postgresql'), 'should detect postgresql from asyncpg');
      } finally {
        teardown(dir);
      }
    });

    it('detects PostgreSQL via psycopg2-binary in requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'psycopg2-binary>=2.9.0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('postgresql'), 'should detect postgresql from psycopg2-binary');
      } finally {
        teardown(dir);
      }
    });

    it('detects PostgreSQL via pyproject.toml', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\ndependencies = ["asyncpg>=0.29"]',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('postgresql'), 'should detect postgresql from pyproject.toml');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — Docker', () => {
    it('detects Docker via Dockerfile', () => {
      const dir = createTmpProject({
        'Dockerfile': 'FROM node:18-alpine\nRUN echo "hello"',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('docker'), 'should detect docker from Dockerfile');
      } finally {
        teardown(dir);
      }
    });

    it('detects Docker via docker-compose.yml', () => {
      const dir = createTmpProject({
        'docker-compose.yml': 'version: "3.8"\nservices:\n  web:\n    image: node:18',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('docker'), 'should detect docker from docker-compose.yml');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — case insensitivity', () => {
    it('detects celery in mixed-case requirements.txt', () => {
      const dir = createTmpProject({
        'requirements.txt': 'CELERY>=5.3.0\nREDIS>=5.0.0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery case-insensitively');
        assert.ok(result.includes('redis'), 'should detect redis case-insensitively');
      } finally {
        teardown(dir);
      }
    });

    it('detects CELERY in pyproject.toml', () => {
      const dir = createTmpProject({
        'pyproject.toml': '[project]\ndependencies = ["CELERY>=5.3"]',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect CELERY case-insensitively');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — multiple technologies', () => {
    it('detects all four technologies at once', () => {
      const dir = createTmpProject({
        'requirements.txt': 'celery>=5.3\nredis>=5.0\npsycopg2-binary>=2.9',
        'Dockerfile': 'FROM python:3.11-alpine',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery');
        assert.ok(result.includes('redis'), 'should detect redis');
        assert.ok(result.includes('postgresql'), 'should detect postgresql');
        assert.ok(result.includes('docker'), 'should detect docker');
        assert.strictEqual(result.length, 4, 'should detect exactly 4 technologies');
      } finally {
        teardown(dir);
      }
    });

    it('detects two technologies (celery + redis)', () => {
      const dir = createTmpProject({
        'requirements.txt': 'celery>=5.3\nredis>=5.0',
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(result.includes('celery'), 'should detect celery');
        assert.ok(result.includes('redis'), 'should detect redis');
        assert.strictEqual(result.length, 2, 'should detect exactly 2 technologies');
      } finally {
        teardown(dir);
      }
    });
  });

  describe('detect() — no technology found', () => {
    it('returns empty array when no tech signatures are present', () => {
      const dir = createTmpProject({
        'README.md': '# My Project\nJust a simple project.',
        'package.json': JSON.stringify({ name: 'myapp', version: '1.0.0' }),
      });
      try {
        const detector = new TechnologyDetector();
        const result = detector.detect(dir);
        assert.ok(Array.isArray(result), 'should return an array');
        assert.strictEqual(result.length, 0, 'should return empty array');
      } finally {
        teardown(dir);
      }
    });

    it('returns empty array for non-existent directory', () => {
      const detector = new TechnologyDetector();
      const result = detector.detect('/non/existent/path');
      assert.ok(Array.isArray(result), 'should return an array');
      assert.strictEqual(result.length, 0, 'should return empty array');
    });
  });

  describe('getToolsForTech()', () => {
    it('returns tool manifest for all four technologies', () => {
      const detector = new TechnologyDetector();
      const tools = detector.getToolsForTech(['celery', 'redis', 'postgresql', 'docker']);
      assert.strictEqual(tools.length, 4, 'should return 4 tools');
      const names = tools.map((t) => t.name);
      assert.ok(names.includes('celery_guard'));
      assert.ok(names.includes('redis_guard'));
      assert.ok(names.includes('postgres_guard'));
      assert.ok(names.includes('docker_guard'));
    });

    it('returns empty array for empty input', () => {
      const detector = new TechnologyDetector();
      const tools = detector.getToolsForTech([]);
      assert.strictEqual(tools.length, 0, 'should return empty array');
    });

    it('celery_guard has correct structure', () => {
      const detector = new TechnologyDetector();
      const tools = detector.getToolsForTech(['celery']);
      assert.strictEqual(tools[0].name, 'celery_guard');
      assert.strictEqual(tools[0].language, 'py');
      assert.strictEqual(tools[0].path, 'celery_guard.py');
    });
  });
});
