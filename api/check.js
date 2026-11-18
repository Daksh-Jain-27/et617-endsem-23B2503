// Vercel serverless function: AI feedback via Sarvam AI (23B2503)
// Key is read from the Vercel environment variable SARVAM_API_KEY — never committed.

const SYSTEM = `You are a kind Hindi teacher for an 11-year-old Class 6 child (Sonu) who speaks Bhojpuri at home and studies in a Hindi-medium school.
Topic: grammatical gender agreement (लिंग) of verbs, adjectives and possessives (मेरा/मेरी) with the NOUN in standard Hindi.
Rules you must follow:
- Only agreement between a noun and its verb/adjective/possessive counts as an ERROR.
- Using "हम" for "मैं", spelling pairs गये/गए, नयी/नई, लिये/लिए, and other regional forms are ACCEPTABLE VARIANTS, never errors.
- Misconception M1 = learner uses the masculine "-आ" form for a feminine noun (e.g. "माँ बाज़ार गया").
- Misconception M2 = learner makes मेरा/मेरी follow the speaker/owner instead of the thing owned (e.g. a boy writes "मेरा किताब").
- Feedback must be in very simple Hindi (max 2 short sentences, Class 6 level), warm, never shaming home speech. Also give an English version.
Reply with ONLY a JSON object, no other text.`;

const TASKS = {
  sentence: t => `Learner's sentence (about what their mother/sister did): "${t}"
Return JSON: {"label":"correct"|"variant"|"error","misconception":"M1"|"M2"|"other"|"none","corrected":"<corrected sentence in Hindi>","feedback_hi":"...","feedback_en":"..."}`,
  explain: t => `Question asked: In "मेरी बहन स्कूल गई", why is "गई" correct and not "गया"?
Model answer: "बहन स्त्रीलिंग है, और क्रिया संज्ञा (बहन) के हिसाब से बदलती है, बोलने वाले के हिसाब से नहीं।"
Learner's explanation: "${t}"
Judge if the explanation names the noun's gender (बहन is feminine) as the reason.
Return JSON: {"label":"correct"|"partial"|"error","misconception":"M1"|"M2"|"other"|"none","feedback_hi":"...","feedback_en":"..."}`
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  const key = process.env.SARVAM_API_KEY;
  if (!key) return res.status(503).json({error:'no_key'});
  const {mode, text} = req.body || {};
  if (!TASKS[mode] || typeof text !== 'string' || !text.trim() || text.length > 300)
    return res.status(400).json({error:'bad_input'});

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method:'POST', signal: ctrl.signal,
      headers:{'Content-Type':'application/json','api-subscription-key':key},
      body: JSON.stringify({
        model:'sarvam-105b', temperature:0.1, max_tokens:1500,
        messages:[{role:'system',content:SYSTEM},{role:'user',content:TASKS[mode](text.trim())}]
      })
    });
    if (!r.ok) return res.status(502).json({error:'ai_http_'+r.status});
    const data = await r.json();
    let out = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    out = out.replace(/<think>[\s\S]*?<\/think>/g,'');          // drop reasoning, if any
    const m = out.match(/\{[\s\S]*\}/);                          // extract the JSON object
    if (!m) return res.status(502).json({error:'ai_no_json'});
    const j = JSON.parse(m[0]);
    // validate shape before it reaches the learner
    const okLabels = mode==='sentence' ? ['correct','variant','error'] : ['correct','partial','error'];
    if (!okLabels.includes(j.label) || typeof j.feedback_hi !== 'string')
      return res.status(502).json({error:'ai_bad_shape'});
    return res.status(200).json({
      label:j.label,
      misconception:['M1','M2','other'].includes(j.misconception) ? j.misconception : null,
      corrected: typeof j.corrected==='string' ? j.corrected.slice(0,200) : null,
      feedback_hi:j.feedback_hi.slice(0,400),
      feedback_en: typeof j.feedback_en==='string' ? j.feedback_en.slice(0,400) : ''
    });
  } catch (e) {
    return res.status(502).json({error: e.name==='AbortError' ? 'ai_timeout' : 'ai_error'});
  } finally { clearTimeout(timer); }
};
