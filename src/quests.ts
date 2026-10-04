import { Companion, Quest } from './types';

export const COMPANIONS: Record<string, Companion> = {
  gaja: {
    id: 'gaja',
    name: 'Gaja',
    species: 'Elephant of Strength',
    description: 'Gentle, super-strong, and full of calm focus. Gaja helps you stand tall like a mountain!',
    color: '#E0F2FE', // Blue-50 back
    accentColor: '#0284C7', // Sky-600
    emoji: '🐘',
    quote: "Deep breaths! A calm mind is as strong as ten elephants."
  },
  mayur: {
    id: 'mayur',
    name: 'Mayur',
    species: 'Peacock of Joy',
    description: 'Bite-sized bundle of colors and song. Mayur reminds you to focus on the beauty of your effort!',
    color: '#F0FDF4', // Green-50
    accentColor: '#16A34A', // Green-600
    emoji: '🦚',
    quote: "Spread your beautiful wings and focus on making sweet music!"
  },
  veeru: {
    id: 'veeru',
    name: 'Veeru',
    species: 'Monkey of Energy',
    description: 'Quick-thinking, bouncy, and playful! Veeru helps you notice your impulses and pause with wisdom.',
    color: '#FEF3C7', // Amber-100
    accentColor: '#D97706', // Amber-650
    emoji: '🐒',
    quote: "A quick pause lets us jump higher and make smarter jumps!"
  },
  gauri: {
    id: 'gauri',
    name: 'Gauri',
    species: 'Cow of Calm Essence',
    description: 'The gentlest soul in the whole valley. Gauri shines like warm sunshine and keeps you peaceful.',
    color: '#FFF1F2', // Rose-50
    accentColor: '#E11D48', // Rose-600
    emoji: '🐄',
    quote: "Storms come and go, but underneath, you are always quiet and safe."
  }
};

