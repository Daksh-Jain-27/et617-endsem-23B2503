// ===== Content for लिंग मित्र (23B2503) =====
// All learner-facing text in Hindi (C2); English is an optional toggle.

// Noun-gender dictionary (used by the लिंग शब्दकोश tool and by the rule-based checker)
const LEXICON = {
  // f = स्त्रीलिंग, m = पुल्लिंग
  'किताब':'f','बस':'f','चाय':'f','गाड़ी':'f','साइकिल':'f','कलम':'f','कुर्सी':'f','मेज़':'f',
  'रोटी':'f','दाल':'f','सब्ज़ी':'f','खिड़की':'f','टोपी':'f','कमीज़':'f','नदी':'f','घड़ी':'f',
  'बात':'f','रात':'f','गुड़िया':'f','चिट्ठी':'f','दवाई':'f','फ़्रॉक':'f','चप्पल':'f',
  'माँ':'f','बहन':'f','दीदी':'f','लड़की':'f','दादी':'f','नानी':'f','चाची':'f','मौसी':'f',
  'सीता':'f','प्रिया':'f','गाय':'f','बिल्ली':'f','चिड़िया':'f','टीचर':'f',
  'पानी':'m','दूध':'m','पेड़':'m','पेन':'m','घर':'m','स्कूल':'m','बाज़ार':'m','खाना':'m',
  'चावल':'m','आम':'m','दरवाज़ा':'m','फ़ोन':'m','मोबाइल':'m','बैग':'m','जूता':'m','पहाड़':'m',
  'दिन':'m','मेला':'m','खेत':'m','मंदिर':'m',
  'भाई':'m','पापा':'m','लड़का':'m','दादा':'m','नाना':'m','चाचा':'m','राहुल':'m','सोनू':'m',
  'कुत्ता':'m','बच्चा':'m'
};

// UI strings (hi default, en optional)
const STR = {
  hi: {
    appName:'लिंग मित्र', tagline:'घर की बोली से स्कूल की हिंदी तक — लिंग का मेल सीखो',
    yourName:'तुम्हारा नाम', start:'शुरू करो', resume:'जहाँ छोड़ा था, वहीं से आगे', restart:'नए सिरे से शुरू',
    learn:'सीखो', next:'आगे', check:'जाँचो', tryAgain:'फिर से कोशिश', dict:'📖 लिंग शब्दकोश',
    close:'बंद करो', search:'शब्द खोजो…', masc:'पुल्लिंग', fem:'स्त्रीलिंग',
    correct:'✅ सही', variant:'🟡 क्षेत्रीय रूप – ठीक है', error:'❌ लिंग की गलती',
    qOf:(a,b)=>`सवाल ${a} / ${b}`, extra:'⭐ अतिरिक्त अभ्यास', challenge:'🚀 कठिन चुनौती', prereq:'📘 पहले यह समझो',
    result:'तुम्हारा नतीजा', about:'जानकारी', home:'घर',
    wordBank:'शब्द टैप करके जोड़ो:', clear:'मिटाओ', typeHere:'यहाँ लिखो…',
    lo1:'संज्ञा का लिंग पहचानना', lo2:'क्रिया/विशेषण का सही रूप', lo3:'गलती और क्षेत्रीय रूप में फ़र्क',
    misSeen:'जो गलतफ़हमियाँ दिखीं', none:'कोई नहीं 🎉', timeSpent:'समय', dictOpens:'शब्दकोश खोला',
    M1:'हर क्रिया/विशेषण "आ" वाला', M2:'मेरा/मेरी बोलने वाले पर निर्भर',
    pickAll:'हर शब्द के लिए चुनो', judgeHint:'हर वाक्य के लिए चुनो: सही, क्षेत्रीय रूप, या गलती',
  },
  en: {
    appName:'Ling Mitra', tagline:'From home speech to school Hindi — learn gender agreement',
    yourName:'Your name', start:'Start', resume:'Resume where you left off', restart:'Start over',
    learn:'Learn', next:'Next', check:'Check', tryAgain:'Try again', dict:'📖 Gender dictionary',
    close:'Close', search:'Search a word…', masc:'Masculine', fem:'Feminine',
    correct:'✅ Correct', variant:'🟡 Regional form – OK', error:'❌ Agreement error',
    qOf:(a,b)=>`Question ${a} / ${b}`, extra:'⭐ Extra practice', challenge:'🚀 Challenge', prereq:'📘 First, understand this',
    result:'Your result', about:'About', home:'Home',
    wordBank:'Tap words to add:', clear:'Clear', typeHere:'Type here…',
    lo1:'Identify noun gender', lo2:'Correct verb/adjective form', lo3:'Error vs regional form',
    misSeen:'Misconceptions seen', none:'None 🎉', timeSpent:'Time', dictOpens:'Dictionary opened',
    M1:'Every verb/adjective takes "-aa"', M2:'mera/meri depends on the speaker',
    pickAll:'Choose for every word', judgeHint:'For each sentence choose: correct, regional form, or error',
  }
};

