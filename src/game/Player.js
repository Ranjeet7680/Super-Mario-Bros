/**
 * Player Controller & State Machine (Kabir — The Adventurer of Jharkhand)
 * Features: High-fidelity stylized procedural 2D rendering with contoured anatomy,
 * organic clothing folds, flowing silk scarf physics, expressive blinking eyes & facial acting,
 * idle acting states (breathing, curious exploration, adjusting satchel), dynamic sprint lean,
 * dash ghost afterimages, variable jump mechanics, squash & stretch, and authentic acoustic footsteps.
 * Adheres to RRR Architecture 20,000 FINAL & UI/Acting Blueprint.
 * Authors: RAJRANJEET7680
 */

import { Physics } from '../engine/Physics.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.width = 28;
    this.height = 46;

    // Movement Physics
    this.vx = 0;
    this.vy = 0;
    this.facing = 1; // 1 = right, -1 = left

    // Tuning Constants (pixels / second)
    this.groundAccel = 1350;
    this.groundFriction = 1500;
    this.airAccel = 950;
    this.airFriction = 500;
    this.maxSpeed = 230;
    this.gravity = 1100;
    this.maxFallSpeed = 550;
    this.fastFallGravity = 1900;

    // Jump Physics
    this.jumpForce = -380;
    this.jumpHoldBoost = -280;
    this.jumpHoldTimer = 0;
    this.maxJumpHoldTime = 0.18; // Variable jump window

    // Coyote Time & Jump Buffering (Fairness feel)
    this.coyoteTime = 0.12;
    this.coyoteTimer = 0;
    this.jumpBufferTime = 0.12;
    this.jumpBufferTimer = 0;

    // Dash Mechanic
    this.canDash = true;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashDuration = 0.18;
    this.dashCooldown = 0.6;
    this.dashCooldownTimer = 0;
    this.dashSpeed = 440;
    this.dashGhostTrail = [];

    // State & Health
    this.isGrounded = false;
    this.wasGrounded = false;
    this.state = 'idle'; // 'idle', 'walk', 'run', 'jumpRise', 'jumpFall', 'dash', 'hurt', 'victory'
    this.health = 3;
    this.maxHealth = 3;
    this.invulnerableTimer = 0;
    this.isDead = false;
    this.hasWon = false;

    // Animation visual parameters (Squash & Stretch & Acting)
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.animTime = 0;
    this.scarfWave = 0;
    this.idleActTimer = 0;
    this.idleActState = 'breathe'; // 'breathe', 'lookAround', 'adjustGear'
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.stepTimer = 0;
    this.stepLeftFoot = true;
    this.sparkleTimer = 0;

    // Outfit Customization (from Character Architecture)
    this.outfit = 'classic'; // 'classic', 'sohrai', 'night'

    // Surface info
    this.currentSurface = 'ground';
  }

  resetToCheckpoint(checkpointX, checkpointY) {
    this.x = checkpointX;
    this.y = checkpointY;
    this.vx = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.isDead = false;
    this.invulnerableTimer = 1.0;
    this.state = 'idle';
    this.idleActTimer = 0;
    this.idleActState = 'breathe';
    this.dashGhostTrail = [];
  }

  takeDamage(amount = 1, audio = null, camera = null) {
    if (this.invulnerableTimer > 0 || this.isDead || this.hasWon) return false;

    this.health -= amount;
    this.invulnerableTimer = 1.4; // 1.4s of i-frames
    this.vy = -260;
    this.vx = -this.facing * 180;
    this.state = 'hurt';

    if (audio) audio.playHurt();
    if (camera) camera.addShake(8.0);

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
    }
    return true;
  }

  update(input, platforms, dt, audio = null, camera = null, particles = null, windForce = 0) {
    if (this.hasWon) {
      this.vx = 0;
      this.vy = 0;
      this.state = 'victory';
      this.animTime += dt;
      this.scarfWave += dt * 6;
      return;
    }

    this.animTime += dt;
    this.scarfWave += dt * 8;

    // Eye blinking timer
    this.blinkTimer += dt;
    if (this.blinkTimer > 3.2) {
      this.isBlinking = true;
      if (this.blinkTimer > 3.36) {
        this.isBlinking = false;
        this.blinkTimer = (Math.sin(this.animTime) * 0.5);
      }
    } else {
      this.isBlinking = false;
    }

    // Invulnerability decay
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Dash cooldown decay
    if (this.dashCooldownTimer > 0) {
      this.dashCooldownTimer -= dt;
    }

    // Coyote timer
    if (this.isGrounded) {
      this.coyoteTimer = this.coyoteTime;
      this.canDash = true;
    } else {
      this.coyoteTimer -= dt;
    }

    // Jump buffer timer
    if (input && input.actions && input.actions.jumpDown) {
      this.jumpBufferTimer = this.jumpBufferTime;
    } else {
      this.jumpBufferTimer -= dt;
    }

    // Handle Dash action
    if (input && input.actions && input.actions.dashDown && this.canDash && this.dashCooldownTimer <= 0 && !this.isDashing) {
      this.isDashing = true;
      this.dashTimer = this.dashDuration;
      this.dashCooldownTimer = this.dashCooldown;
      this.canDash = false;
      this.vx = this.facing * this.dashSpeed;
      this.vy = 0;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, this.dashDuration);
      if (audio) audio.playDash();
      if (camera) camera.addShake(3.0);
      if (input && input.vibrate) input.vibrate(120, 0.4, 0.7);
      if (particles) {
        particles.spawnDashTrail(this.x + this.width / 2, this.y + this.height / 2, this.facing);
      }
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      this.vy = 0; // Maintain level flight while dashing
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
      this.state = 'dash';

      // Ghost trail capture
      this.dashGhostTrail.push({
        x: this.x,
        y: this.y,
        facing: this.facing,
        alpha: 0.55
      });
    } else {
      // Horizontal Movement
      const moveInput = input && input.actions ? (input.actions.right ? 1 : 0) - (input.actions.left ? 1 : 0) : 0;
      const accel = this.isGrounded ? this.groundAccel : this.airAccel;
      const friction = this.isGrounded ? this.groundFriction : this.airFriction;

      if (moveInput !== 0) {
        // Skid dust on sharp turnaround
        if (this.isGrounded && Math.sign(moveInput) !== Math.sign(this.vx) && Math.abs(this.vx) > 110) {
          if (particles) particles.spawnDust(this.x + this.width / 2, this.y + this.height);
        }
        this.facing = moveInput;
        this.vx += moveInput * accel * dt;
        if (Math.abs(this.vx) > this.maxSpeed) {
          this.vx = Math.sign(this.vx) * this.maxSpeed;
        }
      } else {
        // Apply friction deceleration
        if (Math.abs(this.vx) > friction * dt) {
          this.vx -= Math.sign(this.vx) * friction * dt;
        } else {
          this.vx = 0;
        }
      }

      // Wind force effect (highland breezes)
      if (windForce) {
        this.vx += windForce * (this.isGrounded ? 0.4 : 1.0) * dt;
      }

      // Jump Execution (Buffer + Coyote)
      if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
        this.vy = this.jumpForce;
        this.jumpHoldTimer = this.maxJumpHoldTime;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.isGrounded = false;
        this.scaleX = 0.72; // Squash launch
        this.scaleY = 1.32;
        if (audio) audio.playJump();
        if (input && input.vibrate) input.vibrate(40, 0.2, 0.3);
        if (particles) {
          if (this.currentSurface === 'water') {
            particles.spawnBurst(this.x + this.width / 2, this.y + this.height, '#E0F7FA', 10);
            particles.spawnBurst(this.x + this.width / 2, this.y + this.height - 4, '#00E5FF', 6);
          } else {
            particles.spawnDust(this.x + this.width / 2, this.y + this.height);
          }
        }
      }

      // Variable jump height
      if (input && input.actions && input.actions.jump && this.jumpHoldTimer > 0) {
        this.jumpHoldTimer -= dt;
        this.vy += this.jumpHoldBoost * dt;
      } else {
        this.jumpHoldTimer = 0;
      }

      // Gravity & Fast Fall
      const isDown = input && input.actions && input.actions.down;
      const currentGravity = (isDown && this.vy > 0) ? this.fastFallGravity : this.gravity;
      this.vy += currentGravity * dt;
      if (this.vy > this.maxFallSpeed) {
        this.vy = this.maxFallSpeed;
      }
    }

    // Dash ghost decay
    if (this.dashGhostTrail.length > 0) {
      for (const g of this.dashGhostTrail) g.alpha -= dt * 3.8;
      this.dashGhostTrail = this.dashGhostTrail.filter(g => g.alpha > 0.05);
    }

    // Resolve platform collisions
    this.wasGrounded = this.isGrounded;
    Physics.resolvePlatformCollisions(this, platforms, dt);

    // Just landed detection (Squash & Sound)
    if (!this.wasGrounded && this.isGrounded) {
      this.scaleX = 1.32;
      this.scaleY = 0.72;
      if (audio) audio.playLand();
      if (particles) {
        if (this.currentSurface === 'water') {
          particles.spawnBurst(this.x + this.width / 2, this.y + this.height, '#E0F7FA', 14);
          particles.spawnBurst(this.x + this.width / 2, this.y + this.height - 4, '#00E5FF', 8);
        } else {
          particles.spawnDust(this.x + this.width / 2, this.y + this.height);
        }
      }
    }

    // Smooth squash/stretch return to 1.0
    this.scaleX += (1.0 - this.scaleX) * (14.0 * dt);
    this.scaleY += (1.0 - this.scaleY) * (14.0 * dt);

    // State machine calculation
    if (this.health <= 0) {
      this.state = 'death';
    } else if (this.isDashing) {
      this.state = 'dash';
    } else if (!this.isGrounded) {
      this.state = this.vy < 0 ? 'jumpRise' : 'jumpFall';
    } else if (Math.abs(this.vx) > 15) {
      this.state = Math.abs(this.vx) > 160 ? 'run' : 'walk';
    } else {
      this.state = 'idle';
    }

    // Footstep acoustic synchronization during ground motion
    if (this.isGrounded && (this.state === 'walk' || this.state === 'run')) {
      this.stepTimer += dt;
      const stepInterval = this.state === 'run' ? 0.22 : 0.35;
      if (this.stepTimer >= stepInterval) {
        this.stepTimer = 0;
        if (audio && audio.playFootstep) {
          audio.playFootstep(this.currentSurface || 'grass', this.stepLeftFoot);
        }
        this.stepLeftFoot = !this.stepLeftFoot;
      }
    } else {
      this.stepTimer = 0;
    }

    // Idle Acting System (Breathing -> Looking Around -> Gear Adjustment)
    if (this.state === 'idle') {
      this.idleActTimer += dt;
      if (this.idleActTimer < 4.0) {
        this.idleActState = 'breathe';
      } else if (this.idleActTimer < 7.2) {
        this.idleActState = 'lookAround';
      } else if (this.idleActTimer < 10.5) {
        this.idleActState = 'adjustGear';
      } else {
        this.idleActTimer = 0;
      }
    } else {
      this.idleActTimer = 0;
      this.idleActState = 'breathe';
    }
  }

  draw(ctx) {
    // 1. Draw Dash Ghost Afterimages (trailing silhouettes)
    if (this.dashGhostTrail.length > 0) {
      for (const ghost of this.dashGhostTrail) {
        ctx.save();
        ctx.translate(ghost.x + this.width / 2, ghost.y + this.height);
        ctx.scale(ghost.facing, 1);
        ctx.globalAlpha = ghost.alpha * 0.4;
        ctx.fillStyle = this.outfit === 'night' ? '#00E5FF' : '#FF9100';
        ctx.beginPath();
        ctx.ellipse(0, -this.height * 0.5, 12, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(this.facing * this.scaleX, this.scaleY);

    // Blinking effect during invulnerability i-frames
    if (this.invulnerableTimer > 0 && Math.floor(this.animTime * 18) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    const w = this.width;
    const h = this.height;
    const t = this.animTime;

    // Palette per outfit (Tribal Jharkhand & Royal Saffron Aesthetics)
    let skinTone = '#A16238';
    let skinShadow = '#7E421E';
    let skinHighlight = '#BD7B4E';
    let tunicColor = '#00796B'; // Deep peacock teal
    let tunicShadow = '#004D40';
    let tunicTrim = '#FFB300';  // Saffron gold embroidery
    let pantsColor = '#2E7D32'; // Forest olive
    let pantsShadow = '#1B5E20';
    let scarfColor = '#E65100'; // Pure saffron vermilion
    let scarfShadow = '#BF360C';
    let scarfTrim = '#FFD54F';  // Gold tassel fringe
    let leatherColor = '#4E342E'; // Sturdy leather satchel & boots
    let leatherHighlight = '#6D4C41';

    if (this.outfit === 'sohrai') {
      tunicColor = '#B71C1C';     // Sohrai earth terracotta red
      tunicShadow = '#7F0000';
      tunicTrim = '#FFF8E1';      // Natural white chalk pigment
      pantsColor = '#E65100';     // Ochre rust
      pantsShadow = '#BF360C';
      scarfColor = '#FFB300';     // Turmeric yellow
      scarfShadow = '#F57F17';
      scarfTrim = '#FFFFFF';
      leatherColor = '#3E2723';
    } else if (this.outfit === 'night') {
      tunicColor = '#1A237E';     // Midnight indigo
      tunicShadow = '#0D124D';
      tunicTrim = '#80D8FF';      // Moonlit silver/cyan
      pantsColor = '#37474F';     // Deep slate
      pantsShadow = '#212121';
      scarfColor = '#00E5FF';     // Luminescent rift cyan
      scarfShadow = '#0097A7';
      scarfTrim = '#E0F7FA';
      leatherColor = '#212121';
    }

    // 2. Soft Contact Ground Shadow (Squashes and fades when airborne)
    const groundShadowAlpha = this.isGrounded ? 0.35 : Math.max(0.08, 0.35 - Math.abs(this.vy) / 900);
    const groundShadowW = this.isGrounded ? w * 0.75 : w * 0.5;
    ctx.fillStyle = `rgba(18, 12, 10, ${groundShadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 1, groundShadowW, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dynamic Motion & Body Angles
    let torsoBob = 0;
    let forwardLean = 0;
    let legCycle = 0;
    let armCycle = 0;
    let headTilt = 0;
    let gazeX = 0;
    let gazeY = 0;

    if (this.state === 'idle') {
      // Natural organic breathing
      torsoBob = Math.sin(t * 3.0) * 1.2;
      headTilt = Math.sin(t * 1.5) * 0.04;

      if (this.idleActState === 'lookAround') {
        headTilt = Math.sin(t * 2.0) * 0.12;
        gazeX = Math.sin(t * 2.0) * 2.5;
        gazeY = -1;
      } else if (this.idleActState === 'adjustGear') {
        torsoBob = Math.sin(t * 5.0) * 0.8;
      }
    } else if (this.state === 'walk') {
      torsoBob = Math.abs(Math.sin(t * 10)) * 2.5;
      forwardLean = 0.08;
      legCycle = Math.sin(t * 10);
      armCycle = Math.sin(t * 10);
    } else if (this.state === 'run') {
      torsoBob = Math.abs(Math.sin(t * 16)) * 3.8;
      forwardLean = 0.22; // Aerodynamic sprint lean
      legCycle = Math.sin(t * 16);
      armCycle = Math.sin(t * 16);
      gazeX = 1.5;
    } else if (this.state === 'jumpRise') {
      torsoBob = -2;
      forwardLean = 0.06;
      gazeY = -2; // Looking up towards peak
    } else if (this.state === 'jumpFall') {
      torsoBob = 1;
      forwardLean = 0.04;
      gazeY = 1.5; // Looking down towards landing
    } else if (this.state === 'dash') {
      forwardLean = 0.42; // Low knife-edge dive
      torsoBob = -2;
    } else if (this.state === 'hurt') {
      forwardLean = -0.35; // Dramatic backward recoil
      torsoBob = -3;
    } else if (this.state === 'victory') {
      torsoBob = Math.sin(t * 8) * 3;
      forwardLean = 0;
      headTilt = -0.15; // Proud uplifted gaze
    }

    // 4. Background Arm (Left Arm behind torso)
    ctx.save();
    const bgArmX = -w * 0.1;
    const bgArmY = -h * 0.65 + torsoBob;
    ctx.translate(bgArmX, bgArmY);

    let bgArmAngle = -armCycle * 0.7;
    if (this.state === 'victory') bgArmAngle = -1.8; // Raised arm
    if (this.state === 'dash') bgArmAngle = 1.2;     // Swept back
    if (this.state === 'hurt') bgArmAngle = -1.2;

    ctx.rotate(bgArmAngle);
    // Upper arm
    ctx.fillStyle = tunicShadow;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 7, 12, 3);
    ctx.fill();
    // Forearm & wrist
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.roundRect(-3, 10, 6, 10, 2);
    ctx.fill();
    // Hand
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.arc(0, 21, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Backpack & Stitched Travel Satchel (behind body)
    ctx.save();
    ctx.translate(-w * 0.35, -h * 0.62 + torsoBob);
    ctx.rotate(forwardLean * 0.5);
    // Rolled traveler bedroll on top
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.roundRect(-4, -8, 12, 7, 3);
    ctx.fill();
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(-2, -8, 2, 7);
    ctx.fillRect(4, -8, 2, 7);

    // Satchel body
    ctx.fillStyle = leatherColor;
    ctx.beginPath();
    ctx.roundRect(-6, -1, 14, 18, 4);
    ctx.fill();
    // Satchel flap
    ctx.fillStyle = leatherHighlight;
    ctx.beginPath();
    ctx.roundRect(-6, -1, 14, 9, 3);
    ctx.fill();
    // Brass buckle
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-1, 6, 4, 3);
    ctx.restore();

    // 6. Articulated Legs & Sturdy Hiking Boots
    const hipY = -h * 0.38 + torsoBob;

    // --- Back Leg (Left Leg) ---
    ctx.save();
    ctx.translate(-w * 0.15, hipY);
    let backLegAngle = legCycle * 0.65;
    if (this.state === 'jumpRise') backLegAngle = 0.45;
    if (this.state === 'jumpFall') backLegAngle = -0.25;
    if (this.state === 'dash') backLegAngle = 0.8;
    ctx.rotate(backLegAngle);

    // Thigh
    ctx.fillStyle = pantsShadow;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8, 11, 3);
    ctx.fill();
    // Shin & Calf
    ctx.translate(0, 9);
    let backKneeAngle = Math.max(0, -legCycle * 0.5);
    if (this.state === 'jumpRise') backKneeAngle = 0.6;
    ctx.rotate(backKneeAngle);
    ctx.beginPath();
    ctx.roundRect(-3.5, 0, 7, 10, 2);
    ctx.fill();
    // Boot
    ctx.fillStyle = '#271406';
    ctx.beginPath();
    ctx.roundRect(-4, 8, 10, 6, 2);
    ctx.fill();
    ctx.restore();

    // --- Front Leg (Right Leg) ---
    ctx.save();
    ctx.translate(w * 0.1, hipY);
    let frontLegAngle = -legCycle * 0.65;
    if (this.state === 'jumpRise') frontLegAngle = -0.3;
    if (this.state === 'jumpFall') frontLegAngle = 0.35;
    if (this.state === 'dash') frontLegAngle = -0.5;
    ctx.rotate(frontLegAngle);

    // Thigh
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8.5, 11, 3);
    ctx.fill();
    // Shin & Calf
    ctx.translate(0, 9);
    let frontKneeAngle = Math.max(0, legCycle * 0.5);
    if (this.state === 'jumpFall') frontKneeAngle = 0.4;
    ctx.rotate(frontKneeAngle);
    ctx.beginPath();
    ctx.roundRect(-3.5, 0, 7.5, 10, 2);
    ctx.fill();

    // Hiking Boot (detailed leather & sole)
    ctx.fillStyle = leatherColor;
    ctx.beginPath();
    ctx.roundRect(-4.5, 8, 12, 6, 2); // Boot toe extends forward
    ctx.fill();
    // Boot sole
    ctx.fillStyle = '#1B0000';
    ctx.fillRect(-5, 13, 13, 2);
    // Brass laces accent
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(-2, 9, 3, 1.5);
    ctx.restore();

    // 7. Torso & Kurta Tunic
    ctx.save();
    ctx.translate(0, -h * 0.70 + torsoBob);
    ctx.rotate(forwardLean);

    // Kurta Body
    ctx.fillStyle = tunicColor;
    ctx.beginPath();
    // Tapered chest down to slightly flared tunic skirt hem
    ctx.moveTo(-w * 0.32, 0);
    ctx.lineTo(w * 0.32, 0);
    ctx.lineTo(w * 0.36, h * 0.34);
    ctx.quadraticCurveTo(0, h * 0.38, -w * 0.36, h * 0.34);
    ctx.closePath();
    ctx.fill();

    // Subtle side shadow on tunic
    ctx.fillStyle = tunicShadow;
    ctx.beginPath();
    ctx.moveTo(-w * 0.32, 0);
    ctx.lineTo(-w * 0.15, 0);
    ctx.lineTo(-w * 0.18, h * 0.35);
    ctx.lineTo(-w * 0.36, h * 0.34);
    ctx.closePath();
    ctx.fill();

    // Cross-chest leather baldric strap
    ctx.fillStyle = leatherColor;
    ctx.beginPath();
    ctx.moveTo(-w * 0.28, 2);
    ctx.lineTo(-w * 0.18, 0);
    ctx.lineTo(w * 0.30, h * 0.30);
    ctx.lineTo(w * 0.22, h * 0.33);
    ctx.closePath();
    ctx.fill();
    // Brass strap buckle
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(0, h * 0.14, 4, 4);

    // Embroidered Nehru placket & collar trim
    ctx.fillStyle = tunicTrim;
    ctx.fillRect(-1.5, 0, 3, h * 0.24);
    // Tiny gold buttons
    ctx.fillStyle = '#FFF8E1';
    ctx.fillRect(-1, 3, 2, 2);
    ctx.fillRect(-1, 8, 2, 2);
    ctx.fillRect(-1, 13, 2, 2);

    // Nehru Stand Collar
    ctx.fillStyle = tunicTrim;
    ctx.beginPath();
    ctx.roundRect(-w * 0.2, -4, w * 0.4, 4, 2);
    ctx.fill();

    ctx.restore(); // End torso

    // 8. Flowing Silk Scarf (Angavastram / Dupatta) Physics
    ctx.save();
    const scarfAnchorX = -w * 0.05;
    const scarfAnchorY = -h * 0.72 + torsoBob;
    ctx.translate(scarfAnchorX, scarfAnchorY);

    // Dynamic wave curves responding to velocity, wind and scarfWave
    const wave1 = Math.sin(this.scarfWave) * 6;
    const wave2 = Math.cos(this.scarfWave * 1.2) * 8;
    const speedTrail = Math.min(22, Math.abs(this.vx) * 0.08);

    ctx.fillStyle = scarfColor;
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    // Upper ribbon edge
    ctx.bezierCurveTo(
      -12 - speedTrail, -4 + wave1,
      -22 - speedTrail * 1.4, 4 + wave2,
      -36 - speedTrail * 1.8, -2 + wave1 * 1.2
    );
    // Ribbon tip end
    ctx.lineTo(-34 - speedTrail * 1.8, 6 + wave1 * 1.2);
    // Lower ribbon edge
    ctx.bezierCurveTo(
      -20 - speedTrail * 1.4, 12 + wave2,
      -10 - speedTrail, 4 + wave1,
      2, 4
    );
    ctx.closePath();
    ctx.fill();

    // Shadow fold in silk
    ctx.fillStyle = scarfShadow;
    ctx.beginPath();
    ctx.moveTo(-8 - speedTrail, 1);
    ctx.quadraticCurveTo(-20 - speedTrail * 1.3, 8 + wave2, -34 - speedTrail * 1.8, 4 + wave1 * 1.2);
    ctx.lineTo(-33 - speedTrail * 1.8, 6 + wave1 * 1.2);
    ctx.quadraticCurveTo(-18 - speedTrail * 1.3, 11 + wave2, -6 - speedTrail, 4);
    ctx.closePath();
    ctx.fill();

    // Gold Tassel Fringe on scarf tips
    ctx.fillStyle = scarfTrim;
    const tipX = -36 - speedTrail * 1.8;
    const tipY = -2 + wave1 * 1.2;
    ctx.fillRect(tipX - 3, tipY + 2, 3, 5);
    ctx.fillRect(tipX - 1, tipY + 4, 2, 4);

    ctx.restore(); // End scarf

    // 9. Head, Styled Hair & Expressive Face
    ctx.save();
    const headX = 0;
    const headY = -h * 0.83 + torsoBob;
    ctx.translate(headX, headY);
    ctx.rotate(forwardLean * 0.6 + headTilt);

    // Neck
    ctx.fillStyle = skinShadow;
    ctx.fillRect(-3.5, 6, 7, 6);

    // Head base (Jawline & cheeks)
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle jaw contour
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.arc(0, 6, 8, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(0, 5, 8, 0, Math.PI);
    ctx.fill();

    // Ear with traditional small gold stud earring
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(-10, 1, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-11, 2.5, 2, 2);

    // Expressive Eyes
    const eyeX = 3 + gazeX;
    const eyeY = -1 + gazeY;

    if (this.state === 'hurt') {
      // Pain grimace: closed eyes
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eyeX - 3, eyeY);
      ctx.lineTo(eyeX + 3, eyeY - 2);
      ctx.lineTo(eyeX + 8, eyeY);
      ctx.stroke();
    } else if (this.isBlinking) {
      // Natural blink curve
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eyeX - 1, eyeY + 1);
      ctx.quadraticCurveTo(eyeX + 3, eyeY + 3, eyeX + 7, eyeY + 1);
      ctx.stroke();
    } else {
      // Sclera (White eye background)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(eyeX + 3, eyeY, 4.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Deep Warm Amber Iris
      ctx.fillStyle = '#E65100';
      ctx.beginPath();
      ctx.arc(eyeX + 4, eyeY, 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Dark Pupil
      ctx.fillStyle = '#1A0C00';
      ctx.beginPath();
      ctx.arc(eyeX + 4.2, eyeY, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Catchlight Glint (Spark of life)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(eyeX + 4.8, eyeY - 1, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows (Dynamic expression based on state)
    ctx.strokeStyle = '#1E1E1E';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if (this.state === 'run' || this.state === 'dash') {
      // Determined furrow
      ctx.moveTo(eyeX - 1, eyeY - 4);
      ctx.lineTo(eyeX + 7, eyeY - 6);
    } else if (this.state === 'jumpRise') {
      // Alert raised brow
      ctx.moveTo(eyeX - 1, eyeY - 6);
      ctx.quadraticCurveTo(eyeX + 3, eyeY - 8, eyeX + 7, eyeY - 5);
    } else if (this.idleActState === 'lookAround') {
      // Curious inquisitive brow
      ctx.moveTo(eyeX - 1, eyeY - 6);
      ctx.lineTo(eyeX + 7, eyeY - 4);
    } else {
      // Relaxed friendly brow
      ctx.moveTo(eyeX - 1, eyeY - 4.5);
      ctx.quadraticCurveTo(eyeX + 3, eyeY - 5.5, eyeX + 7, eyeY - 4.5);
    }
    ctx.stroke();

    // Mouth Expression
    ctx.fillStyle = '#5D2E14';
    if (this.state === 'victory') {
      // Wide triumphant smile
      ctx.beginPath();
      ctx.arc(eyeX + 1, 6, 4, 0, Math.PI);
      ctx.fill();
      // Flash of teeth
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(eyeX - 1, 6, 4, 1.5);
    } else if (this.state === 'run' || this.state === 'dash') {
      // Determined breath line
      ctx.fillRect(eyeX, 6, 4, 1.5);
    } else {
      // Gentle confident smirk
      ctx.beginPath();
      ctx.arc(eyeX + 1, 5, 3, 0.1, Math.PI * 0.9);
      ctx.stroke();
    }

    // Styled Wavy Black Hair (Crown, Volume & Tufts)
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.arc(0, -3, 11.5, Math.PI, 0); // Top dome
    ctx.fill();

    // Bangs and styled front locks
    ctx.beginPath();
    ctx.moveTo(-11, -3);
    ctx.quadraticCurveTo(-6, -7, 0, -5);
    ctx.quadraticCurveTo(6, -8, 11, -3);
    ctx.quadraticCurveTo(5, -1, 0, -3);
    ctx.quadraticCurveTo(-6, -1, -11, -3);
    ctx.fill();

    // Back hair volume
    ctx.beginPath();
    ctx.arc(-6, 2, 7, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();

    // Saffron Headband (Pheta / Gamcha style with embroidery)
    ctx.fillStyle = scarfColor;
    ctx.beginPath();
    ctx.roundRect(-10.5, -6, 21, 5, 2);
    ctx.fill();

    // Headband golden embroidery diamond dots
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-6, -4.5, 2, 2);
    ctx.fillRect(-1, -4.5, 2, 2);
    ctx.fillRect(4, -4.5, 2, 2);

    // Trailing Headband Ribbons in the back
    const ribbonWave = Math.sin(t * 7) * 4;
    ctx.fillStyle = scarfColor;
    ctx.beginPath();
    ctx.moveTo(-10, -4);
    ctx.quadraticCurveTo(-16, -6 + ribbonWave, -22, -2 + ribbonWave);
    ctx.lineTo(-20, 1 + ribbonWave);
    ctx.quadraticCurveTo(-15, -2 + ribbonWave, -10, -1);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // End Head

    // 10. Foreground Arm (Right Arm with rolled sleeve & Kada)
    ctx.save();
    const fgArmX = w * 0.05;
    const fgArmY = -h * 0.65 + torsoBob;
    ctx.translate(fgArmX, fgArmY);

    let fgArmAngle = armCycle * 0.7;
    let fgElbowAngle = 0.4;

    if (this.state === 'victory') {
      // Triumphant skyward fist pump!
      fgArmAngle = -2.3;
      fgElbowAngle = 0.5;
    } else if (this.state === 'dash') {
      // Swept back aerodynamic
      fgArmAngle = 1.3;
      fgElbowAngle = 0.2;
    } else if (this.state === 'hurt') {
      // Recoil defensive block
      fgArmAngle = -1.1;
      fgElbowAngle = 1.2;
    } else if (this.state === 'idle' && this.idleActState === 'lookAround') {
      // Natural adventurer hand-on-hip explorer pose
      fgArmAngle = 0.35 + Math.sin(t * 2.0) * 0.08;
      fgElbowAngle = 1.25;
    } else if (this.state === 'idle' && this.idleActState === 'adjustGear') {
      // Gentle satchel strap touch
      fgArmAngle = -0.55;
      fgElbowAngle = 1.35;
    }

    ctx.rotate(fgArmAngle);

    // Upper Arm (Tunic sleeve)
    ctx.fillStyle = tunicColor;
    ctx.beginPath();
    ctx.roundRect(-4, 0, 7.5, 11, 3);
    ctx.fill();
    // Sleeve rolled cuff
    ctx.fillStyle = tunicTrim;
    ctx.fillRect(-4.5, 9, 8.5, 2.5);

    // Forearm
    ctx.translate(0, 10);
    ctx.rotate(fgElbowAngle);
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.roundRect(-3, 0, 6.5, 9, 2);
    ctx.fill();

    // Traditional Brass / Steel Kada (Wrist Bangle)
    ctx.fillStyle = '#FFD54F';
    ctx.fillRect(-3.5, 7, 7.5, 2);

    // Sculpted Hand & Fingers
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    if (this.state === 'victory') {
      // Closed celebratory fist
      ctx.roundRect(-3.5, 9, 7, 7, 3);
      ctx.fill();
      // Victory gleam star
      ctx.fillStyle = '#FFFFFF';
      const gleam = 2 + Math.sin(t * 12) * 1;
      ctx.fillRect(-gleam * 0.5, 6 - gleam * 0.5, gleam, gleam);
    } else {
      // Natural gripping adventurer hand
      ctx.arc(0, 12, 3.8, 0, Math.PI * 2);
      ctx.fill();
      // Thumb
      ctx.beginPath();
      ctx.arc(2.5, 10.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // End Foreground Arm

    // 11. Victory Aura & Celebration Sparkles
    if (this.state === 'victory') {
      for (let i = 0; i < 4; i++) {
        const starAngle = t * 3 + (i * Math.PI * 0.5);
        const starDist = 26 + Math.sin(t * 4 + i) * 6;
        const sx = Math.cos(starAngle) * starDist;
        const sy = -h * 0.6 + Math.sin(starAngle) * (starDist * 0.6);

        ctx.fillStyle = (i % 2 === 0) ? '#FFD54F' : '#00E5FF';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore(); // End Player Canvas Transform
  }
}
