/**
 * RRR — Jharkhand Quest: Complete Production Game Coordinator
 * Implements Full Player Journey:
 * Boot/Logo -> Main Lobby -> Level Select / Character Showcase / Settings / Credits ->
 * Loading Screen -> Gameplay with Title Card -> Boss/Goal -> Victory Results & Next Level Progression.
 * Full 8 Jharkhand Regions & End-to-End Nagpuri Local Language Voice Acting.
 * Adheres to RRR Complete Architecture 20,000 FINAL Blueprint.
 * Authors: RAJRANJEET7680
 */

import { Input } from './engine/Input.js';
import { AudioManager } from './engine/Audio.js';
import { Camera } from './engine/Camera.js';
import { Physics } from './engine/Physics.js';
import { Player } from './game/Player.js';
import { PatrolBeetle, ForestCharger } from './game/Enemies.js';
import { EchoShard, CheckpointLantern, SpringFlower, NpcElder, LoreTablet, GoalGateway } from './game/Entities.js';
import { LevelRegistry } from './game/LevelData.js';
import { Localization } from './game/Localization.js';
import { DialogueManager } from './game/DialogueManager.js';
import { WorldRenderer, ParticleSystem } from './game/Renderer.js';
import { VoiceEngine } from './engine/Voice.js';

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
    this.voice = new VoiceEngine(this.audio);
    this.camera = new Camera(this.width, this.height);
    this.dialogue = new DialogueManager(this.audio, this.voice);
    this.renderer = new WorldRenderer(this.width, this.height);
    this.particles = new ParticleSystem();

    // App State: 'boot' | 'lobby' | 'loading' | 'gameplay'
    this.appState = 'boot';

    // Multi-Level Progression State
    this.levels = LevelRegistry;
    this.currentLevelIndex = 0;
    this.unlockedLevelIndex = parseInt(localStorage.getItem('rrr_unlocked_level') || '0', 10);
    if (isNaN(this.unlockedLevelIndex) || this.unlockedLevelIndex < 0) {
      this.unlockedLevelIndex = 0;
    }

    this.level = this.levels[this.currentLevelIndex];
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
    this.updateWorldMapUI();

    // Start Main Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  initLevel() {
    this.level = this.levels[this.currentLevelIndex];
    this.camera.setBounds(0, this.level.width, 0, this.level.height);

    // Initialize level entities
    this.shards = this.level.shards.map(s => new EchoShard(s.x, s.y, s.id, s.isRare));
    this.totalShards = this.shards.length;

    this.checkpoints = this.level.checkpoints.map(c => new CheckpointLantern(c.x, c.y, c.id));
    this.springs = this.level.springs.map(sp => new SpringFlower(sp.x, sp.y));

    this.beetles = this.level.enemies.beetles.map(b => new PatrolBeetle(b.x, b.y, b.left, b.right));
    this.chargers = this.level.enemies.chargers.map(c => new ForestCharger(c.x, c.y, c.left, c.right));

    this.npcElder = new NpcElder(this.level.npcElder.x, this.level.npcElder.y);
    this.loreTablet = new LoreTablet(this.level.loreTablet.x, this.level.loreTablet.y);
    this.goalGateway = new GoalGateway(this.level.goalGateway.x, this.level.goalGateway.y);

    this.activeCheckpoint = { x: this.level.playerSpawn.x, y: this.level.playerSpawn.y };
    this.player.resetToCheckpoint(this.level.playerSpawn.x, this.level.playerSpawn.y);
    this.player.outfit = this.selectedOutfit;
    this.hasTalkedToElder = false;

    // Reset platform base coordinates
    for (const p of this.level.platforms) {
      if (p.moving) {
        p.baseX = p.x;
        p.baseY = p.y;
      }
    }
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
      this.startLevelTransition(this.currentLevelIndex);
    });

    document.getElementById('btnOpenWorldMap').addEventListener('click', () => {
      this.audio.playBtnClick();
      this.updateWorldMapUI();
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

    // World Map Level Selection Launchers
    document.querySelectorAll('.node-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetWorldIndex = parseInt(e.target.getAttribute('data-world-index') || '0', 10);
        document.getElementById('worldMapModal').classList.add('hidden');
        this.startLevelTransition(targetWorldIndex);
      });
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

    // 3-Way Language Cycling: EN -> HI -> NAG
    const cycleLanguage = () => {
      const nextLang = Localization.cycleLanguage();
      this.updateLocalizationUI();
      this.audio.playBtnClick();
      // Voice introduction in the selected language
      this.voice.speak(Localization.get('startVoice'), 'mentor', nextLang);
    };
    document.getElementById('langToggle').addEventListener('click', cycleLanguage);
    document.getElementById('lobbyLangToggle').addEventListener('click', cycleLanguage);

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

    // Fullscreen Toggles
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn("Fullscreen request error:", err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      this.audio.playBtnClick();
    };
    document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
    document.getElementById('lobbyFullscreenBtn')?.addEventListener('click', toggleFullscreen);
    document.getElementById('modalFullscreenBtn')?.addEventListener('click', toggleFullscreen);

    // Voice Acting Toggles
    const toggleVoice = () => {
      const isEnabled = this.voice.toggleVoice();
      const label = isEnabled ? Localization.get('voiceOn') : Localization.get('voiceOff');
      const icon = isEnabled ? '🗣️' : '🔇';
      document.getElementById('voiceToggle').textContent = icon;
      document.getElementById('lobbyVoiceToggle').textContent = label;
      document.getElementById('voiceActingToggle').checked = isEnabled;
      this.audio.playBtnClick();
    };
    document.getElementById('voiceToggle')?.addEventListener('click', toggleVoice);
    document.getElementById('lobbyVoiceToggle')?.addEventListener('click', toggleVoice);
    document.getElementById('voiceActingToggle')?.addEventListener('change', (e) => {
      this.voice.enabled = e.target.checked;
      if (!this.voice.enabled) this.voice.stop();
      const label = this.voice.enabled ? Localization.get('voiceOn') : Localization.get('voiceOff');
      document.getElementById('voiceToggle').textContent = this.voice.enabled ? '🗣️' : '🔇';
      document.getElementById('lobbyVoiceToggle').textContent = label;
    });

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

    // Play Again button
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      document.getElementById('victoryModal').classList.add('hidden');
      this.restartGame();
    });

    // NEXT LEVEL Progression Action Button
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
      document.getElementById('victoryModal').classList.add('hidden');
      const nextIndex = (this.currentLevelIndex + 1) % this.levels.length;
      this.startLevelTransition(nextIndex);
    });

    // Universal audio & speech synthesis unlock on first gesture
    const unlockAudioAndSpeech = () => {
      this.audio.resumeContext();
      this.audio.startBGM();
      if (this.voice && this.voice.synth) {
        if (this.voice.synth.paused) this.voice.synth.resume();
      }
    };
    window.addEventListener('click', unlockAudioAndSpeech, { passive: true });
    window.addEventListener('keydown', unlockAudioAndSpeech, { passive: true });
    window.addEventListener('touchstart', unlockAudioAndSpeech, { passive: true });

    this.updateLocalizationUI();
  }

  updateWorldMapUI() {
    for (let i = 0; i < 8; i++) {
      const worldNum = i + 1;
      const nodeEl = document.getElementById(`nodeWorld${worldNum}`);
      const badgeEl = document.getElementById(`badgeWorld${worldNum}`);
      const btnEl = document.getElementById(`btnLaunchWorld${worldNum}`);

      if (!nodeEl || !badgeEl || !btnEl) continue;

      const isUnlocked = i <= this.unlockedLevelIndex;
      if (isUnlocked) {
        nodeEl.classList.remove('locked');
        nodeEl.classList.add('active');
        badgeEl.className = 'badge-status unlocked';
        badgeEl.textContent = Localization.get('unlockedBadge');
        btnEl.classList.remove('hidden');
      } else {
        nodeEl.classList.remove('active');
        nodeEl.classList.add('locked');
        badgeEl.className = 'badge-status locked';
        badgeEl.textContent = Localization.get('lockedBadge');
        btnEl.classList.add('hidden');
      }
    }
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

    const lang = Localization.currentLang;
    let label = '🇮🇳 हिंदी';
    if (lang === 'hi') label = '🇮🇳 नागपुरी';
    else if (lang === 'nag') label = '🇬🇧 EN';

    document.getElementById('langToggle').textContent = label;
    document.getElementById('lobbyLangToggle').textContent = label;
    this.hudWorld.textContent = Localization.get(this.level.regionKey) || this.level.name;

    const isVoice = this.voice ? this.voice.enabled : true;
    const lobbyVoice = document.getElementById('lobbyVoiceToggle');
    if (lobbyVoice) lobbyVoice.textContent = isVoice ? Localization.get('voiceOn') : Localization.get('voiceOff');
  }

  startLevelTransition(levelIndex = null) {
    if (levelIndex !== null) {
      this.currentLevelIndex = levelIndex;
    }
    this.level = this.levels[this.currentLevelIndex];

    // 1. Hide Lobby
    document.getElementById('lobbyScreen').classList.add('hidden');

    // 2. Show Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBarFill');
    const loadingRegionTitle = document.getElementById('loadingRegionTitle');
    const tipText = document.getElementById('loadingTipText');

    loadingRegionTitle.textContent = Localization.get(this.level.regionKey) || this.level.name;

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
      progress += 25;
      loadingBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          this.beginGameplay();
        }, 250);
      }
    }, 150);
  }

  beginGameplay() {
    this.appState = 'gameplay';
    this.restartGame();

    // Show HUD & hint
    this.hudEl.classList.remove('hidden');
    this.controlsHint.classList.remove('hidden');

    // Update Title Card for the current world
    const tc = document.getElementById('titleCardOverlay');
    const tcTitle = document.getElementById('tcTitle');
    const tcSubtitle = document.getElementById('tcSubtitle');

    tcTitle.textContent = Localization.get(this.level.regionKey);
    tcSubtitle.textContent = this.level.name;

    tc.classList.remove('hidden');
    this.audio.playTitleCardWhoosh();

    // Spoken entrance voice greeting in the selected language
    setTimeout(() => {
      this.voice.speak(Localization.get('startVoice'), 'mentor', Localization.currentLang);
    }, 600);

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
    this.renderer.update(dt);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.renderer.drawParallaxBackground(this.ctx, 200, 0, 'ranchi');

    // Bonfire ledge
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
    this.previewCtx.scale(1.8, 1.8);
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
    this.particles.update(dt, this.level.theme);

    // Update moving platform coordinates before collisions
    Physics.updatePlatforms(this.level.platforms, this.gameTime);

    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
    }

    const prevHealth = this.player.health;

    // Player Update with wind force parameter
    this.player.update(
      this.input,
      this.level.platforms,
      dt,
      this.audio,
      this.camera,
      this.particles,
      this.level.windForce || 0
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

        if (s.isRare) {
          this.voice.speak(Localization.get('shardVoice'), 'player', Localization.currentLang);
        }

        this.hudShards.classList.add('pulse-shard');
        setTimeout(() => this.hudShards.classList.remove('pulse-shard'), 200);
      });
    }

    // Checkpoints
    for (const cp of this.checkpoints) {
      cp.update(dt, this.player, this.audio, this.particles, () => {
        this.activeCheckpoint = { x: cp.x, y: cp.y - 20 };
        this.showBanner(Localization.get('checkpoint'));
        this.voice.speak(Localization.get('checkpointVoice'), 'mentor', Localization.currentLang);
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
    // Unlock next region in progress
    if (this.currentLevelIndex + 1 > this.unlockedLevelIndex) {
      this.unlockedLevelIndex = Math.min(this.levels.length - 1, this.currentLevelIndex + 1);
      try {
        localStorage.setItem('rrr_unlocked_level', this.unlockedLevelIndex.toString());
      } catch (e) {
        // Safe localStorage fallback
      }
      this.updateWorldMapUI();
    }

    // Spoken regional victory callout
    this.voice.speak(Localization.get('victoryVoice'), 'mentor', Localization.currentLang);

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

      // Update Next Level button label
      const nextBtn = document.getElementById('nextLevelBtn');
      if (this.currentLevelIndex >= this.levels.length - 1) {
        nextBtn.textContent = 'Grand Triumph — Replay World 1 ▶';
      } else {
        nextBtn.textContent = Localization.get('nextLevelBtn');
      }

      document.getElementById('victoryModal').classList.remove('hidden');
    }, 600);
  }

  updateHUD() {
    this.hudShards.textContent = `💎 ${this.shardsCollected}/${this.totalShards}`;
    this.hudTime.textContent = `⏱️ ${this.gameTime.toFixed(0)}s`;
    this.hudScore.textContent = `⭐ ${this.score}`;
    this.hudWorld.textContent = Localization.get(this.level.regionKey) || this.level.name;

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

    // 1. Dynamic Parallax Background according to World Theme
    this.renderer.drawParallaxBackground(this.ctx, camX, camY, this.level.theme);

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

    // 8. Ambient Weather Particle Overlay (Rain streaks, mountain wind drift, water spray)
    this.particles.drawAmbientWeather(this.ctx, this.level.theme);

    // 9. World Banner Notification
    if (this.bannerTimer > 0) {
      this.ctx.save();
      const alpha = Math.min(1.0, this.bannerTimer * 2);
      this.ctx.fillStyle = `rgba(33, 33, 33, ${0.85 * alpha})`;
      this.ctx.fillRect(this.width / 2 - 220, 70, 440, 36);
      this.ctx.strokeStyle = `rgba(255, 179, 0, ${alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.width / 2 - 220, 70, 440, 36);

      this.ctx.fillStyle = `rgba(255, 235, 59, ${alpha})`;
      this.ctx.font = 'bold 15px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.bannerMessage, this.width / 2, 94);
      this.ctx.restore();
    }

    // 10. Cinematic Dialogue Overlay
    this.dialogue.draw(this.ctx, this.width, this.height);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
