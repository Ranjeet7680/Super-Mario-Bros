# Localization & Language Architecture

Adhering to Section 5 of the Game Architecture Bible.

---

## 🇮🇳 Bilingual Engine Architecture

The localization engine (`src/game/Localization.js`) decouples all in-game text from logic:

```javascript
Localization.setLanguage('hi'); // Seamlessly switches UI, HUD, and Dialogues to Hindi
```

### Initial Language Support

1. **English (Default):** Accessible worldwide for evaluation, pitches, and testing.
2. **Hindi (हिंदी):** Full authentic translation for all HUD text, dialog exchanges, tutorial hints, and lore inscriptions.

---

### Future Regional Language Expansion

The data dictionary schema is pre-architected to accept regional Jharkhand languages:
* **Nagpuri (नागपुरी)**
* **Mundari (मुण्डारी)**
* **Santali (संताली)**
* **Kurukh (कुड़ुख़)**

Each translation is keyed to stable IDs (e.g. `dialogueIntro`, `checkpoint`, `levelClear`), ensuring zero modifications to gameplay physics or level logic when new languages are introduced.
