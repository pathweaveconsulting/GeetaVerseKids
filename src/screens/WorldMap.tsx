import React from 'react';
import { motion } from 'motion/react';
import { playSound } from '../utils/audio';
import { UserState } from '../types';
import { QUESTS, COMPANIONS } from '../quests';

interface WorldMapProps {
  state: UserState;
  onBack: () => void;
  onStartQuest: (id: number) => void;
}

export default function WorldMap({ state, onBack, onStartQuest }: WorldMapProps) {
  
  // Hand-crafted coordinates for absolute node positioning on a curvy journey path (SVG layout background)
  // These points form an alternating wavy route from left-to-right, bottom-to-top!
  const nodeCoords = [
    { x: '15%', y: '82%', icon: '🏰' }, // Quest 1: Great Gathering
    { x: '35%', y: '78%', icon: '🐚' }, // Quest 2: Conch Sound
    { x: '58%', y: '84%', icon: '🏹' }, // Quest 3: Move Chariot
    { x: '82%', y: '75%', icon: '👥' }, // Quest 4: Family Attachment
    { x: '72%', y: '58%', icon: '🤝' }, // Quest 5: Bodily Tremblings
    { x: '46%', y: '50%', icon: '⛈️' }, // Quest 6: Avoiding Storms
    { x: '22%', y: '44%', icon: '🌊' }, // Quest 7: River of Doubt
    { x: '38%', y: '28%', icon: '⚖️' }, // Quest 8: Loss of Values
    { x: '68%', y: '22%', icon: '🙇' }, // Quest 9: Bow Dropped
    { x: '88%', y: '15%', icon: '✨' }  // Quest 10: Seeking Guide
  ];

  const handleNodeClick = (id: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      playSound.joke(); // Plays funny springy buzz sound
      return;
    }
    playSound.unlock(); // Plays sparkling sound
    onStartQuest(id);
  };

  // Define beautiful kids-appealing natural elements placed strategically between the adventure points!
  const naturalElements = [
    { x: '25%', y: '80%', icon: '🌊', label: 'River Yamuna', color: 'border-blue-300 text-blue-900 bg-blue-100/95 font-sans' },
    { x: '47%', y: '81%', icon: '🌳', label: 'Vrindavan Forest', color: 'border-emerald-300 text-emerald-900 bg-emerald-100/95 font-sans' },
    { x: '70%', y: '81%', icon: '🪨', label: 'Dharma Rocks', color: 'border-amber-300 text-amber-900 bg-yellow-50/95 font-sans' },
    { x: '78%', y: '66%', icon: '🏜️', label: 'Thar Desert', color: 'border-orange-200 text-orange-950 bg-orange-50/95 font-sans' },
    { x: '59%', y: '54%', icon: '🌲', label: 'Mist Woods', color: 'border-teal-300 text-teal-900 bg-teal-100/95 font-sans' },
    { x: '34%', y: '47%', icon: '🌊', label: 'River Ganges', color: 'border-sky-300 text-sky-900 bg-sky-100/95 font-sans' },
    { x: '30%', y: '35%', icon: '🐪', label: 'Thar Dunes', color: 'border-yellow-300 text-amber-950 bg-amber-50/95 font-sans' },
    { x: '52%', y: '25%', icon: '🛕', label: 'Sacred Ashram', color: 'border-rose-200 text-rose-955 bg-rose-50/95 font-sans' },
    { x: '78%', y: '18%', icon: '🌊', label: 'Triveni Sangam', color: 'border-indigo-300 text-indigo-905 bg-indigo-50/95 font-sans' }
  ];

  // Companion positional animation metrics
  const companionKey = state.companion || 'gaja';
  const companionObj = COMPANIONS[companionKey as any] || COMPANIONS.gaja;
  
  // Calculate index of companion standing target (based on completed quests)
  const completedCount = state.completedQuests.length;
  const dIndex = Math.min(completedCount, nodeCoords.length - 1);
  const sIndex = Math.max(0, dIndex - 1);

  const startCoords = nodeCoords[sIndex];
  const destCoords = nodeCoords[dIndex];

  return (
    <div 
      id="world-map-screen"
      className="min-h-screen py-6 px-4 md:px-8 bg-[#f9f5f0] text-amber-900 font-sans select-none flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* 1. Header Navigation */}
      <header id="map-header" className="max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => { playSound.tap(); onBack(); }}
          className="text-indigo-950 font-black text-sm bg-white/60 backdrop-blur-md border border-white px-5 py-2.5 rounded-full hover:bg-white/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-900/5"
        >
          ⬅️ Back To Camp
        </button>
        <div className="flex flex-col items-center">
          <span className="font-display font-black text-indigo-950 text-xl md:text-3xl tracking-wide flex items-center gap-1">
            🗺️ World of Confusion
          </span>
          <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mt-0.5">
            Region 1: The Gateway to Wisdom
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-md text-amber-900 border border-white rounded-full px-4 py-2 text-xs font-black shadow-md shadow-amber-900/5">
          ⭐ {state.xp} XP
        </div>
      </header>

      {/* 2. Map Canvas Stage */}
      <main id="map-canvas" className="max-w-4xl mx-auto w-full flex-grow my-4 bg-white/70 backdrop-blur-md border border-white rounded-[32px] p-4 md:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.05)] relative min-h-[500px] z-10">
        
        {/* Curvy connector path line drawn with an SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 100 420 Q 200 400 300 410 T 500 420 T 700 400 T 650 300 T 400 270 T 200 240 T 300 150 T 550 120 T 750 80"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            strokeDasharray="12 8"
            strokeLinecap="round"
            className="opacity-40"
          />
          <path
            d="M 100 420 Q 200 400 300 410 T 500 420 T 700 400 T 650 300 T 400 270 T 200 240 T 300 150 T 550 120 T 750 80"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeDasharray="12 8"
            strokeLinecap="round"
            className="opacity-30"
            style={{ strokeDashoffset: -50, animation: 'dash 30s linear infinite' }}
          />
        </svg>

        {/* Beautiful Natural Terrain Elements */}
        {naturalElements.map((elem, i) => (
          <div
            key={i}
            className="absolute z-5 pointer-events-none"
            style={{ top: elem.y, left: elem.x, transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex flex-col items-center select-none opacity-90 transition-opacity">
              <span className="text-xl filter drop-shadow animate-pulse" style={{ animationDuration: '4s' }}>
                {elem.icon}
              </span>
              <span className={`text-[8px] mt-0.5 font-bold tracking-tight px-1.5 py-0.5 rounded-full border shadow-xs whitespace-nowrap ${elem.color}`}>
                {elem.label}
              </span>
            </div>
          </div>
        ))}

        {/* Adorable Companion Avatar trekking along the path over natural features! */}
        <motion.div
          id="companion-map-avatar"
          initial={{ left: startCoords.x, top: `calc(${startCoords.y} - 28px)` }}
          animate={{ left: destCoords.x, top: `calc(${destCoords.y} - 28px)` }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.6 }}
          className="absolute z-20 flex flex-col items-center pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Animated jumping visual container */}
          <div className="relative flex flex-col items-center">
            {/* Soft shadow below companion, sliding with it */}
            <div className="absolute -bottom-1 w-6 h-1.5 bg-indigo-950/20 rounded-full blur-xs" />
            
            <div 
              className="w-12 h-12 rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center text-2xl shadow-xl animate-bounce"
              style={{ animationDuration: '2.5s' }}
            >
              {companionObj.emoji}
            </div>
            
            <div className="bg-indigo-950 text-white font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 border border-white whitespace-nowrap shadow-md">
              {companionObj.name} 🏃
            </div>
          </div>
        </motion.div>

        {/* 10 Quest Nodes */}
        {QUESTS.map((quest, index) => {
          const isCompleted = state.completedQuests.includes(quest.id);
          // Sequential unlocking rule: Node index 0 is always unlocked. Others are unlocked if the previous one is completed.
          const isUnlocked = index === 0 || state.completedQuests.includes(quest.id - 1);
          const coords = nodeCoords[index];

          return (
            <div
              key={quest.id}
              className="absolute z-10"
              style={{ top: coords.y, left: coords.x, transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex flex-col items-center">
                
                {/* Node Button wrapper */}
                <motion.button
                  id={`quest-node-${quest.id}`}
                  onClick={() => handleNodeClick(quest.id, isUnlocked)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center font-display font-bold text-xl md:text-2xl shadow-md transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-600 ring-4 ring-emerald-200'
                      : isUnlocked
                        ? 'bg-amber-400 border-amber-600 text-amber-950 hover:bg-amber-500 ring-4 ring-amber-300 ring-offset-2 animate-bounce'
                        : 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-75'
                  }`}
                  whileHover={isUnlocked ? { scale: 1.15 } : {}}
                  whileTap={isUnlocked ? { scale: 0.9 } : {}}
                  style={{ animationDuration: isUnlocked && !isCompleted ? '2.5s' : '0s' }}
                >
                  {isCompleted ? (
                    <span>✅</span>
                  ) : isUnlocked ? (
                    <span>{coords.icon}</span>
                  ) : (
                    <span>🔒</span>
                  )}
                </motion.button>

                {/* Node Title Label Bubble */}
                <div className={`mt-2 px-3 py-1.5 rounded-xl border whitespace-nowrap text-center shadow-sm max-w-[140px] overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-950 font-bold text-[10px]'
                    : isUnlocked
                      ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold text-[10px]'
                      : 'bg-slate-100 border-slate-200 text-slate-400 text-[10px]'
                }`}>
                  <p className="truncate">Quest {quest.id}: {quest.title.split(' ')[0]}</p>
                </div>

              </div>
            </div>
          );
        })}

        {/* --- DECORATION: FUTURE WORLD CLOUD 1 (World of Greed) --- */}
        <div id="future-world-1" className="absolute top-10 left-10 z-10 pointer-events-none opacity-90">
          <div className="relative flex flex-col items-center">
            {/* Cloud representation using SVGs */}
            <svg viewBox="0 0 120 80" className="w-28 h-20 fill-white text-teal-100 drop-shadow-md">
              <path d="M20,60 C15,60 10,55 10,50 C10,48 11,46 12,45 C8,43 5,38 5,33 C5,27 10,22 17,22 C18,22 20,23 21,23 C25,15 32,10 42,10 C52,10 61,16 63,25 C67,22 72,20 77,20 C87,20 95,28 95,38 C95,39 95,40 94,41 C99,43 102,48 102,53 C102,59 97,63 92,64 H20 Z" />
            </svg>
            <div className="absolute top-6 text-center">
              <span className="text-[12px] block">☁️</span>
              <span className="font-display font-black text-[9px] text-sky-850 bg-sky-100/90 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                World of Greed
              </span>
              <span className="text-[8px] text-sky-600 font-bold mt-0.5 block">Locked</span>
            </div>
          </div>
        </div>

        {/* --- DECORATION: FUTURE WORLD CLOUD 2 (World of Ego/Pride) --- */}
        <div id="future-world-2" className="absolute bottom-12 right-6 z-10 pointer-events-none opacity-90">
          <div className="relative flex flex-col items-center">
            <svg viewBox="0 0 120 80" className="w-28 h-20 fill-white text-pink-100 drop-shadow-md">
              <path d="M20,60 C15,60 10,55 10,50 C10,48 11,46 12,45 C8,43 5,38 5,33 C5,27 10,22 17,22 C18,22 20,23 21,23 C25,15 32,10 42,10 C52,10 61,16 63,25 C67,22 72,20 77,20 C87,20 95,28 95,38 C95,39 95,40 94,41 C99,43 102,48 102,53 C102,59 97,63 92,64 H20 Z" />
            </svg>
            <div className="absolute top-6 text-center">
              <span className="text-[12px] block">☁️</span>
              <span className="font-display font-black text-[9px] text-pink-850 bg-pink-100/90 border border-pink-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                World of Pride
              </span>
              <span className="text-[8px] text-pink-600 font-bold mt-0.5 block">Locked</span>
            </div>
          </div>
        </div>

        {/* Floating instruction arrow */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center bg-[#f9f5f0] border border-white px-5 py-2 rounded-full text-xs font-black text-indigo-950 shadow-lg flex items-center gap-2 pointer-events-none z-20">
          <span>👇</span> Tap any unlocked node key to start your 2-minute quest!
        </div>

      </main>

      {/* 3. Footer Tip */}
      <footer className="text-center font-bold text-[10px] text-teal-800/80 uppercase tracking-wide">
        Completed quests reveal sacred crystals that repair the ancient Wisdom Tree!
      </footer>
    </div>
  );
}
