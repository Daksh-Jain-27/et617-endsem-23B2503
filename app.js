// ===== लिंग मित्र — app logic (23B2503) =====
const ROLL = '23B2503';
const KEY = 'lingmitra_23B2503';

const fresh = () => ({
  name:'', lang:'hi', screen:'home', queue:BASE_ORDER.slice(), pos:0,
  results:{}, reason:{}, inserted:{}, streak:0, log:[], dictOpens:0, startedAt:null
});
let S = load() || fresh();
let ui = {answered:false, sel:{}, fb:null}; // per-screen, not saved

function load(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch(e){ return null; } }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function log(ev, detail){ S.log.push({t:Date.now(), ev, q:S.queue[S.pos], ...detail}); save(); }
const T = k => STR[S.lang][k];
const L = o => (o && typeof o==='object') ? (o[S.lang]||o.hi) : o;
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ---------- adaptive decision rule ----------
// first-attempt result decides the next task:
//  wrong + misconception M1/M2  -> alternative explanation + similar extra item on that misconception
//  ≥2 wrong in noun sorting     -> prerequisite instruction (noun gender) + another sort
//  3 correct in a row           -> harder challenge item
function adapt(qid, ok, tag){
  const insert = (ids, why) => { S.queue.splice(S.pos+1, 0, ...ids); ids.forEach(id=>S.reason[id]=why); };
  if (ok){
    S.streak++;
    if (S.streak>=3 && !S.inserted.challenge){ S.inserted.challenge=true; insert(['c1'],'streak'); }
    return;
  }
  S.streak = 0;
  if (tag==='M1' && !S.inserted.M1){ S.inserted.M1=true; insert(['r_m1'],'M1'); }
  else if (tag==='M2' && !S.inserted.M2){ S.inserted.M2=true; insert(['r_m2'],'M2'); }
  else if (tag==='noun' && !S.inserted.noun){ S.inserted.noun=true; insert(['prereq','r_noun'],'noun'); }
}
function record(qid, ok, tag, detail){
  const first = !S.results[qid];
  if (first){ S.results[qid] = {ok, tag, lo:(QUESTIONS[qid]||{}).lo}; adapt(qid, ok, tag); }
  log('answer', {ok, tag, first, ...detail});
}

// ---------- rendering ----------
const app = () => document.getElementById('app');
function go(screen){ S.screen = screen; ui = {answered:false, sel:{}, fb:null}; save(); render(); window.scrollTo(0,0); }

function render(){
  document.documentElement.lang = S.lang;
  document.getElementById('langBtn').innerHTML = S.lang==='hi'
    ? '<span class="on">हिंदी</span> | <span class="off">English</span>'
    : '<span class="off">हिंदी</span> | <span class="on">English</span>';
  document.getElementById('dictBtn').textContent = T('dict');
  document.getElementById('aboutLink').textContent = T('about');
  const f = {home:renderHome, learn:renderLearn, q:renderQ, result:renderResult, about:renderAbout}[S.screen] || renderHome;
  app().innerHTML = f();
}

function renderHome(){
  const canResume = !!(S.startedAt && S.lastScreen);
  return `<section class="card center">
    <div class="logo">लिं</div>
    <h1>${T('appName')}</h1><p class="muted">${T('tagline')}</p>
    <label>${T('yourName')}<input id="nameIn" value="${esc(S.name)}" placeholder="सोनू" autocomplete="off"></label>
    ${canResume ? `<button class="btn primary" data-act="resume">${T('resume')}</button>
       <button class="btn" data-act="restart">${T('restart')}</button>`
     : `<button class="btn primary" data-act="start">${T('start')}</button>`}
  </section>`;
}
function renderLearn(){
  return `<section class="card"><h2>📘 ${T('learn')}</h2>${LESSON[S.lang]}
    <button class="btn primary" data-act="toQ">${T('next')} →</button></section>`;
}

