/**
 * RRR — Jharkhand Quest: Complete 8-Region Level Data Architecture
 * Adheres to Sections 7, 8, 10, 22, 31, 35 of the Game Architecture Bible.
 *
 * 8 Authentic Jharkhand Regions:
 * 1. World 1-1: Ranchi Plateau Gateway (Red soil, Sal groves, teaching jumps)
 * 2. World 2-1: Hundru Falls Wilds (Cascading falls, rushing water platforms, spray springs)
 * 3. World 3-1: Netarhat Sunset Hills (Queen of Chotanagpur, mountain wind gusts, twilight clouds)
 * 4. World 4-1: Betla Forest Frontier (Dense jungle canopy, chargers in patrol groves, ancient fort ruins)
 * 5. World 5-1: Deoghar Heritage-City (Baidyanath Dham, sacred temple arches, bell chime platforms)
 * 6. World 6-1: Jamshedpur Industrial Run (Steel mills, reversible conveyor belts, crane lifts)
 * 7. World 7-1: Dhanbad Coal-Mine Depths (Subterranean mine shafts, minecart rails, collapsible timber)
 * 8. World 8-1: Damodar Storm Summit (Climactic tempest, lightning flashes, combined elements, final Gateway)
 */

export const Level_1_1 = {
  id: 'world-1-1',
  worldNum: 1,
  name: 'World 1-1: Ranchi Plateau Gateway',
  regionKey: 'world1Title',
  theme: 'ranchi',
  width: 3800,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  // Level Geometry
  platforms: [
    // Section 1: Safe Opening Landmark (0 - 450)
    { x: 0, y: 490, width: 480, height: 110, surfaceType: 'ground' },

    // Section 2: Teaching Room (Gentle steps & first Echo Shards) (480 - 950)
    { x: 480, y: 520, width: 220, height: 80, surfaceType: 'ground' },
    { x: 740, y: 470, width: 180, height: 130, surfaceType: 'ground' },
    { x: 960, y: 420, width: 220, height: 180, surfaceType: 'ground' },
    { x: 620, y: 390, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 820, y: 330, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 3: First Test (Patrol Beetle area & gap) (1050 - 1500)
    { x: 1220, y: 440, width: 340, height: 160, surfaceType: 'stone' },
    { x: 1400, y: 350, width: 110, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 4: Checkpoint 1 Lantern Shrine (1600 - 1900)
    { x: 1620, y: 470, width: 300, height: 130, surfaceType: 'ground' },

    // Section 5: Forest Charger Escalation (1960 - 2480)
    { x: 1960, y: 490, width: 500, height: 110, surfaceType: 'ground' },
    { x: 2120, y: 400, width: 120, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 6: High Secret Route (Canopy path reached via Spring Flower)
    { x: 2040, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2240, y: 170, width: 150, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2460, y: 140, width: 200, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Combined Challenge (Moving & Floating Ledges) (2500 - 3250)
    { x: 2500, y: 520, width: 180, height: 80, surfaceType: 'stone' },
    { x: 2740, y: 470, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 1.5, axis: 'x' },
    { x: 2940, y: 430, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 40, moveSpeed: 2.0, axis: 'y' },
    { x: 3140, y: 490, width: 220, height: 110, surfaceType: 'stone' },

    // Assist mode recovery ledges
    { x: 1060, y: 515, width: 480, height: 40, surfaceType: 'ground', isAssist: true },
    { x: 2680, y: 505, width: 440, height: 45, surfaceType: 'ground', isAssist: true },

    // Section 8: Gateway Finale (Torana Arch) (3380 - 3800)
    { x: 3380, y: 460, width: 420, height: 140, surfaceType: 'ground' }
  ],

  checkpoints: [
    { id: 1, x: 1660, y: 410 },
    { id: 2, x: 3180, y: 430 }
  ],

  shards: [
    { id: 0, x: 360, y: 440, isRare: false },
    { id: 1, x: 570, y: 460, isRare: false },
    { id: 2, x: 660, y: 340, isRare: false },
    { id: 3, x: 860, y: 280, isRare: false },
    { id: 4, x: 1040, y: 370, isRare: false },
    { id: 5, x: 1330, y: 390, isRare: false },
    { id: 6, x: 1450, y: 300, isRare: false },
    { id: 7, x: 2170, y: 350, isRare: false },
    { id: 8, x: 2100, y: 170, isRare: true },
    { id: 9, x: 2310, y: 120, isRare: true },
    { id: 10, x: 2550, y: 90, isRare: true },
    { id: 11, x: 2800, y: 410, isRare: false },
    { id: 12, x: 3000, y: 370, isRare: false }
  ],

  springs: [
    { x: 1980, y: 462 },
    { x: 2600, y: 492 }
  ],

  enemies: {
    beetles: [
      { x: 1280, y: 416, left: 1260, right: 1560 },
      { x: 2520, y: 496, left: 2500, right: 2680 },
      { x: 3200, y: 466, left: 3140, right: 3360 }
    ],
    chargers: [
      { x: 2200, y: 458, left: 1980, right: 2450 }
    ]
  },

  temples: [
    { x: 1780, y: 350, templeType: 'jagannath', name: 'Pahari Mandir Ranchi', deity: 'Lord Shiva' },
    { x: 2520, y: 20, templeType: 'dewri', name: 'Dewri Mandir Tamar', deity: '16-Armed Durga' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2580, y: 92 },
  goalGateway: { x: 3580, y: 350 }
};

export const Level_2_1 = {
  id: 'world-2-1',
  worldNum: 2,
  name: 'World 2-1: Hundru Falls Wilds',
  regionKey: 'world2Title',
  theme: 'hundru',
  width: 4000,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  platforms: [
    // Section 1: Mist-drenched Valley Entry (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'stone' },

    // Section 2: Waterfall Spray Stepping Stones (540 - 1100)
    { x: 540, y: 470, width: 160, height: 130, surfaceType: 'water', currentSpeed: 45 },
    { x: 690, y: 395, width: 100, height: 16, oneWay: true, surfaceType: 'wood' }, // Stepping wood ledge
    { x: 770, y: 440, width: 150, height: 160, surfaceType: 'water', currentSpeed: 55 },
    { x: 950, y: 400, width: 180, height: 200, surfaceType: 'stone' },

    // Section 2 Assist platform
    { x: 510, y: 520, width: 440, height: 35, surfaceType: 'stone', isAssist: true },

    // Section 3: The Great Cascade Lift (1140 - 1650)
    { x: 1160, y: 460, width: 180, height: 140, surfaceType: 'stone' },
    { x: 1370, y: 400, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.0, axis: 'y' },
    { x: 1540, y: 340, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 1.8, axis: 'x' },
    { x: 1220, y: 515, width: 440, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 4: Mid-Falls Shrine Checkpoint (1680 - 1980)
    { x: 1680, y: 450, width: 300, height: 150, surfaceType: 'stone' },

    // Section 5: Rapid Stream Crossing (2020 - 2600)
    { x: 2020, y: 480, width: 180, height: 120, surfaceType: 'water', currentSpeed: 75 },
    { x: 2240, y: 450, width: 160, height: 150, surfaceType: 'water', currentSpeed: -65 },
    { x: 2440, y: 420, width: 160, height: 180, surfaceType: 'stone' },

    // Section 5 Assist platform
    { x: 2000, y: 520, width: 450, height: 35, surfaceType: 'stone', isAssist: true },

    // Section 6: High Rainbow Mist Secret Path (Upper Falls Canopy)
    { x: 2100, y: 220, width: 140, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2280, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2460, y: 130, width: 180, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Swirling Pool Gauntlet (2650 - 3350)
    { x: 2650, y: 490, width: 200, height: 110, surfaceType: 'stone' },
    { x: 2890, y: 440, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 2.4, axis: 'x' },
    { x: 3060, y: 390, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.0, axis: 'y' },
    { x: 3230, y: 450, width: 180, height: 150, surfaceType: 'stone' },

    // Assist recovery
    { x: 2750, y: 510, width: 440, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 8: Subarnarekha Torana Outflow (3450 - 4000)
    { x: 3450, y: 460, width: 550, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1720, y: 390 },
    { id: 2, x: 3270, y: 390 }
  ],

  shards: [
    { id: 0, x: 380, y: 430, isRare: false },
    { id: 1, x: 610, y: 410, isRare: false },
    { id: 2, x: 740, y: 345, isRare: false },
    { id: 3, x: 1020, y: 340, isRare: false },
    { id: 4, x: 1220, y: 400, isRare: false },
    { id: 5, x: 1430, y: 320, isRare: false },
    { id: 6, x: 2110, y: 420, isRare: false },
    { id: 7, x: 2320, y: 380, isRare: false },
    { id: 8, x: 2160, y: 160, isRare: true },
    { id: 9, x: 2350, y: 110, isRare: true },
    { id: 10, x: 2530, y: 80, isRare: true },
    { id: 11, x: 2950, y: 380, isRare: false },
    { id: 12, x: 3120, y: 330, isRare: false }
  ],

  springs: [
    { x: 2040, y: 452 }, // Spring waterfall launcher
    { x: 2680, y: 462 }
  ],

  enemies: {
    beetles: [
      { x: 990, y: 376, left: 980, right: 1110 },
      { x: 2470, y: 396, left: 2450, right: 2590 },
      { x: 3260, y: 426, left: 3240, right: 3400 }
    ],
    chargers: [
      { x: 1780, y: 418, left: 1700, right: 1960 }
    ]
  },

  temples: [
    { x: 1820, y: 330, templeType: 'baidyanath', name: 'Hundru Shiv Mandir', deity: 'Lord Shiva' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2520, y: 82 },
  goalGateway: { x: 3750, y: 350 }
};

export const Level_3_1 = {
  id: 'world-3-1',
  worldNum: 3,
  name: 'World 3-1: Netarhat Sunset Hills',
  regionKey: 'world3Title',
  theme: 'netarhat',
  width: 4100,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 75, // Highland winds pushing player

  platforms: [
    // Section 1: Pine Ridge Bluff (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'ground' },

    // Section 2: Floating Cloud Terraces (540 - 1100)
    { x: 540, y: 450, width: 140, height: 150, surfaceType: 'wood' },
    { x: 720, y: 390, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 50, moveSpeed: 1.6, axis: 'y' },
    { x: 900, y: 340, width: 160, height: 260, surfaceType: 'ground' },
    { x: 670, y: 360, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist platform
    { x: 520, y: 515, width: 440, height: 40, surfaceType: 'ground', isAssist: true },

    // Section 3: Magnolia Gully (Wind Gusts) (1140 - 1650)
    { x: 1140, y: 420, width: 220, height: 180, surfaceType: 'ground' },
    { x: 1400, y: 370, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 90, moveSpeed: 2.5, axis: 'x' },
    { x: 1580, y: 460, width: 170, height: 140, surfaceType: 'ground' },

    // Section 4: Koel Viewpoint Shrine Checkpoint (1790 - 2100)
    { x: 1790, y: 460, width: 310, height: 140, surfaceType: 'stone' },

    // Section 5: The Sunset Precipice (2150 - 2700)
    { x: 2150, y: 480, width: 160, height: 120, surfaceType: 'stone' },
    { x: 2360, y: 430, width: 120, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.0, axis: 'y' },
    { x: 2530, y: 380, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 2.2, axis: 'x' },
    { x: 2710, y: 440, width: 170, height: 160, surfaceType: 'ground' },

    // Section 5 Assist
    { x: 2120, y: 515, width: 450, height: 40, surfaceType: 'ground', isAssist: true },

    // Section 6: High Cloud Peak Secret Route
    { x: 2200, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2380, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2560, y: 130, width: 190, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Pine Needles Ridge (2920 - 3450)
    { x: 2920, y: 470, width: 190, height: 130, surfaceType: 'ground' },
    { x: 3160, y: 420, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 50, moveSpeed: 2.0, axis: 'y' },
    { x: 3340, y: 480, width: 200, height: 120, surfaceType: 'ground' },

    // Assist
    { x: 2850, y: 505, width: 440, height: 45, surfaceType: 'ground', isAssist: true },

    // Section 8: Queen of Chotanagpur Torana (3580 - 4100)
    { x: 3580, y: 460, width: 520, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1830, y: 400 },
    { id: 2, x: 3380, y: 420 }
  ],

  shards: [
    { id: 0, x: 380, y: 440, isRare: false },
    { id: 1, x: 600, y: 390, isRare: false },
    { id: 2, x: 780, y: 330, isRare: false },
    { id: 3, x: 960, y: 280, isRare: false },
    { id: 4, x: 1200, y: 360, isRare: false },
    { id: 5, x: 1460, y: 310, isRare: false },
    { id: 6, x: 2210, y: 420, isRare: false },
    { id: 7, x: 2420, y: 370, isRare: false },
    { id: 8, x: 2260, y: 160, isRare: true },
    { id: 9, x: 2440, y: 110, isRare: true },
    { id: 10, x: 2630, y: 80, isRare: true },
    { id: 11, x: 3000, y: 410, isRare: false },
    { id: 12, x: 3220, y: 360, isRare: false }
  ],

  springs: [
    { x: 2170, y: 452 },
    { x: 2740, y: 412 }
  ],

  enemies: {
    beetles: [
      { x: 1220, y: 396, left: 1190, right: 1350 },
      { x: 2950, y: 446, left: 2930, right: 3100 },
      { x: 3370, y: 456, left: 3350, right: 3520 }
    ],
    chargers: [
      { x: 1880, y: 428, left: 1810, right: 2080 }
    ]
  },

  temples: [
    { x: 1800, y: 330, templeType: 'jagannath', name: 'Netarhat Surya Mandir', deity: 'Surya Dev' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2620, y: 82 },
  goalGateway: { x: 3880, y: 350 }
};

export const Level_4_1 = {
  id: 'world-4-1',
  worldNum: 4,
  name: 'World 4-1: Betla Forest Frontier',
  regionKey: 'world4Title',
  theme: 'betla',
  width: 4200,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  platforms: [
    // Section 1: Sal & Mahua Canopy Entrance (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'ground' },

    // Section 2: Tiger Trail Boulders (540 - 1100)
    { x: 540, y: 470, width: 170, height: 130, surfaceType: 'stone' },
    { x: 750, y: 430, width: 150, height: 170, surfaceType: 'stone' },
    { x: 940, y: 390, width: 170, height: 210, surfaceType: 'ground' },
    { x: 640, y: 360, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist
    { x: 520, y: 515, width: 450, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 3: Ancient Chero Fort Ruins (1150 - 1700)
    { x: 1150, y: 440, width: 240, height: 160, surfaceType: 'stone' },
    { x: 1430, y: 380, width: 120, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 60, moveSpeed: 1.8, axis: 'x' },
    { x: 1600, y: 480, width: 180, height: 120, surfaceType: 'stone' },

    // Section 4: Forest Ranger Shrine Checkpoint (1820 - 2150)
    { x: 1820, y: 460, width: 330, height: 140, surfaceType: 'stone' },

    // Section 5: The Boar Thicket (2200 - 2800)
    { x: 2200, y: 490, width: 550, height: 110, surfaceType: 'ground' },
    { x: 2380, y: 410, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 6: Fort Bastion Secret Spire
    { x: 2260, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2450, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2650, y: 130, width: 180, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: River Auranga Crossing (2850 - 3500)
    { x: 2850, y: 500, width: 180, height: 100, surfaceType: 'water', currentSpeed: 70 },
    { x: 3080, y: 450, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 70, moveSpeed: 2.2, axis: 'y' },
    { x: 3260, y: 400, width: 140, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 80, moveSpeed: 2.0, axis: 'x' },
    { x: 3450, y: 470, width: 180, height: 130, surfaceType: 'ground' },

    // Assist
    { x: 2950, y: 505, width: 440, height: 45, surfaceType: 'ground', isAssist: true },

    // Section 8: Sacred Sal Grove Gateway (3680 - 4200)
    { x: 3680, y: 460, width: 520, height: 140, surfaceType: 'ground' }
  ],

  checkpoints: [
    { id: 1, x: 1870, y: 400 },
    { id: 2, x: 3490, y: 410 }
  ],

  shards: [
    { id: 0, x: 370, y: 440, isRare: false },
    { id: 1, x: 610, y: 410, isRare: false },
    { id: 2, x: 810, y: 370, isRare: false },
    { id: 3, x: 1000, y: 330, isRare: false },
    { id: 4, x: 1220, y: 380, isRare: false },
    { id: 5, x: 1480, y: 320, isRare: false },
    { id: 6, x: 2320, y: 430, isRare: false },
    { id: 7, x: 2550, y: 430, isRare: false },
    { id: 8, x: 2320, y: 170, isRare: true },
    { id: 9, x: 2510, y: 120, isRare: true },
    { id: 10, x: 2710, y: 80, isRare: true },
    { id: 11, x: 3120, y: 390, isRare: false },
    { id: 12, x: 3310, y: 340, isRare: false }
  ],

  springs: [
    { x: 2220, y: 462 },
    { x: 2880, y: 472 }
  ],

  enemies: {
    beetles: [
      { x: 1210, y: 416, left: 1190, right: 1370 },
      { x: 2300, y: 466, left: 2240, right: 2420 },
      { x: 3500, y: 446, left: 3460, right: 3620 }
    ],
    chargers: [
      { x: 2450, y: 458, left: 2250, right: 2720 }
    ]
  },

  temples: [
    { x: 1840, y: 330, templeType: 'maluti', name: 'Maluti Terracotta Mandir', deity: 'Maa Mauliksha' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2710, y: 82 },
  goalGateway: { x: 3950, y: 350 }
};

export const Level_5_1 = {
  id: 'world-5-1',
  worldNum: 5,
  name: 'World 5-1: Deoghar Heritage-City',
  regionKey: 'world5Title',
  theme: 'deoghar',
  width: 4200,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  platforms: [
    // Section 1: Sacred Courtyard Entry (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'stone' },

    // Section 2: Shivaganga Stepped Ghats (540 - 1100)
    { x: 540, y: 520, width: 170, height: 80, surfaceType: 'stone' },
    { x: 740, y: 470, width: 160, height: 130, surfaceType: 'stone' },
    { x: 930, y: 420, width: 180, height: 180, surfaceType: 'stone' },
    { x: 640, y: 370, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist
    { x: 520, y: 525, width: 440, height: 35, surfaceType: 'stone', isAssist: true },

    // Section 3: Shikhara Temple Ledges (1150 - 1700)
    { x: 1150, y: 440, width: 220, height: 160, surfaceType: 'stone' },
    { x: 1400, y: 380, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 80, moveSpeed: 1.8, axis: 'x' },
    { x: 1580, y: 460, width: 180, height: 140, surfaceType: 'stone' },

    // Section 4: Panchshul Golden Shrine Checkpoint (1800 - 2120)
    { x: 1800, y: 460, width: 320, height: 140, surfaceType: 'stone' },

    // Section 5: The Red Cloth Canopy Gauntlet (2160 - 2750)
    { x: 2160, y: 480, width: 180, height: 120, surfaceType: 'stone' },
    { x: 2380, y: 420, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 60, moveSpeed: 2.2, axis: 'y' },
    { x: 2560, y: 380, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 70, moveSpeed: 2.0, axis: 'x' },
    { x: 2740, y: 450, width: 170, height: 150, surfaceType: 'stone' },

    // Section 6: High Temple Shikhara Secret Roof
    { x: 2220, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2410, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2610, y: 130, width: 190, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Chime Bell Rhythm Bridges (2950 - 3500)
    { x: 2950, y: 480, width: 180, height: 120, surfaceType: 'stone' },
    { x: 3170, y: 430, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.4, axis: 'y' },
    { x: 3340, y: 470, width: 190, height: 130, surfaceType: 'stone' },

    // Assist
    { x: 2880, y: 505, width: 440, height: 45, surfaceType: 'stone', isAssist: true },

    // Section 8: Baidyanath Great Torana (3580 - 4200)
    { x: 3580, y: 460, width: 620, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1850, y: 400 },
    { id: 2, x: 3390, y: 410 }
  ],

  shards: [
    { id: 0, x: 380, y: 440, isRare: false },
    { id: 1, x: 610, y: 470, isRare: false },
    { id: 2, x: 800, y: 410, isRare: false },
    { id: 3, x: 990, y: 360, isRare: false },
    { id: 4, x: 1220, y: 380, isRare: false },
    { id: 5, x: 1460, y: 320, isRare: false },
    { id: 6, x: 2230, y: 420, isRare: false },
    { id: 7, x: 2440, y: 360, isRare: false },
    { id: 8, x: 2280, y: 170, isRare: true },
    { id: 9, x: 2470, y: 120, isRare: true },
    { id: 10, x: 2680, y: 80, isRare: true },
    { id: 11, x: 3020, y: 420, isRare: false },
    { id: 12, x: 3230, y: 370, isRare: false }
  ],

  springs: [
    { x: 2180, y: 452 },
    { x: 2780, y: 422 }
  ],

  enemies: {
    beetles: [
      { x: 1210, y: 416, left: 1190, right: 1350 },
      { x: 2760, y: 426, left: 2740, right: 2900 },
      { x: 3380, y: 446, left: 3350, right: 3510 }
    ],
    chargers: [
      { x: 1900, y: 428, left: 1820, right: 2090 }
    ]
  },

  temples: [
    { x: 1960, y: 340, templeType: 'baidyanath', name: 'Baba Baidyanath Dham', deity: 'Baidyanath Jyotirlinga' },
    { x: 3720, y: 340, templeType: 'baidyanath', name: 'Basukinath Dham', deity: 'Lord Shiva' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2670, y: 82 },
  goalGateway: { x: 3900, y: 350 }
};

export const Level_6_1 = {
  id: 'world-6-1',
  worldNum: 6,
  name: 'World 6-1: Jamshedpur Industrial Run',
  regionKey: 'world6Title',
  theme: 'jamshedpur',
  width: 4300,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  platforms: [
    // Section 1: Steel Foundry Entrance (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'stone' },

    // Section 2: Reversible Conveyor Line (540 - 1100)
    { x: 540, y: 460, width: 220, height: 140, surfaceType: 'conveyor', currentSpeed: 100 },
    { x: 790, y: 420, width: 200, height: 180, surfaceType: 'conveyor', currentSpeed: -100 },
    { x: 1020, y: 380, width: 160, height: 220, surfaceType: 'stone' },
    { x: 710, y: 350, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist
    { x: 520, y: 515, width: 450, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 3: High Crane Girder Ledges (1200 - 1700)
    { x: 1200, y: 450, width: 220, height: 150, surfaceType: 'stone' },
    { x: 1450, y: 370, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 100, moveSpeed: 2.2, axis: 'x' },
    { x: 1630, y: 480, width: 170, height: 120, surfaceType: 'stone' },

    // Section 4: Worker Foreman Lantern Shrine (1830 - 2150)
    { x: 1830, y: 460, width: 320, height: 140, surfaceType: 'stone' },

    // Section 5: Molten Slag Crossing (2200 - 2800)
    { x: 2200, y: 480, width: 180, height: 120, surfaceType: 'conveyor', currentSpeed: 120 },
    { x: 2420, y: 430, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.4, axis: 'y' },
    { x: 2600, y: 380, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 2.0, axis: 'x' },
    { x: 2780, y: 450, width: 170, height: 150, surfaceType: 'stone' },

    // Section 6: High Gantry Secret Walkway
    { x: 2240, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2430, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2630, y: 130, width: 190, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Steam Turbine Bridges (2980 - 3550)
    { x: 2980, y: 490, width: 200, height: 110, surfaceType: 'conveyor', currentSpeed: -110 },
    { x: 3220, y: 430, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.2, axis: 'y' },
    { x: 3390, y: 480, width: 200, height: 120, surfaceType: 'stone' },

    // Assist
    { x: 2900, y: 505, width: 440, height: 45, surfaceType: 'stone', isAssist: true },

    // Section 8: Jubilee Park Torana Arch (3650 - 4300)
    { x: 3650, y: 460, width: 650, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1870, y: 400 },
    { id: 2, x: 3430, y: 420 }
  ],

  shards: [
    { id: 0, x: 380, y: 440, isRare: false },
    { id: 1, x: 620, y: 400, isRare: false },
    { id: 2, x: 860, y: 360, isRare: false },
    { id: 3, x: 1080, y: 320, isRare: false },
    { id: 4, x: 1280, y: 390, isRare: false },
    { id: 5, x: 1510, y: 310, isRare: false },
    { id: 6, x: 2270, y: 420, isRare: false },
    { id: 7, x: 2480, y: 370, isRare: false },
    { id: 8, x: 2310, y: 160, isRare: true },
    { id: 9, x: 2490, y: 110, isRare: true },
    { id: 10, x: 2690, y: 70, isRare: true },
    { id: 11, x: 3060, y: 430, isRare: false },
    { id: 12, x: 3280, y: 370, isRare: false }
  ],

  springs: [
    { x: 2210, y: 452 },
    { x: 2820, y: 422 }
  ],

  enemies: {
    beetles: [
      { x: 1260, y: 426, left: 1240, right: 1400 },
      { x: 2800, y: 426, left: 2780, right: 2930 },
      { x: 3420, y: 456, left: 3400, right: 3570 }
    ],
    chargers: [
      { x: 1930, y: 428, left: 1850, right: 2120 }
    ]
  },

  temples: [
    { x: 1820, y: 330, templeType: 'dewri', name: 'Rankini Mandir', deity: 'Maa Rankini' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2700, y: 72 },
  goalGateway: { x: 3980, y: 350 }
};

export const Level_7_1 = {
  id: 'world-7-1',
  worldNum: 7,
  name: 'World 7-1: Dhanbad Coal-Mine Depths',
  regionKey: 'world7Title',
  theme: 'dhanbad',
  width: 4400,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 0,

  platforms: [
    // Section 1: Shaft Adit Entry (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'stone' },

    // Section 2: Minecart Timber Rails (540 - 1100)
    { x: 540, y: 470, width: 200, height: 130, surfaceType: 'wood' },
    { x: 770, y: 420, width: 170, height: 180, surfaceType: 'wood' },
    { x: 970, y: 380, width: 180, height: 220, surfaceType: 'stone' },
    { x: 670, y: 350, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist
    { x: 520, y: 515, width: 450, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 3: Subterranean Pit Chasm (1180 - 1700)
    { x: 1180, y: 450, width: 220, height: 150, surfaceType: 'stone' },
    { x: 1430, y: 380, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 90, moveSpeed: 2.3, axis: 'x' },
    { x: 1610, y: 470, width: 180, height: 130, surfaceType: 'stone' },

    // Section 4: Miner Safety Lamp Shrine Checkpoint (1820 - 2150)
    { x: 1820, y: 460, width: 330, height: 140, surfaceType: 'stone' },

    // Section 5: Dark Seam Tunnel Run (2200 - 2800)
    { x: 2200, y: 480, width: 190, height: 120, surfaceType: 'stone' },
    { x: 2430, y: 420, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 60, moveSpeed: 2.2, axis: 'y' },
    { x: 2610, y: 370, width: 130, height: 16, oneWay: true, surfaceType: 'wood', moving: true, moveRange: 80, moveSpeed: 2.0, axis: 'x' },
    { x: 2790, y: 440, width: 180, height: 160, surfaceType: 'stone' },

    // Section 6: High Timber Scaffold Secret Cache
    { x: 2250, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2440, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2640, y: 130, width: 190, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: Collapsing Coal Shaft Ledges (3000 - 3600)
    { x: 3000, y: 480, width: 190, height: 120, surfaceType: 'stone' },
    { x: 3230, y: 430, width: 130, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 60, moveSpeed: 2.4, axis: 'y' },
    { x: 3400, y: 470, width: 210, height: 130, surfaceType: 'stone' },

    // Assist
    { x: 2920, y: 505, width: 440, height: 45, surfaceType: 'stone', isAssist: true },

    // Section 8: Mineral Gateway Exit (3680 - 4400)
    { x: 3680, y: 460, width: 720, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1860, y: 400 },
    { id: 2, x: 3450, y: 410 }
  ],

  shards: [
    { id: 0, x: 380, y: 440, isRare: false },
    { id: 1, x: 610, y: 410, isRare: false },
    { id: 2, x: 840, y: 360, isRare: false },
    { id: 3, x: 1030, y: 320, isRare: false },
    { id: 4, x: 1260, y: 390, isRare: false },
    { id: 5, x: 1490, y: 320, isRare: false },
    { id: 6, x: 2280, y: 420, isRare: false },
    { id: 7, x: 2490, y: 360, isRare: false },
    { id: 8, x: 2320, y: 160, isRare: true },
    { id: 9, x: 2500, y: 110, isRare: true },
    { id: 10, x: 2700, y: 70, isRare: true },
    { id: 11, x: 3080, y: 420, isRare: false },
    { id: 12, x: 3290, y: 370, isRare: false }
  ],

  springs: [
    { x: 2220, y: 452 },
    { x: 2830, y: 412 }
  ],

  enemies: {
    beetles: [
      { x: 1250, y: 426, left: 1220, right: 1380 },
      { x: 2810, y: 416, left: 2790, right: 2950 },
      { x: 3440, y: 446, left: 3410, right: 3590 }
    ],
    chargers: [
      { x: 1920, y: 428, left: 1840, right: 2110 }
    ]
  },

  temples: [
    { x: 1820, y: 330, templeType: 'dewri', name: 'Shakti Mandir Dhanbad', deity: 'Maa Durga' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2710, y: 82 },
  goalGateway: { x: 4050, y: 350 }
};

export const Level_8_1 = {
  id: 'world-8-1',
  worldNum: 8,
  name: 'World 8-1: Damodar Storm Summit',
  regionKey: 'world8Title',
  theme: 'damodar',
  width: 4500,
  height: 600,
  playerSpawn: { x: 80, y: 440 },
  windForce: 95, // Climactic tempest headwind

  platforms: [
    // Section 1: Thunder Ridge (0 - 500)
    { x: 0, y: 490, width: 500, height: 110, surfaceType: 'stone' },

    // Section 2: Lightning Shrouded Cliffs (540 - 1100)
    { x: 540, y: 460, width: 170, height: 140, surfaceType: 'water', currentSpeed: 90 },
    { x: 750, y: 410, width: 150, height: 190, surfaceType: 'stone' },
    { x: 940, y: 360, width: 180, height: 240, surfaceType: 'stone' },
    { x: 650, y: 360, width: 90, height: 16, oneWay: true, surfaceType: 'wood' },

    // Section 2 Assist
    { x: 520, y: 515, width: 450, height: 40, surfaceType: 'stone', isAssist: true },

    // Section 3: Gale Force Chasm (1160 - 1750)
    { x: 1160, y: 440, width: 220, height: 160, surfaceType: 'stone' },
    { x: 1420, y: 370, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 100, moveSpeed: 2.6, axis: 'x' },
    { x: 1610, y: 470, width: 180, height: 130, surfaceType: 'stone' },

    // Section 4: Eye of the Tempest Shrine Checkpoint (1840 - 2180)
    { x: 1840, y: 460, width: 340, height: 140, surfaceType: 'stone' },

    // Section 5: Torrential Inflow Surge (2220 - 2850)
    { x: 2220, y: 480, width: 200, height: 120, surfaceType: 'water', currentSpeed: 130 },
    { x: 2460, y: 420, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 2.4, axis: 'y' },
    { x: 2650, y: 370, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 80, moveSpeed: 2.2, axis: 'x' },
    { x: 2830, y: 440, width: 190, height: 160, surfaceType: 'stone' },

    // Section 6: High Cloud Lightning Spire (Ultimate Secret Cache)
    { x: 2280, y: 220, width: 130, height: 16, oneWay: true, surfaceType: 'wood' },
    { x: 2470, y: 170, width: 140, height: 16, oneWay: true, surfaceType: 'stone' },
    { x: 2670, y: 130, width: 200, height: 16, oneWay: true, surfaceType: 'stone' },

    // Section 7: The Master Rift Gauntlet (3040 - 3700)
    { x: 3040, y: 490, width: 200, height: 110, surfaceType: 'water', currentSpeed: -120 },
    { x: 3280, y: 420, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 70, moveSpeed: 2.5, axis: 'y' },
    { x: 3470, y: 370, width: 140, height: 16, oneWay: true, surfaceType: 'stone', moving: true, moveRange: 80, moveSpeed: 2.3, axis: 'x' },
    { x: 3660, y: 460, width: 220, height: 140, surfaceType: 'stone' },

    // Assist
    { x: 2980, y: 505, width: 440, height: 45, surfaceType: 'stone', isAssist: true },

    // Section 8: The Grand Jharkhand Reconnect Torana (3920 - 4500)
    { x: 3920, y: 460, width: 580, height: 140, surfaceType: 'stone' }
  ],

  checkpoints: [
    { id: 1, x: 1880, y: 400 },
    { id: 2, x: 3710, y: 400 }
  ],

  shards: [
    { id: 0, x: 380, y: 440, isRare: false },
    { id: 1, x: 610, y: 400, isRare: false },
    { id: 2, x: 810, y: 350, isRare: false },
    { id: 3, x: 1010, y: 300, isRare: false },
    { id: 4, x: 1240, y: 380, isRare: false },
    { id: 5, x: 1480, y: 310, isRare: false },
    { id: 6, x: 2300, y: 420, isRare: false },
    { id: 7, x: 2520, y: 360, isRare: false },
    { id: 8, x: 2340, y: 150, isRare: true },
    { id: 9, x: 2530, y: 100, isRare: true },
    { id: 10, x: 2740, y: 60, isRare: true },
    { id: 11, x: 3120, y: 430, isRare: false },
    { id: 12, x: 3340, y: 360, isRare: false }
  ],

  springs: [
    { x: 2240, y: 452 },
    { x: 2870, y: 412 }
  ],

  enemies: {
    beetles: [
      { x: 1230, y: 416, left: 1210, right: 1360 },
      { x: 2860, y: 416, left: 2840, right: 3000 },
      { x: 3700, y: 436, left: 3670, right: 3860 }
    ],
    chargers: [
      { x: 1940, y: 428, left: 1860, right: 2140 }
    ]
  },

  temples: [
    { x: 2020, y: 340, templeType: 'rajrappa', name: 'Rajrappa Chhinnamasta Dham', deity: 'Maa Chhinnamasta Shakti Peeth' }
  ],

  npcElder: { x: 180, y: 440 },
  loreTablet: { x: 2740, y: 82 },
  goalGateway: { x: 4200, y: 350 }
};

export const LevelRegistry = [
  Level_1_1,
  Level_2_1,
  Level_3_1,
  Level_4_1,
  Level_5_1,
  Level_6_1,
  Level_7_1,
  Level_8_1
];
