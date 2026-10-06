/**
 * Input Management Engine
 * Abstracted input handling for Keyboard, Gamepad, and Virtual Touch controls.
 * Adheres to Section 4 & 24 of the Game Architecture Bible.
 */

export class Input {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.justReleased = {};

    // Action mappings
    this.actions = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      jumpDown: false,
      dash: false,
      interact: false,
      pause: false
    };

    this.prevActions = { ...this.actions };

    // Mobile / Touch virtual state
    this.touchState = {
      left: false,
      right: false,
      down: false,
      jump: false,
      dash: false,
      interact: false
    };

    this.initKeyboard();
    this.initGamepad();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent browser default scrolling for game keys
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
    });
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`[Input] Gamepad connected: ${e.gamepad.id}`);
    });
    window.addEventListener('gamepaddisconnected', () => {
      console.log(`[Input] Gamepad disconnected`);
    });
  }

  update() {
    // Preserve previous actions for justPressed detection
    this.prevActions = { ...this.actions };

    // Poll keyboard
    const kLeft = this.keys['KeyA'] || this.keys['ArrowLeft'] || this.touchState.left;
    const kRight = this.keys['KeyD'] || this.keys['ArrowRight'] || this.touchState.right;
    const kUp = this.keys['KeyW'] || this.keys['ArrowUp'];
    const kDown = this.keys['KeyS'] || this.keys['ArrowDown'] || this.touchState.down;
    const kJump = this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp'] || this.touchState.jump;
    const kDash = this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['KeyK'] || this.keys['KeyX'] || this.touchState.dash;
    const kInteract = this.keys['KeyE'] || this.keys['KeyF'] || this.touchState.interact;
    const kPause = this.keys['Escape'] || this.keys['KeyP'];

    // Poll Gamepad if present
    let gpLeft = false, gpRight = false, gpDown = false, gpJump = false, gpDash = false, gpInteract = false, gpPause = false;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (gamepads && gamepads[0]) {
      const gp = gamepads[0];
      const deadZone = 0.25;
      const axisX = gp.axes[0] || 0;
      const axisY = gp.axes[1] || 0;

      gpLeft = axisX < -deadZone || gp.buttons[14]?.pressed;
      gpRight = axisX > deadZone || gp.buttons[15]?.pressed;
      gpDown = axisY > deadZone || gp.buttons[13]?.pressed;

      gpJump = gp.buttons[0]?.pressed || gp.buttons[1]?.pressed; // A / B
      gpDash = gp.buttons[2]?.pressed || gp.buttons[5]?.pressed; // X / RB
      gpInteract = gp.buttons[3]?.pressed || gp.buttons[4]?.pressed; // Y / LB
      gpPause = gp.buttons[9]?.pressed; // Start / Menu
    }

    this.actions.left = Boolean(kLeft || gpLeft);
    this.actions.right = Boolean(kRight || gpRight);
    this.actions.up = Boolean(kUp);
    this.actions.down = Boolean(kDown || gpDown);
    this.actions.jump = Boolean(kJump || gpJump);
    this.actions.dash = Boolean(kDash || gpDash);
    this.actions.interact = Boolean(kInteract || gpInteract);
    this.actions.pause = Boolean(kPause || gpPause);

    // Single-frame triggers
    this.actions.jumpDown = this.actions.jump && !this.prevActions.jump;
    this.actions.dashDown = this.actions.dash && !this.prevActions.dash;
    this.actions.interactDown = this.actions.interact && !this.prevActions.interact;
    this.actions.pauseDown = this.actions.pause && !this.prevActions.pause;

    // Reset single frame maps
    this.justPressed = {};
    this.justReleased = {};
  }

  setTouch(action, isPressed) {
    if (this.touchState.hasOwnProperty(action)) {
      this.touchState[action] = isPressed;
    }
  }
}
