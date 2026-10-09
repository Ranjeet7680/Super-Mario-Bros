/**
 * World Entities Architecture
 * Echo Shards, Checkpoint Lanterns, Spring Flowers, NPC Elder, Lore Tablets, and Goal Gateway.
 * Adheres to Section 4, 7, 21 of both Game Architecture Documents.
 */

import { Physics } from '../engine/Physics.js';

export class EchoShard {
  constructor(x, y, id, isRare = false) {
    this.x = x;
    this.y = y;
    this.width = 22;
    this.height = 28;
    this.id = id;
    this.isRare = isRare;
    this.collected = false;
    this.animTime = Math.random() * 5;
    this.collectAnim = 0;
  }

  update(dt, player, audio, particles, onCollect) {
    if (this.collected) {
      this.collectAnim += dt;
      return;
    }

    this.animTime += dt;

    // Check collision with player
    const hoverY = this.y + Math.sin(this.animTime * 4.5) * 6;
    const box = { x: this.x, y: hoverY, width: this.width, height: this.height };

    if (!player.isDead && Physics.checkAABB(player, box)) {
      this.collected = true;
      if (audio) audio.playShard(this.id);
      if (particles) {
        particles.spawnBurst(this.x + this.width / 2, this.y + this.height / 2, this.isRare ? '#FFD700' : '#00E5FF', 16);
        particles.spawnTextPopup(this.x + this.width / 2, this.y, this.isRare ? '+500 Echo' : '+100 Echo');
      }
      if (onCollect) onCollect(this);
    }
  }

