import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';
import { UserState, CompanionId } from '../types';
import WisdomTree from '../components/WisdomTree';
import CompanionViewer from '../components/CompanionViewer';
import { COMPANIONS, QUESTS } from '../quests';
import { Decoration, DECORATIONS, getDecorationForQuest, getUnlockedDecorations } from '../decorations';

interface WisdomSanctuaryProps {
  state: UserState;
  onBack: () => void;
}

export default function WisdomSanctuary({ state, onBack }: WisdomSanctuaryProps) {
  const [selectedItem, setSelectedItem] = useState<Decoration | null>(null);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [synthInterval, setSynthInterval] = useState<any>(null);

  const companion = COMPANIONS[state.companion as CompanionId];
  const unlockedDecorations = getUnlockedDecorations(state.completedQuests);

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
      
      // Each note reuses the app's single audio engine
      const intervalId = setInterval(() => {
        playSound.chime(notes[Math.floor(Math.random() * notes.length)]);
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

  const handleItemSelect = (questId: number) => {
    const detail = getDecorationForQuest(questId);
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
        <div className="col-span-1 md:col-span-7 bg-white/50 backdrop-blur-md border border-white rounded-[32px] p-6 shadow-xl flex flex-col items-center justify-between gap-3 relative min-h-[400px]">
          
          <div className="self-start bg-indigo-50/80 border border-indigo-100 rounded-full px-3 py-1 text-xs font-black text-indigo-950 pointer-events-none shadow-sm">
            🌲 Active Tree Health: {state.treeHealth}%
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {/* Render Wisdom Tree size="lg" to feel huge and premium */}
            <WisdomTree 
              health={state.treeHealth} 
              unlockedDecorations={unlockedDecorations} 
              size="lg" 
              interactive={true} 
              onDecorationClick={handleItemSelect}
            />
          </div>

          {/* Prompt banner, kept below the tree so it never covers ground decorations */}
          <div className="text-center bg-white/80 backdrop-blur-md border border-white px-4 py-2 rounded-full text-[10px] font-black text-indigo-950 shadow-md pointer-events-none">
            👉 Tap any accessory on the branches or roots to learn its magical secret!
          </div>
        </div>

        {/* Right Side: Unlocks checklist panel & speech bubble (5 cols) */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-5 justify-between h-full">
          
          {/* Unlocked decorative list checklist */}
          <div className="bg-white/50 backdrop-blur-md border border-white rounded-[32px] p-5 shadow-xl">
            <h3 className="font-display font-black text-indigo-950 text-base md:text-lg mb-3 flex items-center gap-2">
              🏆 Your Restored Gems ({unlockedDecorations.length}/{DECORATIONS.length})
            </h3>

            <div className="flex flex-col gap-2">
              {DECORATIONS.map((item) => {
                const unlocked = state.completedQuests.includes(item.questId);

                return (
                  <button
                    key={item.questId}
                    disabled={!unlocked}
                    onClick={() => handleItemSelect(item.questId)}
                    className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all outline-none ${
                      unlocked
                        ? 'border-indigo-100 bg-white hover:bg-indigo-50/50 cursor-pointer shadow-sm'
                        : 'border-slate-100/50 bg-slate-50/20 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{unlocked ? item.emoji : '🔒'}</span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-black leading-none ${unlocked ? 'text-indigo-950' : 'text-slate-400'}`}>
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
                  key={selectedItem.questId}
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
                      <span className="text-[9px] text-indigo-500 font-black uppercase tracking-wider">{selectedItem.philosophicValue}</span>
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
                      "{state.completedQuests.length === QUESTS.length 
                        ? `Look at this paradise, hero! Every lamp, book, and flower is glowing with the Gita seeds of your heart. You did this!`
                        : `We have unlocked ${unlockedDecorations.length} items so far! Let's do more quests on the road to reach 100% health!`}"
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
