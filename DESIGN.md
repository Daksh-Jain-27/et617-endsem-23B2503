# DESIGN.md — ET617 End-Sem · 23B2503

## Identity card
| Field | Choice |
|---|---|
| ID | **23B2503** |
| P | **P2** – Contextual language and literacy application |
| T | **P2-T2** – Hindi: gender agreement (लिंग) in verbs and adjectives |
| L | **L8** – Home language differs from school medium (Bhojpuri at home, Hindi-medium school) |
| C | **C2** – Learner's own language (all learner-facing text in Hindi; English toggle optional) |

App name (working): **लिंग मित्र** (Ling Mitra)
Deploy: `et617-23b2503.vercel.app` · Repo: `et617-endsem-23B2503`

---

## D1 – Educational problem
Children who speak Bhojpuri at home but study in Hindi-medium schools often make gender-agreement errors in written Hindi. Their home language marks gender on verbs and possessives much less strictly than school Hindi, so in writing they carry over a "one form fits all" habit and produce sentences like मेरी बहन स्कूल **गया** or **मेरा** किताब. Teachers usually just mark these red, which doesn't tell the learner *why* the form is wrong. Teachers also tend to mark harmless regional forms like हम जा रहे हैं as wrong, and that shames the learner's home language. The learner needs short practice in their reading language (Hindi) that explains the agreement rule, separates real errors from acceptable regional variation, and gives targeted feedback for each misconception.

**Learning outcomes**
1. **Classify** 10 common Hindi nouns, including non-living things (किताब, बस, चाय, पानी), as पुल्लिंग or स्त्रीलिंग, with at least 80% accuracy.
2. **Correct and produce** verb and adjective/possessive forms (‑आ / ‑ई / ‑ए) that agree with the noun, in present- and past-tense sentences, getting at least 4 of 5 right.
3. **Explain**, in one sentence of their own, why a form is required ("verb follows the noun, not the speaker"), and **distinguish** an acceptable regional variant from an agreement error in 2 given sentences.

**Context of use:** The Hindi teacher sets it as language-support practice after a Hindi writing task, because that's when gender-agreement errors show up. The learner uses it in the school computer lab and finishes it as Hindi homework on the family smartphone (Chrome). Answers are typed in Devanagari, or built by tapping words from an on-screen word bank.

## D2 – Learner persona
- **Name / age:** Sonu Kumar, 11, Class 6, Hindi-medium school in Varanasi. His family is from Ballia district and speaks **Bhojpuri at home**; everything at school is in **Hindi** (the L8 gap).
- **Home language:** Bhojpuri. **School / reading language:** Hindi. Weak in English.
- **Prior knowledge:** Reads and writes Devanagari fluently. Knows that लड़का/लड़की and भाई/बहन are "boy/girl" words. Can recognise naam/kaam words (noun/verb) informally. Does **not** know that non-living nouns have grammatical gender, or that verbs and possessives must agree with the noun.
- **Misconception M1 – "masculine default":** The verb ending is always ‑आ (गया, खाता, आया), whatever the subject. → *मेरी बहन स्कूल गया।* Source: home-language habit of not changing the verb for gender.
- **Misconception M2 – "possessive/adjective follows the owner/speaker":** मेरा/मेरी depends on who is speaking or owning, not on the thing owned. A boy writes *मेरा किताब* ("I am a boy, so मेरा"). Source: home language uses one possessive form for everything.
- **Device / time:** School computer lab during the Hindi period, plus the family smartphone for Hindi homework; about 15–20 minutes per use
- **Motivation:** Lost marks in a Hindi test for "लिंग की गलती" and felt laughed at for speaking "गाँव वाली हिंदी". Wants better marks without being told his home language is wrong.

## D3 – Content plan (all learner text in Hindi)
**Concept explanation (screen "सीखो"):**
> हिंदी में हर संज्ञा या तो **पुल्लिंग** है या **स्त्रीलिंग** — चीज़ें भी! किताब, बस, चाय → स्त्रीलिंग। पानी, दूध, पेड़ → पुल्लिंग।
> **नियम:** क्रिया और विशेषण **संज्ञा के हिसाब से** बदलते हैं, बोलने वाले के हिसाब से नहीं।
> पुल्लिंग → ‑आ (गया, अच्छा, मेरा) · स्त्रीलिंग → ‑ई (गई, अच्छी, मेरी) · पुल्लिंग बहुवचन → ‑ए (गए, अच्छे, मेरे)
> **घर की बोली और स्कूल की हिंदी:** घर पर हम जैसे बोलते हैं, वह भी सही है। पर स्कूल की हिंदी में एक नियम पक्का है — किताब स्त्रीलिंग है, तो **मेरी** किताब।

**Tool:** A **लिंग शब्दकोश** (gender lookup) with 40 common nouns that the learner can open during any question.

