/**
 * 2D Camera Engine
 * Bounded horizontal follow with predictive look-ahead and vertical dead zones.
 * Adheres to Section 5 & 20 of the Game Architecture Bible.
 */

export class Camera {
  constructor(viewportWidth = 960, viewportHeight = 540) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    // Predictive look-ahead
    this.lookAhead = 0;
    this.maxLookAhead = 70;
    this.lookAheadSpeed = 3.0;

    // Vertical dead zone
    this.deadZoneTop = 180;
    this.deadZoneBottom = 340;

    // Screen Shake
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.shakeEnabled = true;

    // Level bounds
    this.bounds = { minX: 0, maxX: 6000, minY: 0, maxY: 600 };
  }

  setBounds(minX, maxX, minY, maxY) {
    this.bounds = { minX, maxX, minY, maxY };
  }

  addShake(intensity) {
    if (!this.shakeEnabled) return;
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  update(target, dt) {
    if (!target) return;

    // Look-ahead based on player facing/velocity
    const targetLook = target.facing * (Math.abs(target.vx) > 30 ? this.maxLookAhead : 0);
    this.lookAhead += (targetLook - this.lookAhead) * (this.lookAheadSpeed * dt);

    // Horizontal target
    this.targetX = target.x + target.width / 2 - this.viewportWidth / 2 + this.lookAhead;

    // Vertical dead zone logic
    const screenTargetY = target.y - this.y;
    if (screenTargetY < this.deadZoneTop) {
      this.targetY = target.y - this.deadZoneTop;
    } else if (screenTargetY > this.deadZoneBottom) {
      this.targetY = target.y - this.deadZoneBottom;
    }

    // Smooth lerp
    this.x += (this.targetX - this.x) * (6.0 * dt);
    this.y += (this.targetY - this.y) * (4.5 * dt);

    // Clamp within level boundaries
    const maxClampX = Math.max(this.bounds.minX, this.bounds.maxX - this.viewportWidth);
    const maxClampY = Math.max(this.bounds.minY, this.bounds.maxY - this.viewportHeight);

    this.x = Math.max(this.bounds.minX, Math.min(this.x, maxClampX));
    this.y = Math.max(this.bounds.minY, Math.min(this.y, maxClampY));

    // Calculate Screen Shake
    if (this.shakeIntensity > 0.3) {
      this.shakeOffsetX = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeOffsetY = (Math.random() * 2 - 1) * this.shakeIntensity;
      this.shakeIntensity *= Math.pow(this.shakeDecay, dt * 60);
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
  }

  getRenderX() {
    return Math.round(this.x + this.shakeOffsetX);
  }

  getRenderY() {
    return Math.round(this.y + this.shakeOffsetY);
  }
}