// Concept explanation
const LESSON = {
  hi: `
  <p>नमस्ते! 👋 चलो, आज हम हिंदी की एक <mark>राज़ की बात</mark> जानते हैं। सिर्फ़ तीन कदम हैं।</p>
  <p><b>पहला कदम:</b> हिंदी में हर संज्ञा या तो <b class="m">पुल्लिंग</b> है या <b class="f">स्त्रीलिंग</b> — <mark>चीज़ें भी!</mark></p>
  <div class="box"><b class="f">स्त्रीलिंग:</b> किताब, बस, चाय, बहन<br><b class="m">पुल्लिंग:</b> पानी, दूध, पेड़, भाई</div>
  <p><b>दूसरा कदम:</b> वाक्य में देखो — <b>किसकी बात हो रही है?</b> उस संज्ञा को ढूँढो।</p>
  <p><b>तीसरा कदम:</b> अब क्रिया और विशेषण को <mark>उसी संज्ञा के हिसाब से</mark> बदलो — बोलने वाले के हिसाब से नहीं।</p>
  <table class="rule"><tr><th></th><th>क्रिया</th><th>विशेषण</th><th>मेरा/मेरी</th></tr>
  <tr><td class="m">पुल्लिंग → आ</td><td>गया</td><td>अच्छा</td><td>मेरा</td></tr>
  <tr><td class="f">स्त्रीलिंग → ई</td><td>गई</td><td>अच्छी</td><td>मेरी</td></tr>
  <tr><td class="m">पुल्लिंग बहुवचन → ए</td><td>गए</td><td>अच्छे</td><td>मेरे</td></tr></table>
  <div class="box"><b>चलो साथ में करके देखें:</b> "मेरी बहन स्कूल ___।" किसकी बात है? <b>बहन</b> की। बहन स्त्रीलिंग है, तो <span class="f">गई</span>! ✅<br>
  और <span class="m">मेरा भाई</span> स्कूल <span class="m">गया</span>।<br>
  सोनू तो लड़का है, फिर भी वह कहेगा: <span class="f">मेरी किताब</span> — क्योंकि बात <b>किताब</b> की है, और किताब स्त्रीलिंग है।</div>
  <div class="box soft"><b>घर की बोली और स्कूल की हिंदी:</b> घर पर हम जैसे बोलते हैं, वह भी सही है। जैसे "हम जा रहे हैं" (मैं के लिए "हम") — यह गलती नहीं, क्षेत्रीय रूप है। पर स्कूल की हिंदी में लिंग का नियम पक्का है।</div>
  <p>💡 शक हो तो <b>📖 लिंग शब्दकोश</b> खोलो।</p>`,
  en: `
  <p>Hello! 👋 Let's learn a <mark>secret of Hindi</mark> together. Just three steps.</p>
  <p><b>Step 1:</b> In Hindi every noun is either <b class="m">masculine</b> or <b class="f">feminine</b> — <mark>even things!</mark></p>
  <div class="box"><b class="f">Feminine:</b> kitaab (book), bus, chai, behan (sister)<br><b class="m">Masculine:</b> paani (water), doodh (milk), ped (tree), bhai</div>
  <p><b>Step 2:</b> Ask — <b>who or what is the sentence about?</b> Find that noun.</p>
  <p><b>Step 3:</b> Change the verb and adjective <mark>to match that noun</mark>, not the speaker.</p>
  <table class="rule"><tr><th></th><th>verb</th><th>adjective</th><th>my</th></tr>
  <tr><td class="m">masc → -aa</td><td>गया</td><td>अच्छा</td><td>मेरा</td></tr>
  <tr><td class="f">fem → -ii</td><td>गई</td><td>अच्छी</td><td>मेरी</td></tr>
  <tr><td class="m">masc plural → -e</td><td>गए</td><td>अच्छे</td><td>मेरे</td></tr></table>
  <div class="box"><b>Example:</b> <span class="f">मेरी बहन</span> स्कूल <span class="f">गई</span>। · <span class="m">मेरा भाई</span> स्कूल <span class="m">गया</span>।<br>
  Sonu (a boy) also says <span class="f">मेरी किताब</span> — because <b>किताब</b> is feminine.</div>
  <div class="box soft"><b>Home speech and school Hindi:</b> how we speak at home is also fine. "हम जा रहे हैं" (हम for "I") is a regional form, not an error. But in school Hindi the gender rule is fixed.</div>
  <p>💡 If unsure, open the <b>📖 Gender dictionary</b>.</p>`
};

