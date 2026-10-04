import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';
import { UserState, CompanionId } from '../types';
import WisdomTree from '../components/WisdomTree';
import CompanionViewer from '../components/CompanionViewer';
import { COMPANIONS } from '../quests';

interface WisdomSanctuaryProps {
  state: UserState;
  onBack: () => void;
}

interface DecorationDetail {
  id: string;
  emoji: string;
  name: string;
  sourceQuest: string;
  meaning: string;
  philosophicValue: string;
}

const DECORATION_DETAILS: Record<string, DecorationDetail> = {
  lamp: {
    id: 'lamp',
    emoji: '🏮',
    name: "Golden Oil Lamp",
    sourceQuest: "Earned from Arjuna (Quest 1)",
    meaning: "Lights your path when you feel confused. It reminds us that admitting we feel nervous is the first spark of true wisdom!",
    philosophicValue: "Mental Clarity (Gita 2.7)"
  },
  plant: {
    id: 'plant',
    emoji: '🪴',
    name: "Patience Lotus Plant",
    sourceQuest: "Earned from Veeru (Quest 2)",
    meaning: "Grown by taking a 3-second pause before acting. It protects your heart from wild impulses and builds inner calmness.",
    philosophicValue: "Sense Peace (Gita 2.58)"
  },
  bookshelf: {
    id: 'bookshelf',
    emoji: '📚',
    name: "Wisdom Scroll Shelf",
    sourceQuest: "Earned from Mayur (Quest 3)",
    meaning: "Reminds you to play and study with 100% love, without worrying about the score tables or winning the gold trophy.",
    philosophicValue: "Karma Yoga Effort (Gita 2.47)"
  },
  feather: {
    id: 'feather',
    emoji: '🦚',
    name: "Peacock Plume Crown",
    sourceQuest: "Earned from Gauri (Quest 4)",
    meaning: "Anchors you during storms. Reminds us that under the cold winter and hot summer, your sky is always blue and peaceful.",
    philosophicValue: "Unshakable Tranquility (Gita 2.14)"
  },
  tree: {
    id: 'tree',
    emoji: '🧘',
    name: "Golden Meditation Rug",
    sourceQuest: "Earned from Golden Bridge (Quest 5)",
    meaning: "Provides a quiet base. Reminds us that large canyons are crossed step-by-step, by placing one foot on the first single stone.",
    philosophicValue: "Courageous Progression (Gita 18.20)"
  }
};

