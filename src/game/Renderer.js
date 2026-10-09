/**
 * Visual Design & Multi-layer Parallax Renderer
 * Renders authentic Jharkhand biomes, red-soil Murram trails, Sal groves,
 * waterfalls, mountain winds, industrial conveyors, and dynamic weather/particle systems.
 * Supports all 8 World Themes: ranchi, hundru, netarhat, betla, deoghar, jamshedpur, dhanbad, damodar.
 * Adheres to Section 7, 9, 15 of both Game Architecture Documents.
 */

// Canvas roundRect polyfill for full compatibility
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 4);
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.textPopups = [];
    this.ambientParticles = [];
    this.initAmbient();
  }

  initAmbient() {
    this.ambientParticles = [];
    for (let i = 0; i < 60; i++) {
      this.ambientParticles.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        vx: (Math.random() - 0.5) * 20,
        vy: 10 + Math.random() * 30,
        size: 1.5 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 3
      });
    }
  }

  update(dt, theme = 'ranchi') {
    // Dynamic particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text popups
    for (let i = this.textPopups.length - 1; i >= 0; i--) {
      const t = this.textPopups[i];
      t.y -= 35 * dt;
      t.life -= dt;
      if (t.life <= 0) {
        this.textPopups.splice(i, 1);
      }
    }

    // Ambient weather particles based on theme
    for (const ap of this.ambientParticles) {
      ap.rot += (ap.rotSpeed || 1) * dt;

      if (theme === 'hundru') {
        // Cascading mist droplets with buoyant swirling updrafts
        ap.x += (Math.sin(ap.y * 0.03 + ap.phase) * 28 + 12) * dt;
        ap.y += (35 + Math.random() * 40) * dt;
      } else if (theme === 'damodar') {
        // Torrential tempest rain streaks rushing downward
        ap.x += 160 * dt;
        ap.y += 480 * dt;
      } else if (theme === 'netarhat') {
        // High mountain winds blowing golden autumn leaves & pine needles
        ap.x += (170 + Math.random() * 110) * dt;
        ap.y += (Math.sin(ap.x * 0.02 + ap.phase) * 24 + 18) * dt;
      } else if (theme === 'betla') {
        // Undulating forest fireflies & glowing spores
        ap.x += Math.sin(ap.y * 0.02 + ap.phase) * 22 * dt;
        ap.y += Math.cos(ap.x * 0.02 + ap.phase) * 16 * dt - 8 * dt;
      } else if (theme === 'jamshedpur') {
        // Rising forge embers & sparks
        ap.x += (Math.sin(ap.y * 0.04) * 22 + (Math.random() - 0.5) * 35) * dt;
        ap.y -= (65 + Math.random() * 55) * dt;
      } else if (theme === 'dhanbad') {
        // Subterranean mine dust and lantern glimmer motes
        ap.x += (Math.random() - 0.5) * 16 * dt;
        ap.y += (14 + Math.random() * 20) * dt;
      } else if (theme === 'deoghar') {
        // Sacred fluttering marigold petals drifting gently
        ap.x += (Math.sin(ap.y * 0.025 + ap.phase) * 32 + 10) * dt;
        ap.y += (35 + Math.random() * 25) * dt;
      } else {
        // Ranchi plateau dawn breeze with dancing Sal pollen
        ap.x += (28 + Math.random() * 22) * dt;
        ap.y += (Math.sin(ap.x * 0.015) * 12 + 6) * dt;
      }

      // Wrap around bounds
      if (ap.x > 960 + 30) ap.x = -30;
      if (ap.x < -30) ap.x = 960 + 30;
      if (ap.y > 540 + 30) ap.y = -30;
      if (ap.y < -30) ap.y = 540 + 30;
    }
  }

  spawnBurst(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 140;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8
      });
    }
  }

  spawnDust(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() * 20 - 10),
        y: y - 2,
        vx: (Math.random() * 2 - 1) * 35,
        vy: -15 - Math.random() * 25,
        size: 2 + Math.random() * 3,
        color: '#D7CCC8',
        life: 0.25,
        maxLife: 0.25
      });
    }
  }

  spawnDashTrail(x, y, facing) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x - facing * (i * 4),
        y: y + (Math.random() * 20 - 10),
        vx: -facing * (40 + Math.random() * 60),
        vy: (Math.random() * 2 - 1) * 30,
        size: 3 + Math.random() * 3,
        color: '#00E5FF',
        life: 0.22,
        maxLife: 0.22
      });
    }
  }

  spawnTextPopup(x, y, text, color = '#FFD54F') {
    this.textPopups.push({
      x,
      y,
      text,
      color,
      life: 0.75,
      maxLife: 0.75
    });
  }

  draw(ctx, camX, camY) {
    ctx.save();
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x - camX, p.y - camY, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    for (const t of this.textPopups) {
      const alpha = Math.max(0, t.life / t.maxLife);
      ctx.fillStyle = t.color;
      ctx.globalAlpha = alpha;
      ctx.fillText(t.text, t.x - camX, t.y - camY);
    }
    ctx.restore();
  }

  drawAmbientWeather(ctx, theme = 'ranchi') {
    ctx.save();
    if (theme === 'damodar') {
      // Torrential storm rain streaks with angled impact
      ctx.strokeStyle = 'rgba(187, 222, 251, 0.65)';
      ctx.lineWidth = 1.6;
      for (const ap of this.ambientParticles) {
        ctx.beginPath();
        ctx.moveTo(ap.x, ap.y);
        ctx.lineTo(ap.x - 7, ap.y - 20);
        ctx.stroke();

        // Tiny water splash ripple at low heights
        if (ap.y > 500) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.ellipse(ap.x, ap.y, 4, 1.5, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(187, 222, 251, 0.65)';
        }
      }
    } else if (theme === 'hundru') {
      // Shimmering waterfall mist droplets with soft iridescent halos
      for (const ap of this.ambientParticles) {
        const radGrad = ctx.createRadialGradient(ap.x, ap.y, 0, ap.x, ap.y, ap.size * 2.2);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        radGrad.addColorStop(0.45, 'rgba(178, 235, 242, 0.55)');
        radGrad.addColorStop(1, 'rgba(128, 222, 234, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'netarhat') {
      // Flying golden highland leaves & pine needle wisps
      for (const ap of this.ambientParticles) {
        ctx.save();
        ctx.translate(ap.x, ap.y);
        ctx.rotate(ap.rot || 0);
        ctx.fillStyle = 'rgba(255, 213, 79, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, ap.size * 2.5, ap.size * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(230, 81, 0, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-ap.size * 2, 0);
        ctx.lineTo(ap.size * 2, 0);
        ctx.stroke();
        ctx.restore();
      }
    } else if (theme === 'betla') {
      // Luminescent emerald forest fireflies & glowing spores
      for (const ap of this.ambientParticles) {
        const pulse = 0.5 + Math.sin((ap.phase || 0) + ap.y * 0.05) * 0.5;
        const radGrad = ctx.createRadialGradient(ap.x, ap.y, 0, ap.x, ap.y, ap.size * 2.5);
        radGrad.addColorStop(0, `rgba(255, 245, 157, ${0.9 * pulse})`);
        radGrad.addColorStop(0.5, `rgba(165, 214, 167, ${0.6 * pulse})`);
        radGrad.addColorStop(1, 'rgba(76, 175, 80, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'jamshedpur') {
      // Glowing furnace sparks & hot rising embers
      for (const ap of this.ambientParticles) {
        ctx.fillStyle = 'rgba(255, 110, 64, 0.85)';
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 215, 64, 0.95)';
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'dhanbad') {
      // Subterranean coal dust specks & warm lantern glimmer
      for (const ap of this.ambientParticles) {
        if (ap.size > 3.0) {
          ctx.fillStyle = 'rgba(255, 183, 77, 0.65)';
        } else {
          ctx.fillStyle = 'rgba(66, 66, 66, 0.45)';
        }
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'deoghar') {
      // Sacred marigold petals tumbling gently
      for (const ap of this.ambientParticles) {
        ctx.save();
        ctx.translate(ap.x, ap.y);
        ctx.rotate(ap.rot || 0);
        ctx.fillStyle = 'rgba(255, 152, 0, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, 0, ap.size * 1.8, ap.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 235, 59, 0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, ap.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Ranchi sunlit plateau dawn pollen & golden dust
      for (const ap of this.ambientParticles) {
        ctx.fillStyle = 'rgba(255, 248, 225, 0.45)';
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

export class WorldRenderer {
  constructor(canvasWidth = 960, canvasHeight = 540) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.time = 0;
    this.cloudOffset = 0;
    this.waterFlowOffset = 0;
    this.lightningTimer = 0;
    this.isLightning = false;
  }

  update(dt) {
    this.time += dt;
    this.cloudOffset += dt * 16;
    this.waterFlowOffset += dt * 90;

    // Periodic lightning flash for Damodar Storm
    this.lightningTimer += dt;
    if (this.lightningTimer > 4.5) {
      this.isLightning = Math.random() < 0.4;
      if (this.lightningTimer > 4.75) {
        this.lightningTimer = 0;
        this.isLightning = false;
      }
    }
  }

  drawParallaxBackground(ctx, camX, camY, theme = 'ranchi') {
    ctx.save();

    // 1. SKY GRADIENT ACCORDING TO BIOME THEME
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    if (theme === 'hundru') {
      // Azure mist & mountain chasm
      skyGrad.addColorStop(0, '#004D40');
      skyGrad.addColorStop(0.35, '#00838F');
      skyGrad.addColorStop(0.7, '#00ACC1');
      skyGrad.addColorStop(1.0, '#B2EBF2');
    } else if (theme === 'netarhat') {
      // Queen of Chotanagpur Crimson & Violet Sunset
      skyGrad.addColorStop(0, '#280659');
      skyGrad.addColorStop(0.35, '#880E4F');
      skyGrad.addColorStop(0.7, '#E65100');
      skyGrad.addColorStop(1.0, '#FFE082');
    } else if (theme === 'betla') {
      // Deep emerald jungle canopy dawn
      skyGrad.addColorStop(0, '#1B5E20');
      skyGrad.addColorStop(0.5, '#2E7D32');
      skyGrad.addColorStop(1.0, '#C8E6C9');
    } else if (theme === 'deoghar') {
      // Sacred Baidyanath ochre sunrise
      skyGrad.addColorStop(0, '#3E2723');
      skyGrad.addColorStop(0.4, '#D84315');
      skyGrad.addColorStop(0.8, '#FFB300');
      skyGrad.addColorStop(1.0, '#FFF9C4');
    } else if (theme === 'jamshedpur') {
      // Industrial amber/bronze forge horizon
      skyGrad.addColorStop(0, '#212121');
      skyGrad.addColorStop(0.5, '#BF360C');
      skyGrad.addColorStop(0.85, '#FF8A65');
      skyGrad.addColorStop(1.0, '#FFE0B2');
    } else if (theme === 'dhanbad') {
      // Subterranean coal shaft cavern vault
      skyGrad.addColorStop(0, '#0A0A0A');
      skyGrad.addColorStop(0.55, '#1E1E1E');
      skyGrad.addColorStop(1.0, '#3E2723');
    } else if (theme === 'damodar') {
      // Storm tempest with lightning
      const bgTop = this.isLightning ? '#ECEFF1' : '#0D1B2A';
      const bgBot = this.isLightning ? '#CFD8DC' : '#1B263B';
      skyGrad.addColorStop(0, bgTop);
      skyGrad.addColorStop(1.0, bgBot);
    } else {
      // Default Ranchi Plateau Dawn
      skyGrad.addColorStop(0, '#3949AB');
      skyGrad.addColorStop(0.45, '#FF8A65');
      skyGrad.addColorStop(0.85, '#FFE082');
      skyGrad.addColorStop(1.0, '#FFCC80');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. CELESTIAL ELEMENTS & LIGHTNING
    if (theme === 'netarhat') {
      // Sinking setting sun disc behind Queen of Chotanagpur plateau
      const sunX = this.width * 0.65 - camX * 0.03;
      const sunY = 220;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 120);
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      sunGrad.addColorStop(0.3, 'rgba(255, 213, 79, 0.85)');
      sunGrad.addColorStop(0.65, 'rgba(255, 112, 67, 0.45)');
      sunGrad.addColorStop(1.0, 'rgba(244, 67, 54, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric golden god-rays
      ctx.fillStyle = 'rgba(255, 235, 59, 0.08)';
      for (let r = -3; r <= 3; r++) {
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + r * 140 - 70, 0);
        ctx.lineTo(sunX + r * 140 + 70, 0);
        ctx.closePath();
        ctx.fill();
      }
    } else if (theme === 'deoghar') {
      // Sacred dawn sun aureole
      const sunX = this.width * 0.35 - camX * 0.03;
      const sunY = 170;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 90);
      sunGrad.addColorStop(0, 'rgba(255, 255, 224, 0.95)');
      sunGrad.addColorStop(0.4, 'rgba(255, 183, 77, 0.6)');
      sunGrad.addColorStop(1.0, 'rgba(255, 152, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme === 'damodar' && this.isLightning) {
      // Forked lightning strike across the storm sky
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.shadowColor = '#80D8FF';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      const lx = ((camX * 0.15 + 460) % (this.width - 100)) + 50;
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx - 22, 65);
      ctx.lineTo(lx + 15, 120);
      ctx.lineTo(lx - 28, 195);
      ctx.lineTo(lx - 6, 255);
      ctx.lineTo(lx - 38, 320);
      ctx.stroke();

      // Secondary lightning branch
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(lx + 15, 120);
      ctx.lineTo(lx + 42, 175);
      ctx.lineTo(lx + 28, 225);
      ctx.stroke();
      ctx.restore();
    }

    // 3. DRIFTING CLOUDS & MIST (Parallax 0.05)
    ctx.fillStyle = theme === 'damodar' ? 'rgba(38, 50, 56, 0.65)' : (theme === 'dhanbad' ? 'rgba(20, 20, 20, 0.5)' : 'rgba(255, 255, 255, 0.38)');
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 320 + this.cloudOffset * 0.8 - camX * 0.05) % (this.width + 320)) - 160;
      const cy = 40 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.arc(cx + 30, cy - 10, 48, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. DISTANT MOUNTAIN SILHOUETTE (Parallax 0.15)
    ctx.fillStyle = theme === 'hundru' ? '#00362F' : (theme === 'netarhat' ? '#4A148C' : (theme === 'betla' ? '#1B4D24' : (theme === 'deoghar' ? '#4E342E' : '#3949AB')));
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width + 120; x += 100) {
      const worldX = x + camX * 0.15;
      const ridgeY = this.height - 240 + Math.sin(worldX * 0.0035) * 65 + Math.cos(worldX * 0.008) * 32;
      ctx.lineTo(x, ridgeY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();

    // 5. CASCADING WATERFALL IN HUNDRU FALLS (Natural Gorge, Multi-Tier Cataract, & Mist Rainbow)
    if (theme === 'hundru') {
      for (let i = 0; i < 3; i++) {
        const fallOriginWorldX = i * 460 + 140;
        const fallX = ((fallOriginWorldX - camX * 0.22) % (this.width + 360)) - 100;
        const fallWidth = 56 + (i % 2) * 18;
        const originY = 110 + (i % 2) * 30; // Mountain gorge origin

        // (a) Rugged Basalt Canyon Cliffs flanking both sides of the cataract
        ctx.fillStyle = '#061D18';
        ctx.beginPath();
        ctx.moveTo(fallX - 32, originY - 15);
        ctx.lineTo(fallX + fallWidth + 32, originY - 15);
        ctx.lineTo(fallX + fallWidth + 45, this.height);
        ctx.lineTo(fallX - 45, this.height);
        ctx.closePath();
        ctx.fill();

        // Stepped basalt rock ledges
        ctx.fillStyle = '#0F2C24';
        ctx.fillRect(fallX - 28, 220, 36, 14);
        ctx.fillRect(fallX + fallWidth - 8, 235, 38, 14);
        ctx.fillRect(fallX - 20, 370, 32, 14);
        ctx.fillRect(fallX + fallWidth - 12, 385, 36, 14);

        // (b) Multi-tier Falling Cataract Torrent Gradient
        const fallGrad = ctx.createLinearGradient(fallX, originY, fallX + fallWidth, originY);
        fallGrad.addColorStop(0, 'rgba(128, 222, 234, 0.6)');
        fallGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.95)');
        fallGrad.addColorStop(0.5, 'rgba(224, 247, 250, 0.92)');
        fallGrad.addColorStop(0.75, 'rgba(178, 235, 242, 0.90)');
        fallGrad.addColorStop(1, 'rgba(128, 222, 234, 0.6)');
        ctx.fillStyle = fallGrad;

        // Cataract body
        ctx.beginPath();
        ctx.moveTo(fallX + 6, originY);
        ctx.lineTo(fallX + fallWidth - 6, originY);
        ctx.lineTo(fallX + fallWidth + 12, this.height);
        ctx.lineTo(fallX - 12, this.height);
        ctx.closePath();
        ctx.fill();

        // (c) Animated Vertical Flowing Whitewater Ribs & Rapids
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.2;
        const flowY = (this.time * 280) % 40;
        ctx.beginPath();
        for (let sy = originY + flowY; sy < this.height - 30; sy += 40) {
          ctx.moveTo(fallX + 10, sy);
          ctx.lineTo(fallX + 10, sy + 22);
          ctx.moveTo(fallX + fallWidth * 0.35, sy + 12);
          ctx.lineTo(fallX + fallWidth * 0.35, sy + 32);
          ctx.moveTo(fallX + fallWidth * 0.65, sy + 6);
          ctx.lineTo(fallX + fallWidth * 0.65, sy + 28);
          ctx.moveTo(fallX + fallWidth - 12, sy + 16);
          ctx.lineTo(fallX + fallWidth - 12, sy + 36);
        }
        ctx.stroke();

        // (d) Mid-tier Rock Shelf Splash Zones (Soft realistic spray mist & foam ripples)
        const splashMid = Math.sin(this.time * 8 + i) * 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(fallX + 14, 228 + splashMid, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(fallX + fallWidth - 14, 242 - splashMid, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Droplet mist glints
        ctx.fillStyle = 'rgba(224, 247, 250, 0.75)';
        for (let sp = 0; sp < 4; sp++) {
          const dropX = fallX + 6 + sp * (fallWidth / 3.5) + Math.sin(this.time * 12 + sp) * 4;
          const dropY = 232 + (sp % 2 === 0 ? splashMid : -splashMid) + Math.cos(this.time * 10 + sp) * 3;
          ctx.beginPath();
          ctx.arc(dropX, dropY, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }

        // (e) Soft Layered Mist Clouds at Plunge Pool Base
        const mistPulse = Math.sin(this.time * 4 + i * 2.2) * 6;
        const poolGrad = ctx.createRadialGradient(
          fallX + fallWidth * 0.5, this.height - 55, 10,
          fallX + fallWidth * 0.5, this.height - 55, 55
        );
        poolGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        poolGrad.addColorStop(0.5, 'rgba(178, 235, 242, 0.35)');
        poolGrad.addColorStop(1, 'rgba(128, 222, 234, 0)');
        ctx.fillStyle = poolGrad;
        ctx.beginPath();
        ctx.arc(fallX + fallWidth * 0.5, this.height - 55 + mistPulse, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(fallX + 8, this.height - 40, 24, 0, Math.PI * 2);
        ctx.arc(fallX + fallWidth - 8, this.height - 42, 26, 0, Math.PI * 2);
        ctx.fill();

        // (f) Shimmering 7-Color Prismatic Mist Rainbow Arc across the Gorge
        const rbCenter = fallX + fallWidth * 0.5;
        const rbY = this.height - 180;
        const rainbowColors = [
          'rgba(244, 67, 54, 0.24)',   // Red
          'rgba(255, 152, 0, 0.22)',  // Orange
          'rgba(255, 235, 59, 0.24)',  // Yellow
          'rgba(76, 175, 80, 0.22)',   // Green
          'rgba(0, 188, 212, 0.22)',   // Cyan
          'rgba(33, 150, 243, 0.20)',  // Blue
          'rgba(156, 39, 176, 0.18)'   // Violet
        ];
        ctx.save();
        ctx.lineWidth = 5.5;
        rainbowColors.forEach((color, cIdx) => {
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.arc(rbCenter + 30, rbY + 50, 105 + cIdx * 4.8, Math.PI * 1.08, Math.PI * 1.88);
          ctx.stroke();
        });
        ctx.restore();
      }
    }

    // 6. MIDGROUND FOOTHILLS & BIOME LANDMARKS (Parallax 0.35)
    ctx.fillStyle = theme === 'betla' ? '#14461B' : (theme === 'jamshedpur' ? '#37474F' : (theme === 'deoghar' ? '#5D4037' : (theme === 'dhanbad' ? '#1B1B1B' : '#2A1845')));
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width + 80; x += 60) {
      const worldX = x + camX * 0.35;
      const hillY = this.height - 150 + Math.sin(worldX * 0.006) * 35 + Math.cos(worldX * 0.012) * 15;
      ctx.lineTo(x, hillY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();

    // 7. ARCHITECTURAL & INDUSTRIAL BIOME LANDMARKS
    if (theme === 'jamshedpur') {
      // Industrial skyline: Blast furnaces & chimneys
      ctx.fillStyle = '#212121';
      for (let i = 0; i < 18; i++) {
        const furnaceWorldX = i * 220;
        const screenX = furnaceWorldX - camX * 0.45;
        if (screenX > -60 && screenX < this.width + 60) {
          ctx.fillRect(screenX + 14, this.height - 210, 16, 120);
          ctx.fillRect(screenX + 8, this.height - 222, 28, 14);

          // Molten furnace glow at stack vents
          ctx.fillStyle = 'rgba(255, 110, 64, 0.85)';
          ctx.fillRect(screenX + 16, this.height - 226, 12, 6);
          ctx.fillStyle = '#212121';
        }
      }
    } else if (theme === 'deoghar') {
      // Baidyanath Temple Shikharas (Spire Silhouettes with Panchshul & Pataka Flags)
      ctx.fillStyle = '#3E2723';
      for (let i = 0; i < 12; i++) {
        const shrineWorldX = i * 310 + 90;
        const screenX = shrineWorldX - camX * 0.42;
        if (screenX > -80 && screenX < this.width + 80) {
          const sY = this.height - 165;
          // Main Shikhara tiered spire
          ctx.beginPath();
          ctx.moveTo(screenX, sY);
          ctx.lineTo(screenX + 18, sY - 72);
          ctx.lineTo(screenX + 36, sY);
          ctx.closePath();
          ctx.fill();

          // Sanctum entrance arch
          ctx.fillStyle = 'rgba(255, 179, 0, 0.4)';
          ctx.fillRect(screenX + 12, sY - 24, 12, 24);

          // Golden Kalash pinnacle finial
          ctx.fillStyle = '#FFD54F';
          ctx.beginPath();
          ctx.arc(screenX + 18, sY - 76, 5, 0, Math.PI * 2);
          ctx.fill();

          // Sacred Baba Baidyanath Panchshul (5-pronged brass trident)
          ctx.strokeStyle = '#FFE082';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(screenX + 18, sY - 76);
          ctx.lineTo(screenX + 18, sY - 92);
          ctx.moveTo(screenX + 12, sY - 86);
          ctx.lineTo(screenX + 24, sY - 86);
          ctx.stroke();

          // Sacred Red Temple Pataka flag fluttering
          ctx.fillStyle = '#D50000';
          ctx.beginPath();
          ctx.moveTo(screenX + 18, sY - 90);
          ctx.lineTo(screenX + 30, sY - 87);
          ctx.lineTo(screenX + 18, sY - 84);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#3E2723';
        }
      }
    } else if (theme === 'ranchi') {
      // Ranchi Hilltop Pahari Mandir & Jagannath Temple Silhouettes
      ctx.fillStyle = '#283593';
      for (let i = 0; i < 6; i++) {
        const mandirWorldX = i * 620 + 240;
        const screenX = mandirWorldX - camX * 0.38;
        if (screenX > -100 && screenX < this.width + 100) {
          const mY = this.height - 180;
          // Hillock plinth
          ctx.beginPath();
          ctx.ellipse(screenX + 25, mY + 10, 45, 18, 0, 0, Math.PI * 2);
          ctx.fill();

          // Mandir Shikhara
          ctx.beginPath();
          ctx.moveTo(screenX + 8, mY + 5);
          ctx.lineTo(screenX + 25, mY - 55);
          ctx.lineTo(screenX + 42, mY + 5);
          ctx.closePath();
          ctx.fill();

          // Golden Chakra & Saffron Flag
          ctx.fillStyle = '#FFD54F';
          ctx.beginPath();
          ctx.arc(screenX + 25, mY - 60, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FF6F00';
          ctx.beginPath();
          ctx.moveTo(screenX + 25, mY - 62);
          ctx.lineTo(screenX + 36, mY - 59);
          ctx.lineTo(screenX + 25, mY - 56);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#283593';
        }
      }
    } else if (theme === 'betla') {
      // Ancient stone watchtowers of Palamu Fort
      ctx.fillStyle = '#1B3B22';
      for (let i = 0; i < 10; i++) {
        const fortWorldX = i * 380 + 120;
        const screenX = fortWorldX - camX * 0.42;
        if (screenX > -90 && screenX < this.width + 90) {
          const fY = this.height - 170;
          ctx.fillRect(screenX, fY - 55, 42, 65);
          // Crenellations
          ctx.fillRect(screenX - 4, fY - 65, 14, 12);
          ctx.fillRect(screenX + 16, fY - 65, 14, 12);
          ctx.fillRect(screenX + 34, fY - 65, 14, 12);
        }
      }
    } else if (theme === 'dhanbad') {
      // Cavern rock vaults & wooden mine headframes
      ctx.fillStyle = '#141414';
      for (let i = 0; i < 12; i++) {
        const frameWorldX = i * 330 + 60;
        const screenX = frameWorldX - camX * 0.42;
        if (screenX > -80 && screenX < this.width + 80) {
          const mY = this.height - 165;
          ctx.fillRect(screenX + 6, mY - 60, 6, 65);
          ctx.fillRect(screenX + 28, mY - 60, 6, 65);
          ctx.fillRect(screenX, mY - 64, 40, 8);
          // Pithead wheel
          ctx.strokeStyle = '#757575';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(screenX + 20, mY - 72, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (theme === 'hundru') {
      // Rugged basalt canyon cliffs & gorge spires flanking Hundru cataract
      ctx.fillStyle = '#08231D';
      for (let i = 0; i < 12; i++) {
        const spireWorldX = i * 290 + 50;
        const screenX = spireWorldX - camX * 0.36;
        if (screenX > -90 && screenX < this.width + 90) {
          const sY = this.height - 120 + Math.sin(spireWorldX * 0.007) * 22;
          ctx.beginPath();
          ctx.moveTo(screenX - 10, this.height);
          ctx.lineTo(screenX + 8, sY - 45);
          ctx.lineTo(screenX + 38, sY - 55);
          ctx.lineTo(screenX + 54, sY - 20);
          ctx.lineTo(screenX + 68, this.height);
          ctx.closePath();
          ctx.fill();

          // Emerald moss rim on top
          ctx.fillStyle = '#1B5E20';
          ctx.fillRect(screenX + 6, sY - 48, 34, 6);
          ctx.fillStyle = '#08231D';
        }
      }
    } else {
      // Authentic Jharkhand Midground Trees (Sal, Palas, Mahua, Pine)
      for (let i = 0; i < 22; i++) {
        const treeWorldX = i * 190;
        const screenX = treeWorldX - camX * 0.40;
        if (screenX > -100 && screenX < this.width + 100) {
          const treeTypes = (theme === 'netarhat') ? ['pine', 'sal', 'pine'] : ['sal', 'palas', 'sal', 'mahua'];
          const tType = treeTypes[i % treeTypes.length];
          const tHeight = 150 + ((i * 37) % 55); // Height 150 - 205
          const tWidth = tHeight * 0.65;
          const tGroundY = this.height - 110 + Math.sin(treeWorldX * 0.005) * 15;
          const sway = Math.sin(this.time * 2.2 + i * 1.3) * (theme === 'netarhat' || theme === 'damodar' ? 8 : 4.5);
          this.drawDetailedTree(ctx, screenX + 25, tGroundY, tHeight, tWidth, tType, sway, false);
        }
      }
    }

    ctx.restore();
  }

  /**
   * Procedural Authentic Tree Renderer
   * Renders realistic Sal (Shorea robusta), Palas (Butea monosperma), Mahua, or Highland Pine trees.
   * Features: Tapered hardwood trunk, bark fissures, root flare, branching forks,
   * layered multi-lobed organic foliage with shadow/highlight depth, Palas blossoms, and wind sway.
   */
  drawDetailedTree(ctx, rootX, rootY, height = 180, width = 120, type = 'sal', sway = 0, isSilhouetted = false) {
    ctx.save();

    const trunkWidth = Math.max(11, height * 0.075);
    const crownY = rootY - height;
    const trunkTopY = rootY - height * 0.62;

    // 1. Root flare & ground shadow
    if (!isSilhouetted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(rootX, rootY, trunkWidth * 1.8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Tapered Trunk Path
    ctx.beginPath();
    ctx.moveTo(rootX - trunkWidth * 1.3, rootY);
    ctx.quadraticCurveTo(rootX - trunkWidth * 0.6, rootY - height * 0.15, rootX - trunkWidth * 0.42, trunkTopY);
    ctx.lineTo(rootX + trunkWidth * 0.42, trunkTopY);
    ctx.quadraticCurveTo(rootX + trunkWidth * 0.6, rootY - height * 0.15, rootX + trunkWidth * 1.3, rootY);
    ctx.closePath();

    if (isSilhouetted) {
      ctx.fillStyle = '#16331C';
      ctx.fill();
    } else {
      // Wood gradient: deep shadow to sunlit warm timber bark
      const trunkGrad = ctx.createLinearGradient(rootX - trunkWidth, rootY, rootX + trunkWidth, rootY);
      trunkGrad.addColorStop(0, '#261811');
      trunkGrad.addColorStop(0.35, '#3E2723');
      trunkGrad.addColorStop(0.75, '#5D4037');
      trunkGrad.addColorStop(1, '#6D4C41');
      ctx.fillStyle = trunkGrad;
      ctx.fill();

      // Vertical bark fissure lines
      ctx.strokeStyle = '#24160F';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(rootX - trunkWidth * 0.15, rootY - 4);
      ctx.lineTo(rootX - trunkWidth * 0.1, trunkTopY + 12);
      ctx.moveTo(rootX + trunkWidth * 0.2, rootY - 8);
      ctx.lineTo(rootX + trunkWidth * 0.15, trunkTopY + 22);
      ctx.stroke();

      // Bark highlight rim
      ctx.strokeStyle = 'rgba(141, 110, 99, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rootX + trunkWidth * 0.35, rootY - 5);
      ctx.lineTo(rootX + trunkWidth * 0.3, trunkTopY + 10);
      ctx.stroke();
    }

    // 3. Branch Forks
    const branchColor = isSilhouetted ? '#16331C' : '#3E2723';
    ctx.strokeStyle = branchColor;
    ctx.lineCap = 'round';

    // Left primary bough
    const leftBranchTipX = rootX - width * 0.32 + sway * 0.6;
    const leftBranchTipY = rootY - height * 0.52;
    ctx.lineWidth = trunkWidth * 0.45;
    ctx.beginPath();
    ctx.moveTo(rootX - trunkWidth * 0.3, rootY - height * 0.36);
    ctx.quadraticCurveTo(rootX - width * 0.16, rootY - height * 0.43, leftBranchTipX, leftBranchTipY);
    ctx.stroke();

    // Right primary bough
    const rightBranchTipX = rootX + width * 0.35 + sway * 0.7;
    const rightBranchTipY = rootY - height * 0.55;
    ctx.lineWidth = trunkWidth * 0.4;
    ctx.beginPath();
    ctx.moveTo(rootX + trunkWidth * 0.3, rootY - height * 0.42);
    ctx.quadraticCurveTo(rootX + width * 0.18, rootY - height * 0.48, rightBranchTipX, rightBranchTipY);
    ctx.stroke();

    // Center upper crown bough
    ctx.lineWidth = trunkWidth * 0.35;
    ctx.beginPath();
    ctx.moveTo(rootX, trunkTopY);
    ctx.quadraticCurveTo(rootX + sway * 0.4, rootY - height * 0.72, rootX + sway * 0.8, crownY + height * 0.16);
    ctx.stroke();

    // 4. Layered Multi-Lobe Foliage Canopy
    if (type === 'pine') {
      // Coniferous Pine Needle Tiers (Netarhat / Highland Ridge)
      const tiers = 4;
      const tierHeight = (height * 0.65) / tiers;
      for (let t = 0; t < tiers; t++) {
        const ty = crownY + t * tierHeight + 12;
        const tw = (width * 0.38) + t * (width * 0.18);
        const tSway = sway * (1.0 - t * 0.2);

        ctx.fillStyle = isSilhouetted ? '#0D2B14' : (t === 0 ? '#2E7D32' : (t === 1 ? '#1B5E20' : '#14461B'));
        ctx.beginPath();
        ctx.moveTo(rootX + tSway, ty - tierHeight * 0.6);
        ctx.lineTo(rootX + tw + tSway, ty + tierHeight * 0.6);
        ctx.lineTo(rootX - tw + tSway, ty + tierHeight * 0.6);
        ctx.closePath();
        ctx.fill();

        if (!isSilhouetted) {
          ctx.strokeStyle = '#66BB6A';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(rootX + tSway, ty - tierHeight * 0.6);
          ctx.lineTo(rootX + tw * 0.75 + tSway, ty + tierHeight * 0.35);
          ctx.stroke();
        }
      }
    } else {
      // Broadleaf Organic Multi-Lobe Canopy (Sal, Palas, Mahua)
      const clusters = [
        // Bottom shadow lobes
        { rx: -0.32, ry: -0.50, rad: width * 0.25, shade: 'shadow' },
        { rx: 0.34, ry: -0.52, rad: width * 0.25, shade: 'shadow' },
        { rx: 0.0, ry: -0.56, rad: width * 0.29, shade: 'shadow' },

        // Mid-canopy main body
        { rx: -0.26, ry: -0.66, rad: width * 0.29, shade: 'mid' },
        { rx: 0.25, ry: -0.68, rad: width * 0.29, shade: 'mid' },
        { rx: -0.04, ry: -0.72, rad: width * 0.33, shade: 'mid' },

        // Upper canopy & sunlit crown
        { rx: -0.15, ry: -0.83, rad: width * 0.27, shade: 'light' },
        { rx: 0.15, ry: -0.84, rad: width * 0.26, shade: 'light' },
        { rx: 0.02, ry: -0.93, rad: width * 0.23, shade: 'top' }
      ];

      let cShadow = '#0D3813';
      let cMid = '#1B5E20';
      let cLight = '#2E7D32';
      let cTop = '#43A047';
      let cRim = '#81C784';

      if (type === 'mahua') {
        cShadow = '#1B3811';
        cMid = '#33691E';
        cLight = '#558B2F';
        cTop = '#7CB342';
        cRim = '#AED581';
      }

      for (const cl of clusters) {
        const lobeSway = sway * (cl.ry * -1);
        const cx = rootX + cl.rx * width + lobeSway;
        const cy = rootY + cl.ry * height;
        const rad = cl.rad;

        let col = cMid;
        if (cl.shade === 'shadow') col = cShadow;
        else if (cl.shade === 'light') col = cLight;
        else if (cl.shade === 'top') col = cTop;

        ctx.fillStyle = isSilhouetted ? '#0E2E16' : col;

        // Main circular lobe
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();

        // Scalloped outer puffy leaf clusters for realistic organic silhouette
        if (!isSilhouetted) {
          ctx.fillStyle = (cl.shade === 'top' || cl.shade === 'light') ? cTop : cMid;
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const px = cx + Math.cos(a) * rad * 0.82;
            const py = cy + Math.sin(a) * rad * 0.82;
            ctx.beginPath();
            ctx.arc(px, py, rad * 0.36, 0, Math.PI * 2);
            ctx.fill();
          }

          // Top sunlit leaf highlight rim
          if (cl.shade === 'top' || cl.shade === 'light') {
            ctx.fillStyle = cRim;
            ctx.beginPath();
            ctx.arc(cx, cy - rad * 0.35, rad * 0.48, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Palas "Flame of the Forest" Flowering Blossoms
      if (type === 'palas' && !isSilhouetted) {
        const blossomPoints = [
          { bx: -0.30, by: -0.50 },
          { bx: 0.28, by: -0.54 },
          { bx: -0.20, by: -0.70 },
          { bx: 0.18, by: -0.74 },
          { bx: -0.07, by: -0.86 },
          { bx: 0.10, by: -0.90 }
        ];

        for (const bp of blossomPoints) {
          const bSway = sway * (bp.by * -1);
          const bx = rootX + bp.bx * width + bSway;
          const by = rootY + bp.by * height;

          // Fiery crimson/orange flower petals
          ctx.fillStyle = '#FF3D00';
          ctx.beginPath();
          ctx.arc(bx, by, 7, 0, Math.PI * 2);
          ctx.arc(bx + 4, by - 3, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FF9100';
          ctx.beginPath();
          ctx.arc(bx + 2, by - 2, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFEA00';
          ctx.beginPath();
          ctx.arc(bx + 1, by - 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  /**
   * Draws scenic background trees anchored directly to ground platforms
   */
  drawWorldTrees(ctx, platforms, camX, camY, theme = 'ranchi') {
    if (theme === 'jamshedpur' || theme === 'dhanbad') return; // Industrial/subterranean biomes

    ctx.save();
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      if (p.isAssist || p.moving || p.surfaceType === 'water' || p.surfaceType === 'conveyor') continue;
      if (p.width < 180) continue;
      if (theme === 'hundru' && p.width < 320) continue; // In Hundru rocky gorge, anchor trees only on major bluffs

      // Deterministic tree placement on platform (avoids elder at spawn on section 1)
      const xRatio = (p.x === 0) ? 0.72 : 0.45;
      const treeWorldX = p.x + Math.floor(p.width * xRatio);
      const treeGroundY = p.y;

      // Cull against camera bounds
      if (treeWorldX < camX - 140 || treeWorldX > camX + this.width + 140) continue;

      const treeTypes = (theme === 'netarhat') ? ['pine', 'sal'] : ['sal', 'palas', 'mahua'];
      const tType = treeTypes[i % treeTypes.length];
      const tHeight = 170 + ((i * 41) % 45); // Height 170 - 215px
      const tWidth = tHeight * 0.65;
      const sway = Math.sin(this.time * 2.0 + treeWorldX * 0.008) * (theme === 'netarhat' || theme === 'damodar' ? 9 : 5);

      this.drawDetailedTree(ctx, treeWorldX, treeGroundY, tHeight, tWidth, tType, sway, false);
    }
    ctx.restore();
  }

  drawPlatforms(ctx, platforms, camX, camY, assistMode, theme = 'ranchi') {
    ctx.save();

    for (const p of platforms) {
      if (p.isAssist && !assistMode) continue;

      // Dynamic moving platform calculation
      let drawX = p.x;
      let drawY = p.y;
      if (p.moving) {
        const offset = Math.sin(this.time * (p.moveSpeed || 2.0)) * (p.moveRange || 60);
        if (p.axis === 'y') {
          drawY = p.baseY ? p.baseY + offset : p.y;
        } else {
          drawX = p.baseX ? p.baseX + offset : p.x;
        }
      }

      // Viewport culling
      if (drawX + p.width < camX - 80 || drawX > camX + this.width + 80) continue;

      if (p.surfaceType === 'water') {
        // ANIMATED RUSHING RIVER RAPIDS PLATFORM
        // 1. Wet Riverbed Granite Foundation
        ctx.fillStyle = '#212D32';
        ctx.fillRect(drawX, drawY + 14, p.width, p.height - 14);
        ctx.fillStyle = '#182125';
        ctx.fillRect(drawX, drawY + p.height - 8, p.width, 8);

        // Stone bank cracks
        ctx.strokeStyle = '#10171A';
        ctx.lineWidth = 1.5;
        for (let bx = drawX + 20; bx < drawX + p.width - 10; bx += 35) {
          ctx.beginPath();
          ctx.moveTo(bx, drawY + 16);
          ctx.lineTo(bx + 4, drawY + p.height);
          ctx.stroke();
        }

        // 2. Crystal Rushing Rapids Water Channel
        const isHundru = (theme === 'hundru');
        const waterGrad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + 18);
        if (isHundru) {
          waterGrad.addColorStop(0, '#E0F7FA');
          waterGrad.addColorStop(0.35, '#00E5FF');
          waterGrad.addColorStop(1.0, '#006064');
        } else if (theme === 'damodar') {
          waterGrad.addColorStop(0, '#E3F2FD');
          waterGrad.addColorStop(0.35, '#2196F3');
          waterGrad.addColorStop(1.0, '#0D47A1');
        } else {
          waterGrad.addColorStop(0, '#E1F5FE');
          waterGrad.addColorStop(0.35, '#29B6F6');
          waterGrad.addColorStop(1.0, '#0277BD');
        }
        ctx.fillStyle = waterGrad;
        ctx.fillRect(drawX, drawY, p.width, 18);

        // 3. Directional Flow Wave Chevrons & Rapids
        const speedDir = (p.currentSpeed && p.currentSpeed < 0) ? -1 : 1;
        const waveShift = ((this.waterFlowOffset * speedDir) % 36);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let wx = drawX + waveShift - 36; wx < drawX + p.width + 20; wx += 28) {
          if (wx >= drawX + 4 && wx <= drawX + p.width - 14) {
            ctx.moveTo(wx, drawY + 2);
            ctx.lineTo(wx + 8 * speedDir, drawY + 7);
            ctx.lineTo(wx + 16 * speedDir, drawY + 2);
          }
        }
        ctx.stroke();

        // 4. Whitewater Foam Bubbles & Spray along Crest
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let fx = drawX + 6; fx < drawX + p.width - 6; fx += 16) {
          const bBob = Math.sin(this.time * 8 + fx * 0.12) * 2.2;
          ctx.beginPath();
          ctx.arc(fx, drawY + 4 + bBob, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.surfaceType === 'conveyor') {
        // ANIMATED INDUSTRIAL CONVEYOR BELT (Jamshedpur Steel / Dhanbad Mines)
        ctx.fillStyle = '#37474F';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        // Conveyor belt rubber track top
        ctx.fillStyle = '#212121';
        ctx.fillRect(drawX, drawY, p.width, 8);

        // Moving directional chevrons
        const cDir = (p.currentSpeed && p.currentSpeed < 0) ? -1 : 1;
        const cShift = ((this.time * 80 * cDir) % 24);
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let cx = drawX + cShift - 20; cx < drawX + p.width; cx += 20) {
          if (cx >= drawX + 5 && cx <= drawX + p.width - 12) {
            ctx.moveTo(cx, drawY + 2);
            ctx.lineTo(cx + 6 * cDir, drawY + 6);
            ctx.lineTo(cx, drawY + 8);
          }
        }
        ctx.stroke();

        // Conveyor rollers
        ctx.fillStyle = '#78909C';
        for (let rx = drawX + 12; rx < drawX + p.width - 10; rx += 28) {
          ctx.beginPath();
          ctx.arc(rx, drawY + 16, 5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.surfaceType === 'stone') {
        // BIOME-SPECIFIC STONE GEOLOGY
        if (p.isAssist) {
          ctx.fillStyle = '#FFB300';
          ctx.fillRect(drawX, drawY, p.width, p.height);
          ctx.fillStyle = '#FFE082';
          ctx.fillRect(drawX, drawY, p.width, 6);
        } else if (theme === 'hundru') {
          // Wet Riverbed Basalt Rock with Emerald Moss Fringe
          ctx.fillStyle = '#1C2833';
          ctx.fillRect(drawX, drawY, p.width, p.height);

          // Top wet stone cap
          ctx.fillStyle = '#2E4053';
          ctx.fillRect(drawX, drawY, p.width, 8);

          // Glistening moisture sheen line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(drawX + 8, drawY + 2);
          ctx.lineTo(drawX + p.width - 8, drawY + 2);
          ctx.stroke();

          // Riverbed emerald moss tufts clinging to stone corners
          ctx.fillStyle = '#2E7D32';
          for (let mx = drawX + 2; mx < drawX + p.width - 4; mx += 14) {
            ctx.beginPath();
            ctx.arc(mx + 4, drawY + 2, 4.5, 0, Math.PI);
            ctx.fill();
          }
          ctx.fillStyle = '#43A047';
          for (let mx = drawX + 4; mx < drawX + p.width - 6; mx += 28) {
            ctx.beginPath();
            ctx.arc(mx + 3, drawY + 1, 2.5, 0, Math.PI);
            ctx.fill();
          }

          // Basalt fissures
          ctx.strokeStyle = '#0E171E';
          ctx.lineWidth = 1.5;
          for (let sx = drawX + 22; sx < drawX + p.width; sx += 36) {
            ctx.beginPath();
            ctx.moveTo(sx, drawY + 8);
            ctx.lineTo(sx - 3, drawY + p.height);
            ctx.stroke();
          }

        } else if (theme === 'deoghar') {
          // Sacred Temple Sandstone Flagstones with Terracotta Frieze
          ctx.fillStyle = '#6D4C41';
          ctx.fillRect(drawX, drawY, p.width, p.height);

          // Carved sandstone top
          ctx.fillStyle = '#D7CCC8';
          ctx.fillRect(drawX, drawY, p.width, 9);

          // Terracotta decorative trim
          ctx.fillStyle = '#BF360C';
          ctx.fillRect(drawX, drawY + 9, p.width, 4);

          // Sacred geometric masonry lines
          ctx.strokeStyle = '#4E342E';
          ctx.lineWidth = 1.5;
          for (let sx = drawX + 26; sx < drawX + p.width; sx += 38) {
            ctx.beginPath();
            ctx.moveTo(sx, drawY + 9);
            ctx.lineTo(sx, drawY + p.height);
            ctx.stroke();
          }

        } else if (theme === 'jamshedpur') {
          // Industrial Heavy Steel Plating with Caution Hazard Stripes
          ctx.fillStyle = '#263238';
          ctx.fillRect(drawX, drawY, p.width, p.height);

          ctx.fillStyle = '#455A64';
          ctx.fillRect(drawX, drawY, p.width, 10);

          // Hazard diagonal yellow/black warning stripes
          ctx.save();
          ctx.beginPath();
          ctx.rect(drawX, drawY, p.width, 6);
          ctx.clip();
          for (let hx = drawX - 10; hx < drawX + p.width + 10; hx += 16) {
            ctx.fillStyle = '#FFD54F';
            ctx.beginPath();
            ctx.moveTo(hx, drawY + 6);
            ctx.lineTo(hx + 8, drawY);
            ctx.lineTo(hx + 14, drawY);
            ctx.lineTo(hx + 6, drawY + 6);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // Steel rivets
          ctx.fillStyle = '#90A4AE';
          for (let rx = drawX + 8; rx < drawX + p.width; rx += 24) {
            ctx.beginPath();
            ctx.arc(rx, drawY + 16, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (theme === 'dhanbad') {
          // Anthracite Coal Seam Strata with Glistening Mineral Facets
          ctx.fillStyle = '#141414';
          ctx.fillRect(drawX, drawY, p.width, p.height);

          ctx.fillStyle = '#262626';
          ctx.fillRect(drawX, drawY, p.width, 8);

          // Mineral crystal flecks
          ctx.fillStyle = '#78909C';
          for (let cx = drawX + 10; cx < drawX + p.width - 8; cx += 22) {
            ctx.fillRect(cx, drawY + 3, 3, 2);
          }

          // Timber mine support props
          ctx.fillStyle = '#3E2723';
          ctx.fillRect(drawX + 8, drawY + 8, 8, p.height - 8);
          ctx.fillRect(drawX + p.width - 16, drawY + 8, 8, p.height - 8);

        } else {
          // Weathered Chotanagpur Granite with Tribal Motifs
          ctx.fillStyle = '#455A64';
          ctx.fillRect(drawX, drawY, p.width, p.height);

          ctx.fillStyle = '#78909C';
          ctx.fillRect(drawX, drawY, p.width, 6);

          ctx.strokeStyle = '#263238';
          ctx.lineWidth = 1.5;
          for (let sx = drawX + 25; sx < drawX + p.width; sx += 40) {
            ctx.beginPath();
            ctx.moveTo(sx, drawY + 6);
            ctx.lineTo(sx, drawY + p.height);
            ctx.stroke();
          }
        }

      } else if (p.surfaceType === 'wood') {
        // AUTHENTIC SAL TIMBER PLANK RUNWAY (Shorea robusta)
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(drawX, drawY, p.width, 5);

        // Plank separation gaps
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        for (let px = drawX + 18; px < drawX + p.width; px += 24) {
          ctx.beginPath();
          ctx.moveTo(px, drawY);
          ctx.lineTo(px, drawY + p.height);
          ctx.stroke();

          // Iron bolt head
          ctx.fillStyle = '#212121';
          ctx.beginPath();
          ctx.arc(px - 6, drawY + 3, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // DEFAULT RED SOIL (MURRAM OF JHARKHAND — LAL MITTI)
        ctx.fillStyle = p.isAssist ? '#FFB300' : '#8D4024';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        // Subsoil dark base layer
        ctx.fillStyle = '#5D2716';
        ctx.fillRect(drawX, drawY + p.height - 10, p.width, 10);

        // Plateau green grass cap
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(drawX, drawY, p.width, 9);

        // Organic grass blades
        ctx.fillStyle = '#388E3C';
        for (let bx = drawX; bx < drawX + p.width - 6; bx += 8) {
          ctx.beginPath();
          ctx.moveTo(bx, drawY);
          ctx.lineTo(bx + 3, drawY - 5);
          ctx.lineTo(bx + 6, drawY);
          ctx.fill();
        }

        // Traditional Sohrai tribal white geometric chalk line motifs
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let sx = drawX + 10; sx < drawX + p.width - 20; sx += 32) {
          ctx.moveTo(sx, drawY + 22);
          ctx.lineTo(sx + 16, drawY + 36);
          ctx.lineTo(sx + 32, drawY + 22);
        }
        ctx.stroke();
      }

      // Moving platform indicator glow
      if (p.moving) {
        ctx.strokeStyle = '#FFD54F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(drawX + p.width / 2, drawY + p.height / 2, 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
