import fs from 'node:fs';import assert from 'node:assert/strict';
const html=fs.readFileSync('index.html','utf8');
for(const id of ['dashboard','growth','progress','typemaster','voicecoach','mockcalls','assessment','interpersonal','courses','paths'])assert.match(html,new RegExp('id="'+id+'"'),'Missing '+id);
for(const name of ['assessment-engine.js','learning-progress.js','mock-call-studio.js','type-master.js','voice-coach.js','career-growth.js','interpersonal-studio.js','career-chatbot.js']){assert.ok(fs.existsSync(name),'Missing script '+name);new Function(fs.readFileSync(name,'utf8'));assert.ok(html.includes(name),'Missing asset reference '+name)}
const bank=JSON.parse(fs.readFileSync('assessments.json','utf8'));assert.equal(bank.tracks.length,30);assert.equal(bank.tracks.reduce((n,t)=>n+t.questions.length,0),220);
console.log('AglaStep static smoke checks passed');
