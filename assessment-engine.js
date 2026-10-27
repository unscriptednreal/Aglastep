(()=>{
'use strict';
const root=document.getElementById('ag-assessment-v2');
if(!root)return;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n};
const state={bank:null,track:null,index:0,answers:[],started:0};
const courseMap={fresher:'fresher',agent:'agent',mid:'mid'};
function trackCourse(audience){return '#courses';}
const career={fresher:'Freshers',agent:'Customer service agents',mid:'Mid-level & future leaders'};
const academies=[
{key:'human',name:'Communication & Human Skills',icon:'💬',ids:['english','listening','empathy','email','workplace','stress','conflict','interview']},
{key:'reasoning',name:'Reasoning & Problem-Solving',icon:'🧠',ids:['reasoning','data-reasoning','numeracy','technical','process']},
{key:'cx',name:'Customer Experience',icon:'🎧',ids:['calls','deescalation','quality','crm','sales','finance']},
{key:'digital',name:'AI, Digital & Data',icon:'🤖',ids:['ai','excel','privacy','digital','typing']},
{key:'leadership',name:'Leadership & Career Growth',icon:'🚀',ids:['leadership','trainer','qa-career','operations','wfm','training-design']}
];
let selectedAudience='all';
function shell(){root.replaceChildren();const intro=el('div',undefined,'ag2-intro');intro.append(el('p','AGLASTEP SKILLS LAB · PRACTICE LIBRARY','ag2-kicker'),el('h3','Browse practice by academy'),el('p','Open a category to see its practice tracks. Choose a quick five-question lab or a ten-question assessment.'));const filters=el('div',undefined,'ag2-filters');filters.id='ag2-filters';[['all','All careers'],['fresher','Freshers'],['agent','Agents'],['mid','Career growth']].forEach(([id,label])=>{const button=el('button',label,'ag2-filter');button.type='button';button.dataset.audience=id;button.setAttribute('aria-pressed',String(selectedAudience===id));button.classList.toggle('selected',selectedAudience===id);button.addEventListener('click',()=>{selectedAudience=id;drawCategories()});filters.append(button)});const grid=el('div',undefined,'ag2-categories');grid.id='ag2-grid';intro.append(filters,grid,el('p','Educational self-check; not certified testing. Answers stay in your browser session.','ag2-note'));root.append(intro);drawCategories()}
function drawCategories(preferred){const grid=root.querySelector('#ag2-grid');if(!grid)return;grid.replaceChildren();root.querySelectorAll('#ag2-filters button').forEach(button=>{const on=button.dataset.audience===selectedAudience;button.classList.toggle('selected',on);button.setAttribute('aria-pressed',String(on))});academies.forEach((academy,index)=>{const tracks=academy.ids.map(id=>state.bank.tracks.find(t=>t.id===id)).filter(t=>t&&(selectedAudience==='all'||t.audience===selectedAudience));if(!tracks.length)return;const section=el('details',undefined,'ag2-category');section.dataset.academy=academy.key;if(preferred===academy.key||(preferred===undefined&&index===0))section.open=true;const header=el('summary',undefined,'ag2-category-title');const label=el('span',undefined,'ag2-category-name');label.append(el('span',academy.icon,'ag2-category-icon'),el('strong',academy.name));const count=el('span',tracks.length+' practice tracks','ag2-category-count');header.append(label,count);const list=el('div',undefined,'ag2-track-stack');tracks.forEach(t=>{const card=el('article',undefined,'ag2-track ag2-track-row');const copy=el('div',undefined,'ag2-track-copy');copy.append(el('h4',t.title),el('p',t.description),el('span',career[t.audience]+' · '+t.questions.length+' questions','ag2-meta'));const button=el('button','Start practice →','btn dark');button.type='button';button.dataset.trackId=t.id;button.addEventListener('click',()=>start(t.id));card.append(copy,button);list.append(card)});section.append(header,list);grid.append(section)});if(preferred){const target=grid.querySelector('[data-academy="'+preferred+'"]');if(target)target.open=true}}
document.addEventListener('click',e=>{const button=e.target.closest('[data-academy]');if(!button||button.closest('#ag2-grid'))return;const key=button.dataset.academy;if(!academies.some(x=>x.key===key))return;selectedAudience='all';shell();drawCategories(key);document.getElementById('assessment').scrollIntoView({behavior:'smooth'})});
function start(id){state.track=state.bank.tracks.find(t=>t.id===id);state.index=0;state.answers=[];state.started=Date.now();renderQ();root.scrollIntoView({behavior:'smooth',block:'start'})}
function renderQ(){const t=state.track,q=t.questions[state.index];root.replaceChildren();const box=el('div',undefined,'ag2-panel');const back=el('button','← All assessments','ag2-back');back.type='button';back.onclick=shell;const tag=el('p',t.title+' · Question '+(state.index+1)+' of '+t.questions.length,'ag2-kicker');const progress=el('div',undefined,'ag2-progress');progress.setAttribute('role','progressbar');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax',String(t.questions.length));progress.setAttribute('aria-valuenow',String(state.index+1));progress.setAttribute('aria-label','Assessment progress');const bar=el('span');bar.style.width=((state.index+1)/t.questions.length*100)+'%';progress.append(bar);const h=el('h3',q.prompt);const choices=el('div',undefined,'ag2-options');const feedback=el('div',undefined,'ag2-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');const next=el('button',state.index===t.questions.length-1?'See my results →':'Continue →','btn dark');next.setAttribute('aria-label',state.index===t.questions.length-1?'View assessment result':'Continue to next question');next.type='button';next.disabled=true;q.options.forEach((opt,i)=>{const b=el('button',String.fromCharCode(65+i)+'. '+opt,'ag2-choice');b.type='button';b.onclick=()=>{if(b.disabled)return;state.answers[state.index]=i;choices.querySelectorAll('button').forEach((z,n)=>{z.disabled=true;z.classList.toggle('ag2-correct',n===q.correctIndex);z.classList.toggle('ag2-wrong',n===i&&i!==q.correctIndex)});const result=i===q.correctIndex?'✓ Good judgment. ':'↗ Learning moment. ';feedback.textContent=result+q.explanation;feedback.style.display='block';next.disabled=false;next.focus()};choices.append(b)});next.onclick=()=>{if(state.index===t.questions.length-1)result();else{state.index++;renderQ()}};box.append(back,tag,progress,h,choices,feedback,next);root.append(box);const focus=root.querySelector('h3');if(focus){focus.tabIndex=-1;focus.focus({preventScroll:true})}}
function result(){
const t=state.track,correct=t.questions.filter((q,i)=>state.answers[i]===q.correctIndex).length,pct=Math.round(correct/t.questions.length*100);
const missed=t.questions.filter((q,i)=>state.answers[i]!==q.correctIndex);
if(window.AglaProgress)window.AglaProgress.record({type:'lab',track:t.title,accuracy:pct,count:t.questions.length});
const strengths=t.questions.filter((q,i)=>state.answers[i]===q.correctIndex);
root.replaceChildren();
const box=el('div',undefined,'ag2-panel ag5-report');
box.append(el('p','YOUR PERSONAL LEARNING REPORT · '+t.title,'ag2-kicker'),el('h3',pct+'% practice accuracy'));
const summary=el('p',correct+' of '+t.questions.length+' scenarios answered correctly · '+(pct>=80?'Strong sample performance':pct>=60?'Developing foundations':'Good starting point for focused practice'));
box.append(summary);
const metrics=el('div',undefined,'ag5-metrics');
[['Correct',correct+'/'+t.questions.length],['Topics to revisit',String(missed.length)],['Time spent',Math.max(1,Math.round((Date.now()-state.started)/60000))+' min']].forEach(([name,value])=>{const card=el('div',undefined,'ag5-metric');card.append(el('strong',value),el('span',name));metrics.append(card)});
box.append(metrics);
const detail=el('div',undefined,'ag5-detail');
detail.append(el('h4','What your answers suggest'));
detail.append(el('p',missed.length?'Your best next step is to practise the '+missed.length+' situation'+(missed.length===1?'':'s')+' below, then attempt a fresh track. Each question has equal weight in this short practice set.':'You handled all sample situations in this track. Challenge yourself with a different topic to broaden your evidence.'));
const per=el('div',undefined,'ag5-bars');
[['Demonstrated in this sample',correct,'#71a934'],['Needs review in this sample',missed.length,'#8067eb']].forEach(([label,count,color])=>{const wrap=el('div',undefined,'ag5-barrow');wrap.append(el('span',label+' · '+count));const rail=el('div',undefined,'ag5-rail');const fill=el('span');fill.style.width=(count/t.questions.length*100)+'%';fill.style.background=color;rail.append(fill);wrap.append(rail);per.append(wrap)});
detail.append(per);
if(strengths.length){detail.append(el('h4','Areas you demonstrated'));const p=el('p',strengths.slice(0,2).map(q=>q.prompt).join(' • '));detail.append(p)}
const heading=el('h4','Your priority improvement topics');detail.append(heading);
if(missed.length){missed.forEach(q=>{const row=el('div',undefined,'ag2-review');row.append(el('strong',q.prompt),el('p',q.explanation));detail.append(row)})}else detail.append(el('p','No missed questions in this track. Try an unfamiliar track for a more varied challenge.'));
detail.append(el('h4','A practical 7-day improvement plan'));
const plan=el('ol',undefined,'ag5-plan');
const focus=missed.length?missed.slice(0,3).map(q=>q.prompt).join(' / '):'Choose an unfamiliar practice track';
const steps=[
'Day 1 — Review your priority scenarios: '+focus+'.',
'Days 2–3 — Practise two realistic situations matching the topics you missed.',
'Days 4–5 — Study a related topic using the '+(t.audience==='mid'?'Microsoft Learn or Salesforce Trailhead':t.audience==='agent'?'HubSpot Academy or Salesforce Trailhead':'NSDC eSkill India or IBM SkillsBuild')+' resources in our catalog.',
'Day 6 — Explain the skill to a peer or practise it in a role-play.',
'Day 7 — Retake all '+t.questions.length+' questions and review any recurring mistakes.'
];
steps.forEach(x=>plan.append(el('li',x)));detail.append(plan);
box.append(detail);
const actions=el('div',undefined,'ag2-actions');
const retry=el('button','Retake this track','btn dark');retry.type='button';retry.onclick=()=>start(t.id);
const all=el('button','Explore other assessments','ag2-back');all.type='button';all.onclick=shell;
const course=el('a','Study recommended resources ↗','ag2-back');course.href='#courses';course.addEventListener('click',()=>{const btn=document.querySelector('[data-filter="'+courseMap[t.audience]+'"]');if(btn)btn.click()});
const copy=el('button','Copy my learning plan','ag2-back');copy.type='button';copy.onclick=()=>{const content='AglaStep – '+t.title+' | '+correct+'/'+t.questions.length+' correct\\nReview: '+(missed.map(q=>q.prompt).join('; ')||'Try another track')+'\\n'+steps.join('\\n');if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(content).then(()=>copy.textContent='Copied ✓').catch(()=>copy.textContent='Copy unavailable')}else copy.textContent='Copy unavailable'};
actions.append(retry,all,course,copy);box.append(actions);
box.append(el('p','This report reflects a short set of educational questions, not general intelligence, an IQ score, aptitude certification or a prediction of job performance. Results are not transmitted.','ag2-note'));
root.append(box);const h=root.querySelector('h3');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}
}
fetch('assessments.json?v=6.0',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Could not load questions');return r.json()}).then(bank=>{if(!Array.isArray(bank.tracks)||!bank.tracks.length||bank.tracks.some(t=>!Array.isArray(t.questions)||t.questions.length<1))throw Error('Invalid question bank');state.bank=bank;shell()}).catch(()=>{root.replaceChildren(el('p','Assessment questions are temporarily unavailable. Please reload the page.'))});
})();