function progressBar(){
  const n = S.queue.length, i = Math.min(S.pos+1, n);
  return `<div class="prog"><div style="width:${(S.pos/n)*100}%"></div></div><p class="muted small">${T('qOf')(i,n)}</p>`;
}
function reasonBanner(qid){
  const r = S.reason[qid]; if (!r) return '';
  const hi = S.lang==='hi';
  const msg = {
    M1: hi?'⭐ अतिरिक्त अभ्यास — पिछले सवाल में "आ" वाला रूप चुना था, तो एक और ऐसा सवाल।':'⭐ Extra practice — you chose the "-aa" form last time, so one more like it.',
    M2: hi?'⭐ अतिरिक्त अभ्यास — मेरा/मेरी पर एक और सवाल।':'⭐ Extra practice — one more on mera/meri.',
    noun: hi?'📘 पहले यह समझो — कुछ शब्दों का लिंग गलत चुना गया था।':'📘 First understand this — some word genders were chosen wrongly.',
    streak: hi?'🚀 तीन सही लगातार! अब एक कठिन चुनौती।':'🚀 Three correct in a row! Now a harder challenge.'
  }[r];
  return `<div class="banner ${r}">${msg}</div>`;
}

function renderQ(){
  const qid = S.queue[S.pos];
  if (!qid){ return renderResult(); }
  if (qid==='prereq') return `<section class="card">${progressBar()}${reasonBanner(qid)}<h2>${T('prereq')}</h2>${PREREQ[S.lang]}
     <button class="btn primary" data-act="next">${T('next')} →</button></section>`;
  const q = QUESTIONS[qid];
  let body = '';
  if (q.type==='mcq') body = `<p class="prompt">${q.prompt.replace('___','<span class="blank">___</span>')}</p>
     <div class="opts">${q.options.map(o=>`<button class="btn opt ${ui.sel.opt===o?'sel':''} ${ui.answered?(o===q.answer?'right':(ui.sel.opt===o?'wrong':'')):''}" data-act="opt" data-v="${o}" ${ui.answered?'disabled':''}>${o}</button>`).join('')}</div>`;
  if (q.type==='sort') body = `<p class="prompt">${L(q.prompt)}</p>
     ${q.words.map(w=>`<div class="sortrow"><span class="word">${w}</span>
       <button class="btn sm ${ui.sel[w]==='m'?'selm':''}" data-act="sort" data-w="${w}" data-v="m" ${ui.answered?'disabled':''}>${T('masc')}</button>
       <button class="btn sm ${ui.sel[w]==='f'?'self':''}" data-act="sort" data-w="${w}" data-v="f" ${ui.answered?'disabled':''}>${T('fem')}</button></div>`).join('')}`;
  if (q.type==='text' || q.type==='ai') body = `${q.type==='ai'?`<span class="pill">🤖 AI ${S.lang==='hi'?'जाँच':'check'}</span>`:''}<p class="prompt">${L(q.prompt)}</p>
     ${q.single ? `<input id="txt" class="txt" placeholder="${T('typeHere')}" value="${esc(ui.sel.txt||'')}" ${ui.answered?'disabled':''}>`
                : `<textarea id="txt" class="txt" rows="2" placeholder="${T('typeHere')}" ${ui.answered?'disabled':''}>${esc(ui.sel.txt||'')}</textarea>`}
     ${ui.answered?'':`<p class="muted small">${T('wordBank')}</p><div class="bank">${q.bank.map(b=>`<button class="chip" data-act="chip" data-v="${b}">${b}</button>`).join('')}
        <button class="chip ghost" data-act="clr">${T('clear')}</button></div>`}`;
  if (q.type==='judge') body = `<p class="prompt small">${T('judgeHint')}</p>
     ${q.items.map((it,i)=>`<div class="judge"><p class="sent">${it.s}</p><div class="opts row">
       ${['correct','variant','error'].map(v=>`<button class="btn sm ${ui.sel[i]===v?'sel':''}" data-act="judge" data-i="${i}" data-v="${v}" ${ui.answered?'disabled':''}>${T(v)}</button>`).join('')}
       </div></div>`).join('')}`;

  const tagLabel = q.kind==='challenge'?`<span class="pill">${T('challenge')}</span>`:q.kind==='extra'?`<span class="pill">${T('extra')}</span>`:'';
  return `<section class="card">${progressBar()}${reasonBanner(qid)}${tagLabel}${body}
    ${ui.loading ? `<div class="fb info">⏳ ${S.lang==='hi'?'जाँच हो रही है…':'Checking…'}</div>` : ''}
    ${ui.fb ? `<div class="fb ${ui.fb.cls}">${ui.fb.src?`<div class="src">${ui.fb.src}</div>`:''}${ui.fb.html}</div>` : ''}
    <div class="actions">
      ${!ui.answered ? `<button class="btn primary" data-act="check" ${ui.loading?'disabled':''}>${T('check')}</button>`
        : `${ui.fb && ui.fb.cls!=='ok' ? `<button class="btn" data-act="retry">${T('tryAgain')}</button>`:''}
           <button class="btn primary" data-act="next">${T('next')} →</button>`}
    </div></section>`;
}

