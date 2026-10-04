// Real-time client-side synthesizer using the browser Web Audio API
// No assets to download, zero network dependencies, 100% operational

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  // Soft playful pop sound when clicking buttons
  tap: () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  },

  // Magical happy bell tone for correct answers
  correct: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.linearRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.4);
  },

  // Soft springy note for friendly incorrect feedback (no scary buzzers!)
  joke: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(330, ctx.currentTime + 0.15); // E4
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },

  // Ascending space-chime for unlocking rewards or opening chests
  unlock: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // E4, G4, C5, E5, G5, C6
    const duration = 0.08;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * duration);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * duration + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * duration);
      osc.stop(ctx.currentTime + idx * duration + 0.25);
    });
  },

  // A breathtaking shimmering double sweep when the Wisdom Tree repairs
  success: () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Fast arpeggio G4 -> C5 -> E5 -> G5 -> C6 -> E6 -> G6 -> C7
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    const duration = 0.06;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * duration);
      
      // Add standard FM-vibe shimmer
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.value = 15; // Hz
      vibratoGain.gain.value = 12; // Mod Index
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + idx * duration + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      vibrato.start(ctx.currentTime + idx * duration);
      osc.start(ctx.currentTime + idx * duration);
      
      vibrato.stop(ctx.currentTime + idx * duration + 0.6);
      osc.stop(ctx.currentTime + idx * duration + 0.6);
    });
  }
};

let activeCompanionId = 'gaja';

export const setActiveCompanionId = (id: string) => {
  activeCompanionId = id;
};