  draw(ctx) {
    if (this.collected && this.collectAnim > 0.3) return;

    ctx.save();
    const hoverY = this.y + Math.sin(this.animTime * 4.5) * 6;
    ctx.translate(this.x + this.width / 2, hoverY + this.height / 2);

    if (this.collected) {
      const scale = 1.0 + this.collectAnim * 3;
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.max(0, 1.0 - this.collectAnim * 3.3);
    }

    // Outer Aura Glow
    const pulse = 0.8 + Math.sin(this.animTime * 6) * 0.2;
    ctx.fillStyle = this.isRare ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 229, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 16 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Echo Diamond Geometry
    ctx.fillStyle = this.isRare ? '#FFEA00' : '#80D8FF';
    ctx.strokeStyle = this.isRare ? '#FF6F00' : '#0091EA';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(9, 0);
    ctx.lineTo(0, 12);
    ctx.lineTo(-9, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 7);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export class CheckpointLantern {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 60;
    this.id = id;
    this.activated = false;
    this.flameScale = 0;
    this.animTime = 0;
  }

  update(dt, player, audio, particles, onActivate) {
    this.animTime += dt;

    if (!this.activated && !player.isDead) {
      const box = { x: this.x - 20, y: this.y, width: this.width + 40, height: this.height };
      if (Physics.checkAABB(player, box)) {
        this.activated = true;
        if (audio) audio.playCheckpoint();
        if (particles) {
          particles.spawnBurst(this.x + this.width / 2, this.y + 18, '#FF9100', 20);
        }
        if (onActivate) onActivate(this);
      }
    }

    if (this.activated && this.flameScale < 1.0) {
      this.flameScale = Math.min(1.0, this.flameScale + dt * 3);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    // Stone Pillar Base
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(-10, -12, 20, 12);
    ctx.fillStyle = '#795548';
    ctx.fillRect(-7, -40, 14, 28);

    // Hanging Festive Banner (Jharkhand Saffron / Red)
    const bannerWave = Math.sin(this.animTime * 3) * 3;
    ctx.fillStyle = '#FF3D00';
    ctx.beginPath();
    ctx.moveTo(-7, -35);
    ctx.lineTo(-14 + bannerWave, -22);
    ctx.lineTo(-7, -25);
    ctx.closePath();
    ctx.fill();

    // Brass Lantern Cage
    ctx.fillStyle = '#FFA000';
    ctx.fillRect(-9, -54, 18, 14);
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(-11, -56, 22, 3); // Roof

    // Flame (if activated)
    if (this.activated) {
      const flicker = 0.8 + Math.sin(this.animTime * 14) * 0.2;
      ctx.fillStyle = 'rgba(255, 145, 0, 0.35)';
      ctx.beginPath();
      ctx.arc(0, -47, 18 * this.flameScale * flicker, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFD600';
      ctx.beginPath();
      ctx.arc(0, -47, 7 * this.flameScale * flicker, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export class SpringFlower {
  constructor(x, y, isTemporary = false) {
    this.x = x;
    this.y = y;
    this.width = 38;
    this.height = 28;
    this.bounceTimer = 0;
    this.isTemporary = isTemporary;
    this.lifetime = isTemporary ? 14.0 : Infinity;
    this.glowTime = Math.random() * Math.PI * 2;
  }

  update(dt, player, audio, particles, input = null, camera = null) {
    this.glowTime += dt;
    if (this.bounceTimer > 0) {
      this.bounceTimer -= dt;
    }
    if (this.isTemporary) {
      this.lifetime -= dt;
    }

    if (!player.isDead && Physics.checkAABB(player, this)) {
      if (player.vy >= -60) { // Coming down or landing on spring
        const isHoldingJump = Boolean(
          (input && input.actions && (input.actions.jump || input.actions.jumpDown)) ||
          player.jumpBufferTimer > 0
        );
        const isFastFalling = Boolean(input && input.actions && input.actions.down);

        if (isHoldingJump || isFastFalling) {
          // --- HIGH JUMP / SUPER SPRING ABILITY ---
          const launchVy = isFastFalling ? -1180 : -1060;
          player.vy = launchVy;
          player.isGrounded = false;
          player.canDash = true; // Air dash reset for aerial maneuvers
          player.scaleX = 0.42;
          player.scaleY = 1.78;
          player.highJumpTrailTimer = 0.9;
          this.bounceTimer = 0.45;

          if (audio) {
            if (audio.playSpring) audio.playSpring(true);
            else if (audio.playJump) audio.playJump();
          }
          if (camera) camera.addShake(isFastFalling ? 6.0 : 4.0);
          if (input && input.vibrate) input.vibrate(200, 0.7, 1.0);

          if (particles) {
            particles.spawnBurst(this.x + this.width / 2, this.y + 10, '#FFD700', 22);
            particles.spawnBurst(this.x + this.width / 2, this.y + 6, '#00E5FF', 14);
            particles.spawnBurst(this.x + this.width / 2, this.y + 14, '#FF4081', 12);
            const label = isFastFalling ? 'MEGA BOUNCE! ⚡' : 'HIGH JUMP! 🚀';
            particles.spawnTextPopup(this.x + this.width / 2, this.y - 18, label, '#FFD700');
          }
        } else {
          // --- REGULAR SPRING BOUNCE ---
          player.vy = -780;
          player.isGrounded = false;
          player.canDash = true;
          player.scaleX = 0.55;
          player.scaleY = 1.5;
          this.bounceTimer = 0.3;

          if (audio) {
            if (audio.playSpring) audio.playSpring(false);
            else if (audio.playJump) audio.playJump();
          }
          if (input && input.vibrate) input.vibrate(80, 0.3, 0.4);

          if (particles) {
            particles.spawnBurst(this.x + this.width / 2, this.y + 10, '#FF4081', 14);
            particles.spawnBurst(this.x + this.width / 2, this.y + 6, '#FFEB3B', 8);
            particles.spawnTextPopup(this.x + this.width / 2, this.y - 12, 'BOUNCE! 🌸', '#FF4081');
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    // Fade effect for temporary spawned player jump pad
    if (this.isTemporary && this.lifetime < 3.0) {
      ctx.globalAlpha = Math.max(0.2, (this.lifetime / 3.0) * (0.6 + Math.sin(this.glowTime * 12) * 0.4));
    }

    const squish = this.bounceTimer > 0 ? 0.42 : 1.0;
    ctx.scale(1.0 + (1 - squish) * 0.45, squish);

    // 1. Spring Coiled Base (Mechanical / Botanical hybrid)
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(6, -7);
    ctx.lineTo(-6, -11);
    ctx.lineTo(6, -14);
    ctx.stroke();

    // 2. Botanical Leaf Platform
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.ellipse(-10, -8, 8, 4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(10, -8, 8, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. High Jump Energy Halo (Subtle pulse showing High Jump capability)
    const haloGlow = 0.22 + Math.sin(this.glowTime * 4) * 0.14;
    ctx.fillStyle = `rgba(255, 215, 0, ${haloGlow})`;
    ctx.beginPath();
    ctx.ellipse(0, -20, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Petals (Vibrant Lotus / Palas flower pink-red with golden rim)
    ctx.fillStyle = this.isTemporary ? '#9C27B0' : '#E91E63';
    ctx.beginPath();
    ctx.ellipse(0, -20, 18, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Petal Highlights
    ctx.fillStyle = this.isTemporary ? '#CE93D8' : '#F48FB1';
    ctx.beginPath();
    ctx.ellipse(0, -21, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Spring Pollen / Jump Pad Core
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(0, -20, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Energy Pip
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Upward High Jump chevron arrow hint on pad
    ctx.strokeStyle = 'rgba(230, 81, 0, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -18);
    ctx.lineTo(0, -23);
    ctx.lineTo(4, -18);
    ctx.stroke();

    ctx.restore();
  }
}

export class NpcElder {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 50;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
  }

  draw(ctx, player) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    const breathe = Math.sin(this.animTime * 3) * 1.5;

    // Shawl & Robe (White & Ochre traditional Kurta/Dhoti)
    ctx.fillStyle = '#ECEFF1';
    ctx.fillRect(-12, -36, 24, 36);

    // Saffron Shawl
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.moveTo(-12, -36);
    ctx.lineTo(12, -36);
    ctx.lineTo(8, -12);
    ctx.lineTo(-8, -12);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.arc(0, -42 + breathe * 0.5, 9, 0, Math.PI * 2);
    ctx.fill();

    // Silver beard & hair
    ctx.fillStyle = '#CFD8DC';
    ctx.beginPath();
    ctx.arc(0, -44 + breathe * 0.5, 9, Math.PI, 0);
    ctx.fill();
    // Beard
    ctx.beginPath();
    ctx.moveTo(-6, -40);
    ctx.lineTo(0, -30);
    ctx.lineTo(6, -40);
    ctx.closePath();
    ctx.fill();

    // Wooden Walking Staff
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(14, -50);
    ctx.stroke();

    // Proximity indicator
    const dist = Math.abs(player.x - this.x);
    if (dist < 85 && !player.isDead) {
      const bob = Math.sin(this.animTime * 6) * 4;
      ctx.fillStyle = '#FFD54F';
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const promptLabel = isTouch ? '🗣️ TALK' : '[E] TALK';
      const promptW = isTouch ? 58 : 48;
      ctx.beginPath();
      ctx.roundRect(-promptW / 2, -76 + bob, promptW, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#212121';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(promptLabel, 0, -62 + bob);
    }

    ctx.restore();
  }
}

export class LoreTablet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 48;
    this.read = false;
  }

  update(player, onRead) {
    if (this.read) return;
    const box = { x: this.x - 15, y: this.y, width: this.width + 30, height: this.height };
    if (!player.isDead && Physics.checkAABB(player, box)) {
      this.read = true;
      if (onRead) onRead();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    // Stone stele
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-18, -46, 36, 46);

    // Ancient Sohrai painted motifs (Geometric animals/plants)
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 2;
    ctx.strokeRect(-14, -42, 28, 38);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -28, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export class GoalGateway {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 110;
    this.reached = false;
    this.animTime = 0;
  }

  update(dt, player, audio, onGoal) {
    this.animTime += dt;
    if (this.reached) return;

    const box = { x: this.x + 20, y: this.y, width: this.width - 40, height: this.height };
    if (!player.isDead && Physics.checkAABB(player, box)) {
      this.reached = true;
      if (audio) audio.playVictory();
      if (onGoal) onGoal();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    // Stone Torana Pillars (Jharkhand Heritage Architecture)
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(-36, -100, 16, 100);
    ctx.fillRect(20, -100, 16, 100);

    // Arch Beam
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(-44, -112, 88, 16);
    ctx.fillStyle = '#FF9800';
    ctx.fillRect(-40, -118, 80, 8); // Golden ornamental lintel

    // Gateway Energy Portal (Shimmering blue/gold Rift restoration field)
    const pulse = 0.5 + Math.sin(this.animTime * 4) * 0.15;
    const gradient = ctx.createLinearGradient(0, -96, 0, 0);
    gradient.addColorStop(0, `rgba(0, 229, 255, ${pulse})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(-20, -96, 40, 96);

    ctx.restore();
  }
}

/**
 * Sacred Jharkhand Temple Shrine (झारखंड के पवित्र मंदिर)
 * Implements iconic Jharkhand temple landmarks:
 * - Baba Baidyanath Dham (Deoghar): Golden Panchshul, red pataka flag, sanctum Jyotirlinga
 * - Pahari Mandir & Jagannath Temple (Ranchi): Sandstone hilltop spire & Sudarshana Chakra
 * - Rajrappa Chhinnamasta Mandir (Ramgarh / Damodar): Ancient Shakti Peeth at river confluence
 * - Maluti Terracotta Temples (Dumka): Characteristic terracotta Char-Chala curved roof
 * - Dewri Mandir (Tamar, Ranchi): 700-year-old ancient carved stone shrine
 * 
 * Mechanics: Ringing bronze temple bell, restoring health (+1 Heart), golden aura, and +500 points.
 */
export class TempleShrine {
  constructor(x, y, templeType = 'baidyanath', name = 'Baba Baidyanath Dham', deity = 'Shiva Jyotirlinga') {
    this.x = x;
    this.y = y;
    this.templeType = templeType; // 'baidyanath' | 'jagannath' | 'rajrappa' | 'maluti' | 'dewri'
    this.name = name;
    this.deity = deity;
    this.width = 84;
    this.height = 120;
    this.blessed = false;
    this.animTime = 0;
    this.bellRinging = 0;
    this.bellAngle = 0;
    this.diyaFlicker = 0;
  }

  ring(audio, particles, player) {
    if (this.bellRinging > 0.15) return false;
    this.bellRinging = 1.6;

    const pitchMap = {
      baidyanath: 0.95,
      jagannath: 1.05,
      rajrappa: 1.20,
      maluti: 1.0,
      dewri: 1.12
    };
    if (audio && audio.playTempleBell) {
      audio.playTempleBell(pitchMap[this.templeType] || 1.0);
    }

    const firstTime = !this.blessed;
    if (firstTime) {
      this.blessed = true;
      if (player) {
        player.health = Math.min(player.maxHealth, player.health + 1);
        player.invulnerableTimer = 2.4; // Golden Ashirwad aura
      }
      if (particles) {
        // Auspicious burst of sacred marigold & saffron petals
        for (let i = 0; i < 24; i++) {
          particles.spawnBurst(this.x + this.width / 2, this.y + 40, i % 2 === 0 ? '#FFD54F' : '#E65100', 1);
        }
        particles.spawnTextPopup(this.x + this.width / 2, this.y - 20, '🕉️ BLESSED! +500 ⭐', '#FFD54F');
      }
    } else {
      if (particles) {
        particles.spawnBurst(this.x + this.width / 2, this.y + 40, '#FFE082', 6);
        particles.spawnTextPopup(this.x + this.width / 2, this.y - 10, '🔔 DING!', '#FFE082');
      }
    }
    return firstTime;
  }

  update(dt, player, input, audio, particles, onBlessing) {
    this.animTime += dt;
    this.diyaFlicker = Math.sin(this.animTime * 12) * 0.2 + Math.cos(this.animTime * 7) * 0.1;

    if (this.bellRinging > 0) {
      this.bellRinging -= dt;
      this.bellAngle = Math.sin(this.bellRinging * 16) * (this.bellRinging / 1.6) * 0.45;
    } else {
      this.bellAngle = 0;
    }

    if (!player || player.isDead) return;

    // Interactive proximity area
    const box = { x: this.x - 24, y: this.y - 16, width: this.width + 48, height: this.height + 24 };
    if (Physics.checkAABB(player, box)) {
      const nearBell = Math.abs(player.x + player.width / 2 - (this.x + this.width / 2)) < 36;
      if (input && (input.actions.interactDown || (input.actions.jumpDown && player.y < this.y + 50 && nearBell))) {
        const first = this.ring(audio, particles, player);
        if (first && onBlessing) {
          onBlessing(this);
        }
      }
    }
  }

  draw(ctx, player) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    const bob = Math.sin(this.animTime * 3) * 2;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // 1. Plinth / Stepped Platform
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-44, -14, 88, 14);
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(-38, -22, 76, 8);

    // 2. Pillars & Mandapa
    ctx.fillStyle = this.templeType === 'maluti' ? '#B71C1C' : (this.templeType === 'rajrappa' ? '#880E4F' : '#8D6E63');
    ctx.fillRect(-32, -88, 12, 66);
    ctx.fillRect(20, -88, 12, 66);

    // 3. Inner Sanctum Glow (Garbhagriha with Shiva Lingam / Deity)
    const sanctumGrad = ctx.createRadialGradient(0, -50, 4, 0, -50, 26);
    sanctumGrad.addColorStop(0, 'rgba(255, 214, 0, 0.9)');
    sanctumGrad.addColorStop(0.6, 'rgba(230, 81, 0, 0.5)');
    sanctumGrad.addColorStop(1, 'rgba(40, 20, 10, 0)');
    ctx.fillStyle = sanctumGrad;
    ctx.fillRect(-22, -84, 44, 62);

    // Sanctum Murti / Lingam
    ctx.fillStyle = '#1B1B1B';
    ctx.beginPath();
    ctx.roundRect(-7, -42, 14, 20, 4);
    ctx.fill();
    // Auspicious sacred tilak on lingam
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(-5, -36, 10, 2);
    ctx.fillStyle = '#E53935';
    ctx.fillRect(-2, -35, 4, 3);

    // 4. Temple Shikhara Spire
    ctx.fillStyle = this.templeType === 'maluti' ? '#C62828' : (this.templeType === 'rajrappa' ? '#AD1457' : (this.templeType === 'baidyanath' ? '#A1887F' : '#8D6E63'));
    ctx.beginPath();
    if (this.templeType === 'maluti') {
      // Characteristic Bengal-Chota Nagpur curved Char-Chala roof
      ctx.moveTo(-38, -88);
      ctx.quadraticCurveTo(-18, -125, 0, -128);
      ctx.quadraticCurveTo(18, -125, 38, -88);
      ctx.closePath();
    } else {
      // Traditional Nagara Shikhara spire
      ctx.moveTo(-36, -88);
      ctx.lineTo(-24, -125);
      ctx.lineTo(0, -138);
      ctx.lineTo(24, -125);
      ctx.lineTo(36, -88);
      ctx.closePath();
    }
    ctx.fill();

    // Spire horizontal stone ribs (Amalaka tiers)
    ctx.strokeStyle = '#FFE082';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 5. Crown Finial
    const topY = this.templeType === 'maluti' ? -128 : -138;
    // Golden Kalash
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(0, topY - 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Distinctive sacred finials
    if (this.templeType === 'baidyanath') {
      // Famous Baba Baidyanath PANCHSHUL (Five-pronged sacred brass trident)
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Center spear
      ctx.moveTo(0, topY - 6);
      ctx.lineTo(0, topY - 26);
      // Prongs
      ctx.moveTo(-7, topY - 20); ctx.lineTo(-7, topY - 14);
      ctx.moveTo(-14, topY - 16); ctx.lineTo(-14, topY - 12);
      ctx.moveTo(7, topY - 20); ctx.lineTo(7, topY - 14);
      ctx.moveTo(14, topY - 16); ctx.lineTo(14, topY - 12);
      ctx.stroke();

      // Red temple flag (Pataka) fluttering
      ctx.fillStyle = '#D50000';
      ctx.beginPath();
      ctx.moveTo(0, topY - 24);
      ctx.lineTo(16 + Math.sin(this.animTime * 6) * 3, topY - 20);
      ctx.lineTo(0, topY - 16);
      ctx.closePath();
      ctx.fill();
    } else if (this.templeType === 'jagannath') {
      // Sudarshana Chakra wheel
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, topY - 16, 7, 0, Math.PI * 2);
      ctx.stroke();
      // Saffron flag
      ctx.fillStyle = '#FF6F00';
      ctx.beginPath();
      ctx.moveTo(0, topY - 22);
      ctx.lineTo(18 + Math.sin(this.animTime * 6) * 3, topY - 18);
      ctx.lineTo(0, topY - 14);
      ctx.closePath();
      ctx.fill();
    } else {
      // Sacred Trishul (Trident)
      ctx.strokeStyle = '#FFD54F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, topY - 6);
      ctx.lineTo(0, topY - 22);
      ctx.moveTo(-8, topY - 18);
      ctx.lineTo(0, topY - 12);
      ctx.lineTo(8, topY - 18);
      ctx.stroke();

      // Sacred vermilion flag
      ctx.fillStyle = '#E65100';
      ctx.beginPath();
      ctx.moveTo(0, topY - 20);
      ctx.lineTo(16 + Math.sin(this.animTime * 6) * 3, topY - 16);
      ctx.lineTo(0, topY - 12);
      ctx.closePath();
      ctx.fill();
    }

    // 6. Suspended Bronze Temple Bell (Ghanta) with Swaying Physics
    ctx.save();
    ctx.translate(0, -82);
    ctx.rotate(this.bellAngle);
    // Cord
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(0, 4);
    ctx.stroke();
    // Bronze bell body
    ctx.fillStyle = '#FFB300';
    ctx.strokeStyle = '#FFE082';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.quadraticCurveTo(-6, 4, 0, 4);
    ctx.quadraticCurveTo(6, 4, 8, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Bell clapper
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(0, 16, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Auspicious Diya Lamps (Ghee lamps flickering at pillars)
    [-30, 30].forEach(dx => {
      ctx.fillStyle = '#FF9800';
      ctx.fillRect(dx - 3, -22, 6, 3);
      // Flame with flicker
      const flameH = 6 + this.diyaFlicker * 3;
      ctx.fillStyle = '#FFF59D';
      ctx.beginPath();
      ctx.moveTo(dx, -22 - flameH);
      ctx.quadraticCurveTo(dx + 3, -22, dx, -22);
      ctx.quadraticCurveTo(dx - 3, -22, dx, -22 - flameH);
      ctx.fill();
    });

    // 8. Temple Name Plaque Banner
    ctx.fillStyle = 'rgba(26, 16, 20, 0.88)';
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-42, -6, 84, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFE082';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, 0, 6);

    // 9. Interactive Prompt when Kabir is near
    const dist = Math.abs(player.x + player.width / 2 - (this.x + this.width / 2));
    if (dist < 80 && !player.isDead) {
      const promptText = isTouch ? '🔔 TAP TO RING' : '[E] RING BELL';
      const promptW = isTouch ? 86 : 80;
      ctx.fillStyle = '#FFD54F';
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-promptW / 2, -156 + bob, promptW, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1A0A00';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(promptText, 0, -143 + bob);
    }

    ctx.restore();
  }
}
