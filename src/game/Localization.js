/**
 * Localization system for RRR - Jharkhand Quest
 * Supports English and Hindi with extensible architecture for regional languages (Nagpuri, Mundari, Santali)
 * Authors: RAJRANJEET7680
 */

export const Localization = {
  currentLang: 'en', // 'en' | 'hi'

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
      levelClearSub: 'World 1-1 Conquered • Ranchi Pathway Reconnected',
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
      close: 'Close',
      statsShards: 'Echo Shards Collected:',
      statsTime: 'Completion Time:',
      statsRank: 'Explorer Rank:',
      rankS: 'S Rank — Legend of Chota Nagpur',
      rankA: 'A Rank — Master Explorer',
      rankB: 'B Rank — Skilled Traveler',
      
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
      levelClearSub: 'विश्व १-१ पूर्ण • राँची मार्ग पुनः जुड़ा',
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
      close: 'बंद करें',
      statsShards: 'एकत्रित गूँज टुकड़े:',
      statsTime: 'कुल समय:',
      statsRank: 'खोजकर्ता श्रेणी:',
      rankS: 'S श्रेणी — छोटा नागपुर के नायक',
      rankA: 'A श्रेणी — कुशल खोजी',
      rankB: 'B श्रेणी — कर्मठ यात्री',

      // Dialogues
      mentorName: 'गुरु कृपाल (वरिष्ठ मार्गदर्शक)',
      protagonistName: 'कबीर (साहसी यात्री)',

      dialogueIntro: [
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'राँची के पठार पर तुम्हारा स्वागत है, कबीर। आकाश की ओर देखो... गूँज की दरार (Rift of Echoes) ने हमारे क्षेत्रों के संपर्कों को तोड़ दिया है।'
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
          text: 'तुम्हें लाल मिट्टी की पगडंडियों पर बिखरे गूँज के टुकड़ों (Echo Shards) को एकत्र करना होगा। इनमें हमारे जंगलों और नदियों की स्मृतियां समाहित हैं।'
        },
        {
          speaker: 'गुरु कृपाल',
          role: 'mentor',
          emotion: 'calm',
          text: 'आगे वन के भृंग (Patrol Beetles) और आक्रामक वराह (Chargers) विचलित हैं। अपनी गति और छलांग से उन पर विजय पाओ। बिरसा की पावन भूमि तुम्हारा पथ आलोकित करे!'
        }
      ],

      loreTabletTitle: 'प्राचीन सोहराय भित्तिचित्र शिलालेख',
      loreTabletText: '“जब नेतरहाट की पहाड़ियों से पठारी हवाएं गूँजेंगी और हुंडरू का जल गर्जना करेगा, तब स्मृति के सूत्र पूरे झारखंड को पुनः एक कर देंगे।” (+1000 गूँज अंक!)'
    }
  },

  setLanguage(lang) {
    if (this.strings[lang]) {
      this.currentLang = lang;
      return true;
    }
    return false;
  },

  get(key) {
    return this.strings[this.currentLang][key] || this.strings['en'][key] || key;
  }
};