// ---------- checking each format ----------
function checkCurrent(){
  const qid = S.queue[S.pos], q = QUESTIONS[qid], hi = S.lang==='hi';
  if (q.type==='mcq'){
    const v = ui.sel.opt; if (!v) return;
    const ok = v===q.answer, tag = ok?null:(q.wrongTag[v]||'other');
    let html;
    if (ok) html = (hi?`शाबाश! <b>${q.noun}</b> के हिसाब से <b>${q.answer}</b> सही है ✅`:`Well done! <b>${q.answer}</b> matches <b>${q.noun}</b> ✅`) + (q.note?`<br>${L(q.note)}`:'');
    else html = feedbackFor({label:'error', misconception:tag, noun:q.noun.split(' ')[0], wrong:v, right:q.answer}, S.lang) + (q.note?`<br>${L(q.note)}`:'');
    ui.fb = {cls: ok?'ok':'bad', html}; ui.answered = true;
    record(qid, ok, tag, {answer:v});
  }
  if (q.type==='sort'){
    if (q.words.some(w=>!ui.sel[w])) { ui.fb={cls:'info', html:T('pickAll')}; return render(); }
    const wrong = q.words.filter(w=>ui.sel[w]!==LEXICON[w]);
    const ok = wrong.length===0;
    const name = g => g==='f'?T('fem'):T('masc');
    const html = ok ? (hi?'शाबाश! सारे लिंग सही ✅':'Well done! All genders correct ✅')
      : (hi?'चीज़ों का भी लिंग होता है! इन्हें फिर देखो:<br>':'Things have gender too! Look again at:<br>') +
        wrong.map(w=>`<b>${w}</b> → ${name(LEXICON[w])}`).join(' · ');
    ui.fb = {cls: ok?'ok':'bad', html}; ui.answered = true;
    record(qid, ok, wrong.length>=2?'noun':(ok?null:'other'), {wrong});
  }
  if (q.type==='text'){
    const txt = (document.getElementById('txt').value||'').trim(); ui.sel.txt = txt;
    if (!txt) return;
    let r;
    if (q.single){
      r = checkSentence(q.frame.replace('{}', txt));
      const ok = normalize(txt)===q.model;
      if (!ok && r.label!=='error') r = {label:'other'};
      ui.fb = {cls: ok?'ok':'bad', html: ok ? feedbackFor({label:'correct'},S.lang)+(hi?` <b>चाय</b> स्त्रीलिंग है → <b>ठंडी</b>।`:` <b>चाय</b> is feminine → <b>ठंडी</b>.`)
        : (r.label==='error'?feedbackFor(r,S.lang):(hi?`ठंडा या ठंडी में से चुनो।`:`Choose ठंडा or ठंडी.`))};
      ui.answered = r.label!=='other' || ok;
      if (ui.answered) record(qid, ok, ok?null:r.misconception, {answer:txt});
    } else {
      r = checkSentence(txt);
      const complete = q.must.every(m=>normalize(txt).includes(m));
      const ok = r.label!=='error' && complete;
      let html;
      if (ok) html = feedbackFor(r,S.lang) + (hi?` <b>किताब</b> स्त्रीलिंग है, इसलिए <b>मेरी</b> किताब और <b>खो गई</b>।`:` <b>किताब</b> is feminine, so <b>मेरी</b> किताब and <b>खो गई</b>.`);
      else if (r.label==='error') html = feedbackFor(r,S.lang) + `<br><span class="muted">${hi?'सुझाया गया वाक्य':'Suggested'}: ${r.corrected}</span>`;
      else html = hi?`वाक्य अधूरा है — पूरा वाक्य लिखो, "किताब" के साथ।`:`Incomplete — write the full sentence with "किताब".`;
      ui.fb = {cls: ok?'ok':'bad', html}; ui.answered = true;
      record(qid, ok, ok?null:(r.misconception||'other'), {answer:txt, checker:r.label});
    }
  }
  if (q.type==='judge'){
    if (q.items.some((_,i)=>!ui.sel[i])) { ui.fb={cls:'info', html:T('pickAll')}; return render(); }
    let allOk = true, tag = null;
    const lines = q.items.map((it,i)=>{
      const ok = ui.sel[i]===it.a; if (!ok) allOk=false;
      let why;
      if (it.a==='variant') why = hi?'"हम" = "मैं" — क्षेत्रीय रूप है, गलती नहीं। लिंग में कोई गलती नहीं।':'"हम" for "I" is a regional form, not an error.';
      if (it.a==='error'){ why = hi?`माँ स्त्रीलिंग → <b>${it.fix}</b>`:`माँ is feminine → <b>${it.fix}</b>`; if(!ok) tag='M1'; }
      if (it.a==='correct') why = hi?'बहन/दीदी स्त्रीलिंग, क्रिया "गई" — सही।':'दीदी is feminine and verb is "गई" — correct.';
      return `${ok?'✅':'❌'} <b>${it.s}</b> → ${T(it.a)}<br><span class="small">${why}</span>`;
    });
    ui.fb = {cls: allOk?'ok':'bad', html: lines.join('<hr>')}; ui.answered = true;
    record(qid, allOk, allOk?null:(tag||'variant'), {sel:ui.sel});
  }
  render();
}

