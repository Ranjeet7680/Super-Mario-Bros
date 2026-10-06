/**
 * Cinematic Animated Story Intro Engine
 * Implements 4-Act Illustrated Story Sequence:
 * Act I: The Sacred Homeland (Jharkhand in peace, Sal groves & Torana Gateways)
 * Act II: The Cosmic Fracture (The Rift of Echoes shatters the gateways into Echo Shards)
 * Act III: The Elder's Mandate (Guru Kripal decrees Kabir's sacred quest)
 * Act IV: Kabir's Resolve (The journey begins to reconnect all 8 regions)
 *
 * Full trilingual text & Web Speech API spoken narration (English, Hindi, Nagpuri).
 * Adheres to Section 03 & 05 of the Game Architecture Bible.
 * Authors: RAJRANJEET7680
 */

import { Localization } from './Localization.js';

export class StoryManager {
  constructor(audioManager, voiceEngine, onComplete) {
    this.audio = audioManager;
    this.voice = voiceEngine;
    this.onComplete = onComplete;

    this.screenEl = document.getElementById('storyScreen');
    this.canvas = document.getElementById('storyCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.badgeEl = document.getElementById('storySceneTag');
    this.textEl = document.getElementById('storyText');
    this.nextBtn = document.getElementById('storyNextBtn');
    this.skipBtn = document.getElementById('storySkipBtn');

    this.currentAct = 0;
    this.totalActs = 4;
    this.isActive = false;
    this.animTime = 0;
    this.typewriterIndex = 0;
    this.fullText = '';
    this.typewriterTimer = 0;

    this.initListeners();
  }

  initListeners() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playBtnClick();
        this.nextAct();
      });
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playBtnClick();
        this.close();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.nextAct();
      } else if (e.code === 'Escape') {
        this.close();
      }
    });
  }

  startStory(callback = null) {
    if (callback) this.onComplete = callback;
    this.isActive = true;
    this.currentAct = 0;
    this.animTime = 0;
    this.screenEl.classList.remove('hidden');

    if (this.audio) {
      this.audio.resumeContext();
      this.audio.startBGM();
    }

    this.loadAct(0);
    this.loop();
  }

  loadAct(actIndex) {
    this.currentAct = actIndex;
    const actNum = actIndex + 1;
    const tagKey = `storyAct${actNum}Tag`;
    const textKey = `storyAct${actNum}Text`;

    const tag = Localization.get(tagKey);
    this.fullText = Localization.get(textKey);

    if (this.badgeEl) this.badgeEl.textContent = tag;
    this.typewriterIndex = 0;
    if (this.textEl) this.textEl.textContent = '';

    // Update Next button label on last act
    if (this.nextBtn) {
      this.nextBtn.textContent = (actIndex === this.totalActs - 1) ? 
        Localization.get('playBtn') + ' ▶' : 
        Localization.get('skipText') + ' ▶';
    }

    // Voice narration in active language
    if (this.voice) {
      this.voice.speak(this.fullText, 'mentor', Localization.currentLang);
    }
  }

  nextAct() {
    if (this.typewriterIndex < this.fullText.length) {
      // Complete text instantly first
      this.typewriterIndex = this.fullText.length;
      if (this.textEl) this.textEl.textContent = this.fullText;
      return;
    }

    if (this.currentAct < this.totalActs - 1) {
      this.loadAct(this.currentAct + 1);
    } else {
      this.close();
    }
  }

  close() {
    this.isActive = false;
    this.screenEl.classList.add('hidden');
    if (this.voice) this.voice.stop();
    if (this.onComplete) this.onComplete();
  }

  update(dt) {
    if (!this.isActive) return;
    this.animTime += dt;

    // Typewriter effect
    if (this.typewriterIndex < this.fullText.length) {
      this.typewriterTimer += dt;
      if (this.typewriterTimer > 0.02) {
        this.typewriterTimer = 0;
        this.typewriterIndex += 2;
        if (this.textEl) {
          this.textEl.textContent = this.fullText.substring(0, this.typewriterIndex);
        }
      }
    }
  }

  loop() {
    if (!this.isActive) return;
    this.update(0.016);
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.animTime;

    ctx.clearRect(0, 0, w, h);

    if (this.currentAct === 0) {
      // --- ACT I: THE SACRED HOMELAND (Dawn, Peaceful Plateau & Sal Groves) ---
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1A237E');
      grad.addColorStop(0.4, '#E65100');
      grad.addColorStop(0.8, '#FFB300');
      grad.addColorStop(1, '#FFE082');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Distant rolling hills
      ctx.fillStyle = '#4A148C';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 40) {
        ctx.lineTo(x, h - 110 + Math.sin(x * 0.008 + t * 0.4) * 20);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Ancient Intact Torana Gateway standing proud
      const archX = w / 2;
      const archY = h - 60;
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(archX - 60, archY - 140, 20, 140);
      ctx.fillRect(archX + 40, archY - 140, 20, 140);
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(archX - 75, archY - 155, 150, 18);
      ctx.fillStyle = '#FFB300';
      ctx.fillRect(archX - 65, archY - 165, 130, 10);

      // Radiant harmonious portal field
      const pulse = 0.5 + Math.sin(t * 3) * 0.2;
      const portalGrad = ctx.createRadialGradient(archX, archY - 70, 10, archX, archY - 70, 70);
      portalGrad.addColorStop(0, `rgba(0, 229, 255, ${pulse + 0.3})`);
      portalGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = portalGrad;
      ctx.fillRect(archX - 50, archY - 140, 100, 140);

      // Peaceful Plateau Grass
      ctx.fillStyle = '#4E342E';
      ctx.fillRect(0, h - 60, w, 60);
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, h - 60, w, 12);

    } else if (this.currentAct === 1) {
      // --- ACT II: THE COSMIC FRACTURE (The Rift of Echoes & Shattered Arch) ---
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0D0914');
      grad.addColorStop(0.5, '#4A0E2E');
      grad.addColorStop(1, '#1A091E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Cosmic fissure lightning tear in sky
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2 - 25, 60);
      ctx.lineTo(w / 2 + 35, 120);
      ctx.lineTo(w / 2 - 15, 180);
      ctx.lineTo(w / 2 + 10, 240);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Shattered Torana Pillars tilted
      ctx.fillStyle = '#4E342E';
      ctx.save();
      ctx.translate(w / 2 - 60, h - 60);
      ctx.rotate(-0.15);
      ctx.fillRect(-10, -120, 20, 120);
      ctx.restore();

      ctx.save();
      ctx.translate(w / 2 + 60, h - 60);
      ctx.rotate(0.18);
      ctx.fillRect(-10, -100, 20, 100);
      ctx.restore();

      // Floating shattered Echo Shards scattering across sky
      for (let i = 0; i < 7; i++) {
        const sx = (w / 2) + Math.cos(t * 1.5 + i) * (80 + i * 35);
        const sy = (h / 2 - 30) + Math.sin(t * 2 + i) * (40 + i * 15);
        ctx.fillStyle = (i % 2 === 0) ? '#00E5FF' : '#FFD54F';
        ctx.beginPath();
        ctx.moveTo(sx, sy - 10);
        ctx.lineTo(sx + 7, sy);
        ctx.lineTo(sx, sy + 10);
        ctx.lineTo(sx - 7, sy);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#261811';
      ctx.fillRect(0, h - 60, w, 60);

    } else if (this.currentAct === 2) {
      // --- ACT III: THE ELDER MANDATE (Guru Kripal at Lantern Shrine) ---
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1A120B');
      grad.addColorStop(0.6, '#3E2723');
      grad.addColorStop(1, '#5D4037');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Checkpoint Shrine with glowing sacred lantern
      const lanternX = w / 2 - 40;
      const lanternY = h - 60;
      ctx.fillStyle = '#795548';
      ctx.fillRect(lanternX - 8, lanternY - 70, 16, 70);
      ctx.fillStyle = '#FFA000';
      ctx.fillRect(lanternX - 12, lanternY - 95, 24, 25);

      // Sacred flame
      const flicker = 0.8 + Math.sin(t * 12) * 0.2;
      ctx.fillStyle = `rgba(255, 145, 0, ${0.4 * flicker})`;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - 82, 36 * flicker, 0, Math.PI * 2);
      ctx.fill();

      // Guru Kripal silhouette on left
      const elderX = w / 2 - 120;
      const elderY = h - 60;
      ctx.fillStyle = '#FFF8E1';
      ctx.beginPath();
      ctx.arc(elderX, elderY - 65, 12, 0, Math.PI * 2); // Head
      ctx.fill();
      ctx.fillStyle = '#FF9800';
      ctx.fillRect(elderX - 14, elderY - 50, 28, 50); // Saffron robe

      // Kabir on right receiving mandate
      const kX = w / 2 + 100;
      const kY = h - 60;
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(kX, kY - 55, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00838F';
      ctx.fillRect(kX - 10, kY - 45, 20, 45); // Teal explorer tunic
      // Saffron headband
      ctx.fillStyle = '#E65100';
      ctx.fillRect(kX - 11, kY - 58, 22, 4);

      // Soil ground
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(0, h - 60, w, 60);

    } else {
      // --- ACT IV: RECONNECTING JHARKHAND (Kabir's Heroic Horizon Resolve) ---
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#283593');
      grad.addColorStop(0.4, '#C2185B');
      grad.addColorStop(0.7, '#FF6F00');
      grad.addColorStop(1, '#FFD54F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // High Netarhat / Ranchi cliff silhouette
      ctx.fillStyle = '#1A091E';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(w * 0.55, h - 110);
      ctx.lineTo(w, h - 40);
      ctx.lineTo(w, h);
      ctx.fill();

      // Heroic Kabir standing on precipice
      const heroX = w * 0.52;
      const heroY = h - 110;

      // Body & Tunic
      ctx.fillStyle = '#00838F';
      ctx.fillRect(heroX - 9, heroY - 48, 18, 48);

      // Head & Headband
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(heroX, heroY - 58, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF9100';
      ctx.fillRect(heroX - 11, heroY - 62, 22, 5);

      // Fluttering long saffron scarf in highland wind
      const scarfWave1 = Math.sin(t * 8) * 8;
      const scarfWave2 = Math.sin(t * 8 + 1) * 12;
      ctx.fillStyle = '#E65100';
      ctx.beginPath();
      ctx.moveTo(heroX - 4, heroY - 52);
      ctx.quadraticCurveTo(heroX - 25, heroY - 55 + scarfWave1, heroX - 55, heroY - 50 + scarfWave2);
      ctx.lineTo(heroX - 52, heroY - 42 + scarfWave2);
      ctx.quadraticCurveTo(heroX - 25, heroY - 46 + scarfWave1, heroX - 4, heroY - 44);
      ctx.closePath();
      ctx.fill();

      // Held Echo Shard glowing in hand
      const shardGlow = 0.6 + Math.sin(t * 6) * 0.3;
      ctx.fillStyle = `rgba(0, 229, 255, ${shardGlow})`;
      ctx.beginPath();
      ctx.arc(heroX + 16, heroY - 65, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(heroX + 16, heroY - 73);
      ctx.lineTo(heroX + 22, heroY - 65);
      ctx.lineTo(heroX + 16, heroY - 57);
      ctx.lineTo(heroX + 10, heroY - 65);
      ctx.closePath();
      ctx.fill();
    }
  }
}
