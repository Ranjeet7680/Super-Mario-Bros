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
    for (let i = 0; i < 45; i++) {
      this.ambientParticles.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        vx: (Math.random() - 0.5) * 20,
        vy: 10 + Math.random() * 30,
        size: 1.5 + Math.random() * 2.5,
        type: 'dust'
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
      if (theme === 'hundru') {
        // Falling water spray & rising mist
        ap.x += (Math.random() - 0.5) * 15 * dt;
        ap.y += (60 + Math.random() * 80) * dt;
      } else if (theme === 'netarhat') {
        // High mountain winds blowing left-to-right
        ap.x += (120 + Math.random() * 100) * dt;
        ap.y += Math.sin(ap.x * 0.02) * 15 * dt;
      } else if (theme === 'damodar') {
        // Heavy rain streaks
        ap.x += 80 * dt;
        ap.y += 360 * dt;
      } else if (theme === 'jamshedpur') {
        // Rising embers & sparks
        ap.x += (Math.random() - 0.5) * 25 * dt;
        ap.y -= (40 + Math.random() * 40) * dt;
      } else {
        // Gentle plateau breeze
        ap.x += (15 + Math.random() * 15) * dt;
        ap.y += (Math.random() - 0.5) * 10 * dt;
      }

      // Wrap around bounds
      if (ap.x > 960 + 20) ap.x = -20;
      if (ap.x < -20) ap.x = 960 + 20;
      if (ap.y > 540 + 20) ap.y = -20;
      if (ap.y < -20) ap.y = 540 + 20;
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
      // Torrential rain streaks
      ctx.strokeStyle = 'rgba(179, 229, 252, 0.45)';
      ctx.lineWidth = 1.5;
      for (const ap of this.ambientParticles) {
        ctx.beginPath();
        ctx.moveTo(ap.x, ap.y);
        ctx.lineTo(ap.x - 6, ap.y - 18);
        ctx.stroke();
      }
    } else if (theme === 'hundru') {
      // Water mist globules
      ctx.fillStyle = 'rgba(224, 247, 250, 0.4)';
      for (const ap of this.ambientParticles) {
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'netarhat') {
      // Flying golden highland leaf / wind streaks
      ctx.fillStyle = 'rgba(255, 224, 130, 0.55)';
      for (const ap of this.ambientParticles) {
        ctx.beginPath();
        ctx.ellipse(ap.x, ap.y, ap.size * 2, ap.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'jamshedpur') {
      // Hot embers / sparks
      ctx.fillStyle = 'rgba(255, 112, 67, 0.65)';
      for (const ap of this.ambientParticles) {
        ctx.beginPath();
        ctx.arc(ap.x, ap.y, ap.size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Gentle plateau dust
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (const ap of this.ambientParticles) {
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
      // Azure mist & waterfall chasm
      skyGrad.addColorStop(0, '#006064');
      skyGrad.addColorStop(0.5, '#0097A7');
      skyGrad.addColorStop(1.0, '#80DEEA');
    } else if (theme === 'netarhat') {
      // Queen of Chotanagpur Crimson Twilight Sunset
      skyGrad.addColorStop(0, '#311B92');
      skyGrad.addColorStop(0.35, '#880E4F');
      skyGrad.addColorStop(0.7, '#E65100');
      skyGrad.addColorStop(1.0, '#FFD54F');
    } else if (theme === 'betla') {
      // Deep emerald jungle canopy
      skyGrad.addColorStop(0, '#1B5E20');
      skyGrad.addColorStop(0.5, '#2E7D32');
      skyGrad.addColorStop(1.0, '#A5D6A7');
    } else if (theme === 'deoghar') {
      // Sacred golden ochre sunrise
      skyGrad.addColorStop(0, '#4A148C');
      skyGrad.addColorStop(0.45, '#F57C00');
      skyGrad.addColorStop(1.0, '#FFF9C4');
    } else if (theme === 'jamshedpur') {
      // Industrial amber/bronze forge horizon
      skyGrad.addColorStop(0, '#263238');
      skyGrad.addColorStop(0.5, '#BF360C');
      skyGrad.addColorStop(1.0, '#FFB74D');
    } else if (theme === 'dhanbad') {
      // Subterranean coal shaft cavern
      skyGrad.addColorStop(0, '#101010');
      skyGrad.addColorStop(0.55, '#212121');
      skyGrad.addColorStop(1.0, '#3E2723');
    } else if (theme === 'damodar') {
      // Storm tempest with lightning
      const bgTop = this.isLightning ? '#ECEFF1' : '#1A237E';
      const bgBot = this.isLightning ? '#CFD8DC' : '#263238';
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

    // 2. DRIFTING CLOUDS / MIST (Parallax 0.05)
    ctx.fillStyle = theme === 'damodar' ? 'rgba(55, 71, 79, 0.6)' : 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 320 + this.cloudOffset * 0.8 - camX * 0.05) % (this.width + 300)) - 150;
      const cy = 40 + (i % 3) * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.arc(cx + 30, cy - 10, 48, 0, Math.PI * 2);
      ctx.arc(cx + 65, cy, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. DISTANT MOUNTAIN SILHOUETTE (Parallax 0.15)
    ctx.fillStyle = theme === 'hundru' ? '#004D40' : (theme === 'netarhat' ? '#4A148C' : '#5E35B1');
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

    // 4. WATERFALL BACKDROP IN HUNDRU FALLS
    if (theme === 'hundru') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      for (let i = 0; i < 4; i++) {
        const fallX = ((i * 380 - camX * 0.25) % (this.width + 200)) - 50;
        ctx.fillRect(fallX, 120, 28, this.height - 120);
        // Cascading white spray
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(fallX + 14, this.height - 80 + Math.sin(this.time * 8 + i) * 6, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      }
    }

    // 5. MIDGROUND FOOTHILLS & SAL FORESTS (Parallax 0.35)
    ctx.fillStyle = theme === 'betla' ? '#1B5E20' : (theme === 'jamshedpur' ? '#37474F' : '#311B92');
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

    // 6. MIDGROUND VEGETATION / SILHOUETTES
    ctx.fillStyle = theme === 'betla' ? '#004D40' : (theme === 'jamshedpur' ? '#212121' : '#2E7D32');
    for (let i = 0; i < 18; i++) {
      const treeWorldX = i * 220;
      const screenX = treeWorldX - camX * 0.45;
      if (screenX > -60 && screenX < this.width + 60) {
        if (theme === 'jamshedpur') {
          // Industrial chimneys & blast towers
          ctx.fillRect(screenX + 14, this.height - 200, 14, 110);
          ctx.fillRect(screenX + 8, this.height - 210, 26, 12);
        } else {
          // Sal / Mahua trees
          ctx.fillRect(screenX + 16, this.height - 180, 8, 90);
          ctx.beginPath();
          ctx.arc(screenX + 20, this.height - 210, 32, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  drawPlatforms(ctx, platforms, camX, camY, assistMode) {
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
        // ANIMATED RUSHING WATER PLATFORM (Hundru Falls / Damodar Basin)
        ctx.fillStyle = '#0288D1';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        // Water surface foam
        ctx.fillStyle = '#E1F5FE';
        ctx.fillRect(drawX, drawY, p.width, 6);

        // Animated flow wave chevrons
        const speedDir = (p.currentSpeed && p.currentSpeed < 0) ? -1 : 1;
        const waveShift = ((this.waterFlowOffset * speedDir) % 40);
        ctx.strokeStyle = '#B3E5FC';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let wx = drawX + waveShift - 40; wx < drawX + p.width + 20; wx += 30) {
          if (wx >= drawX && wx <= drawX + p.width - 15) {
            ctx.moveTo(wx, drawY + 3);
            ctx.lineTo(wx + 8 * speedDir, drawY + 8);
            ctx.lineTo(wx + 16 * speedDir, drawY + 3);
          }
        }
        ctx.stroke();

        // Water spray bubbles on corners
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(drawX + 8, drawY + 3, 3, 0, Math.PI * 2);
        ctx.arc(drawX + p.width - 8, drawY + 3, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.surfaceType === 'conveyor') {
        // ANIMATED INDUSTRIAL CONVEYOR BELT (Jamshedpur Steel / Dhanbad Mines)
        ctx.fillStyle = '#424242';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        // Conveyor belt track top
        ctx.fillStyle = '#212121';
        ctx.fillRect(drawX, drawY, p.width, 8);

        // Animated direction chevrons
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
        ctx.fillStyle = '#757575';
        for (let rx = drawX + 10; rx < drawX + p.width - 10; rx += 28) {
          ctx.beginPath();
          ctx.arc(rx, drawY + 16, 5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.surfaceType === 'stone') {
        // RANCHI / PARASNATH / DEOGHAR GRANITE ROCK
        ctx.fillStyle = p.isAssist ? '#FFB300' : '#546E7A';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        ctx.fillStyle = '#78909C';
        ctx.fillRect(drawX, drawY, p.width, 6);

        // Stone masonry cracks & Sohrai motifs
        ctx.strokeStyle = '#37474F';
        ctx.lineWidth = 1.5;
        for (let sx = drawX + 25; sx < drawX + p.width; sx += 40) {
          ctx.beginPath();
          ctx.moveTo(sx, drawY + 6);
          ctx.lineTo(sx, drawY + p.height);
          ctx.stroke();
        }

      } else if (p.surfaceType === 'wood') {
        // SAL TIMBER PLANK RUNWAY
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(drawX, drawY, p.width, 4);

        // Timber gaps
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        for (let px = drawX + 18; px < drawX + p.width; px += 24) {
          ctx.beginPath();
          ctx.moveTo(px, drawY);
          ctx.lineTo(px, drawY + p.height);
          ctx.stroke();
        }

      } else {
        // DEFAULT RED SOIL (MURRAM OF JHARKHAND)
        ctx.fillStyle = p.isAssist ? '#FFB300' : '#8D4024';
        ctx.fillRect(drawX, drawY, p.width, p.height);

        // Grass top
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(drawX, drawY, p.width, 10);

        // Grass blades
        ctx.fillStyle = '#388E3C';
        for (let bx = drawX; bx < drawX + p.width - 6; bx += 10) {
          ctx.beginPath();
          ctx.moveTo(bx, drawY);
          ctx.lineTo(bx + 3, drawY - 5);
          ctx.lineTo(bx + 6, drawY);
          ctx.fill();
        }

        // Sohrai tribal white decorative line accents
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let sx = drawX + 10; sx < drawX + p.width - 20; sx += 30) {
          ctx.moveTo(sx, drawY + 22);
          ctx.lineTo(sx + 15, drawY + 36);
          ctx.lineTo(sx + 30, drawY + 22);
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
