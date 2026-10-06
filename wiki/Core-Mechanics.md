# Core Platforming Mechanics

Adhering to Section 4 of the Game Architecture Bible.

---

## 🏃 1. Movement Physics

* **Ground Acceleration:** 1350 px/s²
* **Ground Friction:** 1500 px/s²
* **Air Acceleration:** 950 px/s²
* **Air Friction:** 500 px/s²
* **Maximum Horizontal Speed:** 230 px/s
* **Base Gravity:** 1100 px/s²
* **Terminal Fall Speed:** 550 px/s

---

## 🦘 2. Jump Architecture & Fairness

* **Variable Height Jump:** Jump launch force (-380 px/s) + up to 180ms of held-jump boost (-280 px/s).
* **Coyote Time (120ms):** Allows jumping after walking off a ledge.
* **Jump Buffering (120ms):** Buffers jump inputs before landing on ground.
* **Fast Fall (1900 px/s²):** Pressing `S` or `Down Arrow` while airborne increases downward velocity for aerial control.

---

## ⚡ 3. Dash & Combat System

* **Dash Speed:** 440 px/s
* **Dash Duration:** 180ms
* **Dash Cooldown:** 600ms
* **Invulnerability Frames:** Grants immunity and allows defeating grounded enemies on contact.
* **Stomp Bounce:** Landing on enemy heads launches the player upward (-340 to -360 px/s).
