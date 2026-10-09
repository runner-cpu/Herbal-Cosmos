import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SYSTEMS = ['tibetan', 'mongolian', 'uyghur', 'common'];
const CLAIM_WORDS = ['治愈', '根治', '特效', '有效率', '临床验证', '推荐用药', '替代药物', '无毒副作用', '包治', '最好', '第一', '主治', '疗效'];

function readRuntimeHerbs(baseDir) {
  const files = ['assets/js/data/featured.js', 'assets/js/data/expanded.bootstrap.js'];
  const dataDir = path.join(baseDir, 'assets', 'js', 'data');
  const chunks = fs.existsSync(dataDir)
    ? fs.readdirSync(dataDir).filter(file => /^expanded\.chunk-\d+\.js$/.test(file)).sort()
    : [];
  const sources = [...files, ...chunks.map(file => 'assets/js/data/' + file), 'assets/js/data/expanded.generated.js']
    .map(relativePath => {
      try { return fs.readFileSync(path.join(baseDir, relativePath), 'utf8'); }
      catch { return ''; }
    });
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const source of sources) if (source) vm.runInContext(source, sandbox);
  const herbs = sandbox.window.HERBS || [];
  const cards = herbs.filter(herb => !['formula-material', 'directory-only'].includes(herb.kind));
  return { cards, byId: new Map(cards.map(herb => [herb.id, herb])) };
}

function loadCorrespondence(baseDir) {
  const file = path.join(baseDir, 'assets', 'js', 'data', 'ethnic-correspondence.js');
  const source = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return Array.isArray(sandbox.window.ETHNIC_CORRESPONDENCE) ? sandbox.window.ETHNIC_CORRESPONDENCE : [];
}

export function validateEthnicData({ baseDir = root } = {}) {
  const issues = [];
  const warnings = [];
  const entries = loadCorrespondence(baseDir);
  const { cards, byId } = readRuntimeHerbs(baseDir);
  const seen = new Set();
  const approved = [];
  const review = [];

  for (const entry of entries) {
    const label = `${entry.herbName || '?'} / ${(entry.systems || []).join('+') || '?'}`;
    const herb = byId.get(entry.herbId);
    if (!herb) {
      issues.push(`unknown herbId: ${entry.herbId} (${label})`);
      continue;
    }
    if (herb.name !== entry.herbName) {
      issues.push(`herbName mismatch for ${entry.herbId}: expected "${herb.name}", found "${entry.herbName}"`);
      continue;
    }
    if (!Array.isArray(entry.systems) || !entry.systems.length) {
      issues.push(`systems must be a non-empty array: ${label}`);
      continue;
    }
    const unknown = entry.systems.filter(system => !SYSTEMS.includes(system));
    if (unknown.length) {
      issues.push(`unknown system ${unknown.join(', ')} in ${label}; allowed: ${SYSTEMS.join(', ')}`);
      continue;
    }
    const duplicateKey = entry.herbId + '|' + [...entry.systems].sort().join(',');
    if (seen.has(duplicateKey)) {
      issues.push(`duplicate herbId + systems combination: ${label}`);
      continue;
    }
    seen.add(duplicateKey);
    const note = String(entry.note || '');
    if (!note.trim()) {
      issues.push(`note is required: ${label}`);
      continue;
    }
    const offending = CLAIM_WORDS.filter(word => note.includes(word));
    if (offending.length) {
      issues.push(`note uses a treatment claim (${offending.join('、')}): ${label}`);
      continue;
    }
    const url = String(entry.source?.url || '').trim();
    const hasSource = /^https:\/\//.test(url);
    if (entry.status === 'approved' && !hasSource) {
      warnings.push(`downgraded to review (missing https source): ${label}`);
      review.push({ herbId: entry.herbId, herbName: entry.herbName, systems: entry.systems, reason: 'missing source url' });
      continue;
    }
    if (!hasSource) {
      review.push({ herbId: entry.herbId, herbName: entry.herbName, systems: entry.systems, reason: 'missing source url' });
      continue;
    }
    if (entry.status !== 'approved') {
      review.push({ herbId: entry.herbId, herbName: entry.herbName, systems: entry.systems, reason: `status is ${entry.status}` });
      continue;
    }
    approved.push({ herbId: entry.herbId, herbName: entry.herbName, systems: [...entry.systems], note, source: { title: String(entry.source?.title || ''), url } });
  }

  const bySystem = Object.fromEntries(SYSTEMS.map(system => [
    system,
    approved.filter(entry => entry.systems.includes(system)).length
  ]));

  const report = {
    runtimeCards: cards.length,
    total: entries.length,
    approved: approved.length,
    review: review.length,
    bySystem,
    approvedEntries: approved,
    reviewEntries: review
  };

  return { ok: issues.length === 0, issues, warnings, report };
}

export function writeEthnicReport(result, { baseDir = root } = {}) {
  const target = path.join(baseDir, 'reports', 'ethnic-coverage.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(result.report, null, 2) + '\n', 'utf8');
  return target;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateEthnicData();
  const { report } = result;
  const reportPath = writeEthnicReport(result);
  console.log(`Ethnic correspondence: ${report.total} entries, ${report.approved} approved, ${report.review} review, ${result.issues.length} issue(s)`);
  console.log('By system: ' + Object.entries(report.bySystem).map(([key, value]) => `${key} ${value}`).join(' · '));
  console.log('Coverage report: ' + path.relative(root, reportPath).replaceAll('\\', '/'));
  if (report.approved === 0) {
    console.warn('No approved entries yet: the star map reading and the heritage section stay hidden until sources are supplied.');
  }
  for (const warning of result.warnings) console.warn('warning: ' + warning);
  if (process.argv.includes('--verbose')) {
    for (const entry of report.reviewEntries) console.log(`review: ${entry.herbName} — ${entry.reason}`);
  }
  if (result.issues.length) {
    for (const issue of result.issues) console.error('error: ' + issue);
    process.exitCode = 1;
  }
}