// ---------- AI-checked questions (Q6 sentence, Q7 explanation) ----------
async function callAI(mode, text){
  try {
    const ctrl = new AbortController(); const tm = setTimeout(()=>ctrl.abort(), 25000);
    const r = await fetch('/api/check', {method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({mode, text}), signal: ctrl.signal});
    clearTimeout(tm);
    if (!r.ok) return {fail:(await r.json().catch(()=>({}))).error || ('http_'+r.status)};
    return await r.json();
  } catch(e){ return {fail: e.name==='AbortError'?'timeout':'network'}; }
}
async function checkAI(){
  const qid = S.queue[S.pos], q = QUESTIONS[qid], hi = S.lang==='hi';
  const txt = (document.getElementById('txt').value||'').trim(); ui.sel.txt = txt;
  if (!txt) return;
  ui.loading = true; ui.fb = null; render();
  const ai = await callAI(q.mode, txt);
  const SRC_AI = '🤖 Sarvam AI', SRC_OFF = hi?'📏 ऑफ़लाइन जाँच (AI उपलब्ध नहीं — नियम से जाँचा)':'📏 Offline check (AI unavailable — rule-based)';
  let label, mis, html, src;
  if (q.mode==='sentence'){
    const rule = checkSentence(txt);
    const ruleErr = rule.label==='error';
    if (ai.fail){ ({label, misconception:mis} = rule); html = feedbackFor(rule,S.lang); src = SRC_OFF; }
    else if (rule.subject && (ai.label==='error') !== ruleErr){
      // AI and rule checker disagree on a sentence the rule checker can analyse -> trust the rule, say so
      ({label, misconception:mis} = rule); html = feedbackFor(rule,S.lang);
      src = hi?'⚖️ AI और नियम में मतभेद — नियम वाला जवाब दिखाया':'⚖️ AI and rules disagreed — showing the rule-based answer';
    } else {
      label = ai.label; mis = ai.misconception; src = SRC_AI;
      html = hi ? ai.feedback_hi : (ai.feedback_en || ai.feedback_hi);
    }
    if (label==='error'){ const fix = (!ai.fail && src===SRC_AI && ai.corrected) ? ai.corrected : rule.corrected;
      html += `<br><span class="muted">${hi?'सुझाया गया वाक्य':'Suggested'}: ${esc(fix)}</span>`; }
  } else {
    if (ai.fail){ const r = checkExplain(txt); label=r.label; mis=r.misconception; html=explainFeedback(r,S.lang); src=SRC_OFF; }
    else { label=ai.label; mis=ai.misconception; html = hi?ai.feedback_hi:(ai.feedback_en||ai.feedback_hi); src=SRC_AI; }
  }
  const ok = label==='correct' || label==='variant';
  ui.loading = false; ui.answered = true;
  ui.fb = {cls: ok?'ok':'bad', html: `<b>${label==='partial' ? (hi?'🟠 आधा सही':'🟠 Partly right') : T(label)}</b><br>${html}`, src};
  record(qid, ok, ok?null:(mis||'other'), {answer:txt, ai: ai.fail?('fallback:'+ai.fail):ai.label, shown:label});
  render();
}

