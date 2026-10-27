import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const failures = [];
const check = (name, fn) => { try { fn(); console.log('PASS ' + name); } catch (error) { failures.push(name + ': ' + error.message); console.error('FAIL ' + name + ': ' + error.message); } };

check('Document semantics and metadata', () => {
  assert.match(html, /<html\b[^>]*\blang="[^"]+"/i);
  assert.match(html, /<meta\s+name="viewport"/i);
  assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  for (const landmark of ['header', 'main', 'footer', 'nav']) assert.match(html, new RegExp('<' + landmark + '\\b', 'i'));
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, 'Exactly one primary heading required');
});
check('No broken local asset references', () => {
  const assets = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/gi)].map(m => m[1]);
  for (const asset of assets) {
    if (/^(?:https?:|data:|#|mailto:|\/\/)/i.test(asset)) continue;
    const file = decodeURIComponent(asset.split(/[?#]/)[0]).replace(/^\//, '');
    assert.ok(!file.split('/').includes('..'), 'Unsafe asset path: ' + asset);
    assert.ok(fs.existsSync(path.join(root, file)), 'Missing local asset: ' + asset);
  }
});
check('External new-tab links are protected', () => {
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    assert.match(match[0], /\brel="[^"]*noopener[^"]*"/i, 'Missing noopener: ' + match[0]);
  }
});
check('Dashboard tabs have accessible targets', () => {
  const tabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/gi)];
  assert.ok(tabs.length >= 9, 'Expected at least nine dashboard tabs');
  for (const [tag] of tabs) {
    const target = tag.match(/aria-controls="([^"]+)"/i)?.[1];
    assert.ok(target, 'Missing aria-controls: ' + tag);
    assert.ok(html.includes('id="' + target + '"'), 'Tab target does not exist: ' + target);
  }
});
check('Assessment question quality', () => {
  const bank = JSON.parse(read('assessments.json'));
  const ids = new Set();
  for (const track of bank.tracks) {
    assert.ok(track.questions.length, 'Empty assessment track');
    for (const q of track.questions) {
      assert.ok(!ids.has(q.id), 'Duplicate question ' + q.id); ids.add(q.id);
      assert.ok(q.options.every(o => typeof o === 'string' && o.trim()), 'Empty option ' + q.id);
      assert.equal(new Set(q.options.map(o => o.trim().toLowerCase())).size, q.options.length, 'Duplicate options ' + q.id);
    }
  }
});
check('Mock call simulator is implemented', () => {
  const code = read('mock-call-studio.js');
  assert.ok(code.trim().length > 500, 'Mock call module is missing or empty');
  assert.ok(code.includes('mock-call-studio'), 'Simulator mount point missing');
});
if (failures.length) { console.error('\n' + failures.length + ' quality check(s) failed.'); process.exitCode = 1; }
else console.log('\nAll additional static quality checks passed. Browser, security and production tests still required.');
