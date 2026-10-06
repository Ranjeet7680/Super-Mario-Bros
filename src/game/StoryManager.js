/**
 * Cinematic Animated Story Intro Engine
 * Implements 4-Act High-Fidelity Illustrated Story Sequence:
 * Act I: The Sacred Homeland (Peaceful dawn, Sal groves, soaring birds, intact Torana)
 * Act II: The Cosmic Fracture (Cosmic rift tear, branching lightning, fractured floating gateway, scattering Echo Shards)
 * Act III: The Elder's Mandate (Ancient Sal banyan night grove, crackling campfire, Guru Kripal & Kabir)
 * Act IV: Kabir's Resolve (Heroic Netarhat cliff sunrise, long billowing silk scarf, awakened glowing Echo Shard)
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

    // Ambient floating particle field for story scenes
    this.particles = [];
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 340,
        vx: (Math.random() - 0.5) * 15,
        vy: -10 - Math.random() * 25,
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        hue: Math.random() > 0.5 ? '#FFD54F' : '#00E5FF'
      });
    }

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
    if (this.screenEl) this.screenEl.classList.remove('hidden');

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

    // Play mystic chime for act transition
    if (this.audio && this.audio.playStoryChime) {
      this.audio.playStoryChime(actIndex);
    }

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
    if (this.screenEl) this.screenEl.classList.add('hidden');
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

    // Update floating particle field
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -10) {
        p.y = 350;
        p.x = Math.random() * 800;
      }
      if (p.x < -10) p.x = 810;
      if (p.x > 810) p.x = -10;
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
      this.renderAct1SacredHomeland(ctx, w, h, t);
    } else if (this.currentAct === 1) {
      this.renderAct2CosmicFracture(ctx, w, h, t);
    } else if (this.currentAct === 2) {
      this.renderAct3ElderMandate(ctx, w, h, t);
    } else {
      this.renderAct4KabirResolve(ctx, w, h, t);
    }

    // Ambient floating embers / pollen particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha * (0.6 + Math.sin(t * 3 + p.x) * 0.4);
      ctx.fillStyle = p.hue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- ACT I: THE SACRED HOMELAND ---
  renderAct1SacredHomeland(ctx, w, h, t) {
    // 1. Dawn Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1A237E');   // Deep indigo dawn
    sky.addColorStop(0.35, '#880E4F'); // Crimson rose
    sky.addColorStop(0.65, '#E65100'); // Saffron horizon
    sky.addColorStop(0.85, '#FFB300'); // Radiant amber
    sky.addColorStop(1, '#FFF9C4');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Sunrise Sun Disk with soft atmospheric halo
    const sunX = w * 0.5;
    const sunY = h * 0.48;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 140);
    sunGlow.addColorStop(0, 'rgba(255, 255, 235, 0.95)');
    sunGlow.addColorStop(0.3, 'rgba(255, 214, 0, 0.6)');
    sunGlow.addColorStop(0.7, 'rgba(255, 112, 67, 0.25)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
    ctx.fill();

    // Distant Mountain Ridges (Parasnath & Ranchi Range)
    ctx.fillStyle = '#4A148C';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 30) {
      const my = h - 130 + Math.sin(x * 0.007 + 1) * 25 + Math.cos(x * 0.015) * 12;
      ctx.lineTo(x, my);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Midground Rolling Sal Groves
    ctx.fillStyle = '#1B5E20';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 25) {
      const my = h - 90 + Math.sin(x * 0.012) * 18;
      ctx.lineTo(x, my);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Soaring birds in V-formation across sunrise
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const bx = ((w * 0.2 + i * 28 + t * 25) % (w + 100)) - 50;
      const by = 60 + Math.sin(t * 2 + i) * 8 + Math.abs(i - 2) * 10;
      ctx.beginPath();
      ctx.arc(bx - 4, by, 5, Math.PI, 0);
      ctx.arc(bx + 4, by, 5, Math.PI, 0);
      ctx.stroke();
    }

    // 2. Majestic Intact Torana Gateway
    const archX = w / 2;
    const archY = h - 55;

    // Sandstone pillars with carvings
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(archX - 70, archY - 165, 22, 165); // Left Pillar
    ctx.fillRect(archX + 48, archY - 165, 22, 165); // Right Pillar

    // Sohrai tribal diamond relief on pillars
    ctx.fillStyle = '#FFB300';
    for (let py = archY - 150; py < archY - 20; py += 24) {
      ctx.beginPath();
      ctx.moveTo(archX - 59, py);
      ctx.lineTo(archX - 53, py + 6);
      ctx.lineTo(archX - 59, py + 12);
      ctx.lineTo(archX - 65, py + 6);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(archX + 59, py);
      ctx.lineTo(archX + 65, py + 6);
      ctx.lineTo(archX + 59, py + 12);
      ctx.lineTo(archX + 53, py + 6);
      ctx.fill();
    }

    // Double curved Torana Arch Lintels with spiral terminals
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.roundRect(archX - 90, archY - 180, 180, 16, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(archX - 80, archY - 202, 160, 14, 4);
    ctx.fill();

    // Sacred Kalash Urn Finials on top
    ctx.fillStyle = '#FFD54F';
    [-45, 0, 45].forEach(ox => {
      ctx.beginPath();
      ctx.arc(archX + ox, archY - 212, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(archX + ox - 2, archY - 222, 4, 10);
    });

    // Harmonious Cosmic Portal Field within Arch
    const portalPulse = 0.55 + Math.sin(t * 3.5) * 0.25;
    const portalGrad = ctx.createRadialGradient(archX, archY - 80, 15, archX, archY - 80, 85);
    portalGrad.addColorStop(0, `rgba(0, 229, 255, ${portalPulse})`);
    portalGrad.addColorStop(0.5, `rgba(255, 215, 0, ${portalPulse * 0.6})`);
    portalGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = portalGrad;
    ctx.fillRect(archX - 50, archY - 165, 100, 165);

    // Swirling portal star motes
    for (let i = 0; i < 6; i++) {
      const angle = t * 2 + (i * Math.PI / 3);
      const rad = 25 + Math.sin(t * 3 + i) * 15;
      const px = archX + Math.cos(angle) * rad;
      const py = archY - 80 + Math.sin(angle) * (rad * 0.7);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Foreground Plateau Soil & Flowering Grass
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(0, h - 55, w, 55);
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(0, h - 55, w, 10);

    // Vermilion Palas Blossoms along the grass
    for (let x = 20; x < w; x += 45) {
      const bloomY = h - 55 + Math.sin(x) * 3;
      ctx.fillStyle = '#FF3D00';
      ctx.beginPath();
      ctx.arc(x, bloomY - 4, 3.5, 0, Math.PI * 2);
      ctx.arc(x + 3, bloomY - 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- ACT II: THE COSMIC FRACTURE ---
  renderAct2CosmicFracture(ctx, w, h, t) {
    // 1. Tempest Storm Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0A0512');
    sky.addColorStop(0.4, '#310A24');
    sky.addColorStop(0.8, '#1F0624');
    sky.addColorStop(1, '#0D020F');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Cosmic auroras flashing in sky
    const flash = 0.4 + Math.sin(t * 8) * 0.3;
    const auraGrad = ctx.createRadialGradient(w / 2, 80, 20, w / 2, 80, 260);
    auraGrad.addColorStop(0, `rgba(0, 229, 255, ${flash * 0.7})`);
    auraGrad.addColorStop(0.5, `rgba(170, 0, 255, ${flash * 0.5})`);
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, w, h);

    // Jagged Cosmic Fissure Lightning (Branching down through center)
    ctx.save();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    const riftPts = [
      [w / 2 - 35, 50],
      [w / 2 + 25, 105],
      [w / 2 - 20, 160],
      [w / 2 + 35, 215],
      [w / 2 - 15, 270]
    ];
    for (const pt of riftPts) ctx.lineTo(pt[0], pt[1]);
    ctx.stroke();

    // Lightning tendrils branching outward
    ctx.strokeStyle = '#E040FB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 35, 50);
    ctx.lineTo(w / 2 - 110, 85);
    ctx.moveTo(w / 2 + 25, 105);
    ctx.lineTo(w / 2 + 120, 140);
    ctx.moveTo(w / 2 - 20, 160);
    ctx.lineTo(w / 2 - 90, 195);
    ctx.stroke();
    ctx.restore();

    // 2. Fractured Floating Torana Gateway (Separating in zero gravity)
    const archX = w / 2;
    const archY = h - 55;

    // Left Pillar tilts outward
    ctx.save();
    ctx.translate(archX - 85, archY - 80);
    ctx.rotate(-0.16 + Math.sin(t * 2) * 0.03);
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-11, -80, 22, 160);
    // Glowing crack fissure
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -30); ctx.lineTo(10, 10);
    ctx.stroke();
    ctx.restore();

    // Right Pillar tilts opposite
    ctx.save();
    ctx.translate(archX + 85, archY - 80);
    ctx.rotate(0.18 + Math.cos(t * 2) * 0.03);
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-11, -80, 22, 160);
    // Glowing crack fissure
    ctx.strokeStyle = '#E040FB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, -40); ctx.lineTo(-10, 20);
    ctx.stroke();
    ctx.restore();

    // Shattered Arch Lintels floating separated
    ctx.save();
    ctx.translate(archX - 45, archY - 195 + Math.sin(t * 3) * 6);
    ctx.rotate(-0.12);
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(-45, -8, 90, 16);
    ctx.restore();

    ctx.save();
    ctx.translate(archX + 55, archY - 205 + Math.cos(t * 3) * 6);
    ctx.rotate(0.15);
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(-45, -8, 90, 16);
    ctx.restore();

    // 3. Scattering Crystalline Echo Shards Swirling Outward
    for (let i = 0; i < 9; i++) {
      const angle = t * 1.6 + (i * (Math.PI * 2 / 9));
      const dist = 70 + (i * 24) + Math.sin(t * 3 + i) * 12;
      const sx = archX + Math.cos(angle) * dist;
      const sy = (archY - 90) + Math.sin(angle) * (dist * 0.65);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(t * 4 + i);

      // Shard glow aura
      const shardGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
      shardGlow.addColorStop(0, i % 2 === 0 ? 'rgba(0, 229, 255, 0.9)' : 'rgba(255, 215, 0, 0.9)');
      shardGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shardGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Diamond Shard crystal facets
      ctx.fillStyle = i % 2 === 0 ? '#00E5FF' : '#FFD54F';
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 11);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();

      // Shard bright core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 6);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Dark shattered ground
    ctx.fillStyle = '#1A0D08';
    ctx.fillRect(0, h - 55, w, 55);
  }

  // --- ACT III: THE ELDER'S MANDATE ---
  renderAct3ElderMandate(ctx, w, h, t) {
    // 1. Deep Sacred Night Grove
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0A0612');
    sky.addColorStop(0.6, '#1C0E1E');
    sky.addColorStop(1, '#2E1515');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Crescent Moon and Stars
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.arc(w * 0.85, 55, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0A0612';
    ctx.beginPath();
    ctx.arc(w * 0.82, 52, 17, 0, Math.PI * 2);
    ctx.fill();

    // Sprawling Sacred Sal / Banyan Canopy overhead
    ctx.fillStyle = '#0D2B14';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, 20, w * 0.65, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hanging glowing temple lanterns from branches
    [w * 0.25, w * 0.42, w * 0.65, w * 0.78].forEach((lx, i) => {
      const ly = 75 + Math.sin(t * 2 + i) * 5;
      ctx.strokeStyle = '#8D6E63';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx, 30); ctx.lineTo(lx, ly);
      ctx.stroke();

      // Glowing Lantern
      ctx.fillStyle = '#FF9800';
      ctx.beginPath();
      ctx.roundRect(lx - 7, ly, 14, 18, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 214, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(lx, ly + 9, 22, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Crackling Sacred Campfire (Center)
    const fireX = w * 0.5;
    const fireY = h - 55;

    // Firelight ambient radial glow on surroundings
    const flicker = 0.85 + Math.sin(t * 14) * 0.15;
    const fireGlow = ctx.createRadialGradient(fireX, fireY - 20, 10, fireX, fireY - 20, 160 * flicker);
    fireGlow.addColorStop(0, 'rgba(255, 179, 0, 0.6)');
    fireGlow.addColorStop(0.4, 'rgba(230, 81, 0, 0.35)');
    fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = fireGlow;
    ctx.beginPath();
    ctx.arc(fireX, fireY - 20, 160 * flicker, 0, Math.PI * 2);
    ctx.fill();

    // Campfire wood logs
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.moveTo(fireX - 25, fireY); ctx.lineTo(fireX + 25, fireY - 8);
    ctx.lineTo(fireX + 20, fireY); ctx.lineTo(fireX - 20, fireY - 8);
    ctx.fill();

    // Animated Fire Flames (Multi-tier gradient petals)
    const flameH = 34 * flicker;
    ctx.fillStyle = '#FF3D00';
    ctx.beginPath();
    ctx.moveTo(fireX - 16, fireY);
    ctx.quadraticCurveTo(fireX - 10, fireY - flameH * 0.6, fireX, fireY - flameH);
    ctx.quadraticCurveTo(fireX + 10, fireY - flameH * 0.6, fireX + 16, fireY);
    ctx.fill();

    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.moveTo(fireX - 9, fireY);
    ctx.quadraticCurveTo(fireX - 5, fireY - flameH * 0.5, fireX, fireY - flameH * 0.8);
    ctx.quadraticCurveTo(fireX + 5, fireY - flameH * 0.5, fireX + 9, fireY);
    ctx.fill();

    // 3. Guru Kripal (Left side, Serene Padmasana Lotus Pose)
    const elderX = w * 0.32;
    const elderY = h - 55;

    // Spiritual wisdom aura behind Elder
    const elderAura = ctx.createRadialGradient(elderX, elderY - 45, 10, elderX, elderY - 45, 60);
    elderAura.addColorStop(0, 'rgba(255, 235, 59, 0.4)');
    elderAura.addColorStop(1, 'rgba(255, 235, 59, 0)');
    ctx.fillStyle = elderAura;
    ctx.beginPath();
    ctx.arc(elderX, elderY - 45, 60, 0, Math.PI * 2);
    ctx.fill();

    // Saffron Dhoti & Shawl
    ctx.fillStyle = '#E65100';
    ctx.beginPath();
    ctx.ellipse(elderX, elderY - 14, 28, 16, 0, 0, Math.PI * 2); // Cross-legged base
    ctx.fill();
    ctx.fillRect(elderX - 14, elderY - 52, 28, 42); // Torso

    // Head, Serene Face & Flowing Silver Beard
    ctx.fillStyle = '#BA7A4F';
    ctx.beginPath();
    ctx.arc(elderX, elderY - 65, 12, 0, Math.PI * 2);
    ctx.fill();
    // Silver Hair & Topknot
    ctx.fillStyle = '#ECEFF1';
    ctx.beginPath();
    ctx.arc(elderX, elderY - 72, 10, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(elderX, elderY - 82, 6, 0, Math.PI * 2);
    ctx.fill();
    // Flowing Silver Beard
    ctx.beginPath();
    ctx.moveTo(elderX - 9, elderY - 64);
    ctx.quadraticCurveTo(elderX, elderY - 42, elderX + 9, elderY - 64);
    ctx.fill();

    // Sacred Inscribed Scroll held by Guru Kripal
    ctx.fillStyle = '#FFF8E1';
    ctx.beginPath();
    ctx.roundRect(elderX + 8, elderY - 48, 26, 12, 3);
    ctx.fill();
    // Inscribed glyphs glowing gold
    ctx.fillStyle = '#FF9800';
    ctx.fillRect(elderX + 12, elderY - 45, 18, 2);
    ctx.fillRect(elderX + 12, elderY - 41, 14, 2);

    // 4. Young Kabir (Right side, Attentive Kneeling Adventurer)
    const kX = w * 0.68;
    const kY = h - 55;

    // Kneeling legs
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.roundRect(kX - 10, kY - 16, 26, 16, 4);
    ctx.fill();

    // Peacock Teal Tunic
    ctx.fillStyle = '#00695C';
    ctx.beginPath();
    ctx.roundRect(kX - 8, kY - 52, 22, 38, 4);
    ctx.fill();

    // Satchel on ground behind Kabir
    ctx.fillStyle = '#4E342E';
    ctx.beginPath();
    ctx.roundRect(kX + 15, kY - 22, 16, 20, 4);
    ctx.fill();

    // Kabir's Head, Styled Hair & Saffron Headband
    ctx.fillStyle = '#A16238';
    ctx.beginPath();
    ctx.arc(kX + 3, kY - 64, 11, 0, Math.PI * 2);
    ctx.fill();
    // Black Hair
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.arc(kX + 3, kY - 70, 11, Math.PI, 0);
    ctx.fill();
    // Saffron Headband
    ctx.fillStyle = '#E65100';
    ctx.fillRect(kX - 8, kY - 69, 22, 5);

    // Eager listening expression: Amber eye looking towards elder
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(kX - 2, kY - 65, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E65100';
    ctx.beginPath();
    ctx.arc(kX - 3, kY - 65, 2, 0, Math.PI * 2);
    ctx.fill();

    // Soil ground
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(0, h - 55, w, 55);
  }

  // --- ACT IV: KABIR'S RESOLVE ---
  renderAct4KabirResolve(ctx, w, h, t) {
    // 1. Epic Highland Sunrise Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#283593');   // Deep cobalt
    sky.addColorStop(0.35, '#AD1457'); // Vibrant magenta
    sky.addColorStop(0.65, '#F57C00'); // Radiant orange
    sky.addColorStop(0.9, '#FFD54F');  // Golden sunrise
    sky.addColorStop(1, '#FFF9C4');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Blazing Sunrise Sun Cresting Horizon
    const sunX = w * 0.72;
    const sunY = h * 0.52;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 160);
    sunGlow.addColorStop(0, '#FFFFFF');
    sunGlow.addColorStop(0.2, '#FFF59D');
    sunGlow.addColorStop(0.5, 'rgba(255, 179, 0, 0.5)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Faraway Torana silhouettes on distant peaks
    ctx.fillStyle = 'rgba(74, 20, 140, 0.45)';
    [w * 0.15, w * 0.35, w * 0.88].forEach(tx => {
      ctx.fillRect(tx - 10, h - 145, 4, 30);
      ctx.fillRect(tx + 6, h - 145, 4, 30);
      ctx.fillRect(tx - 14, h - 150, 28, 5);
    });

    // Multi-layer Rolling Valleys with Morning Mist
    ctx.fillStyle = '#311B92';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 35) {
      ctx.lineTo(x, h - 110 + Math.sin(x * 0.009) * 22);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    // Morning Canyon Mist layer
    const mistGrad = ctx.createLinearGradient(0, h - 110, 0, h - 50);
    mistGrad.addColorStop(0, 'rgba(255, 236, 179, 0.5)');
    mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, h - 110, w, 60);

    // Soaring Eagle soaring toward sun
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2.2;
    const eagleX = w * 0.65;
    const eagleY = 70 + Math.sin(t * 3) * 6;
    ctx.beginPath();
    ctx.arc(eagleX - 7, eagleY, 9, Math.PI, 0);
    ctx.arc(eagleX + 7, eagleY, 9, Math.PI, 0);
    ctx.stroke();

    // 2. High Netarhat Promontory Cliff (Foreground)
    ctx.fillStyle = '#1B0E1E';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w * 0.52, h - 115); // Dramatic cliff precipice
    ctx.lineTo(w * 0.58, h - 60);
    ctx.lineTo(w, h - 35);
    ctx.lineTo(w, h);
    ctx.fill();

    // 3. Heroic Kabir on Precipice Edge
    const heroX = w * 0.48;
    const heroY = h - 115;

    // Sturdy Boots anchored on stone
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.roundRect(heroX - 12, heroY - 10, 10, 10, 2);
    ctx.roundRect(heroX + 2, heroY - 10, 12, 10, 2);
    ctx.fill();

    // Forest Trousers
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.roundRect(heroX - 10, heroY - 32, 22, 24, 3);
    ctx.fill();

    // Peacock Teal Tunic
    ctx.fillStyle = '#00695C';
    ctx.beginPath();
    ctx.roundRect(heroX - 12, heroY - 65, 24, 38, 4);
    ctx.fill();

    // Cross-chest Leather Strap
    ctx.fillStyle = '#4E342E';
    ctx.beginPath();
    ctx.moveTo(heroX - 10, heroY - 60);
    ctx.lineTo(heroX + 10, heroY - 35);
    ctx.lineTo(heroX + 6, heroY - 32);
    ctx.lineTo(heroX - 12, heroY - 57);
    ctx.fill();

    // Head, Hair & Saffron Headband
    ctx.fillStyle = '#A16238';
    ctx.beginPath();
    ctx.arc(heroX + 2, heroY - 78, 12, 0, Math.PI * 2);
    ctx.fill();
    // Styled Black Hair
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.arc(heroX + 2, heroY - 84, 12, Math.PI, 0);
    ctx.fill();
    // Headband
    ctx.fillStyle = '#E65100';
    ctx.fillRect(heroX - 10, heroY - 84, 24, 5);

    // Determined Heroic Eye looking toward horizon
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(heroX + 7, heroY - 79, 3.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E65100';
    ctx.beginPath();
    ctx.arc(heroX + 8, heroY - 79, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 4. Majestic Flowing Saffron Silk Scarf (Angavastram) Billowing in Wind
    const wave1 = Math.sin(t * 8) * 10;
    const wave2 = Math.cos(t * 8 + 1) * 14;
    const wave3 = Math.sin(t * 8 + 2) * 12;

    ctx.fillStyle = '#E65100';
    ctx.beginPath();
    ctx.moveTo(heroX - 8, heroY - 72);
    ctx.bezierCurveTo(
      heroX - 35, heroY - 78 + wave1,
      heroX - 70, heroY - 65 + wave2,
      heroX - 110, heroY - 75 + wave3
    );
    ctx.lineTo(heroX - 105, heroY - 62 + wave3);
    ctx.bezierCurveTo(
      heroX - 65, heroY - 54 + wave2,
      heroX - 30, heroY - 64 + wave1,
      heroX - 6, heroY - 60
    );
    ctx.closePath();
    ctx.fill();

    // Gold fringe tassels fluttering on scarf tail
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(heroX - 112, heroY - 74 + wave3, 5, 8);

    // 5. Heroic Raised Arm Holding Glowing Awakened Echo Shard
    ctx.fillStyle = '#00695C';
    ctx.save();
    ctx.translate(heroX + 6, heroY - 60);
    ctx.rotate(0.35);
    ctx.fillRect(0, -6, 26, 8); // Forearm extending toward sunrise
    ctx.restore();

    // Hand & Awakened Echo Shard
    const shardX = heroX + 32;
    const shardY = heroY - 76;

    // Brilliant Cyan & Gold Light Rays Beam Forward
    const shardPulse = 0.7 + Math.sin(t * 6) * 0.3;
    const shardBeam = ctx.createRadialGradient(shardX, shardY, 4, shardX, shardY, 65 * shardPulse);
    shardBeam.addColorStop(0, '#FFFFFF');
    shardBeam.addColorStop(0.3, 'rgba(0, 229, 255, 0.85)');
    shardBeam.addColorStop(0.7, 'rgba(255, 215, 0, 0.4)');
    shardBeam.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = shardBeam;
    ctx.beginPath();
    ctx.arc(shardX, shardY, 65 * shardPulse, 0, Math.PI * 2);
    ctx.fill();

    // Crystal Echo Shard
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.moveTo(shardX, shardY - 14);
    ctx.lineTo(shardX + 9, shardY);
    ctx.lineTo(shardX, shardY + 14);
    ctx.lineTo(shardX - 9, shardY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(shardX, shardY - 8);
    ctx.lineTo(shardX + 5, shardY);
    ctx.lineTo(shardX, shardY + 8);
    ctx.lineTo(shardX - 5, shardY);
    ctx.closePath();
    ctx.fill();
  }
}