// Beautiful high-fidelity children's Speech Synthesis engine (Gita Narrations)
export const speakText = (text: string, role: 'krishna' | 'arjuna' | 'companion' | 'narrator', onEnd?: () => void, companionId?: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    // Cancel any current narration
    window.speechSynthesis.cancel();

    // Strip emoji characters from narration line to avoid reading them aloud as text labels
    const cleanedText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');

    // Phonetic replacement maps for correct Indian pronunciation on non-native engines (with spacing for breathing)
    const phoneticMap: Record<string, string> = {
      "Dhritarashtra": "Dhree-tuh-raash-truh",
      "dhṛtarāṣṭra": "Dhree-tuh-raash-truh",
      "Dhritarāṣṭra": "Dhree-tuh-raash-truh",
      "Krishna": "Krish-nuh",
      "kṛṣṇa": "Krish-nuh",
      "Arjuna": "Ar-ju-nuh",
      "arjuna": "Ar-ju-nuh",
      "Sanjaya": "Sun-juhye-uh",
      "sañjaya": "Sun-juhye-uh",
      "Duryodhana": "Dur-yo-dhun-uh",
      "Kurukshetra": "Koo-roo-kshey-truh",
      "kuru-kṣetre": "Koo-roo-kshey-trey",
      "Dharmakshetra": "Dhur-muh-kshey-truh",
      "dharma-kṣetre": "Dhur-muh-kshey-trey",
      "Bhishma": "Bheesh-muh",
      "Drona": "Dro-nuh",
      "Gandiva": "Gaan-dee-vuh",
      "Pandavas": "Paan-duh-vaas",
      "Pandava": "Paan-duh-vuh",
      "Achyuta": "Uh-chyoo-tuh",
      "Kauravas": "Kow-ruh-vaas",
      "Panchajanya": "Paan-chuh-jun-yuh",
      "Devadatta": "Dey-vuh-dut-tuh",
      "Gagan": "Guh-gun",
      "Pranam": "Pruh-naam"
    };

    let processedText = cleanedText;

    // We do a case-insensitive lookup to polish pronunciations
    Object.keys(phoneticMap).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedText = processedText.replace(regex, phoneticMap[word]);
    });

    const utterance = new SpeechSynthesisUtterance(processedText);
    const resolvedCompanion = companionId || activeCompanionId;

    // Dynamic role voice pitches and tempos
    switch (role) {
      case 'krishna':
        utterance.pitch = 0.82; // Deep, meditative, warm, peaceful cosmic voice
        utterance.rate = 0.82;  // Slow, serene chanting tempo
        break;
      case 'arjuna':
        utterance.pitch = 1.05; // Expressive, heroic young prince
        utterance.rate = 0.95;  // Earnest pacing
        break;
      case 'companion':
        if (resolvedCompanion === 'gaja') {
          utterance.pitch = 0.40; // Super deep, heavy, elephant rumbling voice
          utterance.rate = 0.72;  // Slow and majestic
        } else if (resolvedCompanion === 'mayur') {
          utterance.pitch = 1.15; // Sweet, melody-filled peacock voice
          utterance.rate = 0.95;  // Expressive pace
        } else if (resolvedCompanion === 'gauri') {
          utterance.pitch = 0.95; // Soft, maternal, peaceful cow voice
          utterance.rate = 0.84;  // Highly calming
        } else if (resolvedCompanion === 'veeru') {
          utterance.pitch = 1.35; // Playful, quick, bouncy monkey voice
          utterance.rate = 1.15;  // Energetic speed
        } else {
          utterance.pitch = 1.10;
          utterance.rate = 1.0;
        }
        break;
      case 'narrator':
      default:
        if (resolvedCompanion === 'gauri') {
          utterance.pitch = 0.98; // Female calming voice for Cow companion
          utterance.rate = 0.88;
        } else if (resolvedCompanion === 'gaja') {
          utterance.pitch = 0.85; // Solid deep male narrator voice for Elephant
          utterance.rate = 0.86;
        } else {
          utterance.pitch = 1.0;  // Narrative storyteller pace
          utterance.rate = 0.90;  
        }
        break;
    }

    // Try to locate optimal native audio voices
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | null = null;

      // Filter all available Indian accent voices (lang ending or containing "IN")
      const indianVoices = voices.filter(v => {
        const lang = v.lang.toLowerCase();
        return lang.includes('-in') || lang.includes('_in');
      });

      // Character / companion voice gender classification helper
      let genderPref: 'male' | 'female' = 'male';
      if (role === 'companion' && resolvedCompanion === 'gauri') {
        genderPref = 'female';
      } else if (role === 'narrator' && resolvedCompanion === 'gauri') {
        genderPref = 'female';
      }

      const isFemaleName = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('female') || n.includes('woman') || n.includes('girl') || n.includes('heera') || n.includes('ananya') || n.includes('priya') || n.includes('neerja') || n.includes('geeta') || n.includes('zira') || n.includes('veena') || n.includes('swara') || n.includes('komal') || n.includes('hema') || n.includes('siri') || n.includes('google hindi');
      };

      const isMaleName = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('male') || n.includes('man') || n.includes('boy') || n.includes('rishi') || n.includes('ravi') || n.includes('hemant') || n.includes('karan') || n.includes('prakash') || n.includes('raj') || n.includes('deep') || n.includes('dilip') || n.includes('shankar') || n.includes('madhav');
      };

      // For chanting, check if text contains Devanagari or if role is krishna / chant mode
      const isSanskritText = /[\u0900-\u097F]/.test(cleanedText);
      
      if (isSanskritText) {
        // High priority local Hindi/Sanskrit/Marathi voices, preferably male
        const hiSaVoices = voices.filter(v => v.lang.toLowerCase().startsWith('sa-') || v.lang.toLowerCase().startsWith('hi-') || v.lang.toLowerCase().startsWith('mr-'));
        selectedVoice = hiSaVoices.find(v => isMaleName(v.name)) || hiSaVoices[0] || indianVoices[0] || null;

        if (selectedVoice) {
          utterance.text = cleanedText; 
        }
      } else {
        // Find English Indian or alternative Indian languages speaking English (retains thick, native accent)
        const enInVoices = indianVoices.filter(v => v.lang.toLowerCase().includes('en'));
        const fallbackInVoices = indianVoices; // hi-IN, mr-IN, etc.

        if (genderPref === 'female') {
          selectedVoice = enInVoices.find(v => isFemaleName(v.name)) || 
                          fallbackInVoices.find(v => isFemaleName(v.name)) || 
                          enInVoices[0] || 
                          fallbackInVoices[0] || null;
        } else {
          selectedVoice = enInVoices.find(v => isMaleName(v.name)) || 
                          fallbackInVoices.find(v => isMaleName(v.name)) || 
                          enInVoices[0] || 
                          fallbackInVoices[0] || null;
        }

        // If no Indian native voices found in browser list, look for general English with matching gender
        if (!selectedVoice) {
          const generalEnVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
          if (genderPref === 'female') {
            selectedVoice = generalEnVoices.find(v => isFemaleName(v.name)) || generalEnVoices[0] || null;
          } else {
            selectedVoice = generalEnVoices.find(v => isMaleName(v.name)) || generalEnVoices[0] || null;
          }
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis failed", err);
  }
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
