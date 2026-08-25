#!/usr/bin/env node
/**
 * Custom Rules Guard
 * Reads .clc-forge.yml and executes user-defined regex rules against changed files.
 * Self-contained: uses only Node.js built-ins (inline YAML parser, no npm deps).
 *
 * @param {string} targetDir - Directory to scan (defaults to cwd)
 * @returns {{ exitCode: number, skipped: boolean, name: string, data: object }}
 */
const check = async function checkCustom(targetDir) {
  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');

  const dir = targetDir || process.cwd();

  // ── 1. Load config ──────────────────────────────────────────────────
  const configPath = path.join(dir, '.clc-forge.yml');
  if (!fs.existsSync(configPath)) {
    return {
      exitCode: 0, skipped: true, name: 'check_custom',
      data: { violations: {}, message: 'No .clc-forge.yml found' },
    };
  }

  let config;
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    config = parseYaml(raw);
  } catch (e) {
    return {
      exitCode: 0, skipped: true, name: 'check_custom',
      data: { violations: {}, message: `Config parse error: ${e.message}` },
    };
  }

  const rules = config && config.rules;
  if (rules !== undefined && !Array.isArray(rules)) {
    return {
      exitCode: 0, skipped: true, name: 'check_custom',
      data: { violations: {}, message: 'Config error: "rules" must be a list' },
    };
  }
  if (!Array.isArray(rules) || rules.length === 0) {
    return {
      exitCode: 0, skipped: false, name: 'check_custom',
      data: { violations: {}, message: 'No custom rules defined' },
    };
  }

  // ── 2. Validate rules: compile regexes, check required fields ───────
  const validated = [];
  for (const rule of rules) {
    if (!rule.name || !rule.pattern || !rule.message) continue;
    try {
      validated.push({
        name: rule.name,
        pattern: rule.pattern,
        message: rule.message,
        severity: rule.severity || 'error',
        exclude: rule.exclude || [],
        regex: new RegExp(rule.pattern, 'gm'),
        scopeRe: globToRegex(rule.scope || '**/*'),
        excludeRe: (rule.exclude || []).map(globToRegex),
      });
    } catch {
      // Invalid regex — skip this rule silently
    }
  }

  if (validated.length === 0) {
    return {
      exitCode: 0, skipped: false, name: 'check_custom',
      data: { violations: {}, message: 'No valid custom rules after validation' },
    };
  }

  // ── 3. Get changed files via git diff ───────────────────────────────
  let files;
  try {
    const out = execSync('git diff --name-only HEAD~1', {
      cwd: dir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'],
    });
    files = out.split('\n').filter(f => f.trim());
  } catch {
    try {
      const out = execSync('git diff --name-only --cached', {
        cwd: dir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'],
      });
      files = out.split('\n').filter(f => f.trim());
    } catch {
      return {
        exitCode: 0, skipped: true, name: 'check_custom',
        data: { violations: {}, message: 'No git diff available' },
      };
    }
  }

  if (!files || files.length === 0) {
    return {
      exitCode: 0, skipped: false, name: 'check_custom',
      data: { violations: {}, message: 'No files to check' },
    };
  }

  // ── 4. Run rules against files ──────────────────────────────────────
  const violations = {};
  let hasError = false;

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      continue; // permission denied or unreadable — skip
    }

    for (const rule of validated) {
      if (!rule.scopeRe.test(file)) continue;
      if (rule.excludeRe.some(re => re.test(file))) continue;

      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(content)) !== null) {
        const lineNo = content.slice(0, match.index).split('\n').length;
        if (!violations[file]) violations[file] = [];
        violations[file].push({
          lineNo,
          rule: rule.name,
          message: rule.message,
          severity: rule.severity,
        });
        if (rule.severity === 'error') hasError = true;
      }
    }
  }

  // ── 5. Build result ─────────────────────────────────────────────────
  const totalCount = Object.values(violations).flat().length;
  return {
    exitCode: hasError ? 1 : 0,
    skipped: false,
    name: 'check_custom',
    data: {
      violations,
      message: totalCount > 0
        ? `${totalCount} custom rule violation(s) in ${Object.keys(violations).length} file(s)`
        : 'No custom rule violations',
    },
  };
};
module.exports = check;

if (require.main === module) {
  check(process.argv[2]).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.exitCode);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Inline YAML Parser (~85 lines)