**Tasks (4 formats)**
| # | Format | Item | Model answer | Targets |
|---|---|---|---|---|
| Q1 | MCQ | मेरी बहन कल स्कूल ___ । (गया / गई / गए) | गई | M1 |
| Q2 | Sort (tap) | किताब, पानी, बस, दूध, चाय, पेड़ → पुल्लिंग / स्त्रीलिंग | स्त्री: किताब, बस, चाय · पुं: पानी, दूध, पेड़ | LO1 |
| Q3 | Correct the sentence (typed) | राहुल: "मेरा किताब खो गया।" | मेरी किताब खो गई। | M2 + M1 |
| Q4 | Fill blank (typed) | आज चाय बहुत ___ है। (ठंडा/ठंडी) | ठंडी | M2/LO1 |
| Q5 | Error or variation? (judge) | (a) हम कल मेला जाएँगे। (b) माँ बाज़ार गया। | (a) ठीक – regional variant · (b) गलती → गई | Design challenge |
| Q6 | Free sentence (AI-checked) | Write one sentence about what your माँ/दीदी did yesterday | e.g. मेरी दीदी बाज़ार गई। | LO2 |
| Q7 | Explain (AI-checked) | "गई" क्यों सही है? अपने शब्दों में लिखो। | क्योंकि बहन स्त्रीलिंग है, क्रिया संज्ञा के हिसाब से बदलती है। | LO3 |

**Feedback**
- **Correct:** "शाबाश! 'बहन' स्त्रीलिंग है, इसलिए क्रिया 'गई' हुई। ✅"
- **M1 (masculine default):** "ध्यान दो — क्रिया हमेशा 'आ' पर खत्म नहीं होती। कौन गया? **बहन**। बहन स्त्रीलिंग है, तो **गई**। हिंदी में क्रिया संज्ञा के साथ बदलती है।"
- **M2 (follows the owner):** "'मेरा/मेरी' इस पर निर्भर नहीं कि बोलने वाला लड़का है या लड़की। देखो **किस चीज़** की बात है — **किताब** स्त्रीलिंग है, इसलिए **मेरी किताब**। राहुल भी कहेगा: मेरी किताब।"
- **Acceptable variation:** "यह गलती नहीं है 🙂 'हम' का प्रयोग 'मैं' के लिए हमारे इलाके में आम है। लिंग सही है। परीक्षा में 'मैं' लिखना ज़्यादा सुरक्षित है।"

**Out of scope (stated):** ने-constructions (दीदी ने खाना बनाया, where the verb agrees with the object) are left for a next lesson.

## Error vs variation policy (P2 design challenge)
Every check returns one of three labels:
- ✅ **सही** (correct)
- 🟡 **क्षेत्रीय रूप – ठीक है** (regional variant: accepted, not penalised, with a short note). Examples: हम for मैं; spelling pairs गये/गए, नयी/नई, लिये/लिए.
- ❌ **लिंग की गलती** (agreement error: counted, tagged M1 or M2, with targeted feedback)

Only agreement errors between a noun and its verb/adjective/possessive count as errors.

## Screens (D4)
1. **Home / नाम** – enter name, start or resume
2. **सीखो** – concept explanation and home-language/school-Hindi bridge
3. **अभ्यास** – Q1–Q5 (one per screen)
4. **फीडबैक** – correct / M1 / M2 / variant feedback; adaptive next step (an M1 or M2 error → an extra similar item on the same misconception)
5. **जाँचो (AI)** – Q6/Q7 free sentence and explanation, AI-checked
6. **नतीजा** – score per LO and the misconceptions seen
7. **About** – card, roll number, AI use
Footer on every screen: **23B2503**. Language toggle हिंदी / English (C2).

## AI plan
- `/api/check` (Vercel serverless) → **Sarvam AI** (`sarvam-105b`, an Indian-language LLM, via `api.sarvam.ai/v1/chat/completions`) with a fixed teacher prompt. Used only for the open-ended questions: Q6 (own sentence → `{label: correct|variant|error, misconception: M1|M2|other|none, corrected, feedback_hi, feedback_en}`) and Q7 (explanation → `{label: correct|partial|error, misconception, feedback_hi, feedback_en}`).
- Fixed-answer questions (Q1–Q5) are checked by rules only: exact answers need no AI.
- **Validation:** The JSON shape is checked, and the label is cross-checked against a rule-based checker (noun-gender lexicon + verb/possessive endings). If they disagree, the rule-based result is shown and flagged.
- **Fallback:** If the call fails or times out, the rule-based checker is used, with a clearly labelled "ऑफ़लाइन जाँच" badge.
- The API key is kept only in the Vercel environment variable `SARVAM_API_KEY`; the server enforces a 20 s timeout.

## Card alignment: every feature maps to P2 · T2 · L8 · C2
| Card | How the app meets it |
|---|---|
| **P2** Contextual language & literacy | NLP: **spelling/grammar feedback** on free sentences (Sarvam AI + rule-based agreement checker). Design challenge answered by three labels: ✅ correct / 🟡 regional variant (accepted) / ❌ agreement error (Q5, Q6). |
| **T2** Hindi gender agreement | All content is about verb, adjective and मेरा/मेरी agreement with the noun; noun-gender dictionary tool. |
| **L8** Home language ≠ school medium | Misconceptions M1 and M2 come from home-speech habits; the explanation screen bridges home speech to school Hindi; regional forms like हम for मैं are accepted, not marked wrong. |
| **C2** Learner's own language | Every screen, question and piece of feedback is in Hindi; English is an optional toggle. |

Targeted practice after an error (one extra item on the same misconception) is part of P2 **feedback**: it lets the app respond differently to the misconception learner (D5).

## Tech
Vanilla HTML/CSS/JS (no framework) and one Vercel serverless function. Progress is stored in localStorage.
