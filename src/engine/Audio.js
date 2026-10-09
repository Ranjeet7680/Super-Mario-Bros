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

  // --- High-Fidelity Acoustic Sound Effects ---

  playFootstep(surface = 'grass', isLeft = true) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const pitch = isLeft ? 1.0 : 1.08;

    // Filtered noise tap for realistic surface friction
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    if (surface === 'water') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 * pitch, now);
      filter.Q.setValueAtTime(3.0, now);
    } else {
      filter.type = surface === 'stone' ? 'highpass' : 'bandpass';
      filter.frequency.setValueAtTime((surface === 'stone' ? 800 : 450) * pitch, now);
    }

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(surface === 'water' ? 0.14 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (surface === 'water' ? 0.06 : 0.04));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);

    // Subtle low thud of shoe sole
    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
    oGain.gain.setValueAtTime(0.12, now);
    oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(oGain);
    oGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playJump() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Voice 1: Tonal launch curve
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.20);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.20);

    // Voice 2: Aerodynamic air whoosh
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(240, now);
    osc2.frequency.exponentialRampToValueAtTime(720, now + 0.16);
    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now);
    osc2.stop(now + 0.17);
  }

  playLand() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.14);

    gain.gain.setValueAtTime(0.40, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  playSpring(isSuper = false) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isSuper ? 'sawtooth' : 'triangle';
    const startFreq = isSuper ? 260 : 220;
    const endFreq = isSuper ? 1320 : 880;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + (isSuper ? 0.35 : 0.26));

    gain.gain.setValueAtTime(isSuper ? 0.55 : 0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSuper ? 0.42 : 0.32));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + (isSuper ? 0.42 : 0.32));

    if (isSuper) {
      // Harmonic crystal overtone for High Jump
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, now);
      osc2.frequency.exponentialRampToValueAtTime(2090, now + 0.38);
      gain2.gain.setValueAtTime(0.35, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(now);
      osc2.stop(now + 0.45);
    }
  }

  playDash() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.16);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.50, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);

    // Sub-bass shockwave impact
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 0.18);
  }

  playShard(index = 0) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Raag Bhupali Pentatonic Scale: Sa, Re, Ga, Pa, Dha, Sa'
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    const freq = pentatonic[index % pentatonic.length];

    // Rich multi-overtone celestial crystal chime
    [1, 2, 3, 4.02].forEach((mult, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * mult, now);

      const amp = [0.42, 0.24, 0.16, 0.08][i];
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.65);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.65);
    });
  }

  playStomp() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.16);

    gain.gain.setValueAtTime(0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playHurt() {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Body impact crunch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.30);
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.30);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.30);

    // Vocal grunt resonance
    const vocal = this.ctx.createOscillator();
    const vGain = this.ctx.createGain();
    vocal.type = 'triangle';
    vocal.frequency.setValueAtTime(190, now);
    vocal.frequency.exponentialRampToValueAtTime(80, now + 0.22);
    vGain.gain.setValueAtTime(0.30, now);
    vGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    vocal.connect(vGain);
    vGain.connect(this.sfxGain);
    vocal.start(now);
    vocal.stop(now + 0.22);
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
      gain.gain.setValueAtTime(0.32, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.55);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  }

  playStoryChime(act = 0) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Mystic Tibetan singing bowl & temple gong
    const baseFreqs = [220, 293.66, 329.63, 440];
    const base = baseFreqs[act % baseFreqs.length];

    [1, 1.498, 2.01, 3.02].forEach((ratio, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * ratio, now);
      const amp = [0.28, 0.18, 0.12, 0.06][i];
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 1.2);
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

  playStoryChime(index = 0) {
    if (!this.initialized || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chordFrequencies = [
      [261.63, 329.63, 392.00, 523.25], // C major (Homeland)
      [220.00, 261.63, 329.63, 440.00], // A minor (Fracture)
      [196.00, 246.94, 293.66, 392.00], // G major (Mandate)
      [293.66, 369.99, 440.00, 587.33], // D major (Resolve)
      [261.63, 349.23, 392.00, 523.25], // F major (Hundru)
      [329.63, 392.00, 493.88, 659.25], // E minor (Netarhat)
      [246.94, 329.63, 392.00, 493.88], // B minor (Betla)
      [261.63, 329.63, 440.00, 523.25], // C/A (Deoghar)
      [220.00, 293.66, 369.99, 440.00], // Jamshedpur
      [196.00, 261.63, 329.63, 392.00], // Dhanbad
      [293.66, 349.23, 440.00, 587.33], // Damodar
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99] // Grand Reconnection
    ];
    const chord = chordFrequencies[index % chordFrequencies.length];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.18 / (i + 1), now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 1.6);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 1.6);
    });
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
