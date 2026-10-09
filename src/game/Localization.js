/**
 * Localization system for RRR - Jharkhand Quest
 * Full multilingual architecture supporting:
 * - English (en)
 * - Hindi (hi)
 * - Jharkhand Local Regional Language: Nagpuri / नागपुरी (nag)
 * Authors: RAJRANJEET7680
 */

export const Localization = {
  currentLang: 'en', // 'en' | 'hi' | 'nag'
  availableLangs: ['en', 'hi', 'nag'],

  strings: {
    en: {
      gameTitle: 'RRR — JHARKHAND QUEST',
      subtitle: 'Rewind • Reimagine • Reconnect',
      worldTitle: 'World 1-1: Ranchi Plateau Gateway',
      regionName: 'Ranchi Plateau',
      shards: 'Echo Shards',
      health: 'Life',
      score: 'Score',
      time: 'Time',
      checkpoint: 'Lantern Shrine Lit!',
      secretFound: 'Hidden Route Discovered!',
      levelClear: 'GATEWAY RESTORED!',
      levelClearSub: 'Region Conquered • Regional Pathway Reconnected',
      nextLevelBtn: 'Next Level ▶',
      nextChapterBtn: 'Next Chapter Story ▶',
      startLevelAction: 'Enter Level ▶',
      grandFinaleBtn: '🌟 Grand Finale Story ▶',
      grandTriumphTitle: 'JHARKHAND UNIFIED — ALL 8 REGIONS RESTORED!',
      grandTriumphSubtitle: 'The Rift of Echoes is Sealed • All 8 Regional Gateways Reconnected as One',
      replayAllStory: '🎬 Replay Full Saga (Chapters 1–9)',
      viewWorldMap: '🗺️ World Map',
      watchStory: '🎬 Story',
      storyTheaterTitle: 'Chronicles of Jharkhand — Story Theater',
      watchAllChapters: '▶ Watch All Chapters (Saga)',
      allChaptersTab: '▶ All Saga',
      playAgain: 'Play Again',
      controlsHint: '[A/D or ←/→] Run | [W or Space] Jump (S+Jump High) | [C] Jump Pad | [Shift or K] Dash | [S or ↓] Fast Fall | [E] Talk',
      dialoguePrompt: 'Press [E] to Speak',
      skipText: '[Space / E] Next',
      pause: 'PAUSED',
      resume: 'Resume',
      restart: 'Restart Level',
      settings: 'Settings',
      accessibility: 'Accessibility & Settings',
      screenShake: 'Screen Shake',
      highContrast: 'High Contrast Mode',
      assistMode: 'Assist Mode (Recovery Ledges)',
      soundVolume: 'Audio Volume',
      voiceActing: 'Voice Acting (Spoken Dialogue)',
      voiceOn: '🗣️ Voice: ON',
      voiceOff: '🔇 Voice: OFF',
      fullscreen: 'Fullscreen Mode',
      graphicsPreset: 'Graphics Quality',
      presetLow: 'Low',
      presetMed: 'Medium',
      presetHigh: 'High (Cinematic)',
      textSpeed: 'Text Speed',
      speedNormal: 'Normal',
      speedFast: 'Fast',
      speedInstant: 'Instant',
      close: 'Close',
      statsShards: 'Echo Shards Collected:',
      statsTime: 'Completion Time:',
      statsRank: 'Explorer Rank:',
      rankS: 'S Rank — Legend of Chota Nagpur',
      rankA: 'A Rank — Master Explorer',
      rankB: 'B Rank — Skilled Traveler',
      
      // Control Modes
      controlMode: 'Input & Control Mode',
      modeAuto: 'Auto-Detect',
      modePC: 'PC Keyboard & Mouse',
      modeMobile: 'Mobile On-Screen Touch',
      modePS5: 'PlayStation 5 (DualSense)',

      // Lobby UI
      playBtn: '▶ PLAY GAME',
      storyBtn: '🎬 Story Intro',
      levelSelectBtn: '🗺️ Level Select',
      characterBtn: '👤 Character Viewer',
      creditsBtn: '📜 Credits',
      returnToLobby: 'Return to Camp',
      lobbyTitle: 'RANCHI BASE CAMP',
      lobbySubtitle: 'Chapter I: The Rift of Echoes Awakens',

      // Level Select (All 8 Worlds)
      worldSelectTitle: 'The 8 Jharkhand Regions',
      world1Title: 'World 1: Ranchi Plateau Gateway',
      world1Desc: 'Red-soil trails, teaching jumps, and the first Echo Shards.',
      world2Title: 'World 2: Hundru Falls Wilds',
      world2Desc: 'Towering waterfall cliffs, mist, and rushing water currents.',
      world3Title: 'World 3: Netarhat Sunset Hills',
      world3Desc: 'Highland winds, twilight vistas, and floating cloud bridges.',
      world4Title: 'World 4: Betla Forest Frontier',
      world4Desc: 'Dense canopy routes, hanging vines, and hidden wildlife.',
      world5Title: 'World 5: Deoghar Heritage-City',
      world5Desc: 'Sacred courtyards, rhythm platforms, and bell chime puzzles.',
      world6Title: 'World 6: Jamshedpur Industrial Run',
      world6Desc: 'Steel mills, reversible conveyors, and overhead crane lifts.',
      world7Title: 'World 7: Dhanbad Coal-Mine Depths',
      world7Desc: 'Underground rail carts, track switches, and timber collapses.',
      world8Title: 'World 8: Damodar Storm Summit',
      world8Desc: 'The tempest climax combining all learned environmental systems.',
      lockedBadge: '🔒 Locked',
      unlockedBadge: '⭐ Ready',

      // Character Viewer
      charViewerTitle: 'Adventurer Kabir — Character Showcase',
      outfitLabel: 'Traveler Outfit:',
      outfitClassic: 'Classic Explorer (Teal & Saffron)',
      outfitSohrai: 'Sohrai Artist (Earth Red & Ochre)',
      outfitNight: 'Night Scout (Indigo & Silver)',
      animLabel: 'Action Preview:',
      animIdle: 'Idle Pose',
      animWalk: 'Walk',
      animRun: 'Sprint',
      animJump: 'Jump Leap',
      animDash: 'Sonic Dash',
      animHurt: 'Hurt Recoil',
      animVictory: 'Victory Pose',

      // Loading Screen
      loadingLabel: 'Restoring Regional Pathways...',
      tipHeader: 'Gameplay Guide:',
      tip1: 'Press Down (S / ↓ or L2) while airborne to perform a fast-fall descent.',
      tip2: 'Dash (Shift / K or ▢) grants temporary invulnerability and can destroy grounded enemies.',
      tip3: 'Hold Jump on Palas Jump Pads or press [C] to summon a Jump Pad for a massive High Jump!',
      tip4: 'Lit Checkpoint Lanterns save your progress and restore your courage.',

      // Title Card
      stageObjective: 'Objective: Collect the Echo Shards and unlock the Gateway Torana.',

      // Voice callouts
      startVoice: 'Gateway open! Proceed forward!',
      checkpointVoice: 'Lantern lit! Checkpoint secured!',
      victoryVoice: 'Gateway restored! Regional pathway reconnected!',
      shardVoice: 'Echo Shard acquired!',

      // Cinematic Story Intro — Chapters 1 to 9 Titles
      chapter1Title: 'Chapter I: The Awakening of Ranchi',
      chapter2Title: 'Chapter II: The Roar of Hundru Falls',
      chapter3Title: 'Chapter III: The Sunset Heights of Netarhat',
      chapter4Title: 'Chapter IV: The Ancient Canopy of Betla',
      chapter5Title: 'Chapter V: Sacred Chimes of Deoghar',
      chapter6Title: 'Chapter VI: Steel Heart of Jamshedpur',
      chapter7Title: 'Chapter VII: Subterranean Veins of Dhanbad',
      chapter8Title: 'Chapter VIII: Tempest at Damodar Summit',
      chapter9Title: 'Chapter IX: The Grand Reconnection (Grand Finale)',

      // Chapter 1: Ranchi Plateau Gateway
      storyAct1Tag: 'ACT I: THE SACRED HOMELAND',
      storyAct1Text: 'In the ancient highlands of Jharkhand, sacred Sal forests, roaring Hundru waterfalls, and peaceful tribal valleys lived in eternal harmony, bound together by the eight sacred Torana Gateways.',
      storyAct2Tag: 'ACT II: THE COSMIC FRACTURE',
      storyAct2Text: 'Without warning, a cosmic fracture—the Rift of Echoes—tore open the heavens! The sacred gateways shattered, locking the living memories of the land into crystalline Echo Shards and isolating each region in temporal silence.',
      storyAct3Tag: 'ACT III: THE ELDER MANDATE',
      storyAct3Text: 'At the Ranchi Plateau, Sage Guru Kripal summoned young adventurer Kabir: “The spirits of Bhagwan Birsa Munda and our ancestors have chosen you. Traverse the 8 sacred regions, recover the Echo Shards, and restore our gateways!”',
      storyAct4Tag: 'ACT IV: KABIR\'S RESOLVE',
      storyAct4Text: 'Fastening his saffron headband, Kabir gazed toward the plateau horizon: “With the soil of Jharkhand beneath my boots, I will restore every Torana and reconnect our homeland as one!”',

      // Chapter 2: Hundru Falls Wilds
      storyCh2Act1Tag: 'CHAPTER II • SCENE 1: THE ROAR OF SUBARNAREKHA',
      storyCh2Act1Text: 'Leaving the Ranchi plateau behind, Kabir reaches Hundru Falls, where the sacred Subarnarekha river plunges 320 feet into a towering basalt gorge, its thundering mist concealing fractured gateway remnants.',
      storyCh2Act2Tag: 'CHAPTER II • SCENE 2: RAPIDS OF THE CATARACT',
      storyCh2Act2Text: 'Guru Kripal whispers through the spray: “The water currents are treacherous, Kabir! Leap across the wet river ledges, master the rushing torrents, and gather the crystalline water shards!”',

      // Chapter 3: Netarhat Sunset Hills
      storyCh3Act1Tag: 'CHAPTER III • SCENE 1: QUEEN OF CHOTANAGPUR',
      storyCh3Act1Text: 'Ascending higher into the western highlands, Kabir beholds Netarhat bathed in fiery crimson and gold sunset. Here, ancient pine groves touch the evening clouds above rolling mountain valleys.',
      storyCh3Act2Tag: 'CHAPTER III • SCENE 2: THE TWILIGHT PATHWAY',
      storyCh3Act2Text: '“The highland winds test your resolve,” warns the elder. “Mystical cloud platforms drift on the mountain gales. Time your leaps with the twilight breeze to restore the third gateway!”',

      // Chapter 4: Betla Forest Frontier
      storyCh4Act1Tag: 'CHAPTER IV • SCENE 1: SHADOWS OF THE CHERO KINGS',
      storyCh4Act1Text: 'Kabir enters the deep primeval Sal and bamboo wilderness of Betla, where the 16th-century stone fortress of the Chero Kings stands weathered beneath dense canopy foliage.',
      storyCh4Act2Tag: 'CHAPTER IV • SCENE 2: GUARDIAN OF THE CANOPY',
      storyCh4Act2Text: 'Forest creatures watch from the bamboo shadows as ancient tree springs bounce Kabir into high canopies. “Harm no creature, Kabir—move like the wind through the foliage!”',

      // Chapter 5: Deoghar Heritage-City
      storyCh5Act1Tag: 'CHAPTER V • SCENE 1: CITY OF SACRED SHRINES',
      storyCh5Act1Text: 'Arriving at sacred Deoghar, towering red-flagged spires of Baba Baidyanath Dham pierce the dusk. Brass kalashas gleam with divine light while fragrant ghee lamps line the pilgrim steps.',
      storyCh5Act2Tag: 'CHAPTER V • SCENE 2: RESONANCE OF THE BELLS',
      storyCh5Act2Text: '“Listen closely, Kabir,” Guru Kripal speaks. “The ancient bronze temple bells chime in sacred rhythm. Leap across the consecrated courtyards and align your spirit with their chime!”',

      // Chapter 6: Jamshedpur Industrial Run
      storyCh6Act1Tag: 'CHAPTER VI • SCENE 1: FORGE OF FIRE AND IRON',
      storyCh6Act1Text: 'Entering the steel heart of Jamshedpur, towering blast furnace chimneys pierce the night sky, their roaring fires melting iron into incandescent rivers of glowing gold and orange.',
      storyCh6Act2Tag: 'CHAPTER VI • SCENE 2: PULSE OF THE CONVEYORS',
      storyCh6Act2Text: 'Amidst flying welding sparks and mechanical steel cranes, Kabir must master moving industrial belts and high lifts. “The spirit of human craft and tireless labor drives this gateway forward!”',

      // Chapter 7: Dhanbad Coal-Mine Depths
      storyCh7Act1Tag: 'CHAPTER VII • SCENE 1: INTO THE BLACK SEAMS',
      storyCh7Act1Text: 'Descending hundreds of feet below the earth into the coal veins of Dhanbad, timber arches groan under heavy stone ceilings while flickering carbide lamps cast eerie yellow shadows.',
      storyCh7Act2Tag: 'CHAPTER VII • SCENE 2: THE UNDERGROUND TRACKS',
      storyCh7Act2Text: 'Minecart wheels rumble along iron rails through deep tunnels. “Watch for falling coal timbers and shifting track levers, Kabir! Deep in the earth lies the seventh Echo Shard!”',

      // Chapter 8: Damodar Storm Summit
      storyCh8Act1Tag: 'CHAPTER VIII • SCENE 1: EYE OF THE TEMPEST',
      storyCh8Act1Text: 'At the tempest summit of the Damodar reservoir, black storm clouds swirl violently. Purple-white lightning bolts crash into jagged cliff faces as howling gales whip across the precipice.',
      storyCh8Act2Tag: 'CHAPTER VIII • SCENE 2: THE FINAL TRIAL',
      storyCh8Act2Text: 'Before the eighth shattered Torana, storm sparks surge with raw power. Kabir sets his jaw: “Every trial has led to this summit. I will brave the lightning and reclaim the final shard!”',

      // Chapter 9: Grand Finale — The Great Reconnection
      storyCh9Act1Tag: 'CHAPTER IX • SCENE 1: THE HARMONIOUS CONVERGENCE',
      storyCh9Act1Text: 'As Kabir places the eighth Echo Shard into the Torana summit, all eight gateways across Jharkhand ignite simultaneously! Radiant emerald and golden light pillars shoot into the heavens, permanently sealing the Rift of Echoes!',
      storyCh9Act2Tag: 'CHAPTER IX • SCENE 2: GUARDIAN OF JHARKHAND',
      storyCh9Act2Text: 'The sacred land is healed! Guru Kripal embraces Kabir amidst showers of marigold petals as tribal drums echo across the plateau. “You have reconnected Jharkhand, Kabir—our eternal Guardian of the Highlands!”',

      // Credits
      creditsTitle: 'PRODUCTION CREDITS',
      devLead: 'Lead Architecture & Development: RAJRANJEET7680',
      culturalConsultants: 'Cultural Worldbuilding: Jharkhand Folklore & Regional Ecology',
      artArchitecture: 'Visual & Animation Blueprint: 2D Multi-layer Parallax & Pixel Canvas',
      soundDesign: 'Audio Architecture: Procedural Raag Bhupali WebAudio Synthesizer',
      specialThanks: 'Inspired by the vibrant heritage, waterfalls, and resilient spirit of Jharkhand.',

      // Dialogues
      mentorName: 'Guru Kripal (Elder Guide)',
      protagonistName: 'Kabir (Adventurer)',
      
      dialogueIntro: [
        {
          speaker: 'Guru Kripal',
          role: 'mentor',
          emotion: 'calm',
          text: 'Welcome to the Ranchi Plateau, Kabir. Look at the sky... The Rift of Echoes has fractured the pathways between our regions.'
        },
        {
          speaker: 'Kabir',
          role: 'player',
          emotion: 'determined',
          text: 'I can feel the disturbance in the air, Guruji. The sacred Sal groves and the waterfalls seem trapped in time.'
        },
        {
          speaker: 'Guru Kripal',
          role: 'mentor',
          emotion: 'warning',
          text: 'You must gather the Echo Shards scattered along the red-soil trails. They hold the memories that keep our valleys and waters connected.'
        },
        {
          speaker: 'Guru Kripal',
          role: 'mentor',
          emotion: 'calm',
          text: 'Beware of the agitated Forest Beetles and Charging Boars ahead. Use your agility—leap over them, or stomp them from above. May the spirits of Birsa guide your journey!'
        }
      ],

      loreTabletTitle: 'Ancient Sohrai Mural Inscription',
      loreTabletText: '“When the plateau winds whisper through the Netarhat hills and water crashes at Hundru, the three threads of memory shall bind Jharkhand as one.” (+1000 Echo Points!)'
    },

    hi: {
      gameTitle: 'आर.आर.आर — झारखंड क्वेस्ट',
      subtitle: 'रिवाइंड • रीइमेजिन • रीकनेक्ट',
      worldTitle: 'विश्व १-१: राँची पठार प्रवेशद्वार',
      regionName: 'राँची पठार',
      shards: 'गूँज टुकड़े (इको शार्ड्स)',
      health: 'जीवन',
      score: 'अंक',
      time: 'समय',
      checkpoint: 'दीप स्तम्भ प्रज्वलित!',
      secretFound: 'गुप्त मार्ग खोजा गया!',
      levelClear: 'प्रवेशद्वार पुनः स्थापित!',
      levelClearSub: 'क्षेत्र विजय पूर्ण • क्षेत्रीय मार्ग पुनः जुड़ा',
      nextLevelBtn: 'अगला स्तर ▶',
      nextChapterBtn: 'अगला अध्याय कथा ▶',
      startLevelAction: 'स्तर में प्रवेश ▶',
      grandFinaleBtn: '🌟 महा-समापन कथा ▶',
      grandTriumphTitle: 'झारखंड का पुनर्मिलन — आठों तोरण द्वार स्थापित!',
      grandTriumphSubtitle: 'गूँज की दरार समाप्त हुई • संपूर्ण झारखंड एक पावन सूत्र में पुनः जुड़ गया',
      replayAllStory: '🎬 पुनः संपूर्ण गाथा देखें (अध्याय १–९)',
      viewWorldMap: '🗺️ विश्व मानचित्र',
      watchStory: '🎬 कथा',
      storyTheaterTitle: 'झारखंड की अमर गाथा — कथा रंगमंच',
      watchAllChapters: '▶ सभी अध्याय देखें (संपूर्ण गाथा)',
      allChaptersTab: '▶ संपूर्ण गाथा',
      playAgain: 'पुनः खेलें',
      controlsHint: '[A/D या ←/→] दौड़ें | [W या Space] छलांग | [Shift या K] डै़श | [S या ↓] तीव्र पतन | [E] बात करें',
      dialoguePrompt: 'बात करने के लिए [E] दबाएं',
      skipText: '[Space / E] आगे बढ़ें',
      pause: 'विराम (Paused)',
      resume: 'जारी रखें',
      restart: 'पुनः प्रारंभ करें',
      settings: 'सेटिंग्स',
      accessibility: 'सुलभता एवं सेटिंग्स (Accessibility)',
      screenShake: 'स्क्रीन कंपन (Screen Shake)',
      highContrast: 'उच्च कंट्रास्ट मोड',
      assistMode: 'सहायता मोड (अतिरिक्त मंच)',
      soundVolume: 'ध्वनि की तीव्रता',
      voiceActing: 'ध्वनि संवाद (Voice Acting)',
      voiceOn: '🗣️ वाणी: चालू',
      voiceOff: '🔇 वाणी: बंद',
      fullscreen: 'पूर्ण स्क्रीन (Fullscreen)',
      graphicsPreset: 'ग्राफिक्स गुणवत्ता',
      presetLow: 'निम्न (Low)',
      presetMed: 'मध्यम (Medium)',
      presetHigh: 'उच्च (Cinematic)',
      textSpeed: 'संवाद गति',
      speedNormal: 'सामान्य',
      speedFast: 'तीव्र',
      speedInstant: 'तत्काल',
      close: 'बंद करें',
      statsShards: 'एकत्रित गूँज टुकड़े:',
      statsTime: 'कुल समय:',
      statsRank: 'खोजकर्ता श्रेणी:',
      rankS: 'S श्रेणी — छोटा नागपुर के नायक',
      rankA: 'A श्रेणी — कुशल खोजी',
      rankB: 'B श्रेणी — कर्मठ यात्री',

      // Control Modes
      controlMode: 'नियंत्रण साधन (Control Mode)',
      modeAuto: 'स्वतः पहचान (Auto)',
      modePC: 'पीसी कीबोर्ड एवं माउस',
      modeMobile: 'मोबाइल ऑन-स्क्रीन टच',
      modePS5: 'प्लेस्टेशन ५ (PS5 DualSense)',

      // Lobby UI
      playBtn: '▶ खेल शुरू करें',
      storyBtn: '🎬 कथा झाँकी (Story)',
      levelSelectBtn: '🗺️ क्षेत्र चयन (Levels)',
      characterBtn: '👤 नायक अवलोकन (Character)',
      creditsBtn: '📜 आभार एवं श्रेय (Credits)',
      returnToLobby: 'शिविर में लौटें',
      lobbyTitle: 'राँची आधार शिविर',
      lobbySubtitle: 'अध्याय १: गूँज की दरार का जागरण',

      // Level Select
      worldSelectTitle: 'झारखंड के ८ पावन क्षेत्र',
      world1Title: 'विश्व १: राँची पठार प्रवेशद्वार',
      world1Desc: 'लाल मिट्टी की पगडंडियां, आरंभिक छलांगें, और पहले गूँज टुकड़े।',
      world2Title: 'विश्व २: हुंडरू जलप्रपात वन',
      world2Desc: 'विशाल चट्टानें, जलधाराएं और तीव्र जल बहाव।',
      world3Title: 'विश्व ३: नेतरहाट संध्या पहाड़ियाँ',
      world3Desc: 'पठारी पवन, सूर्यास्त के दृश्य और बादलों के पुल।',
      world4Title: 'विश्व ४: बेतला वन सीमांत',
      world4Desc: 'घने साल वृक्ष, लटकती लताएँ और प्राचीन खंडहर।',
      world5Title: 'विश्व ५: देवघर पावन नगर',
      world5Desc: 'ऐतिहासिक प्रांगण, घंटी की ताल पर गतिमान मंच।',
      world6Title: 'विश्व ६: जमशेदपुर इस्पात नगरी',
      world6Desc: 'कन्वेयर बेल्ट, विशाल क्रेन और भाप के दबाव तंत्र।',
      world7Title: 'विश्व ७: धनबाद कोयला खदान गहराई',
      world7Desc: 'खदान रेलगाड़ियां, ट्रैक स्विच और भूमिगत चुनौतियां।',
      world8Title: 'विश्व ८: दामोदर तूफानी शिखर',
      world8Desc: 'जल, वायु और मशीनरी के संगम का अंतिम महा-युद्ध।',
      lockedBadge: '🔒 बंद',
      unlockedBadge: '⭐ उपलब्ध',

      // Character Viewer
      charViewerTitle: 'साहसी कबीर — चरित्र अवलोकन',
      outfitLabel: 'यात्री पोशाक:',
      outfitClassic: 'पारंपरिक अन्वेषक (नीला और केसरिया)',
      outfitSohrai: 'सोहराय चित्रकार (गेरुआ और पीला)',
      outfitNight: 'रात्रि सैनिक (गहरा नीला और रजत)',
      animLabel: 'क्रिया पूर्वावलोकन:',
      animIdle: 'शांत मुद्रा (Idle)',
      animWalk: 'चाल (Walk)',
      animRun: 'दौड़ (Run)',
      animJump: 'ऊँची छलांग (Jump)',
      animDash: 'तीव्र गति (Dash)',
      animHurt: 'चोट/झटका (Hurt)',
      animVictory: 'विजय मुद्रा (Victory)',

      // Loading Screen
      loadingLabel: 'क्षेत्रीय मार्गों का पुनरुद्धार...',
      tipHeader: 'मार्गदर्शन सुझाव:',
      tip1: 'हवा में रहते हुए नीचे (S / ↓ या L2) दबाकर तीव्र पतन (Fast-fall) करें।',
      tip2: 'डैश (Shift / K या ▢) से कुछ पलों के लिए अमरता मिलती है और शत्रु परास्त होते हैं।',
      tip3: 'पलाश के पुष्पों को खोजें—वे आपको गुप्त छतरी तक उछालते हैं!',
      tip4: 'प्रज्वलित दीप स्तम्भ आपकी प्रगति सुरक्षित करते हैं।',

      // Title Card
      stageObjective: 'उद्देश्य: गूँज के टुकड़े एकत्र करें और तोरण द्वार खोलें।',

      // Voice callouts
      startVoice: 'प्रवेशद्वार खुल गया! आगे बढ़ें!',
      checkpointVoice: 'दीप स्तम्भ प्रज्वलित! ठिकाना सुरक्षित!',
      victoryVoice: 'तोरण द्वार पुनः स्थापित! मार्ग जुड़ गया!',
      shardVoice: 'गूँज टुकड़ा प्राप्त हुआ!',

      // Cinematic Story Intro — Chapters 1 to 9 Titles
      chapter1Title: 'अध्याय १: राँची का जागरण',
      chapter2Title: 'अध्याय २: हुंडरू की गर्जना',
      chapter3Title: 'अध्याय ३: नेतरहाट की स्वर्णिम संध्या',
      chapter4Title: 'अध्याय ४: बेतला का प्राचीन अरण्य',
      chapter5Title: 'अध्याय ५: देवघर की पावन घंटियां',
      chapter6Title: 'अध्याय ६: जमशेदपुर का लौह हृदय',
      chapter7Title: 'अध्याय ७: धनबाद की भूमिगत शिराएं',
      chapter8Title: 'अध्याय ८: दामोदर का तूफानी शिखर',
      chapter9Title: 'अध्याय ९: महा-पुनर्मिलन (भव्य समापन)',

      // Chapter 1: Ranchi Plateau Gateway
      storyAct1Tag: 'अध्याय १: पावन मातृभूमि',
      storyAct1Text: 'झारखंड के पावन पठार पर, साल के घने वन, हुंडरू का गर्जना करता जलप्रपात और जनजातीय घाटियां आठ पावन तोरण द्वारों के पावन सूत्र से एक सूत्र में बंधी थीं।',
      storyAct2Tag: 'अध्याय २: गूँज की दरार',
      storyAct2Text: 'अचानक आकाश में एक रहस्यमयी दरार—गूँज की दरार—उभर आई! प्राचीन तोरण द्वार बिखर गए, जंगलों और नदियों की स्मृतियां चमकते गूँज टुकड़ों (Echo Shards) में कैद हो गईं।',
      storyAct3Tag: 'अध्याय ३: गुरु का आदेश',
      storyAct3Text: 'राँची के पठार पर, वरिष्ठ गुरु कृपाल ने साहसी कबीर को पुकारा: “भगवान बिरसा और हमारे पुरखों ने तुम्हें चुना है। आठों क्षेत्रों की यात्रा करो, गूँज के टुकड़े एकत्र करो और तोरण द्वारों को पुनः स्थापित करो!”',
      storyAct4Tag: 'अध्याय ४: कबीर का संकल्प',
      storyAct4Text: 'अपना केसरिया पटका बाँधकर कबीर ने संकल्प लिया: “झारखंड की पावन माटी के बल पर, मैं सभी तोरण द्वारों को पुनः स्थापित कर पूरे झारखंड को पुनः जोड़ दूंगा!”',

      // Chapter 2: Hundru Falls Wilds
      storyCh2Act1Tag: 'अध्याय २ • दृश्य १: सुवर्णरेखा की गर्जना',
      storyCh2Act1Text: 'राँची के पठार को पीछे छोड़ कबीर हुंडरू जलप्रपात पहुंचा, जहाँ पावन सुवर्णरेखा नदी ३२० फीट की ऊंचाई से बेसाल्ट चट्टानों पर गर्जना करते हुए गिरती है। जल के फुहारों में तोरण के टुकड़े छिपे हैं।',
      storyCh2Act2Tag: 'अध्याय २ • दृश्य २: तीव्र धाराओं का वेग',
      storyCh2Act2Text: 'जल-फुहारों के बीच गुरु कृपाल की वाणी गूँजी: “कबीर, जलधाराएं अत्यंत तीव्र हैं! भीगी शिलाओं पर संभलकर छलांग लगाओ, जल के वेग पर विजय पाओ और जल के गूँज टुकड़े एकत्र करो!”',

      // Chapter 3: Netarhat Sunset Hills
      storyCh3Act1Tag: 'अध्याय ३ • दृश्य १: छोटानागपुर की रानी',
      storyCh3Act1Text: 'पश्चिम की ओर ऊंचाई पर बढ़ते हुए, कबीर ने नेतरहाट की पहाड़ियों को देखा जहाँ आकाश सिंदूरी और स्वर्णिम आभा में डूबा था। चीड़ और साल के वन पर्वतीय समीर में लहरा रहे थे।',
      storyCh3Act2Tag: 'अध्याय ३ • दृश्य २: बादलों का रहस्यमयी मार्ग',
      storyCh3Act2Text: '“पठारी हवाएं तुम्हारे साहस की परीक्षा ले रही हैं,” गुरुजी ने कहा। “हवा में तैरते बादलों के मंच केवल वीरों के लिए प्रकट होते हैं। संध्या की वायु के साथ तालमेल बिठाकर तीसरे द्वार को पुनः स्थापित करो!”',

      // Chapter 4: Betla Forest Frontier
      storyCh4Act1Tag: 'अध्याय ४ • दृश्य १: चेरो राजाओं का पावन दुर्ग',
      storyCh4Act1Text: 'कबीर बेतला के प्राचीन सघन वन में प्रविष्ट हुआ, जहाँ घने बाँस और साल के वृक्षों की छाँव में १६वीं शताब्दी के चेरो राजाओं का भव्य प्रस्तर दुर्ग सदियों से अटल खड़ा है।',
      storyCh4Act2Tag: 'अध्याय ४ • दृश्य २: अरण्य के प्रहरी',
      storyCh4Act2Text: 'बाँस के झुरमुटों से वन के प्राणी कबीर की परीक्षा ले रहे हैं। “वन्य जीवों को पीड़ा दिए बिना हवा की भांति डालियों पर छलांग लगाओ, कबीर! प्रकृति का सम्मान ही तोरण द्वार की कुंजी है!”',

      // Chapter 5: Deoghar Heritage-City
      storyCh5Act1Tag: 'अध्याय ५ • दृश्य १: अमर धाम देवघर',
      storyCh5Act1Text: 'पावन नगरी देवघर पहुँचते ही बाबा बैद्यनाथ धाम के भव्य लाल ध्वज आकाश को छूते दिखाई दिए। स्वर्णिम कलश जगमगा रहे थे और तीर्थ मार्ग पर घृत के दीप प्रज्वलित थे।',
      storyCh5Act2Tag: 'अध्याय ५ • दृश्य २: महा-घंटों का दिव्य नाद',
      storyCh5Act2Text: '“कबीर, ध्यान से सुनो,” गुरु कृपाल बोले। “मंदिर के विशाल कांस्य घंटे पावन लय में गूँज रहे हैं। प्रस्तर आंगनों पर तालबद्ध छलांग लगाते हुए पांचवें तोरण द्वार को जागृत करो!”',

      // Chapter 6: Jamshedpur Industrial Run
      storyCh6Act1Tag: 'अध्याय ६ • दृश्य १: अग्नि और इस्पात का नगर',
      storyCh6Act1Text: 'जमशेदपुर के लौह नगर में विशाल धमन-भट्ठियों की चिमनियां आकाश को आलोकित कर रही थीं। पिघले हुए इस्पात की सुनहरी-नारंगी नदियां मानव के अदम्य परिश्रम और शिल्प का साक्षात्कार करा रही थीं।',
      storyCh6Act2Tag: 'अध्याय ६ • दृश्य २: यंत्रों की तीव्र गति',
      storyCh6Act2Text: 'उड़ती चिंगारियों और विशाल क्रेन के बीच कबीर को स्वचालित पट्टों पर संतुलन बनाना है। “मानव के अटूट पुरुषार्थ और शिल्प से ही यह औद्योगिक तोरण द्वार पुनः प्रज्वलित होगा!”',

      // Chapter 7: Dhanbad Coal-Mine Depths
      storyCh7Act1Tag: 'अध्याय ७ • दृश्य १: काले स्वर्ण की गहराइयां',
      storyCh7Act1Text: 'धरती के सैकड़ों फीट नीचे धनबाद की कोयला खदानों में, भारी काष्ठ स्तंभों के सहारे काली चट्टानें खड़ी थीं। जलते कारबाइड दीपकों की पीली रोशनी रहस्यमयी परछाइयां बना रही थी।',
      storyCh7Act2Tag: 'अध्याय ७ • दृश्य २: भूमिगत पटरियों की यात्रा',
      storyCh7Act2Text: 'लोहे की पटरियों पर खदान की गाड़ियां गड़गड़ा रही थीं। “गिरती बल्लियों और बदलते ट्रैक से सावधान रहो, कबीर! पृथ्वी के इस गर्भ में ही सातवां पावन टुकड़ा छुपा है!”',

      // Chapter 8: Damodar Storm Summit
      storyCh8Act1Tag: 'अध्याय ८ • दृश्य १: महा-तूफान का केंद्र',
      storyCh8Act1Text: 'दामोदर जलाशय के उच्चतम तूफानी शिखर पर काले बादलों का चक्रवात उमड़ रहा था। नील-लोहित तड़ित की बिजलियां नुकीली चोटियों पर कौंध रही थीं और प्रचंड झंझावात गूँज रहा था।',
      storyCh8Act2Tag: 'अध्याय ८ • दृश्य २: अंतिम महा-साधना',
      storyCh8Act2Text: 'आठवें भग्न तोरण के समक्ष विद्युत तरंगें वेग से नाच रही थीं। कबीर ने अपनी मुट्ठियां भींच लीं: “मेरी सम्पूर्ण यात्रा इसी पल के लिए थी। मैं इस महा-तूफान को पार कर अंतिम द्वार खोलूँगा!”',

      // Chapter 9: Grand Finale — The Great Reconnection
      storyCh9Act1Tag: 'अध्याय ९ • दृश्य १: अष्ट-तोरण महा-संगम',
      storyCh9Act1Text: 'जैसे ही कबीर ने आठवां गूँज टुकड़ा स्थापित किया, पूरे झारखंड के आठों तोरण द्वार एक साथ दिव्य सुनहरी-हरित ज्योति से जगमगा उठे! आकाश में फैली गूँज की दरार सदा के लिए बंद हो गई!',
      storyCh9Act2Tag: 'अध्याय ९ • दृश्य २: झारखंड के अमर रक्षक',
      storyCh9Act2Text: 'समस्त भूमि रोगमुक्त और जागृत हो उठी! गेंदे के फूलों की वर्षा के बीच गुरु कृपाल ने कबीर को गले लगाया। मांदर की थाप पर पूरी धरती गा उठी: “तुमने झारखंड को पुनः जोड़ दिया, कबीर—हमारे अमर रक्षक!”',

      // Credits
      creditsTitle: 'निर्माण एवं श्रेय',
      devLead: 'मुख्य वास्तुशिल्प एवं प्रोग्रामिंग: RAJRANJEET7680',
      culturalConsultants: 'सांस्कृतिक संदर्भ: झारखंड लोकगाथा एवं क्षेत्रीय पर्यावरण',
      artArchitecture: 'कला एवं एनीमेशन: 2D बहुस्तरीय लंबन (Parallax)',
      soundDesign: 'ध्वनि डिजाइन: राग भूपाली वेब-ऑडियो सिंथेसाइज़र',
      specialThanks: 'झारखंड की पावन भूमि, जलप्रपातों और शौर्य को समर्पित।',

      // Dialogues
      mentorName: 'गुरु कृपाल (वरिष्ठ मार्गदर्शक)',
      protagonistName: 'कबीर (साहसी यात्री)',

      dialogueIntro: [
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'राँची के पठार पर तुम्हारा स्वागत है, कबीर। आकाश की ओर देखो... गूँज की दरार ने हमारे क्षेत्रों के संपर्कों को तोड़ दिया है।'
        },
        {
          speaker: 'कबीर',
          role: 'player',
          emotion: 'determined',
          text: 'मुझे हवा में यह हलचल महसूस हो रही है, गुरुजी। हमारे पावन साल के वन और झरने समय के जाल में बंध गए हैं।'
        },
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'warning',
          text: 'तुम्हें लाल मिट्टी की पगडंडियों पर बिखरे गूँज के टुकड़ों को एकत्र करना होगा। इनमें हमारे जंगलों और नदियों की स्मृतियां समाहित हैं।'
        },
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'आगे वन के भृंग और आक्रामक वराह विचलित हैं। अपनी गति और छलांग से उन पर विजय पाओ। बिरसा की पावन भूमि तुम्हारा पथ आलोकित करे!'
        }
      ],

      loreTabletTitle: 'प्राचीन सोहराय भित्तिचित्र शिलालेख',
      loreTabletText: '“जब नेतरहाट की पहाड़ियों से पठारी हवाएं गूँजेंगी और हुंडरू का जल गर्जना करेगा, तब स्मृति के सूत्र पूरे झारखंड को पुनः एक कर देंगे।” (+1000 गूँज अंक!)'
    },

    nag: {
      gameTitle: 'आर.आर.आर — झारखंड क्वेस्ट',
      subtitle: 'रिवाइंड • रीइमेजिन • रीकनेक्ट',
      worldTitle: 'पहिला खण्ड: राँची पठार कर दुआर',
      regionName: 'राँची पठार',
      shards: 'इको शार्ड (गूँज कर टुकड़ा)',
      health: 'जिंदगी',
      score: 'नंबर',
      time: 'बेरा',
      checkpoint: 'दीया बरत हे! ठिकाना पक्का होल!',
      secretFound: 'गुप्त रस्ता भेंटायल! (+1000 अंक)',
      levelClear: 'तोरण दुआर खुल गेलक! राउर विजय होल!',
      levelClearSub: 'इलाका कर रस्ता जुड़ गेल • झारखंड कर माटी धन्य होल',
      nextLevelBtn: 'आगिला स्तर ▶',
      nextChapterBtn: 'आगिला खण्ड कर कहानी ▶',
      startLevelAction: 'मैदान में उतरा ▶',
      grandFinaleBtn: '🌟 महा-समापन कहानी ▶',
      grandTriumphTitle: 'झारखंड जुड़ गेलक — आठो तोरण दुआर जगमग!',
      grandTriumphSubtitle: 'गूँज कर दरार बंद भेल • आठो इलाका एके डोरी में फेरु से बंध गेलक',
      replayAllStory: '🎬 फेरु से पूरा कहानी देखा (खण्ड १–९)',
      viewWorldMap: '🗺️ इलाका नक्शा',
      watchStory: '🎬 कहानी',
      storyTheaterTitle: 'झारखंड कर अमर कहानी — कथा मंच',
      watchAllChapters: '▶ सब खण्ड देखा (पूरा कहानी)',
      allChaptersTab: '▶ पूरा कहानी',
      playAgain: 'फेरु खेलू',
      controlsHint: '[A/D या ←/→] दौड़ा | [W या Space] कूदा | [Shift या K] झपट्टा | [S या ↓] नीचा | [E] गोठियावा',
      dialoguePrompt: 'गोठियायेक ले [E] दबाऊ',
      skipText: '[Space / E] आगू बढ़ा',
      pause: 'विराम (Paused)',
      resume: 'चालू राखू',
      restart: 'फेरु से शुरू करू',
      settings: 'सेटिंग्स',
      accessibility: 'सुलभता आ सेटिंग्स',
      screenShake: 'स्क्रीन हिलाना (Screen Shake)',
      highContrast: 'साफ देखेक वाला मोड (High Contrast)',
      assistMode: 'मदद वाला मोड (अतिरिक्त मंच)',
      soundVolume: 'आवाज कर जोर',
      voiceActing: 'झारखंडी बोली (Voice Acting)',
      voiceOn: '🗣️ बोली: चालू',
      voiceOff: '🔇 बोली: बंद',
      fullscreen: 'बड़का स्क्रीन (Fullscreen)',
      graphicsPreset: 'फोटो कर निखार',
      presetLow: 'हल्का',
      presetMed: 'मझोला',
      presetHigh: 'चकाचक',
      textSpeed: 'अक्षर कर चाल',
      speedNormal: 'सामान्य',
      speedFast: 'तेज',
      speedInstant: 'तुरंते',
      close: 'बंद करू',
      statsShards: 'बटोरल गूँज टुकड़ा:',
      statsTime: 'लागल बेरा:',
      statsRank: 'खोजकर्ता पदवी:',
      rankS: 'S पदवी — छोटानागपुर कर वीर सपूत',
      rankA: 'A पदवी — होनहार खोजी',
      rankB: 'B पदवी — साहसी राही',

      // Control Modes
      controlMode: 'कंट्रोल तरीका (Control Mode)',
      modeAuto: 'अपने से बुझेक (Auto)',
      modePC: 'कंप्यूटर कीबोर्ड आ माउस',
      modeMobile: 'मोबाइल स्क्रीन टच',
      modePS5: 'प्लेस्टेशन ५ (PS5 DualSense)',

      // Lobby UI
      playBtn: '▶ खेल शुरू करू',
      storyBtn: '🎬 पुरान कहानी (Story)',
      levelSelectBtn: '🗺️ इलाका चुनू',
      characterBtn: '👤 कबीर बाबू के देखा',
      creditsBtn: '📜 जोहार आ आभार',
      returnToLobby: 'डेरा घुरी',
      lobbyTitle: 'राँची बेस कैंप',
      lobbySubtitle: 'पहिला खण्ड: गूँज कर दरार जाग उठलक',

      // Level Select (All 8 Worlds)
      worldSelectTitle: 'झारखंड कर ८ पावन इलाका',
      world1Title: 'पहिला खण्ड: राँची पठार कर दुआर',
      world1Desc: 'लाल माटी कर डगर, उछल-कूद आ पहला गूँज टुकड़ा।',
      world2Title: 'दूसरा खण्ड: हुंडरू जलप्रपात कर बन',
      world2Desc: 'बड़का चट्टान, पानी कर फुहार आ तेज बहाव।',
      world3Title: 'तीसरा खण्ड: नेतरहाट साँझ कर पहिया',
      world3Desc: 'पहाड़ कर तेज बसात, साँझ कर रूप आ बादर कर पुल।',
      world4Title: 'चौथा खण्ड: बेतला जंगल कर सीमना',
      world4Desc: 'घना साल कर गाछ, लटकल लतर आ चेरो राजा कर खंडहर।',
      world5Title: 'पाँचवा खण्ड: देवघर कर पावन नगरी',
      world5Desc: 'बाबा बैद्यनाथ कर आँगन, घंटी कर धुन आ झूमता मंच।',
      world6Title: 'छठा खण्ड: जमशेदपुर कर लोहा कारखाना',
      world6Desc: 'लोहा कर भट्ठी, चलता पट्टा (कन्वेयर) आ क्रेन कर झूला।',
      world7Title: 'सातवा खण्ड: धनबाद कोयला खदान कर गहिर',
      world7Desc: 'खदान कर ठेला गाड़ी, पटरी आ अंधरिया सुरंग।',
      world8Title: 'आठवा खण्ड: दामोदर तूफानी शिखर',
      world8Desc: 'बिजली, पानी आ तूफान कर संगम... अंतिम महा-युद्ध।',
      lockedBadge: '🔒 बंद',
      unlockedBadge: '⭐ तैयार',

      // Character Viewer
      charViewerTitle: 'साहसी कबीर — रूप-रंग अवलोकन',
      outfitLabel: 'यात्री कर पोशाक:',
      outfitClassic: 'पारंपरिक अन्वेषक (आसमानी आ केसरिया)',
      outfitSohrai: 'सोहराय कलाकार (लाल माटी आ पियरका)',
      outfitNight: 'रैन पहरुआ (गहरा नीला आ रुपहला)',
      animLabel: 'चाल-ढाल देखा:',
      animIdle: 'थिर मुद्रा (Idle)',
      animWalk: 'डगर चाल (Walk)',
      animRun: 'धड़कन दौड़ (Run)',
      animJump: 'ऊँच उछाल (Jump)',
      animDash: 'झपट्टा (Dash)',
      animHurt: 'चोट धक्का (Hurt)',
      animVictory: 'जीत कर जयकारा (Victory)',

      // Loading Screen
      loadingLabel: 'इलाका कर रस्ता सब जुड़त हे...',
      tipHeader: 'कबीर बाबू ले सलाह:',
      tip1: 'हवा में रह के नीचा (S / ↓ या L2) दबाबा त तुरते नीचा उतरबा।',
      tip2: 'झपट्टा (Shift / K या ▢) मारले कुछ पल ले अमर होइ जाबा आ दुश्मन साफ!',
      tip3: 'पलाश कर फूल में कूदा—ऊ तोके ऊपर कर छाँह में फेंक देई!',
      tip4: 'दीया जरल त राउर डेरा पक्का भेल!',

      // Title Card
      stageObjective: 'उद्देश्य: गूँज कर टुकड़ा बटोरा आ तोरण दुआर खोला।',

      // Voice callouts
      startVoice: 'जोहार! आगे बढ़ू रे भइया!',
      checkpointVoice: 'दीया बरत हे! ठिकाना पक्का होल!',
      victoryVoice: 'तोरण दुआर खुल गेलक! राउर विजय होल!',
      shardVoice: 'इको शार्ड मिल गेलक!',

      // Cinematic Story Intro — Chapters 1 to 9 Titles
      chapter1Title: 'पहिला खण्ड: राँची कर जागरण',
      chapter2Title: 'दूसरा खण्ड: हुंडरू कर गरजता पानी',
      chapter3Title: 'तीसरा खण्ड: नेतरहाट कर सुरुज डूबेक बेरा',
      chapter4Title: 'चौथा खण्ड: बेतला कर प्राचीन सखुआ बन',
      chapter5Title: 'पाँचवा खण्ड: देवघर कर पावन घंटी',
      chapter6Title: 'छठा खण्ड: जमशेदपुर कर लोहा कारखाना',
      chapter7Title: 'सातवा खण्ड: धनबाद कर कोइला खदान',
      chapter8Title: 'आठवा खण्ड: दामोदर कर आंधी-तूफान',
      chapter9Title: 'नववां खण्ड: झारखंड कर महा-पुनर्मिलन (महा-समापन)',

      // Chapter 1: Ranchi Plateau Gateway
      storyAct1Tag: 'पहिला अध्याय: पावन माटी',
      storyAct1Text: 'झारखंड कर पावन पठार में, सखुआ कर घना बन, हुंडरू कर गरजता झरना आ सब भाई-बंधु आठ गो पावन तोरण दुआर से एके डोरी में बंधल रहैं।',
      storyAct2Tag: 'दूसरा अध्याय: गूँज कर दरार',
      storyAct2Text: 'एकाएक अकास में एक महा-विपत्ति—गूँज कर दरार—फाट उठलक! पावन तोरण दुआर टूट के बिखर गेलक, माटी कर इयाद इको शार्ड में जम गेल, आ हमर सब आठो इलाका अलग होइ गेल।',
      storyAct3Tag: 'तीसरा अध्याय: गुरु कर हुकुम',
      storyAct3Text: 'राँची कर पठार पर, सयान गुरु कृपाल कबीर बाबू के बोलवलें: “भगवान बिरसा आ हमर पुरखा कर आसीरबाद तोर साथे हे। आठो इलाका में जा, गूँज कर टुकड़ा मन के बटोर, आ पावन दीया के बार के रस्ता खोल!”',
      storyAct4Tag: 'चौथा अध्याय: कबीर कर संकल्प',
      storyAct4Text: 'अपन केसरिया पगड़ी बाँध के, कबीर बाबू संकल्प लेलें: “झारखंड कर माटी कर शक्ति से, हम सब तोरण दुआर के फेरु से जोड़ब, आ पूरा झारखंड के एके बनाय देब! जोहार झारखंड!”',

      // Chapter 2: Hundru Falls Wilds
      storyCh2Act1Tag: 'दूसरा खण्ड • दृश्य १: सुवर्णरेखा कर गर्जन',
      storyCh2Act1Text: 'राँची पठार से आगू बढ़ के कबीर बाबू हुंडरू जलप्रपात पहुँचलें, जहाँ सुवर्णरेखा नदी ३२० फीट ऊपर से चट्टान पर दहाड़ मार के गिरेला। पानी कर कुहासा में तोरण कर टुकड़ा लुकायल हे।',
      storyCh2Act2Tag: 'दूसरा खण्ड • दृश्य २: झरना कर तेज धार',
      storyCh2Act2Text: 'पानी कर बौछार में गुरु कृपाल कहलें: “कबीर बाबू, पानी कर धार बड़ा तेज हे रे! भींजल पाथर पर संभल के कूदा, तेज धार के पार करा आ पानी कर गूँज टुकड़ा मन के बटोरा!”',

      // Chapter 3: Netarhat Sunset Hills
      storyCh3Act1Tag: 'तीसरा खण्ड • दृश्य १: छोटानागपुर कर रानी',
      storyCh3Act1Text: 'ऊपर नेतरहाट कर पहाड़ चढ़ते-चढ़ते कबीर बाबू देखलें कि पूरा अकास सिंदूर आ सोना नियर चमकत रहे। चीड़ आ सखुआ कर गाछ पछिया हवा में झूम उठल रहे।',
      storyCh3Act2Tag: 'तीसरा खण्ड • दृश्य २: बादर कर रस्ता',
      storyCh3Act2Text: '“पहाड़ कर ठंढा हवा तोर हिम्मत परखेला,” गुरुजी कहलें। “हवा में तैरत बादर कर डाँड़ा खाली साहसी बेटा मन के दिसेला। संझा बेरा में संभल के तीसरा तोरण दुआर के खोला!”',

      // Chapter 4: Betla Forest Frontier
      storyCh4Act1Tag: 'चौथा खण्ड • दृश्य १: चेरो राजा कर पुरान किला',
      storyCh4Act1Text: 'कबीर बाबू बेतला कर घना जंगल में ढुकलें, जहाँ बाँस आ सखुआ कर छतरी तर १६वीं सदी कर चेरो राजा मन कर पाथर वाला किला आजो सीना तान के खड़ा हे।',
      storyCh4Act2Tag: 'चौथा खण्ड • दृश्य २: जंगल कर पहरेदार',
      storyCh4Act2Text: 'बाँस कर झुरमुट से हाथी आ बाघ कबीर बाबू के देखत हैं। “कोनो जीव-जंतु के दुख नखे देवेक, कबीर! हवा नियर गाछ कर डाली पर कूदा आ जंगल कर तोरण दुआर के खोला!”',

      // Chapter 5: Deoghar Heritage-City
      storyCh5Act1Tag: 'पाँचवा खण्ड • दृश्य १: बाबा धाम देवघर',
      storyCh5Act1Text: 'पवित्र देवघर पहुँचते बाबा बैद्यनाथ धाम कर लाल झंडा अकास छूवत लउकल। सोना कर कलश जगमग करत रहे आ रस्ता भर घीव कर दीया जरत रहे।',
      storyCh5Act2Tag: 'पाँचवा खण्ड • दृश्य २: पावन घंटी कर नाद',
      storyCh5Act2Text: '“कान लगाय के सुना, कबीर,” गुरु कृपाल बोललें। “मंदिर कर बड़का कांसा घंटी ताल में बाजत हे। पाथर कर आँगन पर लय में कूद के पाँचवा तोरण दुआर के जगावा!”',

      // Chapter 6: Jamshedpur Industrial Run
      storyCh6Act1Tag: 'छठा खण्ड • दृश्य १: लोहा आ आग कर नगर',
      storyCh6Act1Text: 'जमशेदपुर कर कारखाना में बड़का-बड़का भट्ठी अकास के उजर कर देले रहे। पिघलल लोहा कर लाल-पियर नदी झारखंडी पौरुष आ मेहनत कर गवाही देत रहे।',
      storyCh6Act2Tag: 'छठा खण्ड • दृश्य २: मशीन कर धड़कन',
      storyCh6Act2Text: 'उड़त चिंगारी आ बड़का क्रेन कर बीच कबीर बाबू के चलत पट्टा पर संभल के दौड़ेक हे। “इंसान कर मेहनत आ बुद्धि से ही ई लोहा कर तोरण दुआर फेरु से जगेगा!”',

      // Chapter 7: Dhanbad Coal-Mine Depths
      storyCh7Act1Tag: 'सातवा खण्ड • दृश्य १: करिया सोना कर गहराई',
      storyCh7Act1Text: 'धरती कर सैकड़ों हाथ नीचे धनबाद कर कोइला खदान में, काठ कर खंभा भारी पाथर के थामल रहे। करबाइड बत्ती कर पीयर रोशनी में करिया चट्टान चमकत रहे।',
      storyCh7Act2Tag: 'सातवा खण्ड • दृश्य २: खदान कर रेलगाड़ी',
      storyCh7Act2Text: 'लोहा कर पटरी पर कोइला कर गाड़ी सरसरा के दौड़त रहे। “गिरता काठ आ बदलता पटरी से होसियार रहा, कबीर बाबू! ई पाताल में ही सातवां पावन टुकड़ा गड़ल हे!”',

      // Chapter 8: Damodar Storm Summit
      storyCh8Act1Tag: 'आठवा खण्ड • दृश्य १: दामोदर कर महा-तूफान',
      storyCh8Act1Text: 'दामोदर बाँध कर सबले ऊँच चोटी पर करिया मेघ घुमड़त रहे। चमचमाती बिजली पाथर पर टूट पड़त रहे आ साँय-साँय पछिया हवा देह कँपावत रहे।',
      storyCh8Act2Tag: 'आठवा खण्ड • दृश्य २: अंतिम परीक्षा',
      storyCh8Act2Text: 'आठवां टूटैल तोरण दुआर कर सामने बिजली कर शोला भड़क उठलक। कबीर बाबू अपन छाती ठोक के कहलें: “हमर सब परीक्षा इहे बेरा ले रहे। ई तूफान के चीर के अंतिम दुआर हम खोलब!”',

      // Chapter 9: Grand Finale — The Great Reconnection
      storyCh9Act1Tag: 'नववां खण्ड • दृश्य १: आठो तोरण कर मिलन',
      storyCh9Act1Text: 'जइसे ही कबीर बाबू आठवां गूँज टुकड़ा बइठवलें, पूरा झारखंड कर आठो तोरण दुआर एक साथ हरियर आ सोनहरा ज्योति से जगमगा उठलक! अकास कर दरार हमेशा ले मिट गेलक!',
      storyCh9Act2Tag: 'नववां खण्ड • दृश्य २: छोटानागपुर कर अमर सपूत',
      storyCh9Act2Text: 'हमर पावन धरती जाग उठलक! गेंदा फूल कर बरखा में गुरु कृपाल कबीर बाबू के छाती से लगा लेलें। मांदर कर ताल पर सब बोले: “कबीर बाबू पूरा झारखंड के जोड़ देलें! जोहार झारखंड!”',

      // Credits
      creditsTitle: 'बनावेक वाला आ जोहार',
      devLead: 'मुख्य वास्तुकार आ कोड: RAJRANJEET7680',
      culturalConsultants: 'माटी कर बात: झारखंड लोकसंस्कृति आ पर्यावरण',
      artArchitecture: 'नक्शा आ एनीमेशन: 2D बहुस्तरीय लंबन (Parallax)',
      soundDesign: 'राग आ सुर: राग भूपाली वेब-ऑडियो सिंथेसाइज़र',
      specialThanks: 'झारखंड कर पावन माटी, झरना आ वीर मन के समर्पित।',

      // Dialogues
      mentorName: 'गुरु कृपाल (सयान मार्गदर्शक)',
      protagonistName: 'कबीर (साहसी यात्री)',

      dialogueIntro: [
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'जोहार कबीर बाबू! अकास के देखा... गूँज कर दरार हमर सब इलाका के अलग-अलग कइर देलक हे।'
        },
        {
          speaker: 'कबीर',
          role: 'player',
          emotion: 'determined',
          text: 'हँ गुरुजी, हवा में कुछ अनहोनी बुझात हे। हमर साल कर बन आ जलप्रपात सब थम्हि गेल हे।'
        },
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'warning',
          text: 'तोके राँची कर लाल माटी में बिखरैल इको शार्ड (गूँज कर टुकड़ा) मन के बटोरेक होवी। ई मन में हमर पुरखा कर इयाद भरल हे।'
        },
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'आगे जंगल कर कीड़ा आ जंगली सूअर घूमत हैं। फूर्ती से कूद के पार होवा। भगवान बिरसा कर आसीरबाद तोर साथे हे!'
        }
      ],

      loreTabletTitle: 'पुरान सोहराय भित्तिचित्र',
      loreTabletText: '“जब नेतरहाट कर पहिया से बसात बही आ हुंडरू कर पानी गरजी, तब झारखंड कर माटी एके होइ!” (+1000 गूँज अंक!)'
    }
  },

  setLanguage(lang) {
    if (this.strings[lang]) {
      this.currentLang = lang;
      return true;
    }
    return false;
  },

  cycleLanguage() {
    const idx = this.availableLangs.indexOf(this.currentLang);
    const nextIdx = (idx + 1) % this.availableLangs.length;
    this.currentLang = this.availableLangs[nextIdx];
    return this.currentLang;
  },

  get(key) {
    return this.strings[this.currentLang][key] || this.strings['en'][key] || key;
  }
};