// Prerequisite mini-lesson (inserted when noun-gender sorting goes wrong)
const PREREQ = {
  hi:`<p>पहले संज्ञा का लिंग पहचानना ज़रूरी है। चीज़ों का भी लिंग होता है — इसे याद करना पड़ता है।</p>
  <div class="box">एक तरकीब: शब्द के साथ <b>"मेरा / मेरी"</b> बोलकर देखो जो तुमने स्कूल की किताबों में पढ़ा है:<br>
  <span class="f">मेरी किताब, मेरी बस, मेरी चाय</span> · <span class="m">मेरा पानी, मेरा घर, मेरा पेड़</span></div>
  <p>ज़्यादातर <b>ई</b> पर खत्म होने वाले शब्द स्त्रीलिंग होते हैं (गाड़ी, कुर्सी, रोटी) — पर <b>पानी</b>, <b>भाई</b> अपवाद हैं! इसलिए शब्दकोश देखो।</p>`,
  en:`<p>First you need to know the noun's gender. Things have gender too — it has to be learnt.</p>
  <div class="box">A trick: say the word with <b>"मेरा / मेरी"</b> as you've read it in school books:<br>
  <span class="f">मेरी किताब, मेरी बस, मेरी चाय</span> · <span class="m">मेरा पानी, मेरा घर, मेरा पेड़</span></div>
  <p>Most words ending in <b>-ii (ई)</b> are feminine (गाड़ी, कुर्सी, रोटी) — but <b>पानी</b>, <b>भाई</b> are exceptions! So check the dictionary.</p>`
};

// Strategy hint card (inserted on INTERACTION signals: many retries or many dictionary look-ups)
const HINT = {
  hi:`<p>लगता है यह थोड़ा मुश्किल लग रहा है — कोई बात नहीं, चलो एक आसान तरकीब अपनाते हैं। 🙂</p>
  <div class="box"><b>हर बार ये 3 सवाल खुद से पूछो:</b><br>
  <b>1.</b> वाक्य <b>किसके बारे में</b> है? (बहन? किताब? फ़ोन?)<br>
  <b>2.</b> वह शब्द <b class="m">पुल्लिंग</b> है या <b class="f">स्त्रीलिंग</b>? (शक हो तो 📖 शब्दकोश)<br>
  <b>3.</b> स्त्रीलिंग → <span class="f">ई</span> (गई, मेरी) · पुल्लिंग → <span class="m">आ</span> (गया, मेरा)</div>
  <p>बोलने वाला लड़का है या लड़की — इससे <b>फ़र्क नहीं</b> पड़ता!</p>`,
  en:`<p>Looks like this is a bit tricky — no problem, let's use an easy trick. 🙂</p>
  <div class="box"><b>Ask yourself these 3 questions every time:</b><br>
  <b>1.</b> <b>Who/what</b> is the sentence about? (बहन? किताब? फ़ोन?)<br>
  <b>2.</b> Is that word <b class="m">masculine</b> or <b class="f">feminine</b>? (unsure → 📖 dictionary)<br>
  <b>3.</b> Feminine → <span class="f">ई</span> (गई, मेरी) · Masculine → <span class="m">आ</span> (गया, मेरा)</div>
  <p>Whether the speaker is a boy or a girl <b>doesn't matter</b>!</p>`
};

