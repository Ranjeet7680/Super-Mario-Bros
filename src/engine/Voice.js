/**
 * Voice Acting & Speech Synthesis Engine
 * Implements Web Speech API with character voice profiles (Guru Kripal & Kabir)
 * and automatic BGM ducking.
 * Adheres to Section 13, 22, and Appendix D of RRR Architecture.
 */

export class VoiceEngine {
  constructor(audioManager) {
    this.audio = audioManager;
    this.enabled = true;
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.currentUtterance = null;

    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  toggleVoice() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  speak(text, speaker = 'mentor', lang = 'en') {
    if (!this.enabled || !this.synth) return;

    // Cancel any previous speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Character voice personality tuning
    if (speaker === 'mentor' || speaker === 'Guru Kripal' || speaker === 'गुरु कृपाल') {
      utterance.pitch = 0.85; // Calmer, deeper sage tone
      utterance.rate = 0.92;
    } else {
      // Protagonist Kabir
      utterance.pitch = 1.15; // Energetic, resolute adventurer tone
      utterance.rate = 1.05;
    }

    // Language & Voice selection
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hindiVoice = this.voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      utterance.lang = 'en-IN';
      // Prefer Indian English voice if available, else standard English
      const indianEnVoice = this.voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
      const fallbackEnVoice = this.voices.find(v => v.lang.startsWith('en'));
      if (indianEnVoice) {
        utterance.voice = indianEnVoice;
      } else if (fallbackEnVoice) {
        utterance.voice = fallbackEnVoice;
      }
    }

    // Audio Ducking: Duck BGM while voice speaks
    if (this.audio) {
      this.audio.setMusicDucking(true);
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (this.audio) {
        this.audio.setMusicDucking(false);
      }
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (this.audio) {
        this.audio.setMusicDucking(false);
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    if (this.audio) {
      this.audio.setMusicDucking(false);
    }
  }
}
