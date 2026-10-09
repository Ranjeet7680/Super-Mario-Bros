/**
 * Enemy Entities Architecture
 * Implements Patrol Beetle and Forest Charger as specified in Section 17 of the Architecture Bible.
 */

import { Physics } from '../engine/Physics.js';

export class PatrolBeetle {
  constructor(x, y, leftBound, rightBound) {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 24;
    this.leftBound = leftBound;
    this.rightBound = rightBound;

    this.vx = 55;
    this.vy = 0;
    this.facing = 1;
    this.isDead = false;
    this.deathTimer = 0;
    this.animTime = 0;
  }

  update(dt, player, audio, particles, camera = null) {
    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    this.animTime += dt;
    this.x += this.vx * dt;

    // Boundary turn
    if (this.x <= this.leftBound) {
      this.x = this.leftBound;
      this.vx = Math.abs(this.vx);
      this.facing = 1;
    } else if (this.x + this.width >= this.rightBound) {
      this.x = this.rightBound - this.width;
      this.vx = -Math.abs(this.vx);
      this.facing = -1;
    }

    // Interaction with Player
    if (!player.isDead && Physics.checkAABB(player, this)) {
      // Check if player is dashing (dash attack destroys enemy)
      if (player.isDashing) {
        this.die(audio, particles);
        return;
      }

      // Check if player stomped from above
      const playerBottom = player.y + player.height;
      if (player.vy > 0 && playerBottom <= this.y + 14) {
        player.vy = -340; // Stomp bounce
        player.scaleX = 0.7;
        player.scaleY = 1.3;
        this.die(audio, particles);
      } else {
        // Player damaged
        player.takeDamage(1, audio, camera);
      }
    }
  }

  die(audio, particles) {
    this.isDead = true;
    if (audio) audio.playStomp();
    if (particles) {
      particles.spawnBurst(this.x + this.width / 2, this.y + this.height / 2, '#4E342E', 12);
      particles.spawnTextPopup(this.x + this.width / 2, this.y, '+200');
    }
  }

