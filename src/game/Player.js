/**
 * Player Controller & State Machine
 * Features: Responsive acceleration, variable jump height, coyote time, jump buffering,
 * fast fall, dash, squash & stretch animation, and health management.
 * Adheres to Section 4 & 16 of the RRR Architecture Bible.
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

    // State & Health
    this.isGrounded = false;
    this.wasGrounded = false;
    this.state = 'idle'; // 'idle', 'walk', 'run', 'jumpRise', 'jumpFall', 'dash', 'hurt', 'victory'
    this.health = 3;
    this.maxHealth = 3;
    this.invulnerableTimer = 0;
    this.isDead = false;
    this.hasWon = false;

    // Animation visual parameters (Squash & Stretch)
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.animTime = 0;
    this.scarfWave = 0;
    this.idleActTimer = 0;
    this.idleActState = 'normal'; // 'normal', 'lookAround', 'stretch'

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

  update(input, platforms, dt, audio = null, camera = null, particles = null) {
    if (this.hasWon) {
      this.vx = 0;
      this.vy = 0;
      this.state = 'victory';
      this.animTime += dt;
      return;
    }

    this.animTime += dt;
    this.scarfWave += dt * 8;

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
    if (input.actions.jumpDown) {
      this.jumpBufferTimer = this.jumpBufferTime;
    } else {
      this.jumpBufferTimer -= dt;
    }

    // Handle Dash action
    if (input.actions.dashDown && this.canDash && this.dashCooldownTimer <= 0 && !this.isDashing) {
      this.isDashing = true;
      this.dashTimer = this.dashDuration;
      this.dashCooldownTimer = this.dashCooldown;
      this.canDash = false;
      this.vx = this.facing * this.dashSpeed;
      this.vy = 0;
      this.invulnerableTimer = Math.max(this.invulnerableTimer, this.dashDuration);
      if (audio) audio.playDash();
      if (camera) camera.addShake(3.0);
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
    } else {
      // Horizontal Movement
      const moveInput = (input.actions.right ? 1 : 0) - (input.actions.left ? 1 : 0);
      const accel = this.isGrounded ? this.groundAccel : this.airAccel;
      const friction = this.isGrounded ? this.groundFriction : this.airFriction;

      if (moveInput !== 0) {
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

      // Jump Execution (Buffer + Coyote)
      if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
        this.vy = this.jumpForce;
        this.jumpHoldTimer = this.maxJumpHoldTime;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
        this.isGrounded = false;
        this.scaleX = 0.7; // Squash launch
        this.scaleY = 1.35;
        if (audio) audio.playJump();
        if (particles) particles.spawnDust(this.x + this.width / 2, this.y + this.height);
      }

      // Variable jump height (held jump button maintains upward push)
      if (input.actions.jump && this.jumpHoldTimer > 0) {
        this.jumpHoldTimer -= dt;
        this.vy += this.jumpHoldBoost * dt;
      } else {
        this.jumpHoldTimer = 0;
      }

      // Gravity & Fast Fall
      const currentGravity = (input.actions.down && this.vy > 0) ? this.fastFallGravity : this.gravity;
      this.vy += currentGravity * dt;
      if (this.vy > this.maxFallSpeed) {
        this.vy = this.maxFallSpeed;
      }
    }

    // Resolve platform collisions
    this.wasGrounded = this.isGrounded;
    Physics.resolvePlatformCollisions(this, platforms, dt);

    // Just landed detection (Squash & Sound)
    if (!this.wasGrounded && this.isGrounded) {
      this.scaleX = 1.35;
      this.scaleY = 0.7;
      if (audio) audio.playLand();
      if (particles) particles.spawnDust(this.x + this.width / 2, this.y + this.height);
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
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(this.facing * this.scaleX, this.scaleY);

    // Blinking effect during invulnerability
    if (this.invulnerableTimer > 0 && Math.floor(this.animTime * 18) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    const w = this.width;
    const h = this.height;

    // Palette per outfit
    let tunicColor = '#00838F';
    let pantsColor = '#33691E';
    let scarfColor = '#E65100';
    let trimColor = '#FFD54F';

    if (this.outfit === 'sohrai') {
      tunicColor = '#B71C1C';
      pantsColor = '#F57F17';
      scarfColor = '#FFD54F';
      trimColor = '#FFFFFF';
    } else if (this.outfit === 'night') {
      tunicColor = '#1A237E';
      pantsColor = '#263238';
      scarfColor = '#00E5FF';
      trimColor = '#80D8FF';
    }

    // --- Dynamic Character Rendering (Kabir: Indian Adventurer) ---
    // Scarf (Silk waving in wind)
    const scarfOffset = Math.sin(this.scarfWave) * 6;
    ctx.fillStyle = scarfColor;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, -h * 0.72);
    ctx.quadraticCurveTo(-w * 0.7, -h * 0.65 + scarfOffset, -w * 0.95, -h * 0.5 + scarfOffset);
    ctx.lineTo(-w * 0.8, -h * 0.42 + scarfOffset);
    ctx.quadraticCurveTo(-w * 0.4, -h * 0.55, -w * 0.1, -h * 0.68);
    ctx.closePath();
    ctx.fill();

    // Backpack (Leather brown)
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(-w * 0.45, -h * 0.68, w * 0.35, h * 0.38);
    ctx.fillStyle = '#D7CCC8';
    ctx.fillRect(-w * 0.42, -h * 0.52, w * 0.28, 3); // buckle

    // Legs / Trousers
    ctx.fillStyle = pantsColor;
    let legOffset = 0;
    if (this.state === 'walk' || this.state === 'run') {
      legOffset = Math.sin(this.animTime * (this.state === 'run' ? 18 : 12)) * 6;
    }
    // Left leg
    ctx.fillRect(-w * 0.32, -h * 0.35, w * 0.28, h * 0.35 - legOffset * 0.3);
    // Right leg
    ctx.fillRect(w * 0.04, -h * 0.35, w * 0.28, h * 0.35 + legOffset * 0.3);

    // Boots (Sturdy brown hiking boots)
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(-w * 0.35, -h * 0.08, w * 0.32, h * 0.08);
    ctx.fillRect(w * 0.02, -h * 0.08, w * 0.32, h * 0.08);

    // Torso / Vest (Traveler tunic)
    ctx.fillStyle = tunicColor;
    ctx.fillRect(-w * 0.35, -h * 0.72, w * 0.7, h * 0.38);

    // Nehru collar / chest detail
    ctx.fillStyle = trimColor;
    ctx.fillRect(-w * 0.05, -h * 0.72, w * 0.1, h * 0.35);

    // Head / Face
    ctx.fillStyle = '#A16238'; // Warm brown skin tone
    ctx.beginPath();
    ctx.arc(0, -h * 0.85, 11, 0, Math.PI * 2);
    ctx.fill();

    // Expressive Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(2, -h * 0.88, 5, 4);
    ctx.fillStyle = '#1A237E'; // Deep iris
    ctx.fillRect(4, -h * 0.87, 2, 3);

    // Hair & Headband
    ctx.fillStyle = '#1A1A1A'; // Jet black hair
    ctx.beginPath();
    ctx.arc(-2, -h * 0.92, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-9, -h * 0.94, 18, 5);

    // Saffron headband
    ctx.fillStyle = scarfColor;
    ctx.fillRect(-9, -h * 0.89, 18, 3);

    // Arms
    ctx.fillStyle = tunicColor;
    let armSwing = 0;
    if (this.state === 'walk' || this.state === 'run') {
      armSwing = Math.cos(this.animTime * 14) * 8;
    } else if (this.state === 'victory') {
      // Raised arms in celebration
      armSwing = -14;
    }
    ctx.fillRect(-w * 0.15 + armSwing * 0.3, -h * 0.68 + (this.state === 'victory' ? -8 : 0), 6, 14);

    ctx.restore();
  }
}
