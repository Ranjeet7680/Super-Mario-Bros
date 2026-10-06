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
      playAgain: 'Play Again',
      controlsHint: '[A/D or ←/→] Run | [W or Space] Jump | [Shift or K] Dash | [S or ↓] Fast Fall | [E] Talk',
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
      
      // Lobby UI
      playBtn: '▶ PLAY GAME',
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
      animVictory: 'Victory Pose',

      // Loading Screen
      loadingLabel: 'Restoring Regional Pathways...',
      tipHeader: 'Gameplay Guide:',
      tip1: 'Press Down (S / ↓) while airborne to perform a fast-fall descent.',
      tip2: 'Dash (Shift / K) grants temporary invulnerability and can destroy grounded enemies.',
      tip3: 'Look for bouncy Palas flowers—they propel you into secret high canopies!',
      tip4: 'Lit Checkpoint Lanterns save your progress and restore your courage.',

      // Title Card
      stageObjective: 'Objective: Collect the Echo Shards and unlock the Gateway Torana.',

      // Voice callouts
      startVoice: 'Gateway open! Proceed forward!',
      checkpointVoice: 'Lantern lit! Checkpoint secured!',
      victoryVoice: 'Gateway restored! Regional pathway reconnected!',
      shardVoice: 'Echo Shard acquired!',

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

      // Lobby UI
      playBtn: '▶ खेल शुरू करें',
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
      animVictory: 'विजय मुद्रा (Victory)',

      // Loading Screen
      loadingLabel: 'क्षेत्रीय मार्गों का पुनरुद्धार...',
      tipHeader: 'मार्गदर्शन सुझाव:',
      tip1: 'हवा में रहते हुए नीचे (S / ↓) दबाकर तीव्र पतन (Fast-fall) करें।',
      tip2: 'डैश (Shift / K) से कुछ पलों के लिए अमरता मिलती है और शत्रु परास्त होते हैं।',
      tip3: 'पलाश के पुष्पों को खोजें—वे आपको गुप्त छतरी तक उछालते हैं!',
      tip4: 'प्रज्वलित दीप स्तम्भ आपकी प्रगति सुरक्षित करते हैं।',

      // Title Card
      stageObjective: 'उद्देश्य: गूँज के टुकड़े एकत्र करें और तोरण द्वार खोलें।',

      // Voice callouts
      startVoice: 'प्रवेशद्वार खुल गया! आगे बढ़ें!',
      checkpointVoice: 'दीप स्तम्भ प्रज्वलित! ठिकाना सुरक्षित!',
      victoryVoice: 'तोरण द्वार पुनः स्थापित! मार्ग जुड़ गया!',
      shardVoice: 'गूँज टुकड़ा प्राप्त हुआ!',

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

      // Lobby UI
      playBtn: '▶ खेल शुरू करू',
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
      animVictory: 'जीत कर जयकारा (Victory)',

      // Loading Screen
      loadingLabel: 'इलाका कर रस्ता सब जुड़त हे...',
      tipHeader: 'कबीर बाबू ले सलाह:',
      tip1: 'हवा में रह के नीचा (S / ↓) दबाबा त तुरते नीचा उतरबा।',
      tip2: 'झपट्टा (Shift / K) मारले कुछ पल ले अमर होइ जाबा आ दुश्मन साफ!',
      tip3: 'पलाश कर फूल में कूदा—ऊ तोके ऊपर कर छाँह में फेंक देई!',
      tip4: 'दीया जरल त राउर डेरा पक्का भेल!',

      // Title Card
      stageObjective: 'उद्देश्य: गूँज कर टुकड़ा बटोरा आ तोरण दुआर खोला।',

      // Voice callouts
      startVoice: 'जोहार! आगे बढ़ू रे भइया!',
      checkpointVoice: 'दीया बरत हे! ठिकाना पक्का होल!',
      victoryVoice: 'तोरण दुआर खुल गेलक! राउर विजय होल!',
      shardVoice: 'इको शार्ड मिल गेलक!',

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
