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

    this.currentChapterIndex = 0;
    this.currentActIndex = 0;
    this.isSagaMode = false;
    this.isTheaterMode = false;
    this.isActive = false;
    this.animTime = 0;
    this.typewriterIndex = 0;
    this.fullText = '';
    this.typewriterTimer = 0;

    // Ambient floating particle field for story scenes
    this.particles = [];
    for (let i = 0; i < 40; i++) {
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

    // Chapters 1 to 9 narrative catalog
    this.chapters = [
      {
        id: 1,
        titleKey: 'chapter1Title',
        acts: [
          { tagKey: 'storyAct1Tag', textKey: 'storyAct1Text', render: (ctx, w, h, t) => this.renderAct1SacredHomeland(ctx, w, h, t) },
          { tagKey: 'storyAct2Tag', textKey: 'storyAct2Text', render: (ctx, w, h, t) => this.renderAct2CosmicFracture(ctx, w, h, t) },
          { tagKey: 'storyAct3Tag', textKey: 'storyAct3Text', render: (ctx, w, h, t) => this.renderAct3ElderMandate(ctx, w, h, t) },
          { tagKey: 'storyAct4Tag', textKey: 'storyAct4Text', render: (ctx, w, h, t) => this.renderAct4KabirResolve(ctx, w, h, t) }
        ]
      },
      {
        id: 2,
        titleKey: 'chapter2Title',
        acts: [
          { tagKey: 'storyCh2Act1Tag', textKey: 'storyCh2Act1Text', render: (ctx, w, h, t) => this.renderCh2HundruFalls(ctx, w, h, t, 0) },
          { tagKey: 'storyCh2Act2Tag', textKey: 'storyCh2Act2Text', render: (ctx, w, h, t) => this.renderCh2HundruFalls(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 3,
        titleKey: 'chapter3Title',
        acts: [
          { tagKey: 'storyCh3Act1Tag', textKey: 'storyCh3Act1Text', render: (ctx, w, h, t) => this.renderCh3NetarhatHills(ctx, w, h, t, 0) },
          { tagKey: 'storyCh3Act2Tag', textKey: 'storyCh3Act2Text', render: (ctx, w, h, t) => this.renderCh3NetarhatHills(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 4,
        titleKey: 'chapter4Title',
        acts: [
          { tagKey: 'storyCh4Act1Tag', textKey: 'storyCh4Act1Text', render: (ctx, w, h, t) => this.renderCh4BetlaForest(ctx, w, h, t, 0) },
          { tagKey: 'storyCh4Act2Tag', textKey: 'storyCh4Act2Text', render: (ctx, w, h, t) => this.renderCh4BetlaForest(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 5,
        titleKey: 'chapter5Title',
        acts: [
          { tagKey: 'storyCh5Act1Tag', textKey: 'storyCh5Act1Text', render: (ctx, w, h, t) => this.renderCh5DeogharHeritage(ctx, w, h, t, 0) },
          { tagKey: 'storyCh5Act2Tag', textKey: 'storyCh5Act2Text', render: (ctx, w, h, t) => this.renderCh5DeogharHeritage(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 6,
        titleKey: 'chapter6Title',
        acts: [
          { tagKey: 'storyCh6Act1Tag', textKey: 'storyCh6Act1Text', render: (ctx, w, h, t) => this.renderCh6JamshedpurIndustrial(ctx, w, h, t, 0) },
          { tagKey: 'storyCh6Act2Tag', textKey: 'storyCh6Act2Text', render: (ctx, w, h, t) => this.renderCh6JamshedpurIndustrial(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 7,
        titleKey: 'chapter7Title',
        acts: [
          { tagKey: 'storyCh7Act1Tag', textKey: 'storyCh7Act1Text', render: (ctx, w, h, t) => this.renderCh7DhanbadDepths(ctx, w, h, t, 0) },
          { tagKey: 'storyCh7Act2Tag', textKey: 'storyCh7Act2Text', render: (ctx, w, h, t) => this.renderCh7DhanbadDepths(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 8,
        titleKey: 'chapter8Title',
        acts: [
          { tagKey: 'storyCh8Act1Tag', textKey: 'storyCh8Act1Text', render: (ctx, w, h, t) => this.renderCh8DamodarSummit(ctx, w, h, t, 0) },
          { tagKey: 'storyCh8Act2Tag', textKey: 'storyCh8Act2Text', render: (ctx, w, h, t) => this.renderCh8DamodarSummit(ctx, w, h, t, 1) }
        ]
      },
      {
        id: 9,
        titleKey: 'chapter9Title',
        acts: [
          { tagKey: 'storyCh9Act1Tag', textKey: 'storyCh9Act1Text', render: (ctx, w, h, t) => this.renderCh9GrandFinale(ctx, w, h, t, 0) },
          { tagKey: 'storyCh9Act2Tag', textKey: 'storyCh9Act2Text', render: (ctx, w, h, t) => this.renderCh9GrandFinale(ctx, w, h, t, 1) }
        ]
      }
    ];

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

    // Story Chapter Navigation Bar Listeners
    const chTabs = document.querySelectorAll('.ch-tab');
    chTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const ch = e.currentTarget.getAttribute('data-ch');
        if (this.audio) this.audio.playBtnClick();
        if (ch === 'all') {
          this.isSagaMode = true;
          this.loadChapter(0, 0);
        } else {
          const idx = parseInt(ch, 10) - 1;
          this.isSagaMode = false;
          this.loadChapter(idx, 0);
        }
      });
    });

    // Mobile tap on dialogue to advance story
    const storyBox = document.querySelector('.story-dialogue-box');
    if (storyBox) {
      storyBox.addEventListener('click', () => {
        if (this.isActive) {
          if (this.audio) this.audio.playBtnClick();
          this.nextAct();
        }
      });
      storyBox.addEventListener('touchstart', () => {
        if (this.isActive) {
          if (this.audio) this.audio.playBtnClick();
          this.nextAct();
        }
      }, { passive: true });
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

  updateTabsUI() {
    const chTabs = document.querySelectorAll('.ch-tab');
    chTabs.forEach(tab => {
      const ch = tab.getAttribute('data-ch');
      if (this.isSagaMode) {
        tab.classList.toggle('active', ch === 'all');
      } else {
        const target = (this.currentChapterIndex + 1).toString();
        tab.classList.toggle('active', ch === target);
      }
    });
  }

  startStory(callback = null) {
    // Default entry: Chapter 1 in progression mode
    this.startChapterStory(1, callback, false);
  }

  startChapterStory(chapterNumber = 1, callback = null, isSaga = false) {
    if (callback) this.onComplete = callback;
    this.isActive = true;
    this.isSagaMode = isSaga;
    this.isTheaterMode = false;
    this.animTime = 0;
    if (this.screenEl) this.screenEl.classList.remove('hidden');

    if (this.audio) {
      this.audio.resumeContext();
      this.audio.startBGM();
    }

    this.loadChapter(chapterNumber - 1, 0);
    this.loop();
  }

  openStoryTheater(startChapter = 1, callback = null) {
    if (callback) this.onComplete = callback;
    this.isActive = true;
    this.isSagaMode = false;
    this.isTheaterMode = true;
    this.animTime = 0;
    if (this.screenEl) this.screenEl.classList.remove('hidden');

    if (this.audio) {
      this.audio.resumeContext();
      this.audio.startBGM();
    }

    this.loadChapter(startChapter - 1, 0);
    this.loop();
  }

  loadAct(actIndex) {
    this.loadChapter(this.currentChapterIndex, actIndex);
  }

  loadChapter(chapterIndex, actIndex = 0) {
    this.currentChapterIndex = Math.max(0, Math.min(8, chapterIndex));
    const ch = this.chapters[this.currentChapterIndex];
    this.currentActIndex = Math.max(0, Math.min(ch.acts.length - 1, actIndex));
    const act = ch.acts[this.currentActIndex];

    this.fullText = Localization.get(act.textKey) || '';
    const tag = Localization.get(act.tagKey) || '';

    if (this.badgeEl) this.badgeEl.textContent = tag;
    this.typewriterIndex = 0;
    if (this.textEl) this.textEl.textContent = '';

    this.updateTabsUI();

    // Play mystic chime for act/chapter transition
    if (this.audio && this.audio.playStoryChime) {
      this.audio.playStoryChime(this.currentChapterIndex + this.currentActIndex);
    }

    // Update Next button label
    if (this.nextBtn) {
      const isLastAct = (this.currentActIndex === ch.acts.length - 1);
      if (!isLastAct) {
        this.nextBtn.textContent = Localization.get('skipText') + ' ▶';
      } else if (this.isSagaMode) {
        this.nextBtn.textContent = (this.currentChapterIndex < 8) ? 
          (Localization.get('nextChapterBtn') || 'Next Chapter ▶') : 
          '🌟 ' + Localization.get('grandFinaleBtn');
      } else if (this.isTheaterMode) {
        this.nextBtn.textContent = (this.currentChapterIndex < 8) ? 
          (Localization.get('nextChapterBtn') || 'Next Chapter ▶') : 
          (Localization.get('close') || 'Close Theater ✕');
      } else {
        // Progression mode right before entering the corresponding level
        if (this.currentChapterIndex === 8) {
          this.nextBtn.textContent = '🌟 ' + (Localization.get('grandFinaleBtn') || 'Complete Story ▶');
        } else {
          this.nextBtn.textContent = (Localization.get('startLevelAction') || 'Enter Region ▶') + ` (${this.currentChapterIndex + 1})`;
        }
      }
    }

    // Spoken voice narration in active language
    if (this.voice) {
      this.voice.speak(this.fullText, 'mentor', Localization.currentLang);
    }
  }

  nextAct() {
    if (this.typewriterIndex < this.fullText.length) {
      // Complete text immediately on first click
      this.typewriterIndex = this.fullText.length;
      if (this.textEl) this.textEl.textContent = this.fullText;
      return;
    }

    const ch = this.chapters[this.currentChapterIndex];
    if (this.currentActIndex < ch.acts.length - 1) {
      this.loadChapter(this.currentChapterIndex, this.currentActIndex + 1);
    } else {
      // Completed current chapter
      if (this.isSagaMode) {
        if (this.currentChapterIndex < 8) {
          this.loadChapter(this.currentChapterIndex + 1, 0);
        } else {
          this.close();
        }
      } else if (this.isTheaterMode) {
        if (this.currentChapterIndex < 8) {
          this.loadChapter(this.currentChapterIndex + 1, 0);
        } else {
          this.close();
        }
      } else {
        // Single chapter before level gameplay
        this.close();
      }
    }
  }

  close() {
    this.isActive = false;
    if (this.screenEl) this.screenEl.classList.add('hidden');
    if (this.voice) this.voice.stop();
    const cb = this.onComplete;
    this.onComplete = null;
    if (cb) cb();
  }

  update(dt) {
    if (!this.isActive) return;
    this.animTime += dt;

    // Typewriter effect
    if (this.typewriterIndex < this.fullText.length) {
      this.typewriterTimer += dt;
      if (this.typewriterTimer > 0.018) {
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

    const ch = this.chapters[this.currentChapterIndex];
    if (ch && ch.acts[this.currentActIndex] && ch.acts[this.currentActIndex].render) {
      ch.acts[this.currentActIndex].render(ctx, w, h, t);
    }

    // Ambient floating embers / pollen / sparkles
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

  // --- REUSABLE MINI KABIR SILHOUETTE ---
  drawMiniKabir(ctx, x, y, t, facing = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    // Boots
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(-6, 0, 5, 10);
    ctx.fillRect(1, 0, 5, 10);

    // Legs & Pants
    ctx.fillStyle = '#263238';
    ctx.fillRect(-5, -12, 4, 12);
    ctx.fillRect(1, -12, 4, 12);

    // Teal Explorer Tunic
    ctx.fillStyle = '#00695C';
    ctx.fillRect(-7, -26, 14, 15);

    // Leather belt & bronze buckle
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-7, -13, 14, 3);
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-2, -14, 4, 4);

    // Head & Skin
    ctx.fillStyle = '#A16238';
    ctx.beginPath();
    ctx.arc(0, -32, 6, 0, Math.PI * 2);
    ctx.fill();

    // Styled hair
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.arc(0, -35, 6, Math.PI, 0);
    ctx.fill();

    // Saffron Headband
    ctx.fillStyle = '#E65100';
    ctx.fillRect(-6, -35, 12, 2.5);

    // Flowing Saffron Silk Scarf
    const wave = Math.sin(t * 8) * 5;
    ctx.fillStyle = '#E65100';
    ctx.beginPath();
    ctx.moveTo(-4, -28);
    ctx.quadraticCurveTo(-14, -26 + wave, -24, -22 + wave * 1.5);
    ctx.lineTo(-22, -18 + wave * 1.5);
    ctx.quadraticCurveTo(-12, -22 + wave, -4, -25);
    ctx.closePath();
    ctx.fill();

    // Gold fringe on scarf tail
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-25, -23 + wave * 1.5, 3, 5);

    ctx.restore();
  }

  // --- CHAPTER 2: HUNDRU FALLS WILDS ---
  renderCh2HundruFalls(ctx, w, h, t, actIndex) {
    // 1. Canyon Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#263238');
    sky.addColorStop(0.5, '#455A64');
    sky.addColorStop(1, '#90A4AE');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Basalt Gorge Cliffs (Left & Right)
    ctx.fillStyle = '#1C2833';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.28, 0);
    ctx.lineTo(w * 0.22, h * 0.4);
    ctx.lineTo(w * 0.32, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#212F3D';
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w * 0.74, 0);
    ctx.lineTo(w * 0.78, h * 0.45);
    ctx.lineTo(w * 0.68, h);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // 3. Mighty Hundru Waterfall (320ft Plunge)
    const fallX = w * 0.48;

    // Outer spray mist glow
    const sprayMist = ctx.createRadialGradient(fallX, h - 50, 20, fallX, h - 50, 160);
    sprayMist.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    sprayMist.addColorStop(0.4, 'rgba(178, 235, 242, 0.4)');
    sprayMist.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sprayMist;
    ctx.beginPath();
    ctx.arc(fallX, h - 50, 160, 0, Math.PI * 2);
    ctx.fill();

    // Cascading water streams with sinusoidal turbulence
    const waterGrad = ctx.createLinearGradient(fallX - 50, 0, fallX + 50, 0);
    waterGrad.addColorStop(0, 'rgba(0, 229, 255, 0.7)');
    waterGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.95)');
    waterGrad.addColorStop(0.7, 'rgba(128, 222, 234, 0.85)');
    waterGrad.addColorStop(1, 'rgba(0, 188, 212, 0.7)');
    ctx.fillStyle = waterGrad;

    ctx.beginPath();
    ctx.moveTo(fallX - 45, 0);
    for (let y = 0; y <= h - 40; y += 15) {
      const wobble = Math.sin(t * 14 + y * 0.08) * 8;
      ctx.lineTo(fallX - 45 + wobble, y);
    }
    ctx.lineTo(fallX + 45, h - 40);
    for (let y = h - 40; y >= 0; y -= 15) {
      const wobble = Math.cos(t * 14 + y * 0.08) * 8;
      ctx.lineTo(fallX + 45 + wobble, y);
    }
    ctx.closePath();
    ctx.fill();

    // Water plunge foam basin & expanding ripples
    for (let i = 0; i < 3; i++) {
      const r = ((t * 40 + i * 25) % 80) + 20;
      const alpha = Math.max(0, 1 - r / 100);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(fallX, h - 35, r * 1.6, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shimmering rainbow arc in the waterfall mist
    ctx.save();
    ctx.lineWidth = 5;
    const rainbowColors = [
      'rgba(244, 67, 54, 0.35)',
      'rgba(255, 193, 7, 0.35)',
      'rgba(76, 175, 80, 0.35)',
      'rgba(0, 229, 255, 0.35)'
    ];
    rainbowColors.forEach((col, idx) => {
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.arc(fallX + 35, h - 35, 115 + idx * 6, Math.PI * 1.1, Math.PI * 1.85);
      ctx.stroke();
    });
    ctx.restore();

    // Foreground Basalt Ledge & Kabir
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.moveTo(0, h - 70);
    ctx.lineTo(w * 0.28, h - 55);
    ctx.lineTo(w * 0.35, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Kabir on ledge looking at the falls
    this.drawMiniKabir(ctx, w * 0.16, h - 65, t, 1);
  }

  // --- CHAPTER 3: NETARHAT SUNSET HILLS ---
  renderCh3NetarhatHills(ctx, w, h, t, actIndex) {
    // 1. "Queen of Chotanagpur" Sunset Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#2A0845');
    sky.addColorStop(0.3, '#7B1FA2');
    sky.addColorStop(0.55, '#C2185B');
    sky.addColorStop(0.75, '#E65100');
    sky.addColorStop(0.9, '#FFB300');
    sky.addColorStop(1, '#FFE082');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Sinking Sun with Atmospheric Halo
    const sunX = w * 0.54;
    const sunY = h * 0.52;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 130);
    sunGlow.addColorStop(0, '#FFFFFF');
    sunGlow.addColorStop(0.35, '#FFE082');
    sunGlow.addColorStop(0.7, 'rgba(255, 112, 67, 0.35)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 130, 0, Math.PI * 2);
    ctx.fill();

    // 3. Layered Rolling Ridges
    // Distant ridge
    ctx.fillStyle = '#4A148C';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 30) {
      ctx.lineTo(x, h - 110 + Math.sin(x * 0.008 + 1) * 25);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Mid ridge
    ctx.fillStyle = '#311B92';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 25) {
      ctx.lineTo(x, h - 75 + Math.sin(x * 0.012 + 2) * 20);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Highland Pine Trees Silhouettes
    ctx.fillStyle = '#1A237E';
    for (let px = 80; px < w; px += 140) {
      const py = h - 90 + Math.sin(px * 0.012 + 2) * 20;
      // Pine trunk & foliage triangles
      ctx.fillRect(px, py, 4, 25);
      ctx.beginPath();
      ctx.moveTo(px + 2, py - 20);
      ctx.lineTo(px - 10, py);
      ctx.lineTo(px + 14, py);
      ctx.closePath();
      ctx.fill();
    }

    // 4. Mystical Floating Cloud Platforms Glowing with Sunset Rim
    for (let ci = 0; ci < 3; ci++) {
      const cx = (w * 0.4 + ci * 140 + Math.sin(t * 1.5 + ci) * 12);
      const cy = h * 0.42 + ci * 30;
      ctx.fillStyle = 'rgba(255, 249, 196, 0.28)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 45, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Foreground Highland Promontory & Kabir
    ctx.fillStyle = '#0D131A';
    ctx.beginPath();
    ctx.moveTo(0, h - 60);
    ctx.lineTo(w * 0.32, h - 45);
    ctx.lineTo(w * 0.38, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    this.drawMiniKabir(ctx, w * 0.18, h - 55, t, 1);
  }

  // --- CHAPTER 4: BETLA FOREST FRONTIER ---
  renderCh4BetlaForest(ctx, w, h, t, actIndex) {
    // 1. Primeval Forest Canopy Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#051B11');
    sky.addColorStop(0.5, '#1B5E20');
    sky.addColorStop(1, '#2E7D32');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Crepuscular Sunbeams (God Rays) Filtering Through Leaves
    ctx.save();
    ctx.rotate(0.25);
    for (let r = 0; r < 4; r++) {
      const rx = 120 + r * 150;
      const ray = ctx.createLinearGradient(rx, -100, rx, h + 100);
      ray.addColorStop(0, 'rgba(255, 255, 220, 0.25)');
      ray.addColorStop(1, 'rgba(255, 255, 220, 0)');
      ctx.fillStyle = ray;
      ctx.fillRect(rx, -100, 35, h + 200);
    }
    ctx.restore();

    // 3. Ancient Chero Kings' Fort Ruins in Midground
    ctx.fillStyle = '#263238';
    // Stone ramparts & arch
    ctx.fillRect(w * 0.45, h - 140, 160, 90);
    // Battlements
    for (let b = 0; b < 6; b++) {
      ctx.fillRect(w * 0.45 + b * 28, h - 155, 16, 15);
    }
    // Carved gateway archway
    ctx.fillStyle = '#192227';
    ctx.beginPath();
    ctx.arc(w * 0.55, h - 90, 26, Math.PI, 0);
    ctx.lineTo(w * 0.55 + 26, h - 50);
    ctx.lineTo(w * 0.55 - 26, h - 50);
    ctx.closePath();
    ctx.fill();

    // Hanging vines / lianas
    ctx.strokeStyle = '#33691E';
    ctx.lineWidth = 2;
    for (let v = 0; v < 5; v++) {
      const vx = w * 0.47 + v * 30;
      ctx.beginPath();
      ctx.moveTo(vx, h - 140);
      ctx.quadraticCurveTo(vx + Math.sin(t * 2 + v) * 8, h - 100, vx, h - 70);
      ctx.stroke();
    }

    // 4. Primeval Sal Trees & Bamboo Groves Framing Scene
    ctx.fillStyle = '#1B381E';
    // Giant Left Sal Trunk
    ctx.fillRect(0, 0, 70, h);
    ctx.fillRect(50, 60, 40, 18);
    // Giant Right Bamboo Stalks
    for (let b = 0; b < 4; b++) {
      ctx.fillRect(w - 60 + b * 15, 0, 8, h);
    }

    // 5. Twinkling Glowing Fireflies
    for (let f = 0; f < 18; f++) {
      const fx = (f * 53 + t * 25) % w;
      const fy = (f * 37 + Math.sin(t * 3 + f) * 22) % (h - 50) + 20;
      const alpha = 0.4 + Math.sin(t * 4 + f) * 0.5;
      ctx.fillStyle = `rgba(205, 255, 80, ${alpha})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foreground Mossy Forest Floor & Kabir
    ctx.fillStyle = '#0E2211';
    ctx.fillRect(0, h - 50, w, 50);

    this.drawMiniKabir(ctx, w * 0.22, h - 52, t, 1);
  }

  // --- CHAPTER 5: DEOGHAR HERITAGE-CITY ---
  renderCh5DeogharHeritage(ctx, w, h, t, actIndex) {
    // 1. Twilight Sapphire Sky with Crescent Moon & Stars
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0D1B2A');
    sky.addColorStop(0.5, '#1B263B');
    sky.addColorStop(1, '#415A77');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Crescent Moon
    ctx.fillStyle = '#FFF9C4';
    ctx.beginPath();
    ctx.arc(w * 0.82, 55, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0D1B2A';
    ctx.beginPath();
    ctx.arc(w * 0.85, 52, 14, 0, Math.PI * 2);
    ctx.fill();

    // 2. Baba Baidyanath Temple Spire (Shikhara)
    const tx = w * 0.5;
    const ty = h - 50;

    ctx.fillStyle = '#4E342E';
    // Main Temple Body
    ctx.fillRect(tx - 70, ty - 120, 140, 120);

    // Tiered Pyramidal Spire
    ctx.beginPath();
    ctx.moveTo(tx, ty - 220);
    ctx.lineTo(tx + 60, ty - 120);
    ctx.lineTo(tx - 60, ty - 120);
    ctx.closePath();
    ctx.fill();

    // Golden Kalasha Finial
    const kalashGlow = ctx.createRadialGradient(tx, ty - 225, 3, tx, ty - 225, 20);
    kalashGlow.addColorStop(0, '#FFFFFF');
    kalashGlow.addColorStop(0.5, '#FFD54F');
    kalashGlow.addColorStop(1, 'rgba(255, 213, 79, 0)');
    ctx.fillStyle = kalashGlow;
    ctx.beginPath();
    ctx.arc(tx, ty - 225, 20, 0, Math.PI * 2);
    ctx.fill();

    // Red Auspicious Pataka Flag Waving on Spire Peak
    const flagWave = Math.sin(t * 8) * 8;
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.moveTo(tx, ty - 232);
    ctx.lineTo(tx + 26 + flagWave, ty - 226);
    ctx.lineTo(tx, ty - 220);
    ctx.closePath();
    ctx.fill();

    // 3. Sacred Temple Bell Hanging in Arch with Sound Rings
    ctx.fillStyle = '#FFA000';
    ctx.beginPath();
    ctx.arc(tx, ty - 70, 18, Math.PI, 0);
    ctx.lineTo(tx + 18, ty - 50);
    ctx.lineTo(tx - 18, ty - 50);
    ctx.closePath();
    ctx.fill();

    // Sound vibration wave rings radiating outwards
    for (let s = 0; s < 3; s++) {
      const rad = ((t * 45 + s * 30) % 90) + 20;
      const alpha = Math.max(0, 1 - rad / 100);
      ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.75})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tx, ty - 60, rad, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Stone Steps & Glowing Ghee Diyas (Lamps)
    ctx.fillStyle = '#2E1C14';
    ctx.fillRect(0, h - 50, w, 50);

    for (let dx = 40; dx < w; dx += 65) {
      // Small clay lamp base
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(dx - 6, h - 48, 12, 5);
      // Flickering yellow-orange flame
      const flameH = 6 + Math.sin(t * 12 + dx) * 2;
      ctx.fillStyle = '#FF9800';
      ctx.beginPath();
      ctx.arc(dx, h - 50 - flameH * 0.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawMiniKabir(ctx, w * 0.22, h - 52, t, 1);
  }

  // --- CHAPTER 6: JAMSHEDPUR INDUSTRIAL RUN ---
  renderCh6JamshedpurIndustrial(ctx, w, h, t, actIndex) {
    // 1. Industrial Night Sky lit by Fiery Blast Furnaces
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#101018');
    sky.addColorStop(0.4, '#3E160C');
    sky.addColorStop(0.8, '#BF360C');
    sky.addColorStop(1, '#FF6F00');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Blast Furnace Stacks & Industrial Silhouette Skyline
    ctx.fillStyle = '#1A141A';
    // Tall furnace tower
    ctx.fillRect(w * 0.35, 60, 50, h - 110);
    ctx.fillRect(w * 0.65, 80, 45, h - 130);
    // Cooling tower curve
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h - 50);
    ctx.lineTo(w * 0.16, 120);
    ctx.lineTo(w * 0.24, 120);
    ctx.lineTo(w * 0.28, h - 50);
    ctx.closePath();
    ctx.fill();

    // Billowing steam clouds from cooling stacks
    for (let st = 0; st < 3; st++) {
      const smY = 90 - st * 25 - (t * 20 % 30);
      ctx.fillStyle = 'rgba(230, 230, 235, 0.22)';
      ctx.beginPath();
      ctx.arc(w * 0.2 + Math.sin(t + st) * 10, smY, 20 + st * 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Elevated Conveyor Truss / Gantry
    ctx.strokeStyle = '#2E2028';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h - 110);
    ctx.lineTo(w, h - 110);
    ctx.stroke();

    // Gantry cross-braces
    ctx.lineWidth = 2;
    for (let gx = 0; gx < w; gx += 40) {
      ctx.beginPath();
      ctx.moveTo(gx, h - 110);
      ctx.lineTo(gx + 40, h - 85);
      ctx.lineTo(gx + 40, h - 110);
      ctx.stroke();
    }

    // 4. Incandescent Molten Steel River
    const moltenGrad = ctx.createLinearGradient(0, h - 45, 0, h);
    moltenGrad.addColorStop(0, '#FFFFFF');
    moltenGrad.addColorStop(0.2, '#FFFF8D');
    moltenGrad.addColorStop(0.6, '#FF9100');
    moltenGrad.addColorStop(1, '#D50000');
    ctx.fillStyle = moltenGrad;
    ctx.fillRect(0, h - 45, w, 45);

    // 5. Flying Welding / Foundry Sparks
    for (let sp = 0; sp < 25; sp++) {
      const spX = (sp * 33 + t * 40) % w;
      const spY = h - 50 - (Math.sin(sp + t * 6) * 60 + 30);
      ctx.fillStyle = sp % 2 === 0 ? '#FFFF00' : '#FF9100';
      ctx.beginPath();
      ctx.arc(spX, spY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    this.drawMiniKabir(ctx, w * 0.18, h - 112, t, 1);
  }

  // --- CHAPTER 7: DHANBAD COAL-MINE DEPTHS ---
  renderCh7DhanbadDepths(ctx, w, h, t, actIndex) {
    // 1. Dark Cavern Seam
    ctx.fillStyle = '#0D0D11';
    ctx.fillRect(0, 0, w, h);

    // Coal Rock Texture Facets
    ctx.fillStyle = '#1A1A22';
    for (let rx = 0; rx < w; rx += 70) {
      for (let ry = 0; ry < h; ry += 60) {
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + 50, ry + 15);
        ctx.lineTo(rx + 35, ry + 55);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 2. Heavy Wooden Support Beams (Mine Props)
    ctx.fillStyle = '#4E342E';
    // Vertical timbers
    ctx.fillRect(w * 0.15, 0, 18, h);
    ctx.fillRect(w * 0.52, 0, 18, h);
    ctx.fillRect(w * 0.85, 0, 18, h);
    // Overhead cross timber
    ctx.fillRect(0, 35, w, 22);

    // 3. Hanging Miner's Carbide Lamp with Golden Light Cone
    const lampX = w * 0.52 + 9;
    const lampY = 62;

    // Hanging wire
    ctx.strokeStyle = '#9E9E9E';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lampX, 45);
    ctx.lineTo(lampX, lampY);
    ctx.stroke();

    // Golden light cone illuminating coal rock
    const lightCone = ctx.createRadialGradient(lampX, lampY, 5, lampX, lampY, 170);
    lightCone.addColorStop(0, 'rgba(255, 235, 59, 0.7)');
    lightCone.addColorStop(0.3, 'rgba(255, 179, 0, 0.35)');
    lightCone.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = lightCone;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 170, 0, Math.PI * 2);
    ctx.fill();

    // Brass lamp body
    ctx.fillStyle = '#FFA000';
    ctx.fillRect(lampX - 6, lampY, 12, 14);

    // 4. Subterranean Rail Tracks & Loaded Minecart
    ctx.fillStyle = '#37474F';
    ctx.fillRect(0, h - 35, w, 8); // rail tie
    ctx.fillStyle = '#90A4AE';
    ctx.fillRect(0, h - 39, w, 4); // iron track

    // Minecart
    const cartX = w * 0.58;
    const cartY = h - 75;
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.moveTo(cartX - 45, cartY);
    ctx.lineTo(cartX + 45, cartY);
    ctx.lineTo(cartX + 35, cartY + 35);
    ctx.lineTo(cartX - 35, cartY + 35);
    ctx.closePath();
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(cartX - 25, cartY + 35, 9, 0, Math.PI * 2);
    ctx.arc(cartX + 25, cartY + 35, 9, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Cyan Echo Shards piled inside minecart
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.moveTo(cartX - 20, cartY - 10);
    ctx.lineTo(cartX, cartY - 25);
    ctx.lineTo(cartX + 20, cartY - 10);
    ctx.lineTo(cartX, cartY);
    ctx.closePath();
    ctx.fill();

    this.drawMiniKabir(ctx, w * 0.28, h - 40, t, 1);
  }

  // --- CHAPTER 8: DAMODAR STORM SUMMIT ---
  renderCh8DamodarSummit(ctx, w, h, t, actIndex) {
    // 1. Violent Swirling Tempest Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0B0715');
    sky.addColorStop(0.5, '#1F1433');
    sky.addColorStop(1, '#342250');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Procedural Lightning Flash & Branching Bolts
    const isLightning = (Math.sin(t * 5.5) > 0.85);
    if (isLightning) {
      // Screen flash
      ctx.fillStyle = 'rgba(224, 231, 255, 0.25)';
      ctx.fillRect(0, 0, w, h);

      // Branching lightning bolt
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#E040FB';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(w * 0.62, 0);
      ctx.lineTo(w * 0.58, 70);
      ctx.lineTo(w * 0.65, 120);
      ctx.lineTo(w * 0.54, 180);
      ctx.lineTo(w * 0.6, h - 80);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 3. Jagged Mountain Peaks & Reservoir Dam Battlements
    ctx.fillStyle = '#140E20';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h - 120);
    ctx.lineTo(w * 0.35, h - 70);
    ctx.lineTo(w * 0.65, h - 160); // Summit peak
    ctx.lineTo(w, h - 90);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // 4. The 8th Fractured Torana Arch on Highest Peak
    const archX = w * 0.65;
    const archY = h - 160;

    ctx.fillStyle = '#6A1B9A';
    ctx.fillRect(archX - 35, archY - 70, 14, 70);
    ctx.fillRect(archX + 21, archY - 70, 14, 70);
    ctx.fillRect(archX - 42, archY - 82, 84, 14);

    // Electrical storm plasma pulsing in shattered gateway
    const arcPulse = Math.sin(t * 12) * 8;
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(archX - 25, archY - 35);
    ctx.lineTo(archX + arcPulse, archY - 50);
    ctx.lineTo(archX + 25, archY - 35);
    ctx.stroke();

    // 5. Whipping Rain Streaks & Tempest Winds
    ctx.strokeStyle = 'rgba(128, 222, 234, 0.35)';
    ctx.lineWidth = 1.2;
    for (let rn = 0; rn < 35; rn++) {
      const rx = (rn * 27 + t * 300) % (w + 100) - 50;
      const ry = (rn * 19 + t * 450) % h;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 15, ry + 25);
      ctx.stroke();
    }

    this.drawMiniKabir(ctx, w * 0.38, h - 74, t, 1);
  }

  // --- CHAPTER 9: GRAND FINALE — THE GREAT RECONNECTION ---
  renderCh9GrandFinale(ctx, w, h, t, actIndex) {
    // 1. Serene Radiant Dawn Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1A237E');
    sky.addColorStop(0.3, '#AD1457');
    sky.addColorStop(0.6, '#FF8F00');
    sky.addColorStop(0.85, '#FFD54F');
    sky.addColorStop(1, '#E8F5E9');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Full Majestic Rainbow Arching Across Plateau
    ctx.save();
    ctx.lineWidth = 6;
    const rainbowHues = [
      'rgba(244, 67, 54, 0.4)',
      'rgba(255, 152, 0, 0.4)',
      'rgba(255, 235, 59, 0.4)',
      'rgba(76, 175, 80, 0.4)',
      'rgba(0, 229, 255, 0.4)',
      'rgba(156, 39, 176, 0.4)'
    ];
    rainbowHues.forEach((hue, idx) => {
      ctx.strokeStyle = hue;
      ctx.beginPath();
      ctx.arc(w * 0.5, h - 40, 260 + idx * 7, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    });
    ctx.restore();

    // 3. 8 Soaring Celestial Pillars of Light (Uniting all 8 regions)
    const regionsX = [80, 160, 260, 360, 480, 600, 700, 780];
    const pillarColors = ['#FFD54F', '#00E5FF', '#FF4081', '#76FF03', '#FF9100', '#E040FB', '#00E676', '#FFEA00'];
    regionsX.forEach((px, idx) => {
      const beam = ctx.createLinearGradient(px - 10, h, px + 10, 0);
      beam.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      beam.addColorStop(0.5, pillarColors[idx]);
      beam.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beam;
      ctx.fillRect(px - 6, 0, 12, h - 50);
    });

    // 4. Intact Reconnected Central Gateway Torana Arch
    const gateX = w * 0.5;
    const gateY = h - 50;

    // Golden Pillars
    ctx.fillStyle = '#FFA000';
    ctx.fillRect(gateX - 55, gateY - 140, 20, 140);
    ctx.fillRect(gateX + 35, gateY - 140, 20, 140);

    // Intact Curved Torana Lintel with Emerald Seal
    ctx.fillStyle = '#FFB300';
    ctx.fillRect(gateX - 70, gateY - 155, 140, 20);
    ctx.fillStyle = '#00E676';
    ctx.beginPath();
    ctx.arc(gateX, gateY - 145, 15, 0, Math.PI * 2);
    ctx.fill();

    // 5. Shower of Celebratory Golden Marigold Petals
    for (let pt = 0; pt < 30; pt++) {
      const pX = (pt * 29 + t * 40) % w;
      const pY = (pt * 23 + t * 65) % (h - 20);
      const sway = Math.sin(t * 3 + pt) * 4;
      ctx.fillStyle = pt % 2 === 0 ? '#FFB300' : '#FF6F00';
      ctx.beginPath();
      ctx.ellipse(pX + sway, pY, 5, 2.5, sway * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Plateau Homeland Soil
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(0, h - 50, w, 50);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, h - 50, w, 8);

    // Kabir & Guru Kripal Standing Together at Gateway
    this.drawMiniKabir(ctx, gateX - 18, h - 52, t, 1);

    // Elder Guru Kripal in Saffron Shawl
    ctx.save();
    ctx.translate(gateX + 18, h - 52);
    // Robe
    ctx.fillStyle = '#FF8F00';
    ctx.fillRect(-6, -26, 12, 26);
    // Head & White Beard
    ctx.fillStyle = '#A16238';
    ctx.beginPath();
    ctx.arc(0, -32, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-4, -30, 8, 8);
    // Walking Staff
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, -36);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.restore();
  }
}