export default function WisdomSanctuary({ state, onBack }: WisdomSanctuaryProps) {
  const [selectedItem, setSelectedItem] = useState<DecorationDetail | null>(null);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [synthInterval, setSynthInterval] = useState<any>(null);

  const companion = COMPANIONS[state.companion as CompanionId];

  // Synthesize soft lofi zen chimes in real-time if toggled!
  const toggleSanctuaryChimes = () => {
    playSound.tap();
    if (isLofiPlaying) {
      setIsLofiPlaying(false);
      if (synthInterval) {
        clearInterval(synthInterval);
        setSynthInterval(null);
      }
    } else {
      setIsLofiPlaying(true);
      // Play a lovely soothing note sequence periodically
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // Warm C-major pentatonic
      
      const intervalId = setInterval(() => {
        try {
          const randomNoteIndex = Math.floor(Math.random() * notes.length);
          const freq = notes[randomNoteIndex];
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 1.2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch (e) {
          console.log("Audio failed to load", e);
        }
      }, 1400);

      setSynthInterval(intervalId);
    }
  };

  // Clean audio intervals if user exits
  React.useEffect(() => {
    return () => {
      if (synthInterval) clearInterval(synthInterval);
    };
  }, [synthInterval]);

  const handleItemSelect = (itemKey: string) => {
    const detail = DECORATION_DETAILS[itemKey];
    if (detail) {
      playSound.unlock();
      setSelectedItem(detail);
    }
  };

  return (
    <div 
      id="sanctuary-screen"
      className="min-h-screen py-6 px-4 md:px-8 bg-[#f9f5f0] text-indigo-950 font-sans select-none flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* 1. Header Navigation */}
      <header id="sanctuary-header" className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 gap-3">
        <button
          onClick={() => {
            playSound.tap();
            if (synthInterval) clearInterval(synthInterval);
            onBack();
          }}
          className="text-indigo-955 font-black text-xs bg-white/60 backdrop-blur-md border border-white px-4 py-2.5 rounded-full hover:bg-white/80 transition-all cursor-pointer shadow-md"
        >
          ⬅️ Back To Camp
        </button>
        <div className="text-center hidden sm:block">
          <span className="font-display font-black text-indigo-950 text-xl md:text-2xl tracking-tight block leading-tight">
            🏮 Inside the Wisdom Sanctuary
          </span>
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-black block">
            A Safe, Quiet Garden for Your Heart
          </span>
        </div>

        {/* Ambient music synthesizer button as requested */}
        <button
          onClick={toggleSanctuaryChimes}
          className={`px-4 py-2.5 text-xs font-black rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
            isLofiPlaying 
              ? 'bg-indigo-600 text-white border border-indigo-600 animate-pulse' 
              : 'bg-white/60 backdrop-blur-md border border-white text-indigo-950 hover:bg-white/80'
          }`}
        >
          {isLofiPlaying ? '🔊 Chimes ON' : '🔇 Play Garden Chimes'}
        </button>
      </header>

      {/* 2. Visual Garden Canvas */}
      <main className="max-w-5xl mx-auto w-full my-4 flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10">
        
        {/* Left Side: Massive Wisdom Tree base (7 cols) */}
        <div className="col-span-1 md:col-span-7 bg-white/50 backdrop-blur-md border border-white rounded-[32px] p-6 shadow-xl flex items-center justify-center relative min-h-[400px]">
          
          <div className="absolute top-4 left-6 bg-indigo-50/80 border border-indigo-100 rounded-full px-3 py-1 text-xs font-black text-indigo-950 pointer-events-none shadow-sm">
            🌲 Active Tree Health: {state.treeHealth}%
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {/* Render Wisdom Tree size="lg" to feel huge and premium */}
            <WisdomTree 
              health={state.treeHealth} 
              unlockedDecorations={state.unlockedDecorations} 
              size="lg" 
              interactive={true} 
              onDecorationClick={handleItemSelect}
            />
          </div>

          {/* Prompt banner */}
          <div className="absolute bottom-4 text-center bg-white/80 backdrop-blur-md border border-white px-4 py-2 rounded-full text-[10px] font-black text-indigo-950 shadow-md pointer-events-none">
            👉 Tap any accessory on the branches or roots to learn its magical secret!
          </div>
        </div>

        {/* Right Side: Unlocks checklist panel & speech bubble (5 cols) */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-5 justify-between h-full">
          
          {/* Unlocked decorative list checklist */}
          <div className="bg-white/50 backdrop-blur-md border border-white rounded-[32px] p-5 shadow-xl">
            <h3 className="font-display font-black text-indigo-950 text-base md:text-lg mb-3 flex items-center gap-2">
              🏆 Your Restored Gems ({state.unlockedDecorations.length}/5)
            </h3>

            <div className="flex flex-col gap-2">
              {Object.keys(DECORATION_DETAILS).map((key) => {
                const item = DECORATION_DETAILS[key];
                const unlocked = state.unlockedDecorations.includes(key);

                return (
                  <button
                    key={key}
                    disabled={!unlocked}
                    onClick={() => handleItemSelect(key)}
                    className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all outline-none ${
                      unlocked
                        ? 'border-indigo-100 bg-white hover:bg-indigo-50/50 cursor-pointer shadow-sm'
                        : 'border-slate-100/50 bg-slate-50/20 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{unlocked ? item.emoji : '🔒'}</span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-black leading-none ${unlocked ? 'text-indigo-950' : 'text-slate-450'}`}>
                          {item.name}
                        </span>
                        <span className="text-[9px] text-indigo-400 font-extrabold mt-0.5">{item.sourceQuest}</span>
                      </div>
                    </div>
                    {unlocked && (
                      <span className="text-[10px] bg-emerald-100/70 text-emerald-950 border border-emerald-200 px-3 py-0.5 rounded-full font-black uppercase">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive display detail pane or Companion Speak */}
          <div className="bg-white/50 backdrop-blur-md border border-white rounded-[32px] p-5 shadow-xl min-h-[160px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {selectedItem ? (
                /* Detail item active modal inside sidebar layout */
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <button 
                    onClick={() => { playSound.tap(); setSelectedItem(null); }}
                    className="absolute top-3 right-3 text-sm text-indigo-400 hover:text-indigo-950 font-black cursor-pointer"
                  >
                    ✖️
                  </button>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-3xl filter drop-shadow">{selectedItem.emoji}</span>
                    <div>
                      <h4 className="font-display font-black text-indigo-950 text-sm md:text-base leading-none">{selectedItem.name}</h4>
                      <span className="text-[9px] text-indigo-505 font-black uppercase tracking-wider">{selectedItem.philosophicValue}</span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-indigo-900/80 font-bold leading-relaxed">
                    {selectedItem.meaning}
                  </p>
                </motion.div>
              ) : (
                /* Companion welcome panel default state */
                <motion.div
                  key="companion-sanctuary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-4xl filter drop-shadow animate-float shrink-0 select-none">
                    {companion?.emoji}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-indigo-950 text-xs">
                      {companion?.name}'s Sanctuary Garden
                    </h4>
                    <p className="font-sans text-[11px] italic text-indigo-900/80 font-bold leading-relaxed mt-1">
                      "{state.completedQuests.length === 5 
                        ? `Look at this paradise, hero! Every lamp, book, and flower is glowing with the Gita seeds of your heart. You did this!`
                        : `We have unlocked ${state.unlockedDecorations.length} items so far! Let's do more quests on the road to reach 100% health!`}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <footer className="text-center text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider mt-3 z-10">
        May you carry this calming quietness on your backpack tomorrow at school! 🧘🌟
      </footer>
    </div>
  );
}
