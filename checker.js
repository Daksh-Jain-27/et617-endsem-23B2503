// ===== Rule-based Hindi gender-agreement checker (23B2503) =====
// Used (1) as the offline fallback when the AI call fails and
// (2) to cross-check the AI's label before the learner sees it.

const PAIRS = { // masculine -> feminine
  'गया':'गई','आया':'आई','था':'थी','रहा':'रही','सका':'सकी','लगा':'लगी','हुआ':'हुई','चला':'चली',
  'खेला':'खेली','टूटा':'टूटी','मेरा':'मेरी','तेरा':'तेरी','उसका':'उसकी','हमारा':'हमारी','अपना':'अपनी',
  'उनका':'उनकी','आपका':'आपकी','अच्छा':'अच्छी','बड़ा':'बड़ी','छोटा':'छोटी','नया':'नई','ठंडा':'ठंडी',
  'मीठा':'मीठी','पुराना':'पुरानी','गंदा':'गंदी','का':'की'
};
const REV = Object.fromEntries(Object.entries(PAIRS).map(([m,f])=>[f,m]));
const POSS = new Set(['मेरा','मेरी','तेरा','तेरी','उसका','उसकी','हमारा','हमारी','अपना','अपनी','उनका','उनकी','आपका','आपकी']);

function normalize(s){
  return s.replace(/[।.,!?"'“”‘’]/g,' ')
    .replace(/गये/g,'गए').replace(/आये/g,'आए').replace(/नयी/g,'नई').replace(/लिये/g,'लिए').replace(/गयी/g,'गई')
    .replace(/\s+/g,' ').trim();
}
// gender of a word-form: 'm' | 'f' | null
const BOUNDARY = new Set(['बोला','बोली','बोले','कहा','लिखा','लेकिन']);
const NOT_VERB =new Set(['पता','माता','पिता','कविता','ममता','गीता','नेता','देवता','जनता','रास्ता','नाश्ता','बस्ता','तोता','सस्ता','वास्ता']);
function formGender(w){
  if (!w || LEXICON[w] || NOT_VERB.has(w)) return null;
  if (PAIRS[w]) return 'm';
  if (REV[w]) return 'f';
  // habitual verb: खाता/खाती, जाता/जाती
  if (w.length>=3 && w.endsWith('ता')) return 'm';
  if (w.length>=3 && w.endsWith('ती') && !LEXICON[w]) return 'f';
  return null;
}
function toGender(w, g){
  if (g==='f') return PAIRS[w] || (w.endsWith('ता') ? w.slice(0,-1)+'ी' : w);
  return REV[w] || (w.endsWith('ती') ? w.slice(0,-1)+'ा' : w);
}

/** Returns {label:'correct'|'variant'|'error', misconception:'M1'|'M2'|'other'|null,
 *           corrected, noun, wrong, right, notes:[] } */
function checkSentence(text){
  const norm = normalize(text);
  const toks = norm.split(' ').filter(Boolean);
  const out = {label:'correct', misconception:null, corrected:norm, noun:null, wrong:null, right:null, notes:[]};
  const fixed = toks.slice();
  let subject = null, subjIdx = -1;

  for (let i=0;i<toks.length;i++){
    const w = toks[i];
    // 1) possessive / adjective directly before a noun must match that noun  -> M2 if wrong
    if (LEXICON[toks[i+1]] && formGender(w) && out.label!=='error'){
      const g = LEXICON[toks[i+1]], fg = formGender(w);
      if (fg !== g){
        out.label='error'; out.misconception = POSS.has(w) ? 'M2' : (g==='f' ? 'M1':'other');
        out.noun = toks[i+1]; out.wrong = w; out.right = toGender(w,g); fixed[i]=out.right;
      }
    }
    if (BOUNDARY.has(w)){ subject = null; subjIdx = -1; continue; } // new clause (e.g. quoted speech)
    if (!subject && LEXICON[w]){ subject = w; subjIdx = i; }
  }
  // 2) verbs / predicate adjectives after the subject must match the subject -> M1 if masc used for fem
  if (subject){
    const g = LEXICON[subject];
    for (let i=subjIdx+1;i<toks.length;i++){
      const w = toks[i];
      if (LEXICON[w] || POSS.has(w) || w==='का' || w==='की') continue;
      if (LEXICON[toks[i+1]]) continue; // attributive, handled above
      const fg = formGender(w);
      if (fg && fg!==g){
        fixed[i] = toGender(w,g);
        if (out.label!=='error'){
          out.label='error'; out.misconception = g==='f' ? 'M1' : 'other';
          out.noun=subject; out.wrong=w; out.right=fixed[i];
        }
      }
    }
  }
  // 3) acceptable regional variation: हम used for मैं
  if (toks[0]==='हम'){
    out.notes.push('hum');
    if (out.label==='correct') out.label='variant';
  }
  if (/गये|नयी|लिये|गयी/.test(text)) out.notes.push('spelling');
  out.subject = subject;
  out.corrected = fixed.join(' ') + '।';
  return out;
}

// Feedback text from a check result (Hindi / English)
function feedbackFor(r, lang){
  const hi = lang!=='en';
  const g = r.noun && LEXICON[r.noun]==='f' ? (hi?'स्त्रीलिंग':'feminine') : (hi?'पुल्लिंग':'masculine');
  if (r.label==='error' && r.misconception==='M1') return hi
    ? `ध्यान दो — क्रिया/विशेषण हमेशा "आ" पर खत्म नहीं होते। यहाँ बात <b>${r.noun}</b> की है। ${r.noun} ${g} है, तो <b>${r.wrong}</b> नहीं, <b>${r.right}</b>।`
    : `Careful — verbs/adjectives don't always end in "-aa". This is about <b>${r.noun}</b>, which is ${g}, so <b>${r.right}</b>, not <b>${r.wrong}</b>.`;
  if (r.label==='error' && r.misconception==='M2') return hi
    ? `"${r.wrong}" इस पर निर्भर नहीं कि बोलने वाला लड़का है या लड़की। देखो <b>किस चीज़</b> की बात है — <b>${r.noun}</b> ${g} है, इसलिए <b>${r.right} ${r.noun}</b>।`
    : `"${r.wrong}" doesn't depend on whether the speaker is a boy or a girl. Look at <b>what thing</b> it is — <b>${r.noun}</b> is ${g}, so <b>${r.right} ${r.noun}</b>.`;
  if (r.label==='error') return hi
    ? `<b>${r.noun}</b> ${g} है, इसलिए <b>${r.right}</b> आएगा, <b>${r.wrong}</b> नहीं।`
    : `<b>${r.noun}</b> is ${g}, so use <b>${r.right}</b>, not <b>${r.wrong}</b>.`;
  if (r.label==='variant') return hi
    ? `यह गलती नहीं है 🙂 "मैं" की जगह "हम" बोलना हमारे इलाके में आम है। लिंग सही है। परीक्षा में "मैं" लिखना ज़्यादा सुरक्षित है।`
    : `This is not an error 🙂 Using "हम" for "I" is common in our region. Gender is correct. In exams, "मैं" is safer.`;
  return hi ? `शाबाश! लिंग का मेल सही है ✅` : `Well done! The agreement is correct ✅`;
}

// Offline fallback for the explanation question (Q7): keyword rubric
function checkExplain(text){
  const t = normalize(text);
  const fem = /स्त्रीलिंग|स्त्री लिंग|लड़की|feminine|female/i.test(t);
  if (fem && !/पुल्लिंग है/.test(t)) return {label:'correct', misconception:null};
  if (/बोल|लिख रह|speaker/i.test(t)) return {label:'error', misconception:'M2'};
  if (/गया सही|पुल्लिंग/.test(t)) return {label:'error', misconception:'M1'};
  return {label:'partial', misconception:null};
}
function explainFeedback(r, lang){
  const hi = lang!=='en';
  if (r.label==='correct') return hi ? 'बिल्कुल सही! बहन स्त्रीलिंग है, इसलिए क्रिया "गई" होती है ✅' : 'Exactly! बहन is feminine, so the verb is "गई" ✅';
  if (r.misconception==='M2') return hi ? 'क्रिया बोलने वाले से नहीं बदलती। देखो <b>कौन गया</b> — बहन। बहन स्त्रीलिंग है, इसलिए "गई"।' : 'The verb does not follow the speaker. Look at <b>who went</b> — बहन, which is feminine, so "गई".';
  if (r.misconception==='M1') return hi ? '"गया" पुल्लिंग के लिए है। बहन स्त्रीलिंग है, इसलिए "गई"।' : '"गया" is for masculine. बहन is feminine, so "गई".';
  return hi ? 'अच्छी कोशिश! अब यह भी लिखो: <b>बहन किस लिंग की है?</b>' : 'Good try! Now also say: <b>what gender is बहन?</b>';
}
