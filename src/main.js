/**
 * RRR — Jharkhand Quest: Complete Production Game Coordinator
 * Implements Full Player Journey:
 * Boot/Logo -> Main Lobby -> Level Select / Character Showcase / Settings / Credits ->
 * Loading Screen -> Gameplay with Title Card -> Boss/Goal -> Victory Results & Return to Camp.
 * Adheres to RRR Complete Architecture 20,000 FINAL Blueprint.
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

    // App State: 'boot' | 'lobby' | 'loading' | 'gameplay'
    this.appState = 'boot';

    // Game Level State
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
    this.selectedOutfit = 'classic';

    // Character Showcase preview player
    this.previewPlayer = new Player(80, 160);
    this.previewCanvas = document.getElementById('charPreviewCanvas');
    this.previewCtx = this.previewCanvas.getContext('2d');
    this.previewAnimState = 'idle';

    // Timing
    this.lastTime = performance.now();
    this.bootTimer = 0;

    this.initLevel();
    this.initUI();
    this.initTouchControls();
    this.initBootSequence();

    // Start Main Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initLevel() {
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
    this.player.outfit = this.selectedOutfit;
  }

  initBootSequence() {
    const bootScreen = document.getElementById('bootScreen');
    const skipBtn = document.getElementById('skipBootBtn');

    const goToLobby = () => {
      if (this.appState !== 'boot') return;
      this.appState = 'lobby';
      bootScreen.classList.add('hidden');
      document.getElementById('lobbyScreen').classList.remove('hidden');
      this.audio.resumeContext();
      this.audio.startBGM();
    };

    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToLobby();
    });

    bootScreen.addEventListener('click', () => {
      this.audio.resumeContext();
      this.audio.playLogoSting();
      setTimeout(goToLobby, 800);
    }, { once: true });

    // Auto-advance after 3.6s
    setTimeout(() => {
      if (this.appState === 'boot') goToLobby();
    }, 3600);
  }

  initUI() {
    // HUD Elements
    this.hudEl = document.getElementById('hud');
    this.hudWorld = document.getElementById('hudWorld');
    this.hudShards = document.getElementById('hudShards');
    this.hudHearts = document.getElementById('hudHearts');
    this.hudTime = document.getElementById('hudTime');
    this.hudScore = document.getElementById('hudScore');
    this.controlsHint = document.getElementById('controls-hint');

    // Lobby Buttons
    document.getElementById('lobbyPlayBtn').addEventListener('click', () => {
      this.audio.playBtnClick();
      this.startLevelTransition();
    });

    document.getElementById('btnOpenWorldMap').addEventListener('click', () => {
      this.audio.playBtnClick();
      document.getElementById('worldMapModal').classList.remove('hidden');
    });

    document.getElementById('btnOpenCharacter').addEventListener('click', () => {
      this.audio.playBtnClick();
      document.getElementById('characterModal').classList.remove('hidden');
    });

    document.getElementById('btnOpenSettings').addEventListener('click', () => {
      this.audio.playBtnClick();
      document.getElementById('pauseModal').classList.remove('hidden');
    });

    document.getElementById('btnOpenCredits').addEventListener('click', () => {
      this.audio.playBtnClick();
      document.getElementById('creditsModal').classList.remove('hidden');
    });

    // Close Modal Buttons
    document.getElementById('closeMapBtn').addEventListener('click', () => {
      document.getElementById('worldMapModal').classList.add('hidden');
    });
    document.getElementById('closeCharBtn').addEventListener('click', () => {
      document.getElementById('characterModal').classList.add('hidden');
    });
    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
      document.getElementById('pauseModal').classList.add('hidden');
    });
    document.getElementById('closeCreditsBtn').addEventListener('click', () => {
      document.getElementById('creditsModal').classList.add('hidden');
    });

    // Level Select Action
    document.getElementById('btnLaunchWorld1').addEventListener('click', () => {
      document.getElementById('worldMapModal').classList.add('hidden');
      this.startLevelTransition();
    });

    // Character Viewer Outfits & Animations
    document.querySelectorAll('.outfit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.outfit-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedOutfit = e.target.getAttribute('data-outfit');
        this.player.outfit = this.selectedOutfit;
        this.previewPlayer.outfit = this.selectedOutfit;
        this.audio.playBtnClick();
      });
    });

    document.querySelectorAll('.anim-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.previewAnimState = e.target.getAttribute('data-anim');
        this.audio.playBtnClick();
      });
    });

    // Language Toggles (Both in Lobby & in Gameplay HUD)
    const toggleLang = () => {
      const nextLang = Localization.currentLang === 'en' ? 'hi' : 'en';
      Localization.setLanguage(nextLang);
      this.updateLocalizationUI();
      this.audio.playBtnClick();
    };
    document.getElementById('langToggle').addEventListener('click', toggleLang);
    document.getElementById('lobbyLangToggle').addEventListener('click', toggleLang);

    // Sound Toggles
    const toggleSound = () => {
      this.audio.resumeContext();
      this.audio.startBGM();
      const muted = this.audio.toggleMute();
      document.getElementById('soundToggle').textContent = muted ? '🔇' : '🔊';
      document.getElementById('lobbySoundToggle').textContent = muted ? '🔇' : '🔊';
    };
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
    document.getElementById('lobbySoundToggle').addEventListener('click', toggleSound);

    // Pause & Settings Listeners
    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('resumeBtn').addEventListener('click', () => this.togglePause(false));
    document.getElementById('restartBtn').addEventListener('click', () => {
      this.togglePause(false);
      this.restartGame();
    });

    // Return to Camp / Lobby
    const returnToCamp = () => {
      this.togglePause(false);
      document.getElementById('victoryModal').classList.add('hidden');
      this.hudEl.classList.add('hidden');
      this.controlsHint.classList.add('hidden');
      document.getElementById('lobbyScreen').classList.remove('hidden');
      this.appState = 'lobby';
    };
    document.getElementById('pauseLobbyBtn').addEventListener('click', returnToCamp);
    document.getElementById('victoryLobbyBtn').addEventListener('click', returnToCamp);

    document.getElementById('shakeToggle').addEventListener('change', (e) => {
      this.camera.shakeEnabled = e.target.checked;
    });

    document.getElementById('contrastToggle').addEventListener('change', (e) => {
      this.highContrast = e.target.checked;
      this.canvas.classList.toggle('high-contrast', this.highContrast);
    });

    document.getElementById('assistToggle').addEventListener('change', (e) => {
      this.assistMode = e.target.checked;
      this.showBanner(this.assistMode ? 'Assist Mode Enabled' : 'Assist Mode Disabled');
    });

    document.getElementById('volumeSlider').addEventListener('input', (e) => {
      this.audio.setVolume(parseFloat(e.target.value));
    });

    document.getElementById('textSpeedSelect').addEventListener('change', (e) => {
      this.dialogue.setTextSpeed(e.target.value);
    });

    document.getElementById('playAgainBtn').addEventListener('click', () => {
      document.getElementById('victoryModal').classList.add('hidden');
      this.restartGame();
    });

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

    const isEn = Localization.currentLang === 'en';
    document.getElementById('langToggle').textContent = isEn ? '🇮🇳 हिंदी' : '🇬🇧 EN';
    document.getElementById('lobbyLangToggle').textContent = isEn ? '🇮🇳 हिंदी' : '🇬🇧 EN';
    this.hudWorld.textContent = Localization.get('worldTitle');
  }

  startLevelTransition() {
    // 1. Hide Lobby
    document.getElementById('lobbyScreen').classList.add('hidden');

    // 2. Show Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBarFill');
    const tipText = document.getElementById('loadingTipText');

    const tips = [
      Localization.get('tip1'),
      Localization.get('tip2'),
      Localization.get('tip3'),
      Localization.get('tip4')
    ];
    tipText.textContent = tips[Math.floor(Math.random() * tips.length)];

    loadingScreen.classList.remove('hidden');
    loadingBar.style.width = '0%';

    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += 20;
      loadingBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          this.beginGameplay();
        }, 300);
      }
    }, 180);
  }

  beginGameplay() {
    this.appState = 'gameplay';
    this.restartGame();

    // Show HUD & hint
    this.hudEl.classList.remove('hidden');
    this.controlsHint.classList.remove('hidden');

    // Cinematic Title Card Whoosh
    const tc = document.getElementById('titleCardOverlay');
    tc.classList.remove('hidden');
    this.audio.playTitleCardWhoosh();

    setTimeout(() => {
      tc.classList.add('hidden');
    }, 2400);
  }

  showBanner(msg, duration = 2.2) {
    this.bannerMessage = msg;
    this.bannerTimer = duration;
  }

  togglePause(forcedState = null) {
    if (this.appState !== 'gameplay') return;
    this.isPaused = (forcedState !== null) ? forcedState : !this.isPaused;
    document.getElementById('pauseModal').classList.toggle('hidden', !this.isPaused);
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
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.input.update();

    if (this.appState === 'gameplay') {
      if (this.input.actions.pauseDown) {
        this.togglePause();
      }

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();
    } else if (this.appState === 'lobby') {
      this.renderLobbyBackground(dt);
    }

    // Always update Character Showcase preview if modal is open
    if (!document.getElementById('characterModal').classList.contains('hidden')) {
      this.updateCharacterPreview(dt);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  renderLobbyBackground(dt) {
    // Parallax scenic background behind lobby menu
    this.renderer.update(dt);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.renderer.drawParallaxBackground(this.ctx, 200, 0);

    // Draw bonfire / camp ledge
    this.ctx.fillStyle = '#4E342E';
    this.ctx.fillRect(0, 480, this.width, 60);
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillRect(0, 480, this.width, 10);
  }

  updateCharacterPreview(dt) {
    this.previewCtx.clearRect(0, 0, 220, 260);

    this.previewPlayer.state = this.previewAnimState;
    this.previewPlayer.animTime += dt;
    this.previewPlayer.scarfWave += dt * 8;

    this.previewCtx.save();
    this.previewCtx.translate(110, 200);
    this.previewCtx.scale(1.8, 1.8); // 1.8x showcase zoom
    this.previewPlayer.x = -14;
    this.previewPlayer.y = -46;
    this.previewPlayer.draw(this.previewCtx);
    this.previewCtx.restore();
  }

  update(dt) {
    this.handleDialogue();

    if (this.dialogue.isActive) {
      this.dialogue.update(dt);
      return;
    }

    this.gameTime += dt;
    this.renderer.update(dt);
    this.particles.update(dt);

    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
    }

    const prevHealth = this.player.health;

    // Player Update
    this.player.update(
      this.input,
      this.level.platforms,
      dt,
      this.audio,
      this.camera,
      this.particles
    );

    // Damage heart flash
    if (this.player.health < prevHealth) {
      this.hudHearts.classList.add('flash-damage');
      setTimeout(() => this.hudHearts.classList.remove('flash-damage'), 400);
    }

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

    // Camera follow
    this.camera.update(this.player, dt);

    // Update Shards
    for (const shard of this.shards) {
      shard.update(dt, this.player, this.audio, this.particles, (s) => {
        this.shardsCollected++;
        this.score += s.isRare ? 500 : 100;

        // Scale pulse animation on shard count
        this.hudShards.classList.add('pulse-shard');
        setTimeout(() => this.hudShards.classList.remove('pulse-shard'), 200);
      });
    }

    // Checkpoints
    for (const cp of this.checkpoints) {
      cp.update(dt, this.player, this.audio, this.particles, () => {
        this.activeCheckpoint = { x: cp.x, y: cp.y - 20 };
        this.showBanner(Localization.get('checkpoint'));
      });
    }

    // Springs
    for (const sp of this.springs) sp.update(dt, this.player, this.audio, this.particles);

    // Enemies
    for (const beetle of this.beetles) beetle.update(dt, this.player, this.audio, this.particles);
    for (const charger of this.chargers) charger.update(dt, this.player, this.audio, this.particles, this.camera);

    // NPC Elder
    this.npcElder.update(dt);

    // Lore Tablet
    this.loreTablet.update(this.player, () => {
      this.score += 1000;
      this.showBanner(Localization.get('secretFound'), 3.0);
      this.particles.spawnTextPopup(this.loreTablet.x + 20, this.loreTablet.y - 20, '+1000 Secret!', '#FFEA00');
    });

    // Goal Gateway
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

      document.getElementById('victoryModal').classList.remove('hidden');
    }, 600);
  }

  updateHUD() {
    this.hudShards.textContent = `💎 ${this.shardsCollected}/${this.totalShards}`;
    this.hudTime.textContent = `⏱️ ${this.gameTime.toFixed(0)}s`;
    this.hudScore.textContent = `⭐ ${this.score}`;

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