  draw(ctx) {
    if (this.isDead && this.deathTimer > 0.4) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(this.facing, this.isDead ? 0.3 : 1.0);

    const legWiggle = Math.sin(this.animTime * 16) * 3;
    const antennaWiggle = Math.cos(this.animTime * 20) * 4;

    // Shell / Carapace (Deep metallic Jharkhand Forest beetle brown/bronze)
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.ellipse(0, -12, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Amber wing accents
    ctx.fillStyle = '#D84315';
    ctx.beginPath();
    ctx.ellipse(-2, -14, 11, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(12, -10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Antennae (telegraphs movement direction)
    ctx.strokeStyle = '#FF7043';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, -12);
    ctx.lineTo(22, -18 + antennaWiggle);
    ctx.stroke();

    // Legs
    ctx.strokeStyle = '#1B0000';
    ctx.lineWidth = 2;
    for (let i = -10; i <= 8; i += 7) {
      ctx.beginPath();
      ctx.moveTo(i, -4);
      ctx.lineTo(i + (i % 2 === 0 ? legWiggle : -legWiggle), 0);
      ctx.stroke();
    }

    ctx.restore();
  }
}

export class ForestCharger {
  constructor(x, y, leftBound, rightBound) {
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 32;
    this.leftBound = leftBound;
    this.rightBound = rightBound;

    this.vx = 40;
    this.facing = 1;
    this.state = 'patrol'; // 'patrol', 'telegraph', 'charge', 'stun'
    this.stateTimer = 0;

    this.isDead = false;
    this.deathTimer = 0;
    this.animTime = 0;
  }

  update(dt, player, audio, particles, camera) {
    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    this.animTime += dt;
    this.stateTimer += dt;

    const dx = player.x + player.width / 2 - (this.x + this.width / 2);
    const dy = Math.abs(player.y - this.y);

    if (this.state === 'patrol') {
      this.x += this.vx * dt;

      // Check patrol boundaries
      if (this.x <= this.leftBound) {
        this.x = this.leftBound;
        this.vx = Math.abs(this.vx);
        this.facing = 1;
      } else if (this.x + this.width >= this.rightBound) {
        this.x = this.rightBound - this.width;
        this.vx = -Math.abs(this.vx);
        this.facing = -1;
      }

      // Detection trigger: player is ahead within 260px and similar elevation
      const playerAhead = (this.facing === 1 && dx > 0 && dx < 240) || (this.facing === -1 && dx < 0 && dx > -240);
      if (playerAhead && dy < 50 && !player.isDead) {
        this.state = 'telegraph';
        this.stateTimer = 0;
      }
    } else if (this.state === 'telegraph') {
      // Wind-up: stamp ground, flash warning exclamation mark
      if (particles && Math.random() < 0.2) {
        particles.spawnDust(this.x + this.width / 2, this.y + this.height);
      }

      if (this.stateTimer >= 0.75) { // 750ms telegraph
        this.state = 'charge';
        this.stateTimer = 0;
        this.vx = this.facing * 260; // Fast charge
        if (camera) camera.addShake(3.0);
      }
    } else if (this.state === 'charge') {
      this.x += this.vx * dt;

      // Stop charge when hitting boundaries
      if (this.x <= this.leftBound || this.x + this.width >= this.rightBound || this.stateTimer >= 1.6) {
        this.state = 'stun';
        this.stateTimer = 0;
        this.x = Math.max(this.leftBound, Math.min(this.rightBound - this.width, this.x));
      }
    } else if (this.state === 'stun') {
      // Exhausted breathing pause
      if (this.stateTimer >= 1.1) {
        this.state = 'patrol';
        this.stateTimer = 0;
        this.facing = -this.facing;
        this.vx = this.facing * 40;
      }
    }

    // Interaction with player
    if (!player.isDead && Physics.checkAABB(player, this)) {
      if (player.isDashing) {
        this.die(audio, particles);
        return;
      }

      const playerBottom = player.y + player.height;
      if (player.vy > 0 && playerBottom <= this.y + 16) {
        player.vy = -360;
        this.die(audio, particles);
      } else {
        player.takeDamage(1, audio, camera);
      }
    }
  }

  die(audio, particles) {
    this.isDead = true;
    if (audio) audio.playStomp();
    if (particles) {
      particles.spawnBurst(this.x + this.width / 2, this.y + this.height / 2, '#795548', 16);
      particles.spawnTextPopup(this.x + this.width / 2, this.y, '+350');
    }
  }

  draw(ctx) {
    if (this.isDead && this.deathTimer > 0.4) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(this.facing, this.isDead ? 0.3 : 1.0);

    // Telegraph alert exclamation
    if (this.state === 'telegraph') {
      ctx.fillStyle = '#FF1744';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      const bounce = Math.sin(this.stateTimer * 25) * 4;
      ctx.fillText('!', 0, -this.height - 8 + bounce);
    }

    const shake = this.state === 'telegraph' ? (Math.random() * 3 - 1.5) : 0;

    // Body (Wild boar / forest charger silhouette)
    ctx.fillStyle = this.state === 'charge' ? '#D84315' : '#4E342E';
    ctx.beginPath();
    ctx.roundRect(-20 + shake, -26, 38, 24, 6);
    ctx.fill();

    // Snout / Tusks
    ctx.fillStyle = '#2D1B16';
    ctx.fillRect(14 + shake, -18, 8, 12);
    ctx.fillStyle = '#ECEFF1'; // White tusks
    ctx.beginPath();
    ctx.moveTo(18, -12);
    ctx.lineTo(24, -18);
    ctx.lineTo(21, -10);
    ctx.fill();

    // Red Glowing Eye
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(10 + shake, -20, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sturdy Legs
    ctx.fillStyle = '#2E1C14';
    const legOffset = (this.state === 'charge' ? Math.sin(this.animTime * 24) * 6 : 0);
    ctx.fillRect(-16, -6, 6, 6 - legOffset * 0.4);
    ctx.fillRect(-4, -6, 6, 6 + legOffset * 0.4);
    ctx.fillRect(8, -6, 6, 6 - legOffset * 0.4);

    ctx.restore();
  }
}
