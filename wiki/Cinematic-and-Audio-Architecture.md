# Cinematic & Audio Architecture

Adhering to Section 6, 7, 21, and 23 of the Game Architecture Bible.

---

## 🎬 1. Bollywood-Style Cinematic Grammar

The game adopts Indian cinematic visual direction to elevate emotional moments:
* **Dramatic Framing:** Wide establishing landscape reveals followed by quick character reaction focus.
* **Letterbox Black Bars:** 40px top and 160px bottom bars glide in during narrative dialogue.
* **Layered Character Acting:** Speaker portraits communicate emotions (`calm`, `determined`, `warning`) alongside character gestures.
* **Skippable Sequences:** All cinematic dialogues can be instantly advanced or skipped via `Space` or `E`.

---

## 🎶 2. Procedural WebAudio Indian Folk Synthesizer

Rather than requiring large pre-recorded audio files, the engine generates all music and effects procedurally in real-time using the **Web Audio API**:

### Raag Bhupali Pentatonic Melody
The background melody cycles through regional folk pitches:
$$\text{Sa (C4)}, \text{Re (D4)}, \text{Ga (E4)}, \text{Pa (G4)}, \text{Dha (A4)}$$
accompanied by a rhythmic dholak/tabla percussive bass pulse at ~115 BPM.

### Procedural Sound Effects
* **Jump:** Pitch-sweep triangle wave ($160\text{Hz} \rightarrow 440\text{Hz}$).
* **Landing:** Low sine wave impulse ($90\text{Hz} \rightarrow 30\text{Hz}$).
* **Echo Shards:** Resonant multi-harmonic sine/triangle chime cycling through the Raag Bhupali scale.
* **Dash:** Bandpass filtered white-noise sweep ($800\text{Hz} \rightarrow 2400\text{Hz}$).
* **Victory:** Uplifting 7-note ascending fanfare.
