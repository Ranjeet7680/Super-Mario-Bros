/**
 * Input Management Engine
 * Comprehensive multi-platform support:
 * - PC Keyboard & Mouse
 * - Full PlayStation 5 (DualSense) & standard Gamepad API support with vibration haptics
 * - Virtual Mobile Touch Controls with customizable mode switch (Auto / PC / Mobile / PS5)
 * Adheres to Section 4 & 24 of the Game Architecture Bible.
 * Authors: RAJRANJEET7680
 */

export class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.justReleased = {};

    // Action states
    this.actions = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      jumpDown: false,
      dash: false,
      dashDown: false,
      jumpPad: false,
      jumpPadDown: false,
      interact: false,
      interactDown: false,
      pause: false,
      pauseDown: false
    };

    this.prevActions = { ...this.actions };

    // Mobile / Touch virtual state
    this.touchState = {
      left: false,
      right: false,
      down: false,
      jump: false,
      dash: false,
      jumpPad: false,
      interact: false
    };

    // Control Mode: 'auto' | 'pc' | 'mobile' | 'ps5'
    this.controlMode = localStorage.getItem('rrr_control_mode') || 'auto';
    this.hasGamepad = false;
    this.isPS5 = false;
    this.gamepadId = '';

    this.initKeyboard();
    this.initGamepad();
    this.applyControlMode();
  }

  setControlMode(mode) {
    this.controlMode = mode;
    try {
      localStorage.setItem('rrr_control_mode', mode);
    } catch (e) {}
    this.applyControlMode();
    return this.controlMode;
  }

  cycleControlMode() {
    const modes = ['auto', 'pc', 'mobile', 'ps5'];
    const nextIdx = (modes.indexOf(this.controlMode) + 1) % modes.length;
    return this.setControlMode(modes[nextIdx]);
  }

  applyControlMode() {
    const touchEl = document.getElementById('touch-controls');
    if (!touchEl) return;

    if (this.controlMode === 'mobile') {
      touchEl.classList.remove('force-hidden');
      touchEl.classList.add('force-visible');
    } else if (this.controlMode === 'pc' || this.controlMode === 'ps5') {
      touchEl.classList.remove('force-visible');
      touchEl.classList.add('force-hidden');
    } else {
      // Auto: Let media queries handle it or show on touch device
      touchEl.classList.remove('force-visible');
      touchEl.classList.remove('force-hidden');
    }
  }

  setTouch(action, isPressed) {
    if (this.touchState[action] !== undefined) {
      this.touchState[action] = isPressed;
    }
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys[e.code]) {
        this.justPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.justReleased[e.code] = true;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      this.justPressed = {};
      this.justReleased = {};
      Object.keys(this.touchState).forEach(k => this.touchState[k] = false);
    });
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.hasGamepad = true;
      this.gamepadId = e.gamepad.id || '';
      const idLower = this.gamepadId.toLowerCase();
      this.isPS5 = idLower.includes('dualsense') || 
                   idLower.includes('wireless controller') || 
                   idLower.includes('054c') ||
                   idLower.includes('playstation');
      console.log(`[Input] Controller connected: ${this.gamepadId} (PS5 DualSense: ${this.isPS5})`);
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.hasGamepad = false;
      this.isPS5 = false;
      this.gamepadId = '';
      console.log(`[Input] Controller disconnected`);
    });
  }

  /**
   * PlayStation 5 DualSense Haptic Feedback / Gamepad Vibration
   */
  vibrate(duration = 120, weakMagnitude = 0.4, strongMagnitude = 0.5) {
    if (!navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i];
      if (gp && gp.vibrationActuator && gp.vibrationActuator.playEffect) {
        try {
          gp.vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: duration,
            weakMagnitude: weakMagnitude,
            strongMagnitude: strongMagnitude
          }).catch(() => {});
        } catch (e) {}
      }
    }
  }

  getControlsPrompt() {
    if (this.controlMode === 'ps5' || (this.controlMode === 'auto' && this.isPS5)) {
      return '[✕] Jump | [L1] Jump Pad | [▢ / R1] Dash | [△] Talk | [▼ / L2] Fast Fall | [OPTIONS] Pause';
    } else if (this.controlMode === 'mobile') {
      return '[◀ / ▶] Run | [⬆️] Jump | [🌸] Jump Pad | [⚡] Dash | [▼] Fast Fall | [🗣️] Talk';
    } else if (this.controlMode === 'auto' && this.hasGamepad) {
      return '[A / ✕] Jump | [LB / ◯] Jump Pad | [X / ▢] Dash | [Y / △] Talk | [START] Pause';
    } else {
      return '[A/D or ←/→] Run | [W or Space] Jump (S+Jump High) | [C] Jump Pad | [Shift or K] Dash | [S or ↓] Fast Fall | [E] Talk';
    }
  }

  update() {
    this.prevActions = { ...this.actions };

    // 1. Keyboard Inputs
    const kLeft = this.keys['KeyA'] || this.keys['ArrowLeft'];
    const kRight = this.keys['KeyD'] || this.keys['ArrowRight'];
    const kUp = this.keys['KeyW'] || this.keys['ArrowUp'];
    const kDown = this.keys['KeyS'] || this.keys['ArrowDown'];
    const kJump = this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp'];
    const kDash = this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['KeyK'] || this.keys['KeyX'];
    const kJumpPad = this.keys['KeyC'] || this.keys['KeyJ'];
    const kInteract = this.keys['KeyE'] || this.keys['KeyF'];
    const kPause = this.keys['Escape'] || this.keys['KeyP'];

    // 2. Mobile Virtual Touch Inputs
    const tLeft = this.touchState.left;
    const tRight = this.touchState.right;
    const tDown = this.touchState.down;
    const tJump = this.touchState.jump;
    const tDash = this.touchState.dash;
    const tJumpPad = this.touchState.jumpPad;
    const tInteract = this.touchState.interact;

    // 3. PlayStation 5 & Standard Gamepad Polling
    let gpLeft = false, gpRight = false, gpDown = false;
    let gpJump = false, gpDash = false, gpJumpPad = false, gpInteract = false, gpPause = false;

    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      if (gamepads && gamepads[0]) {
        const gp = gamepads[0];
        this.hasGamepad = true;
        const idLower = (gp.id || '').toLowerCase();
        this.isPS5 = idLower.includes('dualsense') || idLower.includes('wireless controller') || idLower.includes('054c');

        const deadZone = 0.22;
        const axisX = gp.axes[0] || 0;
        const axisY = gp.axes[1] || 0;

        // Directional controls: Left Analog Stick OR D-Pad
        gpLeft = axisX < -deadZone || Boolean(gp.buttons[14]?.pressed);
        gpRight = axisX > deadZone || Boolean(gp.buttons[15]?.pressed);
        gpDown = axisY > deadZone || Boolean(gp.buttons[13]?.pressed) || Boolean(gp.buttons[6]?.pressed);

        // PS5 & Standard Gamepad Button Map:
        // buttons[0] = Cross (✕) -> Jump
        // buttons[1] = Circle (◯) -> Jump Pad / Action
        // buttons[2] = Square (▢) -> Dash
        // buttons[3] = Triangle (△) -> Talk / Interact
        // buttons[4] = L1 -> Jump Pad Ability
        // buttons[5] = R1 -> Dash
        // buttons[7] = R2 -> Dash
        // buttons[9] = Options / Start -> Pause
        gpJump = Boolean(gp.buttons[0]?.pressed);
        gpDash = Boolean(gp.buttons[2]?.pressed || gp.buttons[5]?.pressed || gp.buttons[7]?.pressed);
        gpJumpPad = Boolean(gp.buttons[4]?.pressed || gp.buttons[1]?.pressed);
        gpInteract = Boolean(gp.buttons[3]?.pressed);
        gpPause = Boolean(gp.buttons[9]?.pressed || gp.buttons[8]?.pressed);
      }
    }

    // Merge active input channels
    this.actions.left = Boolean(kLeft || tLeft || gpLeft);
    this.actions.right = Boolean(kRight || tRight || gpRight);
    this.actions.up = Boolean(kUp);
    this.actions.down = Boolean(kDown || tDown || gpDown);
    this.actions.jump = Boolean(kJump || tJump || gpJump);
    this.actions.dash = Boolean(kDash || tDash || gpDash);
    this.actions.jumpPad = Boolean(kJumpPad || tJumpPad || gpJumpPad);
    this.actions.interact = Boolean(kInteract || tInteract || gpInteract);
    this.actions.pause = Boolean(kPause || gpPause);

    // Frame-exact edge triggers
    this.actions.jumpDown = this.actions.jump && !this.prevActions.jump;
    this.actions.dashDown = this.actions.dash && !this.prevActions.dash;
    this.actions.jumpPadDown = this.actions.jumpPad && !this.prevActions.jumpPad;
    this.actions.interactDown = this.actions.interact && !this.prevActions.interact;
    this.actions.pauseDown = this.actions.pause && !this.prevActions.pause;

    // Reset single-frame key caches
    this.justPressed = {};
    this.justReleased = {};
  }
}
