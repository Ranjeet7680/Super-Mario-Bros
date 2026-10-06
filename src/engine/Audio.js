/**
 * High-Fidelity Procedural WebAudio Synthesizer Engine
 * Features authentic Indian acoustic textures:
 * - Bansuri Bamboo Flute (warm tone + vibrato LFO)
 * - Sitar Plucked String (overtone resonance & decay)
 * - Dholak & Tabla Rhythmic Percussion (Dha, Ge, Tin, Na)
 * - Crystal Echo Shard Chord Chimes
 * - Robust unlock & ducking controls
 * Adheres to Section 21, 23 of RRR Architecture Bible.
 * Authors: RAJRANJEET7680
 */

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.volume = 0.75;
    this.musicPlaying = false;
    this.bgmTimer = null;
    this.initialized = false;
    this.isDucked = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.70, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('WebAudio not supported or blocked:', e);
    }
  }

  resumeContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setMusicDucking(duck) {
    this.isDucked = duck;
    if (!this.initialized || !this.musicGain || !this.ctx) return;
    const target = duck ? 0.08 : 0.38;
    this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
  }

  // --- Sound Effects ---

  playJump() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);

    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playLand() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playDash() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.linearRampToValueAtTime(2800, now + 0.14);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  playShard(index = 0) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Raag Bhupali Harmonic Scale: Sa, Re, Ga, Pa, Dha, Sa
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    const freq = pentatonic[index % pentatonic.length];

    // Primary crystal chime
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // Octave overtone

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now); // Fifth harmonic

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
    osc3.stop(now + 0.55);
  }

  playStomp() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.16);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playHurt() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(55, now + 0.28);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playCheckpoint() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Auspicious Temple Bell Chime
    [392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.3, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }

  playVictory() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    melody.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      gain.gain.setValueAtTime(0.35, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.65);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.65);
    });
  }

  playDialogueBlip() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(460 + Math.random() * 90, now);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playBtnClick() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.07);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playLogoSting() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    // 1. Deep environmental rumble
    const rumble = this.ctx.createOscillator();
    const rGain = this.ctx.createGain();
    rumble.type = 'sine';
    rumble.frequency.setValueAtTime(55, now);
    rumble.frequency.linearRampToValueAtTime(35, now + 1.2);
    rGain.gain.setValueAtTime(0.45, now);
    rGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    rumble.connect(rGain);
    rGain.connect(this.sfxGain);
    rumble.start(now);
    rumble.stop(now + 1.2);

    // 2. Rising tonal shimmer
    const tone = this.ctx.createOscillator();
    const tGain = this.ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(130, now + 0.35);
    tone.frequency.exponentialRampToValueAtTime(587.33, now + 1.4);
    tGain.gain.setValueAtTime(0.3, now + 0.35);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    tone.connect(tGain);
    tGain.connect(this.sfxGain);
    tone.start(now + 0.35);
    tone.stop(now + 1.8);

    // 3. Resonant percussion accent
    const perc = this.ctx.createOscillator();
    const pGain = this.ctx.createGain();
    perc.type = 'sine';
    perc.frequency.setValueAtTime(190, now + 1.35);
    perc.frequency.exponentialRampToValueAtTime(45, now + 1.75);
    pGain.gain.setValueAtTime(0.4, now + 1.35);
    pGain.gain.exponentialRampToValueAtTime(0.001, now + 1.75);
    perc.connect(pGain);
    pGain.connect(this.sfxGain);
    perc.start(now + 1.35);
    perc.stop(now + 1.75);
  }

  playTitleCardWhoosh() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.32);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  // --- Rich Indian Folk Melodic Soundtrack ---
  startBGM() {
    if (this.musicPlaying) return;
    this.resumeContext();
    this.musicPlaying = true;
    let step = 0;

    // Traditional Jharkhand Raag Bhupali Melody Pattern
    const melodyNotes = [
      261.63, 293.66, 329.63, 392.00,
      440.00, 392.00, 329.63, 293.66,
      329.63, 392.00, 440.00, 523.25,
      440.00, 392.00, 329.63, 261.63,
      293.66, 329.63, 392.00, 523.25,
      587.33, 523.25, 440.00, 392.00
    ];

    const playLoopStep = () => {
      if (!this.musicPlaying) return;
      if (this.ctx && !this.isMuted) {
        const now = this.ctx.currentTime;
        const noteFreq = melodyNotes[step % melodyNotes.length];
        
        // 1. Bansuri Bamboo Flute (Warm Triangle with 5Hz gentle vibrato)
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        // Flute vibrato
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.2, now);
        lfoGain.gain.setValueAtTime(3.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        lfo.start(now);
        osc.stop(now + 0.38);
        lfo.stop(now + 0.38);

        // 2. Sitar Sympathetic String Pluck (Harmonic overtone on beat)
        if (step % 2 === 0) {
          const sitar = this.ctx.createOscillator();
          const sGain = this.ctx.createGain();
          sitar.type = 'sawtooth';
          sitar.frequency.setValueAtTime(noteFreq * 2, now);
          sGain.gain.setValueAtTime(0.06, now);
          sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          sitar.connect(sGain);
          sGain.connect(this.musicGain);
          sitar.start(now);
          sitar.stop(now + 0.22);
        }

        // 3. Dholak / Tabla Rhythmic Groove:
        // Beat 0: Dha (Deep Bass + Snare Rim)
        // Beat 1: Ge (Soft bass)
        // Beat 2: Tin (Crisp ringing tone)
        // Beat 3: Na (Sharp high tap)
        const beatInBar = step % 4;
        if (beatInBar === 0) {
          // Dha
          const bass = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(100, now);
          bass.frequency.exponentialRampToValueAtTime(35, now + 0.16);
          bGain.gain.setValueAtTime(0.22, now);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          bass.connect(bGain);
          bGain.connect(this.musicGain);
          bass.start(now);
          bass.stop(now + 0.16);
        } else if (beatInBar === 2) {
          // Tin (Snare rim)
          const rim = this.ctx.createOscillator();
          const rGain = this.ctx.createGain();
          rim.type = 'triangle';
          rim.frequency.setValueAtTime(260, now);
          rim.frequency.exponentialRampToValueAtTime(90, now + 0.09);
          rGain.gain.setValueAtTime(0.14, now);
          rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          rim.connect(rGain);
          rGain.connect(this.musicGain);
          rim.start(now);
          rim.stop(now + 0.09);
        }

        step++;
      }
      this.bgmTimer = setTimeout(playLoopStep, 250); // ~120 BPM traditional tempo
    };

    playLoopStep();
  }

  stopBGM() {
    this.musicPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}
