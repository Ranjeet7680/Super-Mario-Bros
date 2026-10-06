/**
 * RRR — Jharkhand Quest: Main Game Coordinator
 * Integrates Player, Physics, Camera, Audio, Enemies, Entities, Dialogue, and HUD.
 * Authors: RAJRANJEET7680
 */

import { Input } from './engine/Input.js';
import { AudioManager } from './engine/Audio.js';
import { Camera } from './engine/Camera.js';
import { Player } from './game/Player.js';
import { PatrolBeetle, ForestCharger } from './game/Enemies.js';
import { EchoShard, CheckpointLantern, SpringFlower, NpcElder, LoreTablet, GoalGateway } from './game/Entities.js';
import { Level_1_1 } from './game/LevelData.js';
import { Localization } from './game/Localization.js';
import { DialogueManager } from './game/DialogueManager.js';
import { WorldRenderer, ParticleSystem } from './game/Renderer.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Subsystems
    this.input = new Input();
    this.audio = new AudioManager();
    this.camera = new Camera(this.width, this.height);
    this.dialogue = new DialogueManager(this.audio);
    this.renderer = new WorldRenderer(this.width, this.height);
    this.particles = new ParticleSystem();

    // Game State
    this.level = Level_1_1;
    this.player = new Player(this.level.playerSpawn.x, this.level.playerSpawn.y);
    this.activeCheckpoint = { x: this.level.playerSpawn.x, y: this.level.playerSpawn.y };
    this.camera.setBounds(0, this.level.width, 0, this.level.height);

    // Entity Collections
    this.shards = [];
    this.checkpoints = [];
    this.springs = [];
    this.beetles = [];
    this.chargers = [];
    this.npcElder = null;
    this.loreTablet = null;
    this.goalGateway = null;

    // Metrics & Score
    this.score = 0;
    this.shardsCollected = 0;
    this.totalShards = 0;
    this.gameTime = 0;
    this.isPaused = false;
    this.assistMode = false;
    this.highContrast = false;
    this.bannerMessage = '';
    this.bannerTimer = 0;
    this.hasTalkedToElder = false;

    // Timing
    this.lastTime = performance.now();

    this.initLevel();
    this.initUI();
    this.initTouchControls();

    // Start loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initLevel() {
    // Entities instantiation from data
    this.shards = this.level.shards.map(s => new EchoShard(s.x, s.y, s.id, s.isRare));
    this.totalShards = this.shards.length;

    this.checkpoints = this.level.checkpoints.map(c => new CheckpointLantern(c.x, c.y, c.id));
    this.springs = this.level.springs.map(sp => new SpringFlower(sp.x, sp.y));

    this.beetles = this.level.enemies.beetles.map(b => new PatrolBeetle(b.x, b.y, b.left, b.right));
    this.chargers = this.level.enemies.chargers.map(c => new ForestCharger(c.x, c.y, c.left, c.right));

    this.npcElder = new NpcElder(this.level.npcElder.x, this.level.npcElder.y);
    this.loreTablet = new LoreTablet(this.level.loreTablet.x, this.level.loreTablet.y);
    this.goalGateway = new GoalGateway(this.level.goalGateway.x, this.level.goalGateway.y);

    this.player.resetToCheckpoint(this.level.playerSpawn.x, this.level.playerSpawn.y);
  }

  initUI() {
    this.hudWorld = document.getElementById('hudWorld');
    this.hudShards = document.getElementById('hudShards');
    this.hudHearts = document.getElementById('hudHearts');
    this.hudTime = document.getElementById('hudTime');
    this.hudScore = document.getElementById('hudScore');

    this.langBtn = document.getElementById('langToggle');
    this.soundBtn = document.getElementById('soundToggle');
    this.pauseBtn = document.getElementById('pauseBtn');

    this.pauseModal = document.getElementById('pauseModal');
    this.resumeBtn = document.getElementById('resumeBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.shakeToggle = document.getElementById('shakeToggle');
    this.contrastToggle = document.getElementById('contrastToggle');
    this.assistToggle = document.getElementById('assistToggle');
    this.volumeSlider = document.getElementById('volumeSlider');

    this.victoryModal = document.getElementById('victoryModal');
    this.playAgainBtn = document.getElementById('playAgainBtn');

    // Language Toggle Listener
    this.langBtn.addEventListener('click', () => {
      const nextLang = Localization.currentLang === 'en' ? 'hi' : 'en';
      Localization.setLanguage(nextLang);
      this.updateLocalizationUI();
    });

    // Sound Toggle Listener
    this.soundBtn.addEventListener('click', () => {
      this.audio.resumeContext();
      this.audio.startBGM();
      const muted = this.audio.toggleMute();
      this.soundBtn.textContent = muted ? '🔇' : '🔊';
    });

    // Pause Listeners
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.resumeBtn.addEventListener('click', () => this.togglePause(false));
    this.restartBtn.addEventListener('click', () => {
      this.togglePause(false);
      this.restartGame();
    });

    // Settings Listeners
    this.shakeToggle.addEventListener('change', (e) => {
      this.camera.shakeEnabled = e.target.checked;
    });

    this.contrastToggle.addEventListener('change', (e) => {
      this.highContrast = e.target.checked;
      this.canvas.classList.toggle('high-contrast', this.highContrast);
    });

    this.assistToggle.addEventListener('change', (e) => {
      this.assistMode = e.target.checked;
      this.showBanner(this.assistMode ? 'Assist Mode Enabled' : 'Assist Mode Disabled');
    });

    this.volumeSlider.addEventListener('input', (e) => {
      this.audio.setVolume(parseFloat(e.target.value));
    });

    this.playAgainBtn.addEventListener('click', () => {
      this.victoryModal.classList.add('hidden');
      this.restartGame();
    });

    // User first interaction starts Audio context & BGM
    window.addEventListener('keydown', () => {
      this.audio.resumeContext();
      this.audio.startBGM();
    }, { once: true });

    window.addEventListener('click', () => {
      this.audio.resumeContext();
      this.audio.startBGM();
    }, { once: true });

    this.updateLocalizationUI();
  }

  initTouchControls() {
    const bindBtn = (id, action) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.audio.resumeContext();
        this.audio.startBGM();
        this.input.setTouch(action, true);
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.input.setTouch(action, false);
      });
    };

    bindBtn('btnTouchLeft', 'left');
    bindBtn('btnTouchRight', 'right');
    bindBtn('btnTouchDown', 'down');
    bindBtn('btnTouchJump', 'jump');
    bindBtn('btnTouchDash', 'dash');
    bindBtn('btnTouchTalk', 'interact');
  }

  updateLocalizationUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = Localization.get(key);
    });
    this.hudWorld.textContent = Localization.get('worldTitle');
    this.langBtn.textContent = Localization.currentLang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN';
  }

  showBanner(msg, duration = 2.2) {
    this.bannerMessage = msg;
    this.bannerTimer = duration;
  }

  togglePause(forcedState = null) {
    this.isPaused = (forcedState !== null) ? forcedState : !this.isPaused;
    this.pauseModal.classList.toggle('hidden', !this.isPaused);
  }

  restartGame() {
    this.score = 0;
    this.shardsCollected = 0;
    this.gameTime = 0;
    this.activeCheckpoint = { x: this.level.playerSpawn.x, y: this.level.playerSpawn.y };
    this.player = new Player(this.level.playerSpawn.x, this.level.playerSpawn.y);
    this.initLevel();
  }

  handleDialogue() {
    if (this.dialogue.isActive) {
      if (this.input.actions.jumpDown || this.input.actions.interactDown) {
        this.dialogue.next();
      }
      return;
    }

    // Check interaction with Elder NPC
    const elderDist = Math.abs(this.player.x - this.npcElder.x);
    if (elderDist < 75 && this.input.actions.interactDown) {
      const script = Localization.get('dialogueIntro');
      this.dialogue.startDialogue(script, () => {
        if (!this.hasTalkedToElder) {
          this.hasTalkedToElder = true;
          this.score += 250;
          this.particles.spawnTextPopup(this.npcElder.x + 15, this.npcElder.y - 20, '+250 Knowledge');
        }
      });
    }
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // Clamp dt to prevent tunneling
    this.lastTime = timestamp;

    this.input.update();

    if (this.input.actions.pauseDown) {
      this.togglePause();
    }

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.handleDialogue();

    if (this.dialogue.isActive) {
      this.dialogue.update(dt);
      return; // Freeze world physics during cinematic dialogue
    }

    this.gameTime += dt;
    this.renderer.update(dt);
    this.particles.update(dt);

    // Banner message decay
    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
    }

    // Update Player
    this.player.update(
      this.input,
      this.level.platforms,
      dt,
      this.audio,
      this.camera,
      this.particles
    );

    // Bottom pit check
    if (this.player.y > this.level.height + 60) {
      this.player.takeDamage(1, this.audio, this.camera);
      if (!this.player.isDead) {
        this.player.resetToCheckpoint(this.activeCheckpoint.x, this.activeCheckpoint.y);
      }
    }

    // Death & Respawn
    if (this.player.isDead) {
      setTimeout(() => {
        this.player.resetToCheckpoint(this.activeCheckpoint.x, this.activeCheckpoint.y);
      }, 700);
    }

    // Update Camera
    this.camera.update(this.player, dt);

    // Update Collectibles
    for (const shard of this.shards) {
      shard.update(dt, this.player, this.audio, this.particles, (s) => {
        this.shardsCollected++;
        this.score += s.isRare ? 500 : 100;
      });
    }

    // Update Checkpoints
    for (const cp of this.checkpoints) {
      cp.update(dt, this.player, this.audio, this.particles, () => {
        this.activeCheckpoint = { x: cp.x, y: cp.y - 20 };
        this.showBanner(Localization.get('checkpoint'));
      });
    }

    // Update Spring Flowers
    for (const sp of this.springs) {
      sp.update(dt, this.player, this.audio, this.particles);
    }

    // Update Enemies
    for (const beetle of this.beetles) {
      beetle.update(dt, this.player, this.audio, this.particles);
    }

    for (const charger of this.chargers) {
      charger.update(dt, this.player, this.audio, this.particles, this.camera);
    }

    // Update NPC Elder
    this.npcElder.update(dt);

    // Update Lore Tablet
    this.loreTablet.update(this.player, () => {
      this.score += 1000;
      this.showBanner(Localization.get('secretFound'), 3.0);
      this.particles.spawnTextPopup(this.loreTablet.x + 20, this.loreTablet.y - 20, '+1000 Secret!', '#FFEA00');
    });

    // Update Goal Gateway
    this.goalGateway.update(dt, this.player, this.audio, () => {
      this.player.hasWon = true;
      this.showVictoryScreen();
    });

    this.updateHUD();
  }

  showVictoryScreen() {
    setTimeout(() => {
      document.getElementById('resShards').textContent = `${this.shardsCollected} / ${this.totalShards}`;
      document.getElementById('resTime').textContent = `${this.gameTime.toFixed(1)}s`;
      document.getElementById('resScore').textContent = `${this.score}`;

      let rank = Localization.get('rankB');
      if (this.shardsCollected >= this.totalShards && this.gameTime < 75) {
        rank = Localization.get('rankS');
      } else if (this.shardsCollected >= 8) {
        rank = Localization.get('rankA');
      }
      document.getElementById('resRank').textContent = rank;

      this.victoryModal.classList.remove('hidden');
    }, 600);
  }

  updateHUD() {
    this.hudShards.textContent = `💎 ${this.shardsCollected}/${this.totalShards}`;
    this.hudTime.textContent = `⏱️ ${this.gameTime.toFixed(0)}s`;
    this.hudScore.textContent = `⭐ ${this.score}`;

    // Hearts display
    let hearts = '';
    for (let i = 0; i < this.player.maxHealth; i++) {
      hearts += (i < this.player.health) ? '❤️' : '🖤';
    }
    this.hudHearts.textContent = hearts;
  }

  render() {
    const camX = this.camera.getRenderX();
    const camY = this.camera.getRenderY();

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Parallax Sky & Mountain Ridges
    this.renderer.drawParallaxBackground(this.ctx, camX, camY);

    // 2. World Space Rendering
    this.ctx.save();
    this.ctx.translate(-camX, -camY);

    this.renderer.drawPlatforms(this.ctx, this.level.platforms, camX, camY, this.assistMode);

    // 3. Goal Gateway Arch
    this.goalGateway.draw(this.ctx);

    // 4. Interactive Entities
    this.loreTablet.draw(this.ctx);
    this.npcElder.draw(this.ctx, this.player);

    for (const cp of this.checkpoints) cp.draw(this.ctx);
    for (const sp of this.springs) sp.draw(this.ctx);
    for (const s of this.shards) s.draw(this.ctx);

    // 5. Enemies
    for (const beetle of this.beetles) beetle.draw(this.ctx);
    for (const charger of this.chargers) charger.draw(this.ctx);

    // 6. Player
    this.player.draw(this.ctx);

    // 7. Particles & Popups
    this.particles.draw(this.ctx, 0, 0);

    this.ctx.restore();

    // 8. World Banner Notification
    if (this.bannerTimer > 0) {
      this.ctx.save();
      const alpha = Math.min(1.0, this.bannerTimer * 2);
      this.ctx.fillStyle = `rgba(33, 33, 33, ${0.85 * alpha})`;
      this.ctx.fillRect(this.width / 2 - 200, 70, 400, 36);
      this.ctx.strokeStyle = `rgba(255, 179, 0, ${alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.width / 2 - 200, 70, 400, 36);

      this.ctx.fillStyle = `rgba(255, 235, 59, ${alpha})`;
      this.ctx.font = 'bold 15px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.bannerMessage, this.width / 2, 94);
      this.ctx.restore();
    }

    // 9. Cinematic Dialogue Overlay
    this.dialogue.draw(this.ctx, this.width, this.height);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
