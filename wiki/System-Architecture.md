# System Architecture Blueprint

Adhering to Section 3 & 28 of the Game Architecture Bible.

<div align="center">
  <img src="https://raw.githubusercontent.com/Ranjeet7680/Super-Mario-Bros/main/assets/diagram-architecture.svg" alt="System Architecture Blueprint" width="100%" />
</div>

<br/>

---

## 🏗️ 5-Pillar Architectural Breakdown

The engine architecture separates gameplay rules, presentation, audio, and data into five loosely coupled layers:

### 1. Presentation & UI Layer
* **Fixed Logical Viewport:** Rendered to a 960x540 canvas scaled with crisp pixel-art filtering.
* **Minimal HUD:** Displays life hearts, collected Echo Shards, current world title, and score.
* **Bollywood Cinematic Dialogue:** Black letterbox bars with speaker emotion portraits and typing effects.
* **Touch Controller:** On-screen virtual D-Pad and action buttons on mobile/tablet devices.

### 2. Core Gameplay Layer
* **Player State Machine:** `idle`, `walk`, `run`, `jumpRise`, `jumpFall`, `land`, `dash`, `hurt`, `victory`.
* **Fairness Subsystem:** Coyote time, jump buffering, and invulnerability blinking.
* **Enemy AI:** Patrol Beetles (edge detection) and Forest Chargers (telegraphed charge sprints).

### 3. World & Physics Layer
* **AABB Resolution:** Separate horizontal and vertical collision passes preventing geometry tunneling.
* **One-Way Platforms:** Supports jumping through underneath and standing on top.
* **Parallax Camera:** Smooth predictive look-ahead and vertical dead zones.

### 4. Audio Engine
* **WebAudio Synthesis:** 100% code-synthesized sounds (no external audio assets required).
* **Indian Folk Stem Synth:** Dynamic Raag Bhupali melody paired with rhythmic bass/dhol pulses.
* **SFX Generators:** Real-time oscillators for jumps, dashes, crystal chimes, and fanfares.

### 5. Data & Localization Bus
* **Data-Driven Levels:** Levels defined declaratively in JSON/JS records.
* **Bilingual Localization:** Live language switching between English and Hindi (`Localization.js`).
