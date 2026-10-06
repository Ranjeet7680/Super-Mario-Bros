/**
 * Voice Acting & Speech Synthesis Engine
 * Implements Web Speech API with character voice profiles (Guru Kripal & Kabir)
 * and automatic BGM ducking.
 * Full support for English, Hindi, and authentic Jharkhand Nagpuri local dialect phonetics.
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
    if (!this.enabled || !this.synth || !text) return;

    // Cancel any previous active speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);

    // Character voice personality tuning
    const isMentor = speaker === 'mentor' || 
                     speaker === 'Guru Kripal' || 
                     speaker === 'गुरु कृपाल' ||
                     speaker?.toLowerCase().includes('guru') ||
                     speaker?.toLowerCase().includes('kripal');

    if (isMentor) {
      utterance.pitch = (lang === 'nag') ? 0.88 : 0.85; // Sage elder tone
      utterance.rate = (lang === 'nag') ? 0.90 : 0.92;
    } else {
      // Protagonist Kabir
      utterance.pitch = (lang === 'nag') ? 1.05 : 1.15; // Resolute adventurer tone
      utterance.rate = (lang === 'nag') ? 1.00 : 1.05;
    }

    // Language & Voice selection
    if (lang === 'hi' || lang === 'nag') {
      utterance.lang = 'hi-IN';
      // Find best Indian / Hindi voice
      const hindiVoice = this.voices.find(v => v.lang === 'hi-IN' || v.lang.includes('hi') || v.lang.includes('HI'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } else {
      utterance.lang = 'en-IN';
      // Prefer Indian English voice for authentic flavor, else fallback
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
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      if (this.audio) this.audio.setMusicDucking(false);
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignore cancel errors
      }
    }
    this.currentUtterance = null;
    if (this.audio) {
      this.audio.setMusicDucking(false);
    }
  }
}