// Supports: scalars, block sequences, block mappings, inline flow
// sequences, comments. No anchors/aliases, no multiple documents.
//
// Stack entries: { obj, indent, _parentObj, _parentKey }
//   obj: the object we are building key-value pairs into
//   indent: indent level (children at same indent stay)
//   _parentObj/_parentKey: where to find/create the array for sequences
// ═══════════════════════════════════════════════════════════════════════

function parseYaml(text) {
  const lines = text.split('\n');
  const root = {};
  const stack = [{ obj: root, indent: -1, _parentObj: null, _parentKey: null }];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/\s*#.*$/, '').trimEnd();
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const entry = stack[stack.length - 1];

    // ── Sequence item: "- rest" ──
    if (trimmed.startsWith('- ')) {
      const rest = trimmed.slice(2).trim();

      if (rest.includes(': ')) {
        // "- key: value" — mapping inside a sequence
        let arr = null;
        // Check if parent key already points to an array
        if (entry._parentObj && entry._parentKey) {
          const pk = entry._parentObj[entry._parentKey];
          if (Array.isArray(pk)) {
            arr = pk;
          } else if (pk && typeof pk === 'object' && Object.keys(pk).length === 0) {
            // Convert empty object to array
            entry._parentObj[entry._parentKey] = [];
            arr = entry._parentObj[entry._parentKey];
          }
        }
        if (arr) {
          const obj = {};
          const colonIdx = rest.indexOf(': ');
          obj[rest.slice(0, colonIdx).trim()] = parseScalar(rest.slice(colonIdx + 2).trim());
          arr.push(obj);
          stack.push({ obj, indent, _parentObj: arr, _parentKey: null });
        }
      } else if (entry._parentObj && entry._parentKey) {
        // "- scalar" inside a sequence
        const pk = entry._parentObj[entry._parentKey];
        if (Array.isArray(pk)) pk.push(parseScalar(rest));
      }
      continue;
    }

    // ── key: value pair ──
    const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();

      if (val === '' || val === '|' || val === '>') {
        // Empty value → children follow
        if (!entry.obj[key]) entry.obj[key] = {};
        stack.push({ obj: entry.obj[key], indent, _parentObj: entry.obj, _parentKey: key });
      } else if (val.startsWith('[') && val.endsWith(']')) {
        entry.obj[key] = val.slice(1, -1).split(',').map(s => parseScalar(s.trim()));
      } else if (val.startsWith('{') && val.endsWith('}')) {
        entry.obj[key] = parseFlowMapping(val);
      } else {
        entry.obj[key] = parseScalar(val);
      }
      continue;
    }
  }

  return root;
}

function parseScalar(val) {
  if (val === '' || val === '~' || val === 'null') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  // Strip quotes and unescape common escape sequences
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1).replace(/\\(.)/g, '$1');
  }
  return val;
}

function parseFlowMapping(str) {
  const inner = str.slice(1, -1).trim();
  if (!inner) return {};
  const obj = {};
  const pairs = inner.split(',');
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(':');
    if (colonIdx === -1) continue;
    const k = pair.slice(0, colonIdx).trim();
    const v = pair.slice(colonIdx + 1).trim();
    obj[k] = parseScalar(v);
  }
  return obj;
}

// ═══════════════════════════════════════════════════════════════════════
// Glob-to-Regex Converter (~15 lines)
// Handles: **, *, {a,b} alternation
// ═══════════════════════════════════════════════════════════════════════

function globToRegex(glob) {
  let re = glob
    .replace(/\./g, '\\.')           // escape dots
    .replace(/\*\*\//g, '{{GLOBSTAR_SLASH}}') // protect **/ (zero or more segments + separator)
    .replace(/\*\*/g, '{{GLOBSTAR}}') // protect trailing **
    .replace(/\*/g, '[^/]*')          // single * = no slashes
    .replace(/\{\{GLOBSTAR_SLASH\}\}/g, '(?:.+/)?') // **/ = optional path segments
    .replace(/\{\{GLOBSTAR\}\}/g, '.*') // ** = anything
    .replace(/\{([^}]+)\}/g, (_, alt) =>
      `(${alt.split(',').join('|')})`);  // {a,b} alternation
  return new RegExp('^' + re + '$');
}
