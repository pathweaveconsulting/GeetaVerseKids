import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound, speakText, stopSpeaking } from '../utils/audio';
import { Quest, CompanionId } from '../types';
import { QuestStep } from '../session';
import { COMPANIONS } from '../quests';
import CharacterPortrait, { CharacterId } from '../components/CharacterPortrait';

interface QuestPageProps {
  quest: Quest;
  companionId: CompanionId;
  ageGroup?: 'explorer' | 'seeker' | 'guide';
  // Where to resume, so a refresh returns the child to the same step
  initialStep?: QuestStep;
  initialWisdomUncovered?: boolean;
  isReplay?: boolean;
  onProgress?: (step: QuestStep, wisdomUncovered: boolean) => void;
  onComplete: (questId: number) => void;
  onExit: () => void;
}

export default function QuestPage({
  quest,
  companionId,
  ageGroup = 'seeker',
  initialStep = 1,
  initialWisdomUncovered = false,
  isReplay = false,
  onProgress,
  onComplete,
  onExit
}: QuestPageProps) {
  const [currentStep, setCurrentStep] = useState<QuestStep>(initialStep);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectSelected, setIsCorrectSelected] = useState(false);
  const [uncoveredWisdom, setUncoveredWisdom] = useState(initialWisdomUncovered || initialStep > 2);
  const [activeSpeaker, setActiveSpeaker] = useState<CharacterId | null>(null);
  
  // Audio narration controls
  const [isMuted, setIsMuted] = useState(false);
  
  // Chanting game state
  const [chantActive, setChantActive] = useState(false);
  const [chantIndex, setChantIndex] = useState(0);
  const [isChantedRepeating, setIsChantedRepeating] = useState(false);
  const [isChantFinished, setIsChantFinished] = useState(false);

  const companion = COMPANIONS[companionId];

  useEffect(() => {
    onProgress?.(currentStep, uncoveredWisdom);
  }, [currentStep, uncoveredWisdom]);

  const getQuestCharacters = (questId: number): CharacterId[] => {
    switch (questId) {
      case 1: return ['dhritarashtra', 'sanjaya', 'arjuna', 'krishna'];
      case 2: return ['arjuna', 'krishna'];
      case 3: return ['arjuna', 'krishna'];
      case 4: return ['arjuna', 'bhishma', 'drona'];
      case 5: return ['arjuna', 'krishna'];
      case 6: return ['arjuna', 'krishna'];
      case 7: return ['arjuna', 'krishna'];
      case 8: return ['arjuna', 'duryodhana'];
      case 9: return ['arjuna', 'krishna', 'sanjaya'];
      case 10: return ['arjuna', 'krishna'];
      default: return ['arjuna', 'krishna'];
    }
  };

  const getCharacterDialogue = (charId: CharacterId) => {
    switch (charId) {
      case 'krishna':
        return "O Arjuna, stand stable and face your inner storms with a quiet, powerful heart!";
      case 'arjuna':
        return "My hands are shaking, Sri Krishna, guide me on this magical chariot of duty!";
      case 'dhritarashtra':
        return "O Sanjaya, tell me what did my sons and the Pandavas do on the battlefield of Kurukshetra?";
      case 'sanjaya':
        return "I see the golden chariot of Arjuna and Sri Krishna standing between the two armies, brave and focused!";
      case 'bhishma':
        return "I am Bhishma, doing my duty with strength and elder blessings!";
      case 'drona':
        return "Focus your arrow of attention towards a single target, noble student!";
      case 'duryodhana':
        return "I want the crown and victory, even if it is full of struggle and proud choices!";
      default:
        return "I stand ready on the field of values!";
    }
  };

  // Auto-narrate on step updates and scroll uncovers
  useEffect(() => {
    stopSpeaking();
    if (isMuted) return;

    if (currentStep === 1) {
      speakText(`${quest.storyStep.text} ... Krishna looks at Arjuna and advises: ${quest.storyStep.narratorQuote}`, 'narrator');
    } else if (currentStep === 2) {
      if (!uncoveredWisdom) {
        speakText("Step 2: Uncover the sacred Wisdom Leaf scroll below to unlock values!", 'narrator');
      } else if (!chantActive) {
        const primaryWisdom = ageGroup === 'explorer'
          ? (quest.teachingStep.explorerWisdom || quest.teachingStep.kidWisdom)
          : ageGroup === 'guide'
            ? (quest.teachingStep.guideWisdom || quest.teachingStep.kidWisdom)
            : quest.teachingStep.kidWisdom;
        speakText(`Original Sanskrit verse: ${quest.shlokaTransliteration}. Today's Wisdom: ${primaryWisdom}`, 'narrator');
      }
    } else if (currentStep === 3) {
      speakText(`${quest.exampleStep.scenario}`, 'narrator');
    } else if (currentStep === 4) {
      speakText(`Quiz challenge: ${quest.challengeStep.question}`, 'narrator');
    } else if (currentStep === 5) {
      speakText(isReplay
        ? `Amazing job! You finished this quest again. Your ${quest.rewardItem} is still glowing in the Sanctuary!`
        : `Amazing job! You successfully completed the quest and restored the ${quest.rewardCrystal} and unlocked the ${quest.rewardItem}! Let's merge it into our Wisdom Tree.`, 'companion');
    }

    return () => stopSpeaking();
  }, [currentStep, uncoveredWisdom, isMuted, quest, ageGroup, chantActive, isReplay]);

  const handleNextStep = () => {
    setActiveSpeaker(null);
    if (currentStep < 5) {
      playSound.tap();
      setCurrentStep((prev) => (prev + 1) as QuestStep);
    }
  };

  const handlePrevStep = () => {
    setActiveSpeaker(null);
    if (currentStep > 1) {
      playSound.tap();
      setCurrentStep((prev) => (prev - 1) as QuestStep);
    }
  };

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);
    setShowFeedback(true);
    if (isCorrect) {
      playSound.correct();
      setIsCorrectSelected(true);
      if (!isMuted) {
        const feedbackText = quest.challengeStep.options.find(o => o.id === optionId)?.feedback || '';
        speakText(feedbackText, 'companion');
      }
    } else {
      playSound.joke();
      setIsCorrectSelected(false);
      if (!isMuted) {
        const feedbackText = quest.challengeStep.options.find(o => o.id === optionId)?.feedback || '';
        speakText(feedbackText, 'companion');
      }
    }
  };

  const handleFinalClaim = () => {
    playSound.success();
    stopSpeaking();
    onComplete(quest.id);
  };

  // Start single-line chanting recitation
  const handleHearChantLine = () => {
    if (quest.chantSteps && quest.chantSteps[chantIndex]) {
      speakText(quest.chantSteps[chantIndex], 'krishna');
    }
  };

  // Trigger mic imitation breathing wave animation
  const handleChantRepeat = () => {
    if (isChantedRepeating) return;
    playSound.tap();
    setIsChantedRepeating(true);
    setTimeout(() => {
      setIsChantedRepeating(false);
      playSound.correct();
      if (quest.chantSteps && chantIndex < quest.chantSteps.length - 1) {
        setChantIndex(prev => prev + 1);
      } else {
        setIsChantFinished(true);
      }
    }, 2400);
  };

  const stepsConfig = [
    { num: 1, label: 'Story 📖' },
    { num: 2, label: 'Wisdom Leaf 🍃' },
    { num: 3, label: 'School Life 🏫' },
    { num: 4, label: 'Challenge 🎯' },
    { num: 5, label: 'Reward 💎' },
  ];

  return (
    <div 
      id="quest-play-wrapper"
      className="min-h-screen py-6 px-4 md:px-8 bg-[#f9f5f0] text-amber-900 font-sans select-none flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* 1. Header Navigation and Narration Controls */}
      <header className="max-w-4xl mx-auto w-full flex flex-col gap-3 z-10 mb-2">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => { stopSpeaking(); playSound.tap(); onExit(); }}
            className="text-indigo-950 font-black text-xs bg-white/60 backdrop-blur-md border border-white px-4 py-2.5 rounded-full hover:bg-white/80 transition-all cursor-pointer shadow-md"
          >
            ⬅️ Exit Quest
          </button>
          
          <div className="flex items-center gap-1.5 bg-indigo-100/70 py-1.5 px-4 rounded-full border border-indigo-250/30">
            <span className="text-sm">🌟</span>
            <span className="text-[10px] font-display font-black text-indigo-950 uppercase tracking-widest">
              Gita Quest {quest.id} - Age: {ageGroup.toUpperCase()}
            </span>
          </div>

          {/* Narration voice options (Read Myself/Listen) */}
          <button
            onClick={() => {
              if (!isMuted) {
                stopSpeaking();
              }
              setIsMuted(!isMuted);
              playSound.tap();
            }}
            className={`font-black text-xs px-4 py-2 rounded-full border transition-all shadow-md cursor-pointer flex items-center gap-1 ${
              isMuted 
                ? 'bg-rose-50/70 border-rose-200 text-rose-800' 
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}
          >
            {isMuted ? '🔇 Read Myself' : '🔊 Narration ON'}
          </button>
        </div>

        {/* Level Path progress notches */}
        <div className="bg-white/50 backdrop-blur-md border border-white rounded-[24px] p-3 flex justify-between items-center gap-2 shadow-xl">
          {stepsConfig.map((step) => {
            const active = currentStep === step.num;
            const done = currentStep > step.num;
            return (
              <div key={step.num} className="flex-grow flex flex-col items-center gap-1">
                <div 
                  className={`w-full h-2 rounded-full transition-all duration-300 ${
                    done 
                      ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' 
                      : active 
                        ? 'bg-indigo-600 scale-y-125' 
                        : 'bg-indigo-100'
                  }`}
                />
                <span className={`text-[9px] md:text-[10px] font-black tracking-wider ${
                  active ? 'text-indigo-950' : 'text-indigo-400/90'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* 2. Interactive Step Window with Transitions */}
      <main className="max-w-2xl mx-auto w-full flex-grow flex flex-col justify-center items-center z-10 my-3">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: STORY CARD WITH IN-CHARACTER VISUAL SPEAKER */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 w-full relative z-10"
            >
              <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                Story Scene 📖
              </div>

              {/* ⚔️ Immersive Kurukshetra Battlefield Stage for Kids! */}
              <div className="w-full bg-gradient-to-b from-sky-50 to-[#FEF08A]/80 rounded-[28px] border-2 border-amber-205/60 p-3.5 mb-6 overflow-hidden flex flex-col justify-between relative shadow-inner">
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-amber-200/80 to-transparent" />
                <div className="absolute top-2 right-4 text-3xl opacity-15 select-none pointer-events-none">🛕☸️🌤️</div>
                <div className="absolute bottom-1 left-2 text-xl opacity-10 select-none pointer-events-none">🏹🔱</div>

                <div className="flex items-center justify-between mb-2 z-10">
                  <span className="text-[9px] font-black uppercase text-amber-900 tracking-widest bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
                    ⚔️ Kurukshetra Battlefield Stage
                  </span>
                  <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">
                    Tap characters to hear voices!
                  </span>
                </div>

                <div id="story-stage" className="grid grid-cols-2 sm:flex sm:justify-center items-end gap-2 sm:gap-3 z-10 w-full flex-grow pt-2 select-none">
                  {getQuestCharacters(quest.id).map((charId) => {
                    const isSpeakerActive = activeSpeaker === charId;
                    return (
                      <motion.button
                        type="button"
                        key={`stage-${charId}`}
                        onClick={() => {
                          playSound.tap();
                          setActiveSpeaker(charId);
                          const speakRole = charId === 'krishna' ? 'krishna' : charId === 'arjuna' ? 'arjuna' : 'narrator';
                          speakText(getCharacterDialogue(charId), speakRole);
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.92 }}
                        className={`min-w-0 flex flex-col items-center cursor-pointer transition-all duration-300 p-1.5 rounded-2xl ${
                          isSpeakerActive 
                            ? 'bg-amber-100/70 border-2 border-amber-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]' 
                            : 'bg-white/40 hover:bg-white/80 border-2 border-transparent'
                        }`}
                      >
                        <CharacterPortrait id={charId} size="xs" animated={isSpeakerActive} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <h2 className="font-display font-black text-xl md:text-2xl text-indigo-950 mb-3 mt-1 leading-tight text-left">
                {quest.storyStep.title}
              </h2>

              <p className="font-sans text-xs md:text-sm text-indigo-900/80 leading-relaxed font-bold mb-4">
                {quest.storyStep.text}
              </p>

              {/* Narrator Advisor Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100/60 p-4 rounded-3xl flex items-start gap-4 shadow-sm relative overflow-hidden mb-6">
                <div className="text-4xl filter drop-shadow animate-pulse">☸️</div>
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-700 tracking-wider mb-0.5 block">
                    Krishna’s Golden Chariot Advice
                  </span>
                  <p className="font-sans text-xs italic text-indigo-950 font-extrabold leading-relaxed">
                    "{quest.storyStep.narratorQuote}"
                  </p>
                </div>
              </div>

              {/* 👥 Meet the Characters Kids interactive panel */}
              <div className="border-t border-indigo-150 pt-5 mt-4">
                <span className="text-[10px] uppercase font-black text-indigo-500 tracking-widest block mb-3 text-center">
                  👥 Voice Dialogues Recorder Room
                </span>

                {/* 💬 Dynamic Speech Bubble display */}
                <AnimatePresence mode="wait">
                  {activeSpeaker && (
                    <motion.div
                      key={activeSpeaker}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mb-5 bg-indigo-50/80 border-2 border-indigo-100 rounded-3xl p-4 flex items-center gap-4 relative shadow-sm"
                    >
                      <div className="shrink-0 bg-white p-1 rounded-2xl border border-indigo-100/60 shadow-xs">
                        <CharacterPortrait id={activeSpeaker} size="sm" animated={true} />
                      </div>
                      
                      <div className="text-left flex-grow z-10">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 block mb-0.5">
                          Speaking Now 💬
                        </span>
                        <p className="font-sans text-xs md:text-sm font-black text-indigo-950 leading-relaxed">
                          "{getCharacterDialogue(activeSpeaker)}"
                        </p>
                        
                        {/* Audio track visuals playing */}
                        <div className="flex gap-0.5 mt-1.5 items-center">
                          <span className="text-[8px] font-bold text-indigo-400 mr-1 uppercase">Playing Audio</span>
                          <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                          <span className="w-1 h-3.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                          <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap justify-center gap-3">
                  {getQuestCharacters(quest.id).map((charId) => {
                    const isSelected = activeSpeaker === charId;
                    return (
                      <motion.button
                        type="button"
                        key={charId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          playSound.tap();
                          setActiveSpeaker(charId);
                          const speakRole = charId === 'krishna' ? 'krishna' : charId === 'arjuna' ? 'arjuna' : 'narrator';
                          speakText(getCharacterDialogue(charId), speakRole);
                        }}
                        className={`cursor-pointer p-2 rounded-2xl border transition-all flex flex-col items-center shadow-xs w-[8.5rem] text-center ${
                          isSelected 
                            ? 'bg-amber-100/60 border-amber-400 ring-2 ring-amber-200' 
                            : 'bg-[#fcfaf5] border-indigo-50/70 hover:border-indigo-200'
                        }`}
                      >
                        <CharacterPortrait id={charId} size="xs" animated={true} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: WISDOM TEACHING WITH SANSKRIT RECITATION, CHANT LAB, AND ACCORDION WORD BREAKINGS */}
          {currentStep === 2 && (
            <motion.div
              id="wisdom-card"
              key="step-2"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 w-full relative z-10 flex flex-col items-center"
            >
              <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                Wisdom Scroll 🍃
              </div>

              <h2 className="font-display font-black text-2xl text-indigo-950 mb-3 mt-2 text-center">
                {quest.teachingStep.title}
              </h2>

              {!uncoveredWisdom ? (
                /* Infinite pulse interactive leaf */
                <motion.button
                  onClick={() => { playSound.unlock(); setUncoveredWisdom(true); }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-44 h-44 rounded-full bg-white flex flex-col items-center justify-center border border-emerald-100 shadow-2xl p-4 cursor-pointer relative"
                >
                  <div className="absolute inset-0 rounded-full bg-emerald-100/30 blur-xl animate-pulse" />
                  <span className="text-5xl animate-bounce z-10">🍂</span>
                  <span className="font-display font-black text-xs text-indigo-950 mt-2 text-center leading-tight z-10">
                    Tap to Unveil Sacred Shloka Scroll!
                  </span>
                </motion.button>
              ) : (
                /* Unveiled scroll with detailed Shloka Practice panel */
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full text-indigo-950 flex flex-col gap-4"
                >
                  {/* Miniature Krishna-Arjuna Guidance Stage */}
                  <div className="flex justify-center items-center gap-6 bg-gradient-to-r from-amber-50/70 to-blue-50/70 py-2.5 px-4 rounded-2xl border border-amber-205/60 shadow-xs select-none">
                    <div 
                      onClick={() => {
                        playSound.tap();
                        speakText("I am reciting this sacred shloka. Focus your mind on its vibration!", "krishna");
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      <CharacterPortrait id="krishna" size="xs" animated={true} showName={false} />
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] font-black uppercase tracking-widest text-amber-700">Recites Shloka ☸️</span>
                        <span className="font-sans font-black text-[10px] text-indigo-950">Sri Krishna</span>
                      </div>
                    </div>
                    
                    <div className="text-sm font-black text-amber-500/80 animate-pulse">🏹 🛠️ 🪶</div>
                    
                    <div 
                      onClick={() => {
                        playSound.tap();
                        speakText("Teach me this wisdom, Sri Krishna. I am listening with a silent heart!", "arjuna");
                      }}
                      className="flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                    >
                      <div className="flex flex-col text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#0284C7]">Chants Along 🏹</span>
                        <span className="font-sans font-black text-[10px] text-indigo-950">Arjuna</span>
                      </div>
                      <CharacterPortrait id="arjuna" size="xs" animated={true} showName={false} />
                    </div>
                  </div>

                  {/* Sanskrit original text panel */}
                  <div className="bg-[#fcfaf5] border-2 border-amber-200/50 rounded-2xl p-4 text-center shadow-md relative">
                    <div className="absolute top-2 right-3 text-xs">📜</div>
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest block mb-1">Gita Shloka</span>
                    <p className="font-sans text-base md:text-lg font-black text-amber-900 leading-relaxed whitespace-pre-line text-center">
                      {quest.shlokaSanskrit}
                    </p>
                    <p className="font-mono text-xs italic text-indigo-500 font-bold mt-2.5 leading-snug">
                      {quest.shlokaTransliteration}
                    </p>
                  </div>

                  {/* CHANT-ALONG INTERACTIVE LAB */}
                  <div className="bg-gradient-to-r from-[#eef2ff] to-[#f5f3ff] border border-indigo-100 rounded-2xl p-4 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">🎤 Chant-Along Practice Lab</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-black">
                        COMPANION ACTIVE
                      </span>
                    </div>

                    {!chantActive ? (
                      <button
                        onClick={() => { playSound.tap(); setChantActive(true); }}
                        className="w-full bg-indigo-600 text-white font-black text-xs py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        ⚡ Let's Practice Chanting line-by-line!
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {isChantFinished ? (
                          <div className="text-center py-2">
                            <span className="text-3xl block">🏆</span>
                            <p className="font-display font-black text-xs text-indigo-950 mt-1">Wonderful chanting! You practised every line.</p>
                          </div>
                        ) : (
                          <>
                            <div className="bg-white/90 p-3 rounded-xl border border-indigo-50 text-center relative">
                              <span className="absolute -top-2 left-2 text-[8px] font-black bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                                Line {chantIndex + 1} of {quest.chantSteps?.length || 4}
                              </span>
                              <p className="font-mono text-xs text-indigo-950 font-black tracking-wide mt-1">
                                "{quest.chantSteps?.[chantIndex]}"
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {/* Hear standard synth recite the line */}
                              <button
                                onClick={handleHearChantLine}
                                className="bg-white border border-indigo-150 p-2.5 rounded-xl text-xs font-black text-indigo-950 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                              >
                                🔊 Listen Line
                              </button>

                              {/* The child chants aloud; nothing is recorded */}
                              <button
                                onClick={handleChantRepeat}
                                disabled={isChantedRepeating}
                                className={`p-2.5 rounded-xl text-xs font-black text-white cursor-pointer flex items-center justify-center gap-1 shadow-md transition-all ${
                                  isChantedRepeating
                                    ? 'bg-amber-500'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                              >
                                {isChantedRepeating ? '🗣️ Say it out loud!' : '🗣️ My turn to chant'}
                              </button>
                            </div>

                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Word Breakings table for detail */}
                  {quest.shlokaWordMeanings && (
                    <div className="bg-amber-100/30 border border-amber-205 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-2">🔤 Sanskrit Word Meanings</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-[10px] font-extrabold">
                        {quest.shlokaWordMeanings.map((wm, i) => (
                          <div key={i} className="bg-white/80 border border-amber-100 px-2 py-1.5 rounded-lg flex flex-col">
                            <span className="text-indigo-950 font-bold">{wm.word}</span>
                            <span className="text-amber-800 text-[9px] mt-0.5 font-bold">→ {wm.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kids Adaptation translation block */}
                  <div className="bg-white border-l-4 border-indigo-500 rounded-r-2xl p-4 shadow-sm">
                    <span className="text-[10px] uppercase font-black text-indigo-500 tracking-widest block mb-1">Today's Adapted Lesson</span>
                    <p className="font-display font-extrabold text-sm text-indigo-900 leading-snug">
                      {ageGroup === 'explorer' 
                        ? (quest.teachingStep.explorerWisdom || quest.teachingStep.kidWisdom)
                        : ageGroup === 'guide'
                          ? (quest.teachingStep.guideWisdom || quest.teachingStep.kidWisdom)
                          : quest.teachingStep.kidWisdom
                      }
                    </p>
                    <p className="font-sans text-[11px] text-indigo-400/80 italic mt-2.5">
                      📖 Simple Analogy: {quest.shlokaKidVersion}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: REAL LIFE CHILD EXAMPLE */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 w-full relative z-10"
            >
              <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                School Arena 🏫
              </div>

              <h2 className="font-display font-black text-2xl text-indigo-950 mb-4 mt-2">
                {quest.exampleStep.title}'s Scenario
              </h2>

              <p className="font-sans text-sm md:text-base text-indigo-900/80 leading-relaxed font-black mb-6">
                {quest.exampleStep.scenario}
              </p>

              {/* Graphic container simulating actual classroom or situation */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-5 flex items-center gap-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-white shadow-md">
                  <span className="text-4xl">🎒</span>
                </div>
                <div>
                  <h4 className="font-display font-black text-xs text-indigo-950 uppercase tracking-widest mb-0.5">Practical Arena</h4>
                  <p className="font-sans text-xs text-indigo-900/70 font-semibold leading-relaxed">
                    Our friends in Wisdom Valley face storms just like Arjuna did. Let's see how they choose their focus.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: MINI CHALLENGE WITH COMPANION VOICE FEEDBACKS */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 w-full relative z-10"
            >
              <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                Wisdom Challenge 🎯
              </div>

              <h2 className="font-display font-black text-lg md:text-xl text-indigo-950 mb-4 mt-2 text-center leading-snug">
                {quest.challengeStep.question}
              </h2>

              {/* Answer options cards */}
              <div className="flex flex-col gap-3 my-4">
                {quest.challengeStep.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                      className={`w-full text-left p-4 rounded-2xl border font-bold text-xs sm:text-sm shadow-md transition-all outline-none cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100'
                            : 'border-rose-300 bg-rose-50 text-rose-950'
                          : 'border-indigo-100 bg-white hover:bg-indigo-50/50 text-indigo-950'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span className="shrink-0 text-base">
                            {opt.isCorrect ? '✅' : '❌'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Real-time speech bubble feedback spoken in-character */}
              <AnimatePresence mode="wait">
                {showFeedback && selectedOptionId && (
                  <motion.div
                    key={selectedOptionId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-5 rounded-2xl border text-xs font-semibold leading-relaxed ${
                      isCorrectSelected 
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                        : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
                    } shadow-md`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0 filter drop-shadow">{companion.emoji}</span>
                      <div>
                        <span className="uppercase tracking-wider font-black text-[10px] block mb-1 text-indigo-500">
                          {companion.name}'s Friendly Guidelines
                        </span>
                        <span>
                          {quest.challengeStep.options.find(o => o.id === selectedOptionId)?.feedback}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 5: REWARD REVEAL */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 w-full relative z-10 flex flex-col items-center text-center"
            >
              <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-display font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                Quest Reward 💎
              </div>

              <motion.div
                animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 0.95, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 my-4 flex items-center justify-center bg-white rounded-full border border-indigo-50 shadow-2xl relative"
              >
                <div className="absolute inset-0 rounded-full bg-indigo-100/30 blur-2xl animate-pulse" />
                <span className="text-5xl filter drop-shadow z-10">💎</span>
              </motion.div>

              <h2 className="font-display font-black text-indigo-950 text-2xl md:text-3xl leading-none mt-2">
                {isReplay ? 'Quest Complete Again!' : `Unwrapped ${quest.rewardCrystal}!`}
              </h2>
              
              <p className="font-sans text-xs text-indigo-950/70 font-bold max-w-sm mt-3 leading-relaxed">
                {isReplay
                  ? `You already restored the ${quest.rewardCrystal}. Practising again keeps its wisdom bright!`
                  : 'A pristine nugget of Krishna-Arjuna wisdom, glowing with divine values! It will join your collection in the Knowledge River!'}
              </p>

              {/* Reward accessory item details */}
              <div className="my-4 bg-indigo-50/50 border border-indigo-100 rounded-[20px] p-4 flex items-center gap-4 w-full max-w-sm shadow-sm">
                <span className="text-3xl">🎁</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider block">{isReplay ? 'Already in Your Sanctuary' : 'Camp Ground Upgrade'}</span>
                  <h4 className="font-display font-black text-indigo-950 text-sm">{quest.rewardItem}</h4>
                </div>
              </div>

              <motion.button
                onClick={handleFinalClaim}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display font-black text-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 px-8 py-4 rounded-[24px] shadow-[0_10px_20px_rgba(79,70,229,0.3)] cursor-pointer flex items-center gap-1.5 touch-target"
              >
                Grow Wisdom Tree 🚀
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. Navigation Controls Row */}
      <footer className="max-w-xl mx-auto w-full z-10 flex justify-between gap-4 mt-1">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`px-5 py-3 rounded-full border font-bold text-xs cursor-pointer transition-all ${
            currentStep === 1 
              ? 'bg-indigo-50/40 border-indigo-100/30 text-indigo-300 cursor-not-allowed opacity-50' 
              : 'bg-white border-indigo-100 text-indigo-950 hover:bg-indigo-50 shadow-sm'
          }`}
        >
          ⬅️ Previous
        </button>

        {/* Blocking validation gates */}
        {currentStep === 2 && !uncoveredWisdom ? (
          <div className="bg-indigo-100 text-indigo-700 border border-indigo-200/50 text-[10px] font-black py-2.5 px-4 rounded-full uppercase tracking-wider flex items-center shadow-sm animate-pulse">
            🔒 Tap Leaf To Open!
          </div>
        ) : currentStep === 4 && !isCorrectSelected ? (
          <div className="bg-pink-100 text-pink-700 border border-pink-205 text-[10px] font-black py-2.5 px-4 rounded-full uppercase tracking-wider flex items-center shadow-sm">
            🔒 Solve Challenge first!
          </div>
        ) : currentStep < 5 ? (
          <button
            onClick={handleNextStep}
            className="px-6 py-3 rounded-full font-display font-black text-xs text-white bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:brightness-110 cursor-pointer flex items-center gap-1.5 transition-all"
          >
            Got it! Next Step ➜
          </button>
        ) : (
          <div className="w-16" />
        )}
      </footer>
    </div>
  );
}
