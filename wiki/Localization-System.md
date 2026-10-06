# Localization & Jharkhand Regional Language Voice Architecture

Adhering to Section 5, 13, and 22 of the Game Architecture Bible.

---

## 🇮🇳 Trilingual Regional Architecture

The localization engine (`src/game/Localization.js`) and speech synthesis engine (`src/engine/Voice.js`) implement a seamless 3-way cycle:

$$\text{English (en)} \longrightarrow \text{Hindi (hi)} \longrightarrow \text{Nagpuri (nag)} \longrightarrow \text{English (en)}$$

```javascript
// Cycle language at runtime from Lobby or in-game HUD
const nextLang = Localization.cycleLanguage();
this.updateLocalizationUI();
this.voice.speak(Localization.get('startVoice'), 'mentor', nextLang);
```

---

## 🌲 Jharkhand Indigenous Language: Nagpuri (नागपुरी)

Nagpuri is the historic lingua franca of the Chotanagpur plateau (Ranchi, Gumla, Simdega, Khunti, Lohardaga). *RRR — Jharkhand Quest* includes full end-to-end support for authentic Nagpuri vocabulary, dialogue scripts, and vocal acting.

### Sample Localization Dictionary

| Key | English (`en`) | Hindi (`hi`) | Nagpuri (`nag`) |
| :--- | :--- | :--- | :--- |
| **Greeting / Intro** | "Welcome to Ranchi Plateau..." | "राँची के पठार पर तुम्हारा स्वागत है..." | "जोहार कबीर बाबू! अकास के देखा..." |
| **Echo Shards** | "Echo Shards" | "गूँज टुकड़े (इको शार्ड्स)" | "इको शार्ड (गूँज कर टुकड़ा)" |
| **Checkpoint Lit** | "Lantern Shrine Lit!" | "दीप स्तम्भ प्रज्वलित!" | "दीया बरत हे! ठिकाना पक्का होल!" |
| **Next Level Action** | "Next Level ▶" | "अगला स्तर ▶" | "आगिला स्तर ▶" |
| **Level Conquered** | "GATEWAY RESTORED!" | "प्रवेशद्वार पुनः स्थापित!" | "तोरण दुआर खुल गेलक! राउर विजय होल!" |
| **Secret Found** | "Hidden Route Discovered!" | "गुप्त मार्ग खोजा गया!" | "गुप्त रस्ता भेंटायल! (+1000 अंक)" |
| **Talk Prompt** | "Press [E] to Speak" | "बात करने के लिए [E] दबाएं" | "गोठियायेक ले [E] दबाऊ" |
| **Camp Return** | "Return to Camp" | "शिविर में लौटें" | "डेरा घुरी" |

---

## 🗣️ Web Speech API Regional Voice Acting Engine

The voice engine (`src/engine/Voice.js`) handles authentic pronunciation and tone modulation:

1. **Sage Tone (Guru Kripal):** Lower pitch ($\approx 0.88$) and measured cadence ($\approx 0.90$) for elder wisdom.
2. **Hero Tone (Kabir):** Vibrant pitch ($\approx 1.05$) and agile pace ($\approx 1.00$) for adventurous resilience.
3. **Phonetic Engine Routing:** Routes Nagpuri text through high-fidelity Indian speech synthesis engines (`hi-IN`), preserving indigenous inflection and warmth.
4. **Automatic BGM Ducking:** WebAudio BGM volume drops automatically during dialogue or voice triggers, restoring smoothly upon utterance completion.