// Question bank. tag on wrong options = misconception shown by choosing it.
const QUESTIONS = {
  q1:{type:'mcq', lo:2, prompt:'मेरी बहन कल स्कूल ___ ।', options:['गया','गई','गए'], answer:'गई', wrongTag:{'गया':'M1','गए':'M1'}, noun:'बहन'},
  q2:{type:'sort', lo:1, prompt:{hi:'हर शब्द का लिंग चुनो:',en:'Choose the gender of each word:'}, words:['किताब','पानी','बस','दूध','चाय','पेड़']},
  q3:{type:'text', lo:2, prompt:{hi:'राहुल ने लिखा: "मेरा किताब खो गया।" — सही वाक्य लिखो।',en:'Rahul wrote: "मेरा किताब खो गया।" — write the correct sentence.'},
      model:'मेरी किताब खो गई।', must:['मेरी','किताब','गई'], bank:['मेरा','मेरी','किताब','खो','गया','गई','।']},
  q4:{type:'text', lo:2, prompt:{hi:'खाली जगह भरो: "आज चाय बहुत ___ है।" (ठंडा / ठंडी)',en:'Fill the blank: "आज चाय बहुत ___ है।" (ठंडा / ठंडी)'},
      model:'ठंडी', single:true, frame:'आज चाय बहुत {} है', bank:['ठंडा','ठंडी']},
  q5:{type:'judge', lo:3, items:[
      {s:'हम कल मेला जाएँगे।', a:'variant'},
      {s:'माँ बाज़ार गया।', a:'error', fix:'माँ बाज़ार गई।'},
      {s:'मेरी दीदी स्कूल गई।', a:'correct'} ]},
  // Remedial items (inserted after a misconception)
  r_m1:{type:'mcq', lo:2, kind:'extra', prompt:'दादी रोज़ सुबह मंदिर ___ है।', options:['जाता','जाती','जाते'], answer:'जाती', wrongTag:{'जाता':'M1','जाते':'M1'}, noun:'दादी'},
  r_m2:{type:'mcq', lo:2, kind:'extra', prompt:'प्रिया बोली: "___ फ़ोन टूट गया।"', options:['मेरा','मेरी'], answer:'मेरा', wrongTag:{'मेरी':'M2'}, noun:'फ़ोन'},
  r_noun:{type:'sort', lo:1, kind:'extra', prompt:{hi:'फिर से — हर शब्द का लिंग चुनो:',en:'Again — choose each word\'s gender:'}, words:['गाड़ी','घर','कुर्सी','आम','घड़ी','जूता']},
  // Challenge (inserted after 3 correct in a row)
  c1:{type:'mcq', lo:2, kind:'challenge', prompt:'मेरा भाई और मेरी बहन मेला ___ ।', options:['गया','गई','गए'], answer:'गए', wrongTag:{}, noun:'भाई और बहन',
      note:{hi:'दो लोग (लड़का + लड़की) हों तो क्रिया पुल्लिंग बहुवचन होती है: <b>गए</b>।',en:'For a mixed group (boy + girl) the verb is masculine plural: <b>गए</b>.'}}
};

// AI-checked open questions (Sarvam AI, with rule-based fallback)
QUESTIONS.q6 = {type:'ai', mode:'sentence', lo:2,
  prompt:{hi:'कल तुम्हारी माँ या दीदी ने क्या किया? एक वाक्य लिखो। (जैसे: "मेरी दीदी … गई")',
          en:'What did your mother or sister do yesterday? Write one sentence. (e.g. "मेरी दीदी … गई")'},
  bank:['मेरी','मेरा','माँ','दीदी','कल','बाज़ार','मंदिर','स्कूल','गई','गया','।']};
QUESTIONS.q7 = {type:'ai', mode:'explain', lo:3,
  prompt:{hi:'"मेरी बहन स्कूल गई" — यहाँ "गई" क्यों सही है, "गया" क्यों नहीं? अपने शब्दों में लिखो।',
          en:'"मेरी बहन स्कूल गई" — why is "गई" correct and not "गया"? Explain in your own words.'},
  bank:['बहन','स्त्रीलिंग','है','इसलिए','गई','क्योंकि','लड़की','बोल','रही','पुल्लिंग']};

const BASE_ORDER = ['q1','q2','q3','q4','q5','q6','q7'];
