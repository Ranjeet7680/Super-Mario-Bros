/**
 * Visual Design & Multi-layer Parallax Renderer
 * Renders the vibrant landscapes of Ranchi Plateau, red-soil Murram trails, Sal groves,
 * Sohrai tribal patterns, and atmospheric particle systems.
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
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.textPopups.length - 1; i >= 0; i--) {
      const t = this.textPopups[i];
      t.y -= 35 * dt;
      t.life -= dt;
      if (t.life <= 0) {
        this.textPopups.splice(i, 1);
      }
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
}

export class WorldRenderer {
  constructor(canvasWidth = 960, canvasHeight = 540) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.time = 0;
    this.cloudOffset = 0;
  }

  update(dt) {
    this.time += dt;
    this.cloudOffset += dt * 15;
  }

  drawParallaxBackground(ctx, camX, camY) {
    ctx.save();

    // Layer 1: Vibrant Sky Gradient (Chota Nagpur dawn/dusk sky)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#3949AB');   // Deep indigo
    skyGrad.addColorStop(0.45, '#FF8A65'); // Soft peach sunrise
    skyGrad.addColorStop(0.85, '#FFE082'); // Golden plateau horizon
    skyGrad.addColorStop(1.0, '#FFCC80');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Drifting Monsoon Clouds (Parallax ratio: 0.05)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 320 + this.cloudOffset * 0.8 - camX * 0.05) % (this.width + 300)) - 150;
      const cy = 40 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.arc(cx + 30, cy - 10, 48, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 2: Distant Plateau Ridges (Tagore Hill / Netarhat ridge silhouette - ratio: 0.15)
    ctx.fillStyle = '#7E57C2';
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    for (let x = 0; x <= this.width + 100; x += 120) {
      const worldX = x + camX * 0.15;
      const ridgeY = this.height - 230 + Math.sin(worldX * 0.003) * 60 + Math.cos(worldX * 0.007) * 30;
      ctx.lineTo(x, ridgeY);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();

    // Layer 3: Midground Sal Forest & Foothills (Parallax ratio: 0.35)
    ctx.fillStyle = '#4A148C';
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

    // Layer 4: Sal Tree Silhouettes in Midground
    ctx.fillStyle = '#2E7D32';
    for (let i = 0; i < 18; i++) {
      const treeWorldX = i * 220;
      const screenX = treeWorldX - camX * 0.45;
      if (screenX > -60 && screenX < this.width + 60) {
        // Trunk
        ctx.fillRect(screenX + 16, this.height - 180, 8, 90);
        // Canopy
        ctx.beginPath();
        ctx.arc(screenX + 20, this.height - 210, 32, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawPlatforms(ctx, platforms, camX, camY, assistMode) {
    ctx.save();

    for (const p of platforms) {
      if (p.isAssist && !assistMode) continue;

      // Cull against camera viewport bounds
      if (p.x + p.width < camX - 60 || p.x > camX + this.width + 60) continue;

      const screenX = p.x;
      const screenY = p.y;

      if (p.surfaceType === 'ground') {
        // Red Soil (Murram of Jharkhand)
        ctx.fillStyle = p.isAssist ? '#FFB300' : '#8D4024';
        ctx.fillRect(screenX, screenY, p.width, p.height);

        // Lush green grass topping
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(screenX, screenY, p.width, 10);

        // Decorative grass blades
        ctx.fillStyle = '#388E3C';
        for (let bx = screenX; bx < screenX + p.width - 6; bx += 10) {
          ctx.beginPath();
          ctx.moveTo(bx, screenY);
          ctx.lineTo(bx + 3, screenY - 5);
          ctx.lineTo(bx + 6, screenY);
          ctx.fill();
        }

        // Sohrai Tribal White Line Painting Accent on platform front
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let sx = screenX + 10; sx < screenX + p.width - 20; sx += 30) {
          ctx.moveTo(sx, screenY + 22);
          ctx.lineTo(sx + 15, screenY + 36);
          ctx.lineTo(sx + 30, screenY + 22);
        }
        ctx.stroke();

      } else if (p.surfaceType === 'stone') {
        // Ranchi Granite / Basalt Rock
        ctx.fillStyle = '#546E7A';
        ctx.fillRect(screenX, screenY, p.width, p.height);

        ctx.fillStyle = '#78909C';
        ctx.fillRect(screenX, screenY, p.width, 6);

        // Stone brick cracks
        ctx.strokeStyle = '#37474F';
        ctx.lineWidth = 1.5;
        for (let sx = screenX + 25; sx < screenX + p.width; sx += 40) {
          ctx.beginPath();
          ctx.moveTo(sx, screenY + 6);
          ctx.lineTo(sx, screenY + p.height);
          ctx.stroke();
        }
      } else if (p.surfaceType === 'wood') {
        // Wooden Forest Walkway / Sal Timber Planks
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(screenX, screenY, p.width, p.height);

        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(screenX, screenY, p.width, 4);

        // Plank gaps
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        for (let px = screenX + 18; px < screenX + p.width; px += 24) {
          ctx.beginPath();
          ctx.moveTo(px, screenY);
          ctx.lineTo(px, screenY + p.height);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }
}
