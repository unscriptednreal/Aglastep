import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=fs.readFileSync('index.html','utf8');
const required=['dashboard','growth','progress','typemaster','voicecoach','mockcalls','assessment','interpersonal','courses','paths'];
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
for(const id of required)assert.ok(ids.includes(id),'Missing dashboard section '+id);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML ids');
const tabIds=[...html.matchAll(/<button[^>]+data-dashboard-tab="([^"]+)"[^>]*>/g)].map(x=>x[1]);
for(const t of ['growth','progress','typemaster','voicecoach','mockcalls','assessment','interpersonal','courses','paths']){
  assert.ok(tabIds.includes(t),'Missing interactive dashboard tab '+t);
  assert.ok(html.includes('id="'+t+'" data-dashboard-panel="'+t+'"'),'Tab has no matching section: '+t);
}
for(const [,destination] of html.matchAll(/\shref="#([^"]+)"/g))assert.ok(ids.includes(destination),'Broken in-page link #'+destination);
const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
for(const file of scripts){assert.ok(fs.existsSync(file),'Missing script '+file);new vm.Script(fs.readFileSync(file,'utf8'),{filename:file})}
for(const [,js] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(js.trim())new vm.Script(js,{filename:'index-inline.js'});
const bank=JSON.parse(fs.readFileSync('assessments.json','utf8'));
assert.equal(bank.tracks.length,30,'Unexpected assessment track count');
const questions=bank.tracks.flatMap(t=>t.questions);
assert.equal(questions.length,220,'Unexpected assessment question count');
const questionIds=new Set();
for(const q of questions){
  assert.ok(q.id&&!questionIds.has(q.id),'Missing or duplicate question ID '+q.id);questionIds.add(q.id);
  assert.ok(q.options.length>=2&&Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<q.options.length,'Invalid answer index '+q.id);
  assert.ok(q.prompt&&q.explanation,'Incomplete assessment question '+q.id);
}
for(const name of ['interpersonal-labs.json'])JSON.parse(fs.readFileSync(name,'utf8'));
console.log('Passed: navigation, section refs, JS syntax, 30 tracks, 220 questions, answer integrity.');
