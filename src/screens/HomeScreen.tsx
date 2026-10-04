import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound, speakText, stopSpeaking, setActiveCompanionId } from '../utils/audio';
import { UserState, CompanionId, AvatarId } from '../types';
import WisdomTree from '../components/WisdomTree';
import { QUESTS, COMPANIONS } from '../quests';
import { getUnlockedDecorations } from '../decorations';
import { AgeGroup } from '../session';

const LEVELS: Record<AgeGroup, { emoji: string; name: string; ages: string; blurb: string }> = {
  explorer: { emoji: '🎨', name: 'Explorer', ages: 'ages 6–8', blurb: 'Short, simple lessons with less reading.' },
  seeker: { emoji: '🌟', name: 'Seeker', ages: 'ages 9–11', blurb: 'School stories, word meanings and chanting.' },
  guide: { emoji: '🧠', name: 'Guide', ages: 'ages 12–13', blurb: 'Deeper ideas from the original Gita.' }
};

interface HomeScreenProps {
  state: UserState;
  onNavigate: (screen: 'landing' | 'avatar' | 'home' | 'map' | 'quest' | 'sanctuary' | 'reward') => void;
  onReset: () => void;
  onStartQuest: (questId: number) => void;
  onUpdateAgeGroup?: (ageGroup: 'explorer' | 'seeker' | 'guide') => void;
}