// ---------- results ----------
function renderResult(){
  const los = {1:[0,0],2:[0,0],3:[0,0]};
  const mis = {};
  Object.values(S.results).forEach(r=>{ if(!r.lo) return; los[r.lo][1]++; if(r.ok) los[r.lo][0]++; if(r.tag==='M1'||r.tag==='M2') mis[r.tag]=1; });
  const mins = S.startedAt ? Math.max(1, Math.round((Date.now()-S.startedAt)/60000)) : 0;
  const bar = ([a,b]) => `<div class="lo"><div style="width:${b?a/b*100:0}%"></div></div><span class="small">${a}/${b}</span>`;
  return `<section class="card"><h2>🏁 ${T('result')}${S.name?', '+esc(S.name):''}</h2>
    <p><b>LO1</b> ${T('lo1')}</p>${bar(los[1])}
    <p><b>LO2</b> ${T('lo2')}</p>${bar(los[2])}
    <p><b>LO3</b> ${T('lo3')}</p>${bar(los[3])}
    <h3>${T('misSeen')}</h3><p>${Object.keys(mis).length?Object.keys(mis).map(m=>`• ${T(m)}`).join('<br>'):T('none')}</p>
    <p class="muted small">${T('timeSpent')}: ${mins} min · ${T('dictOpens')}: ${S.dictOpens}</p>
    <button class="btn" data-act="restart">${T('restart')}</button></section>`;
}
function renderAbout(){
  return `<section class="card"><h2>${T('about')}</h2>
    <p><b>लिंग मित्र</b> — ET617 End-Semester · Roll No. <b>${ROLL}</b></p>
    <table class="rule"><tr><td>P</td><td>P2 – Contextual language & literacy</td></tr>
    <tr><td>T</td><td>P2-T2 – Hindi gender agreement (लिंग) in verbs & adjectives</td></tr>
    <tr><td>L</td><td>L8 – Home language (Bhojpuri) ≠ school medium (Hindi)</td></tr>
    <tr><td>C</td><td>C2 – Learner's own language (Hindi UI, English toggle)</td></tr></table>
    <p class="small">Rule-based checker + AI feedback (with labelled offline fallback). Built with plain HTML/CSS/JS on Vercel; AI assistance disclosed in the report.</p>
    <button class="btn" data-act="back">← ${T('home')}</button></section>`;
}

