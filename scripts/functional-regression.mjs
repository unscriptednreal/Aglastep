import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read = file => fs.readFileSync(file, 'utf8');
const auth = read('learner-account.js');
const assessment = read('assessment-engine.js');
const calls = read('mock-call-studio.js');
assert.ok(!/(?<!window\.)\bhistory\.replaceState\(/.test(auth), 'OAuth callback must use window.history');
assert.match(auth, /if\(user\?\.id!==userId\)return/, 'Cloud results must verify current user');
assert.match(assessment, /if\(b\.disabled\)return/, 'Assessment must ignore repeat answer clicks');
assert.match(calls, /if\(btn\.disabled\)return/, 'Mock call must ignore repeat answer clicks');
const store = new Map();
const window = {dispatchEvent(){}};
const context = {window, localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}, document:{getElementById:()=>null},Event:class{constructor(type){this.type=type}}, console};
vm.runInNewContext(read('learning-progress.js'), context);
const progress = window.AglaProgress;
progress.record({type:'lab',track:'Test',accuracy:80,count:5});
assert.equal(progress.snapshot().sessions.length, 1);
const valid = JSON.parse(JSON.stringify(progress.snapshot()));
progress.clear();
progress.restore(valid);
assert.equal(progress.snapshot().sessions[0].accuracy, 80);
for (const bad of [
 {...valid, sessions:[null]},
 {...valid, sessions:[{...valid.sessions[0],accuracy:'NaN'}]},
 {...valid, visits:[{}]},
 {...valid, events:[{type:'x',detail:'y',day:'not-a-date'}]}
]) {
 const before = JSON.stringify(progress.snapshot());
 assert.throws(()=>progress.restore(bad), /Invalid/);
 assert.equal(JSON.stringify(progress.snapshot()),before,'Rejected restore must not mutate progress');
}
console.log('Passed: OAuth callback, cloud identity guard, answer double-click guards, progress record/clear/restore, invalid backup rejection.');
