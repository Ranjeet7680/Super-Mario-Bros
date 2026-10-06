# Core Platforming Mechanics

Adhering to Section 4 of the Game Architecture Bible.

<div align="center">
  <img src="https://raw.githubusercontent.com/Ranjeet7680/Super-Mario-Bros/main/assets/diagram-player-physics.svg" alt="Player Physics Envelope" width="100%" />
</div>

<br/>

---

## 🏃 1. Movement Physics & Acceleration

The player movement is engineered to feel responsive, physical, and fair across all surfaces:

| Parameter | Ground Value | Airborne Value | Unit / Description |
| :--- | :--- | :--- | :--- |
| **Acceleration** | 1350 | 950 | px/s² — Snappy start with controllable air steering |
| **Friction / Decel** | 1500 | 500 | px/s² — Tactile stopping power |
| **Max Horizontal Speed** | 230 | 230 | px/s — Smooth running velocity |
| **Base Gravity** | 1100 | 1100 | px/s² |
| **Fast-Fall Gravity** | 1900 | 1900 | px/s² — Activated by pressing Down (`S` or `↓`) |
| **Terminal Velocity** | 550 | 550 | px/s |

---

## 🦘 2. Jump Architecture & Fairness Guarantees

* **Variable Height Jump:** Pressing jump initiates an impulse velocity of `-380 px/s`. Holding the jump key continues applying an upward boost of `-280 px/s` for up to $180\text{ms}$.
* **Coyote Time ($120\text{ms}$):** A $120\text{ms}$ grace period after running off an edge allows the player to still jump, preventing unfair falls.
* **Jump Buffering ($120\text{ms}$):** If the player presses jump within $120\text{ms}$ of touching the ground, the input is buffered and executed on the exact frame of landing.
* **Squash & Stretch:** Dynamic sprite scaling ($0.7\times$ width, $1.35\times$ height on launch; $1.35\times$ width, $0.7\times$ height on landing) communicates weight and momentum.

---

## ⚡ 3. Dash & Combat System

* **Dash Burst:** $440\text{px/s}$ forward velocity for $180\text{ms}$ with full invulnerability frames. Cooldown: $600\text{ms}$.
* **Head Stomp:** Landing on enemy heads triggers a bounce impulse of `-340 px/s` to `-360 px/s` and defeats basic enemies.
* **Dash Attack:** Dashing through ground enemies defeats them instantly with a particle burst and score reward.
