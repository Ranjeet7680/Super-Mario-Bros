/**
 * World 1-1 Level Data: Ranchi Plateau Gateway
 * Data-driven architecture adhering to Section 7, 10, 22, 31 of both Game Architecture Documents.
 * Features 8 cohesive micro-sections:
 * Safe Opening -> Teaching Room -> First Test -> Checkpoint -> Escalation -> Secret High Canopy -> Combined Challenge -> Gateway Finale.
 */

export const Level_1_1 = {
  id: 'world-1-1',
  name: 'World 1-1: Ranchi Plateau Gateway',
  width: 3800,
  height: 600,
  playerSpawn: { x: 80, y: 440 },

  // Level Geometry
  platforms: [
    // --- Section 1: Safe Opening Landmark (0 - 450) ---
    { x: 0, y: 490, width: 480, height: 110, surfaceType: 'ground' },

    // --- Section 2: Teaching Room (Gentle steps & first Echo Shards) (480 - 950) ---
    { x: 480, y: 520, width: 220, height: 80, surfaceType: 'ground' },
    { x: 740, y: 470, width: 180, height: 130, surfaceType: 'ground' },
    { x: 960, y: 420, width: 220, height: 180, surfaceType: 'ground' },

    // Intermediate floating platforms
    { x: 620, y: 390, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 820, y: 330, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // --- Section 3: First Test (Patrol Beetle area & gap) (1050 - 1500) ---
    { x: 1220, y: 440, width: 340, height: 160, surfaceType: 'stone' },
    { x: 1400, y: 350, width: 110, height: 16, oneWay: true, surfaceType: 'stone' },

    // --- Section 4: Checkpoint 1 Lantern Shrine (1600 - 1900) ---
    { x: 1620, y: 470, width: 300, height: 130, surfaceType: 'ground' },

    // --- Section 5: Forest Charger Escalation (1960 - 2480) ---
    { x: 1960, y: 490, width: 500, height: 110, surfaceType: 'ground' },
    { x: 2120, y: 400, width: 120, height: 16, oneWay: true, surfaceType: 'wood' },

    // --- Section 6: Optional High Secret Route (Canopy path above Section 5 & 6) ---
    // Reached via Spring Flower at x: 1980
    { x: 2040, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2240, y: 170, width: 150, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2460, y: 140, width: 200, height: 16, oneWay: true, surfaceType: 'stone' }, // Secret Lore Cache

    // --- Section 7: Combined Challenge (Moving platforms & Hazards) (2500 - 3250) ---
    { x: 2500, y: 520, width: 180, height: 80, surfaceType: 'stone' },
    { x: 2740, y: 470, width: 140, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2940, y: 430, width: 140, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 3140, y: 490, width: 220, height: 110, surfaceType: 'stone' },

    // Recovery bottom platform (Assist mode support)
    { x: 2680, y: 575, width: 440, height: 25, surfaceType: 'ground', isAssist: true },

    // --- Section 8: Gateway Finale (Torana Arch) (3380 - 3800) ---
    { x: 3380, y: 460, width: 420, height: 140, surfaceType: 'ground' }
  ],

  // Checkpoints
  checkpoints: [
    { id: 1, x: 1660, y: 410 },
    { id: 2, x: 3180, y: 430 }
  ],

  // Collectible Echo Shards
  shards: [
    // Section 1 & 2 Shards (Teaching jump arc)
    { id: 0, x: 360, y: 440, isRare: false },
    { id: 1, x: 570, y: 460, isRare: false },
    { id: 2, x: 660, y: 340, isRare: false },
    { id: 3, x: 860, y: 280, isRare: false },
    { id: 4, x: 1040, y: 370, isRare: false },

    // Section 3 Shards (Risk/reward above patrol beetle)
    { id: 5, x: 1330, y: 390, isRare: false },
    { id: 6, x: 1450, y: 300, isRare: false },

    // Section 5 Shards (Charger lane)
    { id: 7, x: 2170, y: 350, isRare: false },

    // Section 6 SECRET ROUTE Rare Shards (Gold)
    { id: 8, x: 2100, y: 170, isRare: true },
    { id: 9, x: 2310, y: 120, isRare: true },
    { id: 10, x: 2550, y: 90, isRare: true },

    // Section 7 Shards (Cascade crossing)
    { id: 11, x: 2800, y: 410, isRare: false },
    { id: 12, x: 3000, y: 370, isRare: false }
  ],

  // Spring Bounce Flowers
  springs: [
    { x: 1980, y: 462 }, // Launches player to high secret canopy
    { x: 2600, y: 492 }  // High bounce across cascade
  ],

  // Enemies
  enemies: {
    beetles: [
      { x: 1250, y: 416, left: 1220, right: 1560 },
      { x: 2520, y: 496, left: 2500, right: 2680 },
      { x: 3200, y: 466, left: 3140, right: 3360 }
    ],
    chargers: [
      { x: 2200, y: 458, left: 1980, right: 2450 }
    ]
  },

  // NPCs
  npcElder: { x: 210, y: 440 },

  // Lore Tablet in Secret Canopy
  loreTablet: { x: 2580, y: 92 },

  // Goal Gateway Arch
  goalGateway: { x: 3580, y: 350 }
};