export const QUESTS: Quest[] = [
  {
    id: 1,
    title: "The Battle inside Hearts",
    shortDescription: "Discover how the brave Arjuna stood in front of his life's biggest battle and what we do when we feel butterflies!",
    rewardCrystal: "Courage Crystal",
    rewardItem: "Wisdom Lamp",
    themeColor: "from-sky-400 to-indigo-600",
    textColor: "text-indigo-600",
    shadowColor: "shadow-indigo-200",
    shlokaSanskrit: "धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय || 1.1 ||",
    shlokaTransliteration: "dhṛtarāṣṭra uvāca\ndharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāścaiva kim akurvata sañjaya",
    shlokaTranslation: "King Dhritarashtra asked: 'O Sanjaya, assembled on the sacred field of Kurukshetra, eager to fight, what did my sons and the sons of Pandu do?'",
    shlokaKidVersion: "Imagine your grandpa asking with excitement and a racing heart: 'What happened when our school team walked onto the football field for the championship?'",
    shlokaWordMeanings: [
      { word: "Dharma-kṣetre", meaning: "Field of Values and True Duty" },
      { word: "Kuru-kṣetre", meaning: "The physical field of action" },
      { word: "Samavetāḥ", meaning: "Gathered together" },
      { word: "Yuyutsavaḥ", meaning: "Eager to play and struggle" },
      { word: "Kim akurvata", meaning: "What did they do?" }
    ],
    chantSteps: [
      "dhṛtarāṣṭra uvāca",
      "dharma-kṣetre kuru-kṣetre",
      "samavetā yuyutsavaḥ",
      "māmakāḥ pāṇḍavāścaiva",
      "kim akurvata sañjaya"
    ],
    storyStep: {
      title: "The Great Gathering 🛡️",
      text: "Two massive armies are standing face to face on a golden, dusty field! On one side are the hundred Kauravas, and on the other, the brave Pandavas with their golden chariot. King Dhritarashtra wants to know what his children are doing. Arjuna takes a deep breath but is feeling heavily nervous.",
      narratorQuote: "Krishna looks at Arjuna with infinite peace: 'Before we fight any dragons outside, we must learn to calm the storm currently racing inside our own hearts!'"
    },
    teachingStep: {
      title: "The Sacred Field of Duty",
      originalConcept: "Bhagavad Gita 1.1 - The Outer and Inner Field",
      kidWisdom: "Our life is like a playing field. Every single day, we stand in the middle and choose our actions. Feeling worried or eager is natural when starting big things!",
      explorerWisdom: "Our mind is like a sunny playground where we decide to be kind and brave!",
      guideWisdom: "The 'Dharmaksetra' is the symbolic arena of human conscience where righteousness and ego struggle constantly for control."
    },
    exampleStep: {
      title: "Riaansh's First Day",
      childName: "Riaansh",
      scenario: "Riaansh steps inside the middle school classroom. Everyone is talking loudly, and his desk feels incredibly far away. His chest feels tight, and he wonders if he should run to the restroom to hide."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "Which action shows the courageous heart of Arjuna?",
      options: [
        {
          id: '1a',
          text: "Tell the teacher his stomach hurts, slip out to the playground, and seek to call Mom.",
          isCorrect: false,
          feedback: "Running away might feel easy, but it won't let Riaansh discover his beautiful inner courage!"
        },
        {
          id: '1b',
          text: "Take three calm elephant chest breaths, smile warmly, and walk to his seat, greeting a classmate.",
          isCorrect: true,
          feedback: "Superb! Taking a slow deep breath gets the body ready for any exciting field!"
        }
      ]
    }
  },
  {
    id: 2,
    title: "The Sound of the Shells",
    shortDescription: "Celebrate the magnificent blasting sound of conch shells that filled everyone with immense energy!",
    rewardCrystal: "Vibrant Crystal",
    rewardItem: "Garden Chimes",
    themeColor: "from-amber-400 to-orange-600",
    textColor: "text-amber-700",
    shadowColor: "shadow-amber-200",
    shlokaSanskrit: "ततः शङ्खाश्च भेर्यश्च पणवानकगोमुखाः |\nसहसैवाभ्यहन्यन्त स शब्दस्तुमुलोऽभवत् || 1.13 ||",
    shlokaTransliteration: "tataḥ śaṅkhāś ca bheryaś ca paṇavānaka-gomukhāḥ\nsahasaivābhyahanyanta sa śabdas tumulo 'bhavat",
    shlokaTranslation: "Then, conchs, kettledrums, cymbals, drums, and trumpets were suddenly blown, and the sound was tumultuous.",
    shlokaKidVersion: "Like standard drums, cheers, bells, and high-fives bursting open at once in a stadium of celebration!",
    shlokaWordMeanings: [
      { word: "Tataḥ", meaning: "After that" },
      { word: "Śaṅkhāḥ", meaning: "Beautiful Conch Shells" },
      { word: "Bheryaḥ", meaning: "Loud Drums" },
      { word: "Sahasa-eva", meaning: "All of a sudden" },
      { word: "Tumulaḥ", meaning: "Tremendously grand" }
    ],
    chantSteps: [
      "tataḥ śaṅkhāś ca bheryaś ca",
      "paṇavānaka-gomukhāḥ",
      "sahasaivābhyahanyanta",
      "sa śabdas tumulo 'bhavat"
    ],
    storyStep: {
      title: "The Golden Echo 🐚",
      text: "The grand warriors of Kurukshetra hold up their white conch shells. Arjuna holds his called 'Devadatta' while Krishna lifts 'Panchajanya'. The drums start to beat, and when the shells blow, a majestic sound travels through the valleys, shaking all sadness away!",
      narratorQuote: "Mayur spreads his feathers: 'Let your energy sound like the beautiful conchs. Clear, bright, and proud of doing true goodness!'"
    },
    teachingStep: {
      title: "Awakening Your Energy",
      originalConcept: "Bhagavad Gita 1.13 - Shanti and Veera Rasa",
      kidWisdom: "When we are quiet or scared, a sudden joyful shout, a clap, or a happy song can wake up our dormant power and drive the shadows away!",
      explorerWisdom: "We can clap our hands and sing a happy song to make ourselves feel super strong!",
      guideWisdom: "Sound vibrates our internal energy centers. Loud, positive sonic elements (like chants or music) can instantly realign our nervous system under stress."
    },
    exampleStep: {
      title: "Ananya's Piano Concert",
      childName: "Ananya",
      scenario: "Ananya is sitting backstage waiting to play her silver piano. The room is quiet and cold, making her fingers freeze up with worry."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "How can Ananya blow her internal joyful conch?",
      options: [
        {
          id: '2a',
          text: "Whisper 'I'm going to fail' and freeze her shoulders tight.",
          isCorrect: false,
          feedback: "Quiet, negative thoughts keep our energy frozen under lock!"
        },
        {
          id: '2b',
          text: "Quietly rub her hands together to warm them up, smile big, and hum her favorite happy tune.",
          isCorrect: true,
          feedback: "Bravo! Generating warmth and musical vibration clears the nervous chill and brings joy!"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Move the Chariot",
    shortDescription: "Help Arjuna request Krishna to place the golden chariot right in the middle of the armies!",
    rewardCrystal: "Focus Crystal",
    rewardItem: "Lotus Pond",
    themeColor: "from-emerald-400 to-teal-600",
    textColor: "text-emerald-700",
    shadowColor: "shadow-emerald-200",
    shlokaSanskrit: "अर्जुन उवाच |\nसेनयोरुभयोर्मध्ये रथं स्थापय मेऽच्युत || 1.21 ||",
    shlokaTransliteration: "arjuna uvāca\nsenayor ubhayor madhye rathaṁ sthāpaya me 'cyuta",
    shlokaTranslation: "Arjuna said: 'O Achyuta (the infallible Lord), please park my chariot between the two armies.'",
    shlokaKidVersion: "Arjuna looking at his guide and saying: 'Hey, let's step closer to the chalkboard so we can see the problems clearly and figure them out!'",
    shlokaWordMeanings: [
      { word: "Senayoḥ", meaning: "Of the armies" },
      { word: "Ubhayoḥ", meaning: "Of both" },
      { word: "Madhye", meaning: "Right in the middle" },
      { word: "Rathaṁ", meaning: "The magnificent chariot" },
      { word: "Sthāpaya", meaning: "Please park/place" },
      { word: "Acyuta", meaning: "The Stable/Trustworthy Friend" }
    ],
    chantSteps: [
      "arjuna uvāca",
      "senayor ubhayor madhye",
      "rathaṁ sthāpaya me 'cyuta"
    ],
    storyStep: {
      title: "Into the Center 🏹",
      text: "Arjuna stands tall, holding his grand bow Gandiva. He looks at Krishna, who is holding the reins of the five white horses. 'Achyuta! Put us in the exact center, so I can see everything clearly.' Krishna gracefully guidelines the chariot right where the action is.",
      narratorQuote: "Krishna nods: 'True wisdom is never found by hiding. We must stand in the middle, look at our choices, and examine them with honesty!'"
    },
    teachingStep: {
      title: "Standing in the Center",
      originalConcept: "Bhagavad Gita 1.21 - Observation and Clarity",
      kidWisdom: "When we are trying to resolve a problem, we don't look away or close our eyes. We stand right in the middle, observe what is happening, and ask for clear guidelines.",
      explorerWisdom: "Standing in the middle and looking at details helps us make smart decisions!",
      guideWisdom: "Achieving an objective viewpoint requires centering oneself between conflicting factions, stepping out of subjective bias."
    },
    exampleStep: {
      title: "Dev's Kitchen Cleanup",
      childName: "Dev",
      scenario: "Dev has to clean up a giant kitchen mess of split cereal, bowls, and spoons. It looks super messy and scary."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "Which action maps to 'Move the Chariot' to face the work?",
      options: [
        {
          id: '3a',
          text: "Stuff all clean and dirty bowls inside the cabinet quickly so no one sees them.",
          isCorrect: false,
          feedback: "Hiding the bowls doesn't clean the kitchen, it just stores the chaos!"
        },
        {
          id: '3b',
          text: "Stand right in front of the kitchen island, look at what needs to go where, and start sorting spoons first.",
          isCorrect: true,
          feedback: "Fantastic! Centering yourself and addressing one bowl at a time is the hero's path!"
        }
      ]
    }
  },
  {
    id: 4,
    title: "Seeing the Family",
    shortDescription: "Arjuna observes his grandfathers, uncles, and teachers standing before him, feeling deep attachment.",
    rewardCrystal: "Heart Crystal",
    rewardItem: "Cosmic Seat",
    themeColor: "from-purple-400 to-pink-600",
    textColor: "text-purple-700",
    shadowColor: "shadow-purple-200",
    shlokaSanskrit: "तत्रापश्यत्स्थितान् पार्थः पितृनथ पितामहान् |\nआचार्यान्मातुलान्भ्रातृन्पुत्रान्पौत्रान्सखींस्तथा || 1.26 ||",
    shlokaTransliteration: "tatrāpaśyat sthitān pārthaḥ pitṝn atha pitāmahān\nācāryān mātulān bhrātṝn putrān pautrān sakhīṁs tathā",
    shlokaTranslation: "There, Arjuna saw standing before him fathers, grandfathers, teachers, maternal uncles, brothers, sons, grandsons, and friends.",
    shlokaKidVersion: "Arjuna looking around and seeing everyone he knows and loves in the audience, making him worried about his performance.",
    shlokaWordMeanings: [
      { word: "Tatra", meaning: "Over there" },
      { word: "Apaśyat", meaning: "Observed/Saw" },
      { word: "Pitāmahān", meaning: "Grandfathers (like Bhishma)" },
      { word: "Ācāryān", meaning: "Teachers (like Drona)" },
      { word: "Sakhīn", meaning: "Dear childhood friends" }
    ],
    chantSteps: [
      "tatrāpaśyat sthitān pārthaḥ",
      "pitṝn atha pitāmahān",
      "ācāryān mātulān bhrātṝn",
      "putrān pautrān sakhīṁs tathā"
    ],
    storyStep: {
      title: "Faces in the Crowd 👥",
      text: "From the middle of the field, Arjuna looks left and right. His eyes widen. He sees his favorite grand-uncle Bhishma who raised him, and his spelling/archery teacher Drona! His heart grows heavy. 'How can I compete with people I care about?' he asks in sadness.",
      narratorQuote: "Gauri sighs gently: 'Seeing those we love can sometimes make our duties feel super tricky, because we don't want to hurt anyone.'"
    },
    teachingStep: {
      title: "Dealing with Attachment",
      originalConcept: "Bhagavad Gita 1.26 - Attachment and Grief",
      kidWisdom: "When we love our friends, we sometimes find it hard to play fairly or say what is true because we fear they will get upset. Real love means wanting what is right for everyone!",
      explorerWisdom: "We want our friends to be happy, but we still play fair and tell the truth!",
      guideWisdom: "Personal relationships can cloud duty and objective judgement. Arjuna's personal grief represents the conflict between immediate attachment and higher moral responsibility."
    },
    exampleStep: {
      title: "Kabir's Game Choice",
      childName: "Kabir",
      scenario: "Kabir is playing soccer. His best friend Aarav is on the other team. Aarav asks Kabir to pretend to trip so Aarav's team can win easily."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "How can Kabir show true, honest love for friendship?",
      options: [
        {
          id: '4a',
          text: "Pretend to fall down so Aarav is happy, even if it hurts his own teammates.",
          isCorrect: false,
          feedback: "Cheating doesn't show true friendship, and it breaks the trust of his own teammates!"
        },
        {
          id: '4b',
          text: "Play with 100% effort, shake Aarav's hand with a smile, and say: 'I played my best because I respect you!'",
          isCorrect: true,
          feedback: "Wow! Giving your best effort is the highest form of respect for your friends!"
        }
      ]
    }
  },
  {
    id: 5,
    title: "Hands Shaking, Bow Slipping",
    shortDescription: "Explore physical symptoms of anxiety—how Arjuna's hands shook and his bow slipped.",
    rewardCrystal: "Relief Crystal",
    rewardItem: "Pebble Path",
    themeColor: "from-rose-400 to-red-600",
    textColor: "text-rose-700",
    shadowColor: "shadow-rose-200",
    shlokaSanskrit: "गाण्डीवं स्रंसते हस्तात्त्वक्चैव परिदह्यते |\nन च शक्नोम्यवस्थातुं भ्रमतीव च मे मनः || 1.30 ||",
    shlokaTransliteration: "gāṇḍīvaṁ sraṁsate hastāt tvak caiva paridahyate\nna ca śaknumy avasthātuṁ bhramatīva ca me manaḥ",
    shlokaTranslation: "My Gandiva bow is slipping from my hand, my skin is burning all over, I am unable to stand steady, and my mind is reeling.",
    shlokaKidVersion: "My pencil feels too heavy, my skin feels hot and sweaty, my stomach is full of cold butterflies, and I cannot think straight!",
    shlokaWordMeanings: [
      { word: "Gāṇḍīvaṁ", meaning: "The divine golden bow" },
      { word: "Sraṁsate", meaning: "Slipping out" },
      { word: "Hastāt", meaning: "From his shaking hand" },
      { word: "Tvak caiva", meaning: "My skin too" },
      { word: "Paridahyate", meaning: "Is burning/hot" },
      { word: "Bhramati-iva", meaning: "Is spinning like a top" }
    ],
    chantSteps: [
      "gāṇḍīvaṁ sraṁsate hastāt",
      "tvak caiva paridahyate",
      "na ca śaknumy avasthātuṁ",
      "bhramatīva ca me manaḥ"
    ],
    storyStep: {
      title: "The Trembling Hero 🏹💨",
      text: "Arjuna collapses onto his chariot bench. His majestic bow, Gandiva, slips out of his grasp and lands on the wood. His throat is dry, his knees feel like jelly, and his mind is spinning in circles. He thinks: 'I am not strong enough for this big test!'",
      narratorQuote: "Gaja presses his soft trunk to Arjuna's shoulder: 'Arjuna, your body is just sending a signal of fear. It is not telling you who you are! Let us pause and rest together.'"
    },
    teachingStep: {
      title: "Listening to the Body",
      originalConcept: "Bhagavad Gita 1.30 - Somatic Symptoms of Stress",
      kidWisdom: "When we get scared, our bodies get hot, sweaty, or wiggly. It's just a reminder that we are facing something important. We don't have to panic about the wiggles!",
      explorerWisdom: "Sweaty hands just mean we are about to try something amazing!",
      guideWisdom: "Physical reactions to fear are universal cognitive stress responses. Recognizing them objectively prevents us from misidentifying physiological arousal as ultimate failure."
    },
    exampleStep: {
      title: "Maya's Big Presentation",
      childName: "Maya",
      scenario: "Maya is standing at the front of the class to show her science poster. Suddenly, her throat goes super dry, her hands start shaking, and the paper rustles loudly."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "What is Maya's best action for her wiggly body?",
      options: [
        {
          id: '5a',
          text: "Drop her poster on the floor, apologize, and go sit down quickly.",
          isCorrect: false,
          feedback: "Running away teaches Maya's brain that her posters are scary monsters!"
        },
        {
          id: '5b',
          text: "Drink a small sip of water, feel her feet heavy on the carpet, smile, and say: 'Hello everyone!'",
          isCorrect: true,
          feedback: "Wonderful! Drinking water and feeling the solid floor calms the physical alarm safely!"
        }
      ]
    }
  },
  {
    id: 6,
    title: "Running Away or Facing Storms?",
    shortDescription: "Understand why avoiding hard choices is comforting but keeps us from growing.",
    rewardCrystal: "True Power Crystal",
    rewardItem: "Sunset Bench",
    themeColor: "from-teal-400 to-blue-600",
    textColor: "text-teal-700",
    shadowColor: "shadow-teal-100",
    shlokaSanskrit: "न च श्रेयोऽनुपश्यामि हत्वा स्वजनमाहवे |\nन काङ्क्षे विजयं कृष्ण न च राज्यं सुखानि च || 1.31 ||",
    shlokaTransliteration: "na ca śreyo 'nupaśyāmi hatvā svajanam āhave\nna kāṅkṣe vijayaṁ kṛṣṇa na ca rājyaṁ sukhāni ca",
    shlokaTranslation: "I do not see how any good can come from killing my own family. O Krishna, I do not crave victory, nor kingdoms, nor happiness.",
    shlokaKidVersion: "What is the point of winning this spelling trophy if it makes my cousins or classmates feel sad and left out? I'd rather just give up my turn.",
    shlokaWordMeanings: [
      { word: "Na ca śreyaḥ", meaning: "There is no benefit" },
      { word: "Svajanam", meaning: "My own relatives/clan" },
      { word: "Na kāṅkṣe", meaning: "I do not desire" },
      { word: "Vijayaṁ", meaning: "Glorious Victory" }
    ],
    chantSteps: [
      "na ca śreyo 'nupaśyāmi",
      "hatvā svajanam āhave",
      "na kāṅkṣe vijayaṁ kṛṣṇa",
      "na ca rājyaṁ sukhāni ca"
    ],
    storyStep: {
      title: "The Excuse Finder 🧐",
      text: "Arjuna tries to explain why giving up is actually a very nice and kind idea. He says: 'Krishna, if I win, everyone will be unhappy. Let someone else have the crown. I will go live in the forest and eat berries instead. I don't need victory!'",
      narratorQuote: "Veeru scratches his ear: 'Mmh, sometimes when I can't climb a tall tree, I say the apples on top are sour anyway. Is Arjuna doing the same?'"
    },
    teachingStep: {
      title: "The Avoiding Trap",
      originalConcept: "Bhagavad Gita 1.31 - rationalizing avoidance",
      kidWisdom: "When things get tough, our brains look for nice excuses to escape, like saying: 'I don't even like soccer anyway.' Stop and notice if you are avoiding a challenge!",
      explorerWisdom: "Excuses are just tiny masks our fear wears. We don't need them!",
      guideWisdom: "Rationalization is a powerful ego defense mechanism. Arjuna couches his reluctance to face pain in high-sounding moral arguments about renunciation."
    },
    exampleStep: {
      title: "Siddharth's Math Workbook",
      childName: "Siddharth",
      scenario: "Siddharth is stuck on step 4 of his long division homework. He slams the book shutdown and says: 'Math is useless! In the future, computers will do all division anyway!'"
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "Which thought reflects True Power for Siddharth?",
      options: [
        {
          id: '6a',
          text: "Play Minecraft all afternoon and tell his mom he already completed the pages.",
          isCorrect: false,
          feedback: "Lying will cause a giant storm tomorrow at school when the teacher check books!"
        },
        {
          id: '6b',
          text: "Pause, laugh at his 'division is useless' excuse, and ask: 'Sis, can you show me how you divide this one number?'",
          isCorrect: true,
          feedback: "Outstanding! Asking for a small clue breaks the freeze and lets Siddharth stay on his path!"
        }
      ]
    }
  },
  {
    id: 7,
    title: "The River of Doubt",
    shortDescription: "Learn how foreseeing bad outcomes before we try keeps us trapped in anxiety.",
    rewardCrystal: "Clarity Crystal",
    rewardItem: "Floating Lotus Leaf",
    themeColor: "from-pink-400 to-rose-600",
    textColor: "text-pink-700",
    shadowColor: "shadow-pink-100",
    shlokaSanskrit: "यदि मामप्रतीकारमशस्त्रं शस्त्रपाणयः |\nधार्तराष्ट्रा रणे हन्युस्तन्मे क्षेमतरं भवेत् || 1.46 ||",
    shlokaTransliteration: "yadi mām apratīkāram aśastraṁ śastra-pāṇayaḥ\ndhārtarāṣṭrā raṇe hanyus tan me kṣemataraṁ bhavet",
    shlokaTranslation: "It would be better for me if the armed sons of Dhritarashtra killed me unresisting and unarmed in the battle.",
    shlokaKidVersion: "It would be better if the teacher just gave me a zero on the test right now so I don't have to spend all afternoon worrying about it!",
    shlokaWordMeanings: [
      { word: "Yadi", meaning: "If" },
      { word: "Aśastraṁ", meaning: "Without weapons" },
      { word: "Apra-tīkāram", meaning: "Without fighting back" },
      { word: "Kṣemataraṁ", meaning: "Far more peaceful/better" }
    ],
    chantSteps: [
      "yadi mām apratīkāram",
      "aśastraṁ śastra-pāṇayaḥ",
      "dhārtarāṣṭrā raṇe hanyus",
      "tan me kṣemataraṁ bhavet"
    ],
    storyStep: {
      title: "Surrendering to Darkness 🌊",
      text: "Arjuna sits completely flat. He says: 'Let them come and take the crown. If they strike me while I am unarmed, it's better than trying and making mistakes.' His mind is imagining a huge list of disaster scenarios.",
      narratorQuote: "Krishna holds his hand: 'Arjuna, worry takes your sweet energy from today and spends it on a future that hasn't even happened yet. Be here, in this moment!'"
    },
    teachingStep: {
      title: "The Illusion of Future Disasters",
      originalConcept: "Bhagavad Gita 1.46 - Extreme Despair and Catastrophizing",
      kidWisdom: "We catastrophize when we believe only bad things will happen. But we can't see the future! Don't let imaginary dark clouds ruin the sunny day we have today.",
      explorerWisdom: "Don't worry about what happens tomorrow. Focus on the single step you take now!",
      guideWisdom: "Catastrophizing strips physical efficacy. By choosing pre-emptive surrender, Arjuna attempts to gain control over his fear of failure by ensuring the failure himself."
    },
    exampleStep: {
      title: "Lata's Cooking Experience",
      childName: "Lata",
      scenario: "Lata is making a birthday cake for her grandmother. She thinks: 'What if the oven burns it, or it tastes like salt, or everyone makes fun of me? I'll throw the dough away.'"
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "Which action pulls Lata out of the River of Doubt?",
      options: [
        {
          id: '7a',
          text: "Pour the dough down the sink and tell grandma she forgot the bakery was closed.",
          isCorrect: false,
          feedback: "Throwing it away guarantees there is no cake! That is the worst outcome!"
        },
        {
          id: '7b',
          text: "Tell herself: 'I'll just follow the recipe cup-by-cup. Mixing flour is fun right now, let's see how it bakes!'",
          isCorrect: true,
          feedback: "Magnificent! When we follow the recipe block-by-block, our minds find calm focus and avoid imaginary storms!"
        }
      ]
    }
  },
  {
    id: 8,
    title: "Confusion Over Duty",
    shortDescription: "Understand the struggle between what feels easy and comfortable vs. what represents our true inner duties.",
    rewardCrystal: "Duty Crystal",
    rewardItem: "Eternal Flame Lantern",
    themeColor: "from-violet-400 to-purple-600",
    textColor: "text-violet-700",
    shadowColor: "shadow-violet-200",
    shlokaSanskrit: "कुलक्षये प्रणश्यन्ति कुलधर्माः सनातनाः |\nधर्मे नष्टे कुलं कृत्स्नमधर्मोऽभिभवत्युत || 1.39 ||",
    shlokaTransliteration: "kula-kṣaye praṇaśyanti kula-dharmāḥ sanātanāḥ\ndharme naṣṭe kulaṁ kṛtsnam adharmo 'bhibhavaty uta",
    shlokaTranslation: "With the destruction of the family, the eternal family values are lost, and chaos takes over the entire household.",
    shlokaKidVersion: "If we break the playground rules once just to win, our entire group of friends will start cheating and the game won't be fun anymore!",
    shlokaWordMeanings: [
      { word: "Kula-kṣaye", meaning: "When family/structures break" },
      { word: "Kula-dharmāḥ", meaning: "Shared family rules and values" },
      { word: "Dharme naṣṭe", meaning: "When duty is lost" },
      { word: "Adharmaḥ", meaning: "Chaos and unfairness" }
    ],
    chantSteps: [
      "kula-kṣaye praṇaśyanti",
      "kula-dharmāḥ sanātanāḥ",
      "dharme naṣṭe kulaṁ kṛtsnam",
      "adharmo 'bhibhavaty uta"
    ],
    storyStep: {
      title: "The Ripple Effect 🌊",
      text: "Arjuna is thinking 10 steps ahead. He says: 'If we break the rules in this battle, we will destroy the order of our whole society. Children will stop listening to their elders, and values will disappear.' He believes that avoiding the struggle is the only logical way to save the world.",
      narratorQuote: "Gaja waves his ears: 'Doing what is right sometimes feels messy at first, but cheating only to stay safe is like drinking salty water when you are thirsty!'"
    },
    teachingStep: {
      title: "Saving Our Values",
      originalConcept: "Bhagavad Gita 1.39 - Preservation of Order",
      kidWisdom: "When we feel tempted to do something slightly wrong just to escape a tricky situation (like copy a small word on a spelling test), we harm the integrity of our whole self. Values protect us!",
      explorerWisdom: "Keeping rules keeps game fun and full of smiles for everybody!",
      guideWisdom: "The systemic breakdown ('Kula-dharmas') Arjuna foresees are valid concerns, yet his error lies in hoping to preserve values through inaction rather than active, values-based participation."
    },
    exampleStep: {
      title: "Ishaan's Test Paper",
      childName: "Ishaan",
      scenario: "During a math quiz, the teacher leaves the classroom for three minutes. Two kids immediately open their notebooks to copy formulas, and motion for Ishaan to do the same."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "What represents Ishaan's true duty and strength?",
      options: [
        {
          id: '8a',
          text: "Copy the formulas quickly, telling himself: 'Everyone is doing it anyway, so it is fair of me!'",
          isCorrect: false,
          feedback: "We don't copy standard mistakes just because they look popular! Your integrity is your shield!"
        },
        {
          id: '8b',
          text: "Keep his eyes on his own worksheet, and rely calmly on whatever formulas he studied.",
          isCorrect: true,
          feedback: "Incredible strength! Ishaan kept his own values stable, keeping his trust engine completely clean!"
        }
      ]
    }
  },
  {
    id: 9,
    title: "Arjuna Collapses",
    shortDescription: "Arjuna drops his weapons, sits heavy in his chariot seat, and admits he is completely overwhelmed.",
    rewardCrystal: "Surrender Crystal",
    rewardItem: "Dolphin Fountain",
    themeColor: "from-blue-400 to-indigo-600",
    textColor: "text-blue-700",
    shadowColor: "shadow-blue-200",
    shlokaSanskrit: "सञ्जय उवाच |\nएवमुक्त्वार्जुनः सङ्ख्ये रथोपस्थ उपाविशत् |\nविसृज्य सशरं चापं शोकसंविग्नमानसः || 1.47 ||",
    shlokaTransliteration: "sañjaya uvāca\nevam uktvārjunaḥ saṅkhye rathopastha upāviśat\nvīsṛjya sa-śaraṁ cāpaṁ śoka-saṁvigna-mānasaḥ",
    shlokaTranslation: "Sanjaya said: Having spoken thus on the battlefield, Arjuna cast aside his bow and arrows and sank onto the chariot seat, his mind overwhelmed by grief.",
    shlokaKidVersion: "Arjuna throwing his cards on the floor, sitting heavy in his beanbag, and saying: 'I cannot do this. It's too hard for my small heart.'",
    shlokaWordMeanings: [
      { word: "Evam uktvā", meaning: "Having spoken thus" },
      { word: "Ratha-upasthe", meaning: "On the seat of the chariot" },
      { word: "Upāviśat", meaning: "Sat down heavy" },
      { word: "Vīsṛjya", meaning: "Throwing/Casting aside" },
      { word: "Śaraṁ cāpaṁ", meaning: "Arrows and bow" },
      { word: "Śoka-saṁvigna", meaning: "Distressed inside with deep sorrow" }
    ],
    chantSteps: [
      "sañjaya uvāca",
      "evam uktvārjunaḥ saṅkhye",
      "rathopastha upāviśat",
      "vīsṛjya sa-śaraṁ cāpaṁ",
      "śoka-saṁvigna-mānasaḥ"
    ],
    storyStep: {
      title: "The Bow is Dropped 🏹❌",
      text: "With a pale face and tears in his eyes, Arjuna drops his grand bow and quiver onto the floorboards. The golden arrows scatter around Krishna's feet. Arjuna buries his face in his trembling hands, sitting heavy in the chariot. He is completely exhausted. He cannot see any way forward.",
      narratorQuote: "Gauri rings her bell lovingly: 'My hero, dropping your weapons when you are tired is not a crime. It is the perfect moment to let go of self-pride and ask for warm help.'"
    },
    teachingStep: {
      title: "The Power of Letting Go",
      originalConcept: "Bhagavad Gita 1.47 - The Zero Point of the Ego",
      kidWisdom: "When we admit we are tired or overwhelmed, we are not failing. We are clearing our hearts of pride, making space for beautiful wisdom to enter and help us!",
      explorerWisdom: "When we are tired, we can take a rest and ask a wise friend to help us find the path!",
      guideWisdom: "Admitting helplessness is the prerequisites condition for receptivity. By surrendering his ego-driven plans, Arjuna finally moves from pride into studenthood."
    },
    exampleStep: {
      title: "Tanya's Piano Practice",
      childName: "Tanya",
      scenario: "Tanya cannot play the final section of her recital song. She feels like crying, hits the keys randomly, and wants to smash her piano books."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "How can Tanya copy Arjuna's surrender to find wisdom?",
      options: [
        {
          id: '9a',
          text: "Rip up the music sheets, storm off to her room, and lock her door.",
          isCorrect: false,
          feedback: "Anger hurts her sheets and makes her tomorrow self feel even more blocked!"
        },
        {
          id: '9b',
          text: "Close the piano screen safely, take three calm deep breaths, and say: 'Dad, I am stuck. Can we practice this tricky line bar-by-bar together?'",
          isCorrect: true,
          feedback: "Wonderful! Laying down the anger shield and asking for guidelines opens the doorway to true progress!"
        }
      ]
    }
  },
  {
    id: 10,
    title: "Seeking Guidance",
    shortDescription: "Complete the Chapter 1 journey as Arjuna shifts from fear into seeker-mode, asking Krishna for light.",
    rewardCrystal: "Vanguard Crystal",
    rewardItem: "Sacred Meditation Tree",
    themeColor: "from-rose-400 to-red-600",
    textColor: "text-rose-700",
    shadowColor: "shadow-rose-200",
    shlokaSanskrit: "कार्पण्यदोषोपहतस्वभावः\nपृच्छामि त्वां धर्मसम्मूढचेताः |\nयच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे\nशिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम् || 2.7 ||",
    shlokaTransliteration: "kārpaṇya-doṣopahata-svabhāvaḥ\npṛcchāmi tvāṁ dharma-sammūḍha-cetāḥ\nyac chreyaḥ syān niścitaṁ brūhi tan me\nśiṣyas te 'haṁ śādhi māṁ tvāṁ prapannam",
    shlokaTranslation: "My heart is heavy with confusion, and my mind is lost regarding duty. Please tell me clearly what is best for me. I am your disciple, surrendered to you. Please direct me.",
    shlokaKidVersion: "I am feeling totally lost and mixed up. Please act as my wise teacher. I am ready to sit quietly, listen with love, and learn your beautiful secrets.",
    shlokaWordMeanings: [
      { word: "Kārpaṇya", meaning: "Confusion/Helplessness" },
      { word: "Pṛcchāmi tvāṁ", meaning: "I am asking you" },
      { word: "Dharma-sammūḍha-cetāḥ", meaning: "Whose mind is completely mixed up about values" },
      { word: "Niścitaṁ", meaning: "With absolute certainty" },
      { word: "Śiṣyaḥ te ahaṁ", meaning: "I am your eager student" },
      { word: "Śādhi māṁ", meaning: "Please teach/guide me" }
    ],
    chantSteps: [
      "kārpaṇya-doṣopahata-svabhāvaḥ",
      "pṛcchāmi tvāṁ dharma-sammūḍha-cetāḥ",
      "yac chreyaḥ syān niścitaṁ brūhi tan me",
      "śiṣyas te 'haṁ śādhi māṁ tvāṁ prapannam"
    ],
    storyStep: {
      title: "The Ultimate Guide 🌟",
      text: "Arjuna looks up at Krishna. 'I cannot guide myself anymore, Krishna. Please teach me. I am your student now.' Krishna's warm smile glows like a thousand suns as he prepares to recite the golden paths of Bhagavad Gita. The World of Confusion is repaired!",
      narratorQuote: "Krishna sweeps the air: 'Brave Arjuna, when we sit humbly as seekers, the universe unfolds its grandest light. You are ready to receive the secrets of everlasting strength!'"
    },
    teachingStep: {
      title: "Entering Studenthood",
      originalConcept: "Bhagavad Gita 2.7 - The Turn towards Spiritual Guidance",
      kidWisdom: "The biggest superpower in the whole universe is not knowing everything. It is being brave enough to sit down, say 'I don't know', and listen quietly to those who love and guide us!",
      explorerWisdom: "Saying 'Can you help me?' is a magical key that unlocks all the secrets of wisdom!",
      guideWisdom: "True education begins only when the intellect recognizes its limits and converts from arrogant asserting into humble seekerhood."
    },
    exampleStep: {
      title: "Rohan's Great Choice",
      childName: "Rohan",
      scenario: "Rohan is trying to build a complex robotic Lego car but can't fit the gears. He has tried four times, and the wheels are rolling backward."
    },
    challengeStep: {
      title: "Wisdom Challenge",
      question: "Which represents the most wise choice for Rohan's heart?",
      options: [
        {
          id: '10a',
          text: "Kick the gears under the bed, telling himself: 'This Lego set is stupid!'",
          isCorrect: false,
          feedback: "Anger keeps Rohan from playing, and doesn't solve why the wheels roll backward!"
        },
        {
          id: '10b',
          text: "Sit on the floor, look at the instruction manual with calm attention, and ask his elder brother: 'Can you show me what this step means?'",
          isCorrect: true,
          feedback: "Perfect! You unlocked the seeker key! By consulting the manual and a guide, Rohan masters the robot!"
        }
      ]
    }
  }
];
