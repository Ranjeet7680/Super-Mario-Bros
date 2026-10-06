/**
 * 2D Physics & Collision Engine
 * AABB collision resolution with solid tiles, one-way platforms, moving platforms,
 * water currents, conveyor belts, and surface friction profiles.
 * Adheres to Section 4 of the Game Architecture Bible.
 */

export class Physics {
  static checkAABB(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Updates platform positions for moving platforms.
   */
  static updatePlatforms(platforms, totalTime) {
    for (const p of platforms) {
      if (p.moving) {
        if (p.baseX === undefined) p.baseX = p.x;
        if (p.baseY === undefined) p.baseY = p.y;

        const prevX = p.x;
        const prevY = p.y;
        const offset = Math.sin(totalTime * (p.moveSpeed || 2.0)) * (p.moveRange || 60);

        if (p.axis === 'y') {
          p.y = p.baseY + offset;
          p.dx = 0;
          p.dy = p.y - prevY;
        } else {
          p.x = p.baseX + offset;
          p.dx = p.x - prevX;
          p.dy = 0;
        }
      } else {
        p.dx = 0;
        p.dy = 0;
      }
    }
  }

  /**
   * Resolves entity collisions against an array of platform rects.
   * Supports solid blocks, one-way ledges, moving platforms, and surface currents.
   */
  static resolvePlatformCollisions(entity, platforms, dt) {
    // Horizontal resolution
    entity.x += entity.vx * dt;
    let box = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };

    for (const plat of platforms) {
      if (plat.oneWay) continue;
      if (this.checkAABB(box, plat)) {
        if (entity.vx > 0) {
          entity.x = plat.x - entity.width;
          entity.vx = 0;
        } else if (entity.vx < 0) {
          entity.x = plat.x + plat.width;
          entity.vx = 0;
        }
        box.x = entity.x;
      }
    }

    // Vertical resolution
    const prevY = entity.y;
    entity.y += entity.vy * dt;
    box = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
    entity.isGrounded = false;
    entity.currentSurface = 'ground';

    for (const plat of platforms) {
      if (!this.checkAABB(box, plat)) continue;

      if (plat.oneWay) {
        // One-way jump-through ledge
        const prevBottom = prevY + entity.height;
        if (entity.vy >= 0 && prevBottom <= plat.y + 12) {
          entity.y = plat.y - entity.height;
          entity.vy = 0;
          entity.isGrounded = true;
          entity.currentSurface = plat.surfaceType || 'ground';
          box.y = entity.y;

          // Carry entity with moving platform
          if (plat.moving) {
            entity.x += (plat.dx || 0);
            entity.y += (plat.dy || 0);
          }

          // Apply conveyor or water surface push
          if (plat.currentSpeed) {
            entity.x += plat.currentSpeed * dt;
          }
        }
      } else {
        // Solid block collision
        if (entity.vy > 0) {
          entity.y = plat.y - entity.height;
          entity.vy = 0;
          entity.isGrounded = true;
          entity.currentSurface = plat.surfaceType || 'ground';

          if (plat.moving) {
            entity.x += (plat.dx || 0);
            entity.y += (plat.dy || 0);
          }

          if (plat.currentSpeed) {
            entity.x += plat.currentSpeed * dt;
          }
        } else if (entity.vy < 0) {
          entity.y = plat.y + plat.height;
          entity.vy = 0;
        }
        box.y = entity.y;
      }
    }
  }
}