// ---------- dictionary tool ----------
function openDict(){
  S.dictOpens++; log('dict_open',{});
  document.getElementById('dict').hidden = false;
  dictLabels();
}
function dictLabels(){
  document.getElementById('dictTitle').textContent = T('dict');
  document.getElementById('dictSearch').placeholder = T('search');
  document.getElementById('dictClose').textContent = T('close');
  fillDict(document.getElementById('dictSearch').value.trim());
}
function fillDict(f){
  const items = Object.keys(LEXICON).filter(w=>w.includes(f)).sort((a,b)=>a.localeCompare(b,'hi'));
  document.getElementById('dictList').innerHTML = items.map(w=>`<li><span>${w}</span><span class="${LEXICON[w]}">${LEXICON[w]==='f'?T('fem'):T('masc')}</span></li>`).join('');
}

// ---------- events ----------
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a==='start'){ S = Object.assign(fresh(), {lang:S.lang, name:(document.getElementById('nameIn').value||'').trim(), startedAt:Date.now()}); log('start',{}); go('learn'); }
  if (a==='resume'){ const n=document.getElementById('nameIn'); if(n) S.name=n.value.trim(); log('resume',{}); go(S.lastScreen||'q'); }
  if (a==='restart'){ const lang=S.lang; S = Object.assign(fresh(),{lang}); save(); go('home'); }
  if (a==='toQ'){ go('q'); }
  if (a==='opt'){ ui.sel.opt = b.dataset.v; render(); }
  if (a==='sort'){ ui.sel[b.dataset.w] = b.dataset.v; render(); }
  if (a==='judge'){ ui.sel[b.dataset.i] = b.dataset.v; render(); }
  if (a==='chip'){ const t=document.getElementById('txt'); const q=QUESTIONS[S.queue[S.pos]]; t.value = q.single ? b.dataset.v : (t.value+' '+b.dataset.v).replace(/\s+।/,'।').trim(); ui.sel.txt=t.value; }
  if (a==='clr'){ document.getElementById('txt').value=''; ui.sel.txt=''; }
  if (a==='check'){ QUESTIONS[S.queue[S.pos]] && QUESTIONS[S.queue[S.pos]].type==='ai' ? checkAI() : checkCurrent(); }
  if (a==='retry'){ log('retry',{}); ui = {answered:false, sel:{}, fb:null}; render(); }
  if (a==='next'){ S.pos++; if (S.pos>=S.queue.length){ go('result'); } else go('q'); }
  if (a==='back'){ go(S.lastScreen && S.lastScreen!=='about' ? S.lastScreen : 'home'); }
});
document.getElementById('langBtn').onclick = ()=>{ S.lang = S.lang==='hi'?'en':'hi'; save(); render(); dictLabels(); };
document.getElementById('dictBtn').onclick = openDict;
document.getElementById('dictClose').onclick = ()=>{ document.getElementById('dict').hidden = true; };
document.getElementById('dictSearch').oninput = e=> fillDict(e.target.value.trim());
document.getElementById('aboutLink').onclick = e=>{ e.preventDefault(); if (S.screen!=='about') S.lastScreen = S.screen; go('about'); };

// remember where the learner was, so "resume" returns there (stop & resume)
const _go = go;
go = function(screen){ if (screen!=='home' && screen!=='about') S.lastScreen = screen; _go(screen); };

// on load: always land on home; if progress exists, home offers "resume"
if (S.screen!=='home' && S.screen!=='about') S.lastScreen = S.screen;
S.screen = 'home';
render();
