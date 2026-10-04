import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';
import { Quest, CompanionId } from '../types';
import WisdomTree from '../components/WisdomTree';
import { COMPANIONS } from '../quests';
import { getDecorationForQuest, getUnlockedDecorations } from '../decorations';

interface RewardPageProps {
  quest: Quest;
  companionId: CompanionId;
  previousHealth: number;
  newHealth: number;
  previouslyCompletedQuests: number[];
  // Replaying a finished quest: nothing new to unlock, so skip the celebration
  isReplay?: boolean;
  onNext: () => void;
  onGoToSanctuary: () => void;
}

export default function RewardPage({
  quest,
  companionId,
  previousHealth,
  newHealth,
  previouslyCompletedQuests,
  isReplay = false,
  onNext,
  onGoToSanctuary
}: RewardPageProps) {
  const [animationState, setAnimationState] = useState<'idle' | 'flying' | 'impact' | 'completed'>(isReplay ? 'completed' : 'idle');
  const [currentDisplayHealth, setCurrentDisplayHealth] = useState(isReplay ? newHealth : previousHealth);
  // Show the tree as it was before this quest, then add this quest's decoration on impact
  const [displayedCompletedQuests, setDisplayedCompletedQuests] = useState<number[]>(previouslyCompletedQuests);
  const unlockedDecoration = getDecorationForQuest(quest.id);
  
  const companion = COMPANIONS[companionId];

  const triggerFlyAnimation = () => {
    playSound.tap();
    setAnimationState('flying');

    // Wait for the crystal to 'fly' into the tree
    setTimeout(() => {
      playSound.success(); // Big magical chime sweep
      setAnimationState('impact');
      setCurrentDisplayHealth(newHealth);
      
      // Sprout the new item
      setDisplayedCompletedQuests(prev => prev.includes(quest.id) ? prev : [...prev, quest.id]);

      // Complete the scene transition
      setTimeout(() => {
        setAnimationState('completed');
      }, 1000);

    }, 1500); // 1.5 seconds travel flight
  };

  return (
    <div 
      id="reward-screen-wrapper"
      className="min-h-screen py-8 px-4 md:px-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-900 font-sans text-white flex flex-col justify-between overflow-hidden relative"
    >
      {/* Cosmic shooting star background effects */}
      <div id="cosmic-dust-particles" className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/30 rounded-full animate-pulse-gentle"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 95}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* 1. Header Victory Banner */}
      <header className="text-center z-10 max-w-xl mx-auto w-full">
        <span className="text-[#a5b4fc] font-display font-black text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-md">
          🏆 QUEST {quest.id} {isReplay ? 'COMPLETE AGAIN' : 'STABILIZED'}
        </span>
        <h1 className="font-display font-black text-3xl md:text-4xl mt-3 text-white drop-shadow-md">
          {isReplay ? 'Wisdom Practised!' : 'Wisdom Unlocked!'}
        </h1>
      </header>

      {/* 2. Interactive Animation Stage */}
      <main className="flex-grow flex flex-col items-center justify-center max-w-3xl mx-auto w-full my-4 relative">
        
        {/* THE GLOWING FLOATING CRYSTAL */}
        <AnimatePresence>
          {animationState === 'idle' && (
            <motion.div
              key="crystal-idle"
              initial={{ scale: 0.5, y: -40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute z-30 flex flex-col items-center cursor-pointer"
              onClick={triggerFlyAnimation}
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative w-32 h-32 flex items-center justify-center bg-radial-gradient from-amber-300/30 to-transparent rounded-full">
                {/* Big pulse ring */}
                <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
                <span className="text-7xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">💎</span>
              </div>
              <span className="mt-2 text-sm bg-amber-400 text-amber-950 font-display font-black px-4 py-1.5 rounded-full shadow-lg border border-amber-300">
                Tap to Release {quest.rewardCrystal}!
              </span>
            </motion.div>
          )}

          {animationState === 'flying' && (
            <motion.div
              key="crystal-flying"
              initial={{ scale: 1, y: -50, x: 0 }}
              animate={{ 
                scale: [1, 0.4, 0.2], 
                y: [20, 150, 20], 
                x: [0, 45, 0],
                rotate: 720 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute z-30 text-5xl filter drop-shadow-[0_0_20px_rgba(251,191,36,1)]"
            >
              💎
            </motion.div>
          )}

          {animationState === 'impact' && (
            <motion.div
              key="crystal-impact"
              initial={{ scale: 0.2 }}
              animate={{ scale: [1, 3, 1], opacity: [1, 0] }}
              transition={{ duration: 0.6 }}
              className="absolute z-30 w-32 h-32 rounded-full border-4 border-amber-300 flex items-center justify-center bg-white/20 blur-[2px]"
            >
              <span className="text-3xl text-yellow-300">⭐</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TREE PREVIEW WRAPPER */}
        <div id="tree-preview-reward" className="relative flex flex-col items-center">
          {/* Wisdom Tree viewer using real-time local state */}
          <WisdomTree health={currentDisplayHealth} unlockedDecorations={getUnlockedDecorations(displayedCompletedQuests)} size="md" />

          {/* Dynamic health bar HUD overlay */}
          <div className="w-64 mt-3 bg-slate-800/85 rounded-full h-4.5 border-2 border-indigo-400/40 relative overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-teal-400 via-emerald-400 to-green-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${currentDisplayHealth}%` }}
            />
            {/* Absolute indicator label */}
            <span className="absolute inset-0 flex items-center justify-center font-display font-black text-[10px] text-white">
              TREE HEALTH: {currentDisplayHealth}%
            </span>
          </div>
        </div>

        {/* SUCCESS HUD SUMMARY */}
        <AnimatePresence>
          {animationState === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[-10px] w-full max-w-sm bg-slate-800/90 border border-amber-200/40 rounded-2xl p-4 text-center shadow-lg"
            >
              <span className="text-2xl animate-float block">✨</span>
              {isReplay ? (
                <>
                  <h3 className="font-display font-black text-amber-200 text-sm md:text-base leading-none">
                    Great practice!
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 mt-1 leading-snug">
                    Your {unlockedDecoration?.emoji} {unlockedDecoration?.name ?? quest.rewardItem} is already glowing in the Sanctuary.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display font-black text-amber-200 text-sm md:text-base leading-none">
                    You Unlocked: {unlockedDecoration?.emoji} {unlockedDecoration?.name ?? quest.rewardItem}!
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 mt-1 leading-snug">
                    It has been anchored beautifully in the Sanctuary tree branch. Visit the garden to play with it!
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. Action Call Buttons */}
      <footer className="max-w-xl mx-auto w-full z-10 flex flex-col sm:flex-row gap-3 pt-4 border-t border-indigo-900/40">
        {animationState === 'idle' ? (
          <button
            onClick={triggerFlyAnimation}
            className="w-full text-center font-display font-black text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 py-3.5 rounded-full hover:brightness-110 shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            🔮 Launch Crystal into Tree 🚀
          </button>
        ) : (
          <>
            <button
              onClick={() => { playSound.tap(); onGoToSanctuary(); }}
              disabled={animationState !== 'completed'}
              className={`w-full font-display font-black text-xs uppercase tracking-wider text-center py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                animationState === 'completed'
                  ? 'bg-[#18181b] hover:bg-[#27272a] text-white border border-white/10'
                  : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
               View in Sanctuary 🌳
            </button>
            <button
              onClick={() => { playSound.tap(); onNext(); }}
              disabled={animationState !== 'completed'}
              className={`w-full font-display font-black text-xs uppercase tracking-wider text-center py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                animationState === 'completed'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white'
                  : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              🗺️ Open World Map 🚀
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