export default function HomeScreen({ state, onNavigate, onReset, onStartQuest, onUpdateAgeGroup }: HomeScreenProps) {
  const companion = COMPANIONS[state.companion as CompanionId];
  const avatar = state.avatar as AvatarId;
  const currentAge = state.ageGroup || 'seeker';

  // Toggle state variables
  const [showRiver, setShowRiver] = useState(false);
  const [isPlayingRiverWord, setIsPlayingRiverWord] = useState<number | null>(null);
  // Changing the level is a two-step choice so a stray tap can't change it
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<AgeGroup | null>(null);

  useEffect(() => {
    if (state.companion) {
      setActiveCompanionId(state.companion);
    }
    
    const welcomeMsg = state.completedQuests.length === 10
      ? `Hari Om, ${state.avatarName}! Welcome back! We have successfully completed all ten wisdom quests and fully restored the Wisdom Tree! Let's examine our glorious garden decorations!`
      : state.completedQuests.length === 0
      ? `Hari Om, ${state.avatarName}! I am ${companion?.name}, your devoted companion guide. Tap the Start Adventure button to begin our magical journey on the World Map!`
      : `Hari Om, ${state.avatarName}! Welcome back! We have gathered ${state.completedQuests.length} sacred crystals so far, and our Wisdom Tree has reached ${state.treeHealth} percent health. Let's start our next quest of courage!`;

    const timer = setTimeout(() => {
      speakText(welcomeMsg, 'companion');
    }, 850);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Find the next uncompleted quest (1 to 10)
  const nextQuestIndex = QUESTS.findIndex(q => !state.completedQuests.includes(q.id));
  const activeQuest = nextQuestIndex !== -1 ? QUESTS[nextQuestIndex] : null;

  // Today's quest parameters
  const questStatusLabel = activeQuest 
    ? `Today's Quest: Quest ${activeQuest.id}` 
    : "🌟 Adventure Complete!";

  const questTitleText = activeQuest
    ? activeQuest.title
    : "You've stabilized the Wisdom Tree! Visited the sanctuary?";

  const questDescText = activeQuest
    ? activeQuest.shortDescription
    : "Excellent job hero! You have acquired all 10 crystals of Gita Wisdom and restored the grand energy canopy!";

  const handleResetClick = () => {
    if (confirm("Would you like to reset your profile and start a brand new adventure?")) {
      playSound.joke();
      onReset();
    }
  };

  const closeLevelPicker = () => {
    setLevelPickerOpen(false);
    setPendingLevel(null);
  };

  const confirmLevelChange = () => {
    if (pendingLevel && onUpdateAgeGroup) {
      playSound.unlock();
      onUpdateAgeGroup(pendingLevel);
    }
    closeLevelPicker();
  };

  const handleRiverShlokaHear = (qId: number, text: string) => {
    playSound.correct();
    setIsPlayingRiverWord(qId);
    speakText(text, 'narrator');
    setTimeout(() => {
      setIsPlayingRiverWord(null);
    }, 4000);
  };

  return (
    <div 
      id="home-screen-bg"
      className="min-h-screen py-6 px-4 md:px-8 bg-[#f9f5f0] text-amber-900 font-sans select-none flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* 1. Header Row */}
      <header id="home-header" className="max-w-5xl mx-auto w-full bg-white/60 backdrop-blur-md border border-white rounded-[32px] md:rounded-full p-4 px-6 shadow-xl flex flex-wrap justify-center lg:justify-between items-center gap-4 z-10">
        
        {/* Profile Card left */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
            {avatar === 'boy' ? (
              <span className="text-3xl mt-1">👦</span>
            ) : (
              <span className="text-3xl mt-1">👧</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-display font-black text-amber-950 text-base leading-tight">
              {state.avatarName}
            </span>
            {/* Adventure level: shows the current level; changing it asks first */}
            <button
              id="level-button"
              onClick={() => { playSound.tap(); setLevelPickerOpen(true); }}
              aria-haspopup="dialog"
              className={`mt-1 text-xs font-black px-3 rounded-full border cursor-pointer transition-all w-fit flex items-center gap-1.5 whitespace-nowrap ${
                currentAge === 'explorer' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : currentAge === 'guide'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {LEVELS[currentAge].emoji} Level: {LEVELS[currentAge].name}
              <span className="font-bold opacity-70">({LEVELS[currentAge].ages})</span>
            </button>
          </div>
        </div>

        {/* Center Live XP Indicators */}
        <div className="flex gap-3">
          {/* XP bubble */}
          <div className="bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="text-sm">⭐</span>
            <span className="font-display font-black text-sm text-amber-950">
              {state.xp} <span className="text-[10px] text-amber-800 uppercase font-bold">XP</span>
            </span>
          </div>

          {/* Quest nodes done bubble */}
          <div className="bg-emerald-100 border border-emerald-200 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="text-sm">💎</span>
            <span className="font-display font-black text-sm text-emerald-950">
              {state.completedQuests.length} / 10 <span className="text-[10px] text-emerald-800 uppercase font-bold font-sans">Crystals</span>
            </span>
          </div>
        </div>

        {/* Right Menu Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Knowledge River trigger */}
          <button
            onClick={() => { playSound.tap(); setShowRiver(true); }}
            className="px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-950 font-black text-xs rounded-full cursor-pointer shadow-md border border-blue-200 flex items-center gap-1.5 transition-all"
          >
            🌊 Knowledge River
          </button>

          <button
            onClick={() => { playSound.tap(); onNavigate('map'); }}
            className="px-5 py-2.5 bg-white/85 hover:bg-white text-indigo-950 font-black text-xs rounded-full cursor-pointer shadow-md border border-indigo-50 flex items-center gap-1.5 transition-all"
          >
            🗺️ World Map
          </button>
          
          <button
            onClick={() => { playSound.tap(); onNavigate('sanctuary'); }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs rounded-full cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
          >
            🌳 Wisdom Tree
          </button>
        </div>
      </header>

      {/* 2. Middle Main Section - Wisdom Tree Arena */}
      <main id="home-main-arena" className="max-w-5xl mx-auto w-full my-6 flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Card: Tree visualization */}
        <div className="col-span-1 md:col-span-7 bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center relative min-h-[380px] z-10">
          
          <div className="absolute top-4 left-6 flex items-center gap-1">
            <span className="text-[10px] bg-indigo-100/75 text-indigo-900 border border-indigo-200/50 rounded-full px-3 py-1 font-black uppercase tracking-[0.12em]">
              🌳 Your Wisdom Tree
            </span>
          </div>

          <div className="absolute top-4 right-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-black flex items-center gap-1.5 shadow-sm">
            💚 Health: <span className="font-display font-black text-sm text-emerald-800">{state.treeHealth}%</span>
          </div>

          <div className="w-full flex items-center justify-center mt-3">
            <WisdomTree health={state.treeHealth} unlockedDecorations={getUnlockedDecorations(state.completedQuests)} size="md" />
          </div>

          {/* Dynamic health bar */}
          <div className="w-full max-w-sm mt-3 bg-amber-200/55 rounded-full h-4 relative overflow-hidden border border-amber-300">
            <div 
              className="bg-gradient-to-r from-orange-400 via-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${state.treeHealth || 5}%` }}
            />
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-white/10" />
          </div>
          <span className="text-[10px] text-amber-800 font-bold mt-1.5 uppercase tracking-wider">
            {state.treeHealth === 100 
              ? "✨ The Wisdom Tree is fully glowing and restored! ✨" 
              : "Complete giant quests to help it grow leaves and magical lights!"}
          </span>
        </div>

        {/* Right Card: Current Quest Info & Companion Chat */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6 h-full justify-between">
          
          {/* Companion Speaking Box */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-2xl relative flex flex-col items-center flex-grow justify-center z-10">
            <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              {companion?.name}'s Advice
            </div>
            
            <div className="flex items-center gap-4 py-2 w-full mt-2">
              <span className="text-5xl filter drop-shadow hover:scale-110 transition-transform duration-300 cursor-pointer shrink-0" onClick={() => playSound.unlock()}>
                {companion?.emoji}
              </span>
              <div className="flex flex-col">
                <p className="font-sans text-xs font-semibold text-indigo-950 italic leading-relaxed">
                  "{state.completedQuests.length === 10 
                    ? `Brilliant, ${state.avatarName}! We restored all 10 branches of the tree! Let's examine our sanctuary decorations!`
                    : `We are doing great, ${state.avatarName}! The tree needs our values. Let's do the next quest on our magical map!`}"
                </p>
                <span className="text-[9px] uppercase font-black tracking-wider text-indigo-400 mt-1">Your Companion guide</span>
              </div>
            </div>
          </div>

          {/* Active / Next Quest Box (Sleek Theme Design Style) */}
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[40px] shadow-2xl border border-white relative overflow-hidden z-10 flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full" />

            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                {activeQuest ? `Quest ${activeQuest.id}` : "Sacred Trophy"}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black leading-tight text-indigo-950 mb-3 block">
              {questTitleText}
            </h3>
            
            <p className="text-indigo-900/70 text-sm leading-relaxed mb-6 font-semibold">
              {questDescText}
            </p>

            {activeQuest && (
              <div id="reward-visual-capsule" className="flex items-center gap-3.5 p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6 z-10">
                <div className="text-3xl">💎</div>
                <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Reward</p>
                  <p className="text-xs font-black text-indigo-900">
                    {activeQuest.rewardCrystal} & {activeQuest.rewardItem}
                  </p>
                </div>
              </div>
            )}

            {/* Main Interactive Button */}
            {activeQuest ? (
              <motion.button
                onClick={() => { playSound.tap(); onStartQuest(activeQuest.id); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-black rounded-3xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-2 touch-target transition-all z-10"
              >
                START ADVENTURE 🚀
              </motion.button>
            ) : (
              <motion.button
                onClick={() => { playSound.tap(); onNavigate('sanctuary'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-3xl shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-2 touch-target transition-all z-10"
              >
                GARDEN SANCTUARY 🎨
              </motion.button>
            )}
          </div>

        </div>
      </main>

      {/* 🌊 KNOWLEDGE RIVER PORTFOLIO MODAL (GLOWING DIARY OVERLAY) */}
      <AnimatePresence>
        {showRiver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#fcfaf5] w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-3xl border-4 border-indigo-200/55 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-500 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <span className="text-3xl animate-bounce">🌊</span>
                  <div>
                    <h2 className="font-display font-black text-xl leading-none">Your Knowledge River</h2>
                    <span className="text-[10px] font-mono tracking-widest text-indigo-200 uppercase font-black">
                      ALIVE ARCHIVE OF SAGELY DHARMA
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { stopSpeaking(); playSound.tap(); setShowRiver(false); }}
                  className="bg-white/20 hover:bg-white/35 p-2 rounded-full font-black text-sm w-10 h-10 flex items-center justify-center cursor-pointer transition-all border border-white/20"
                >
                  ❌
                </button>
              </div>

              {/* Scrollable River body */}
              <div className="p-6 md:p-8 flex-grow overflow-y-auto relative bg-[#fcfaf5]">
                {/* Wavy background water current stream */}
                <div className="absolute left-4 top-0 bottom-0 w-8 pointer-events-none overflow-hidden flex flex-col items-center justify-around z-0 opacity-75">
                  <div className="absolute inset-y-0 w-4 bg-gradient-to-b from-sky-200 via-blue-400 to-indigo-300 rounded-full shadow-inner animate-pulse duration-1000" />
                  <div className="absolute inset-y-0 w-1.5 bg-sky-100/60 border-dashed border-l border-white/80 animate-pulse duration-3000" />
                  
                  {/* Flowing lotus flowers and paper boats drifting downstream! */}
                  <span className="text-xl animate-bounce filter drop-shadow-xs" style={{ animationDuration: '4.5s' }}>🌸</span>
                  <span className="text-base animate-pulse" style={{ animationDuration: '3.2s' }}>⛵</span>
                  <span className="text-lg animate-bounce filter drop-shadow-xs" style={{ animationDuration: '5.2s' }}>🌸</span>
                  <span className="text-sm animate-pulse" style={{ animationDuration: '4s' }}>⛵</span>
                  <span className="text-xl animate-bounce filter drop-shadow-xs" style={{ animationDuration: '3.8s' }}>🌸</span>
                  <span className="text-base animate-pulse" style={{ animationDuration: '5s' }}>⛵</span>
                  <span className="text-lg animate-bounce filter drop-shadow-xs" style={{ animationDuration: '4.7s' }}>🌸</span>
                </div>

                {state.completedQuests.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                    <span className="text-6xl filter drop-shadow">⛵</span>
                    <h4 className="font-display font-black text-lg text-indigo-950 mt-2">The River is Waiting to Flow!</h4>
                    <p className="text-xs text-indigo-900/70 font-semibold max-w-sm leading-relaxed">
                      Complete some Bhagavad Gita quests on the World Map! Every completed quest floats a glowing **Wisdom Leaf** onto your river representing courage, action, and peace.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 pl-10">
                    {state.completedQuests.map((qId) => {
                      const quest = QUESTS.find((q) => q.id === qId);
                      if (!quest) return null;

                      const isPlaying = isPlayingRiverWord === qId;

                      return (
                        <div 
                          key={qId}
                          className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-md flex flex-col md:flex-row justify-between gap-4 hover:shadow-lg transition-shadow relative"
                        >
                          {/* Anchor Node badge */}
                          <div className="absolute -left-12 top-6 bg-indigo-600 text-white font-mono text-xs font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            {qId}
                          </div>

                          <div className="flex-grow flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{quest.rewardCrystal.includes('Action') ? '🐚' : '🎯'}</span>
                              <h3 className="font-display font-black text-base text-indigo-950">
                                {quest.title}
                              </h3>
                            </div>

                            <p className="font-sans text-xs italic text-amber-900 font-bold bg-amber-50/50 py-1.5 px-3 rounded-xl border border-amber-100/50">
                              "{quest.shlokaSanskrit}"
                            </p>

                            <p className="text-[11px] font-mono font-black text-indigo-500 italic">
                              {quest.shlokaTransliteration}
                            </p>

                            {/* Kid Friendly explanation */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                              <span className="text-[9px] uppercase font-black text-slate-500 tracking-wider block mb-0.5">Kids Adaptation</span>
                              <p className="text-xs leading-relaxed text-slate-805 font-bold">
                                {currentAge === 'explorer' 
                                  ? (quest.teachingStep.explorerWisdom || quest.teachingStep.kidWisdom)
                                  : currentAge === 'guide'
                                    ? (quest.teachingStep.guideWisdom || quest.teachingStep.kidWisdom)
                                    : quest.teachingStep.kidWisdom
                                }
                              </p>
                            </div>
                          </div>

                          {/* Action panel */}
                          <div className="shrink-0 flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5 gap-3">
                            <div className="text-left md:text-right">
                              <span className="text-[9px] uppercase font-black text-indigo-400 block">Restored Energy</span>
                              <span className="text-xs font-black text-indigo-950 font-display">🔮 {quest.rewardCrystal}</span>
                            </div>

                            <button
                              onClick={() => handleRiverShlokaHear(qId, quest.shlokaTransliteration || quest.teachingStep.kidWisdom)}
                              className={`px-4 py-2 rounded-xl text-xs font-black text-white cursor-pointer shadow-md transition-all flex items-center gap-1 ${
                                isPlaying 
                                  ? 'bg-rose-500 animate-pulse' 
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                              }`}
                            >
                              {isPlaying ? '🔊 Chanting...' : '🔊 Chant Verse'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Parent Summary Card */}
              <div className="bg-amber-50/70 p-4 border-t border-amber-100 flex items-center justify-between text-indigo-950 text-xs">
                <span className="font-semibold">🧑‍👩‍👧 **Parent Corner**: Clean, non-academic Sanskrit familiarity tracking dashboard.</span>
                <span className="font-black text-amber-900 bg-amber-200/50 px-3 py-1 rounded-full uppercase tracking-wide">
                  VALUABLE INSIGHTS
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adventure level picker */}
      <AnimatePresence>
        {levelPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-indigo-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLevelPicker}
          >
            <motion.div
              id="level-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="level-dialog-title"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#fcfaf5] w-full max-w-md rounded-[32px] shadow-2xl border-4 border-indigo-100 p-6 text-indigo-950"
              onClick={(e) => e.stopPropagation()}
            >
              {pendingLevel === null ? (
                <>
                  <h2 id="level-dialog-title" className="font-display font-black text-xl">Adventure Level</h2>
                  <p className="text-sm font-bold mt-1 mb-4">
                    You are playing as{' '}
                    <span className="whitespace-nowrap">{LEVELS[currentAge].emoji} {LEVELS[currentAge].name} ({LEVELS[currentAge].ages})</span>.
                  </p>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(LEVELS) as AgeGroup[]).map((level) => {
                      const isCurrent = level === currentAge;
                      return (
                        <button
                          key={level}
                          disabled={isCurrent}
                          onClick={() => { playSound.tap(); setPendingLevel(level); }}
                          className={`w-full text-left px-4 py-3 rounded-2xl border-2 flex items-center gap-3 ${
                            isCurrent ? 'border-indigo-400 bg-indigo-50 cursor-default' : 'border-indigo-100 bg-white hover:bg-indigo-50/50 cursor-pointer'
                          }`}
                        >
                          <span className="text-2xl">{LEVELS[level].emoji}</span>
                          <span className="flex-1">
                            <span className="block font-black text-sm">{LEVELS[level].name} <span className="font-bold opacity-70">({LEVELS[level].ages})</span></span>
                            <span className="block text-xs font-semibold text-indigo-900/70">{LEVELS[level].blurb}</span>
                          </span>
                          {isCurrent && <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-2 py-1 rounded-full">Current</span>}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={closeLevelPicker}
                    className="mt-4 w-full px-4 py-3 rounded-full font-black text-sm bg-white border border-indigo-100 hover:bg-indigo-50 cursor-pointer"
                  >
                    Keep {LEVELS[currentAge].name}
                  </button>
                </>
              ) : (
                <>
                  <h2 id="level-dialog-title" className="font-display font-black text-xl">
                    Switch to {LEVELS[pendingLevel].emoji} {LEVELS[pendingLevel].name}?
                  </h2>
                  <p className="text-sm font-bold mt-2 mb-5">
                    Stories and lessons will change to the {LEVELS[pendingLevel].name} level ({LEVELS[pendingLevel].ages}). Your crystals and Wisdom Tree stay the same.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      id="level-confirm"
                      onClick={confirmLevelChange}
                      className="flex-1 px-4 py-3 rounded-full font-black text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 cursor-pointer"
                    >
                      Yes, switch to {LEVELS[pendingLevel].name}
                    </button>
                    <button
                      id="level-cancel"
                      onClick={closeLevelPicker}
                      className="flex-1 px-4 py-3 rounded-full font-black text-sm bg-white border border-indigo-100 hover:bg-indigo-50 cursor-pointer"
                    >
                      No, keep {LEVELS[currentAge].name}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Footer Reset Actions */}
      <footer id="home-footer-row" className="max-w-5xl mx-auto w-full pt-4 border-t border-amber-200/50 flex justify-between items-center z-10 text-[10px] text-amber-700/80 font-bold uppercase tracking-wider">
        <span>© GeetaVerse Kids Game</span>
        <button
          onClick={handleResetClick}
          className="hover:text-red-700 cursor-pointer bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-200 hover:bg-red-50 transition-all font-bold shadow-sm"
        >
          🔄 Restart from Beginning
        </button>
      </footer>
    </div>
  );
}
