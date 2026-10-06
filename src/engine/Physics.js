/**
 * 2D Physics & Collision Engine
 * AABB collision resolution with solid tiles, one-way platforms, and surface friction profiles.
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
   * Resolves entity collisions against an array of platform rects.
   * Supports solid blocks and one-way (jump-through) platforms.
   */
  static resolvePlatformCollisions(entity, platforms, dt) {
    // Horizontal resolution
    entity.x += entity.vx * dt;
    let box = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };

    for (const plat of platforms) {
      if (plat.oneWay) continue; // One-way platforms don't block horizontally
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
        // Only land on top of one-way platforms if coming from above
        const prevBottom = prevY + entity.height;
        if (entity.vy >= 0 && prevBottom <= plat.y + 10) {
          entity.y = plat.y - entity.height;
          entity.vy = 0;
          entity.isGrounded = true;
          entity.currentSurface = plat.surfaceType || 'ground';
          box.y = entity.y;
        }
      } else {
        // Solid block collision
        if (entity.vy > 0) {
          entity.y = plat.y - entity.height;
          entity.vy = 0;
          entity.isGrounded = true;
          entity.currentSurface = plat.surfaceType || 'ground';
        } else if (entity.vy < 0) {
          entity.y = plat.y + plat.height;
          entity.vy = 0;
        }
        box.y = entity.y;
      }
    }
  }
}
