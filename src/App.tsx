import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound, setActiveCompanionId } from './utils/audio';
import { UserState, GameScreen, AvatarId, CompanionId, Quest } from './types';
import { QUESTS } from './quests';

// Import Screens
import LandingPage from './screens/LandingPage';
import AvatarCreation from './screens/AvatarCreation';
import HomeScreen from './screens/HomeScreen';
import WorldMap from './screens/WorldMap';
import QuestPage from './screens/QuestPage';
import RewardPage from './screens/RewardPage';
import WisdomSanctuary from './screens/WisdomSanctuary';

const LOCAL_STORAGE_KEY = 'geetaverse_kids_game_state_v1';

const initialGameState: UserState = {
  avatar: null,
  avatarName: '',
  companion: null,
  xp: 0,
  completedQuests: [],
  treeHealth: 0,
  lastPlayed: new Date().toISOString()
};

export default function App() {
  const [gameState, setGameState] = useState<UserState>(initialGameState);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('landing');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  
  // Transition variables for Reward screen
  const [previousHealth, setPreviousHealth] = useState(0);
  const [newHealthForReward, setNewHealthForReward] = useState(0);
  const [previouslyCompletedQuests, setPreviouslyCompletedQuests] = useState<number[]>([]);

  // 1. Initial State Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // Older saves also stored an unlockedDecorations list; decorations are
        // now derived from completedQuests, so drop it
        const { unlockedDecorations: _legacy, ...parsed } = JSON.parse(stored) as UserState & { unlockedDecorations?: unknown };
        // Verify values are sane
        if (parsed.avatar && parsed.companion && parsed.avatarName) {
          setGameState(parsed);
          setActiveCompanionId(parsed.companion);
        }
      }
    } catch (e) {
      console.error("Local storage lookup failed", e);
    }
  }, []);

  // 2. State persistence helper
  const saveGameState = (updatedState: UserState) => {
    setGameState(updatedState);
    if (updatedState.companion) {
      setActiveCompanionId(updatedState.companion);
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedState));
    } catch (e) {
      console.error("Failed to write game state to local storage", e);
    }
  };

  // 3. Navigation routing action
  const handleNavigate = (target: GameScreen) => {
    setCurrentScreen(target);
  };

  const handleStartAdventure = () => {
    // If user profile is already created, go to Home Screen, else go to Avatar Creation
    if (gameState.avatar && gameState.companion && gameState.avatarName) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('avatar');
    }
  };

  // 4. Save Avatar profile onboarding
  const handleSaveProfile = (name: string, avatar: AvatarId, companion: CompanionId, ageGroup: 'explorer' | 'seeker' | 'guide') => {
    const updated: UserState = {
      ...gameState,
      avatar,
      avatarName: name,
      companion,
      ageGroup,
      lastPlayed: new Date().toISOString()
    };
    saveGameState(updated);
    setCurrentScreen('home');
  };

  // 5. Trigger specific quest starting
  const handleStartQuest = (questId: number) => {
    const quest = QUESTS.find((q) => q.id === questId);
    if (quest && gameState.companion) {
      setActiveQuest(quest);
      setCurrentScreen('quest');
    }
  };

  // 6. Complete quest - Calculate XP, crystals, and item rewards
  const handleCompleteQuest = (questId: number) => {
    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return;

    const isAlreadyCompleted = gameState.completedQuests.includes(questId);
    const newCompleted = isAlreadyCompleted 
      ? gameState.completedQuests 
      : [...gameState.completedQuests, questId].sort((a, b) => a - b);
    
    // Compute progress: 10% health per quest completed (based on 10 quests)
    const prevH = Math.min(gameState.completedQuests.length * 10, 100);
    const nextH = Math.min(newCompleted.length * 10, 100);

    const updated: UserState = {
      ...gameState,
      completedQuests: newCompleted,
      xp: isAlreadyCompleted ? gameState.xp : gameState.xp + 50,
      treeHealth: nextH,
      lastPlayed: new Date().toISOString()
    };

    // Store state details to pass into the Reward Screen animation
    setPreviousHealth(prevH);
    setNewHealthForReward(nextH);
    setPreviouslyCompletedQuests(gameState.completedQuests);
    
    // Persist details
    saveGameState(updated);

    // Swap to the cinematic reward screen
    setCurrentScreen('reward');
  };

  // 7. Reset all progress back to pristine state
  const handleReset = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
    setGameState(initialGameState);
    setCurrentScreen('landing');
  };

  return (
    <div className="bg-gradient-to-tr from-amber-50 to-orange-100 min-h-screen text-slate-800 antialiased font-sans flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
      
      {/* Visual background atmospheric particles */}
      <div id="geetaverse-cosmic-glow" className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-300/10 to-transparent pointer-events-none -z-10" />

      {/* Screen swap router wrapper with full transition layout animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-grow flex flex-col"
        >
          {currentScreen === 'landing' && (
            <LandingPage onStart={handleStartAdventure} />
          )}

          {currentScreen === 'avatar' && (
            <AvatarCreation 
              onSave={handleSaveProfile} 
              onBack={() => setCurrentScreen('landing')} 
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              state={gameState}
              onNavigate={handleNavigate}
              onReset={handleReset}
              onStartQuest={handleStartQuest}
              onUpdateAgeGroup={(newAge) => saveGameState({ ...gameState, ageGroup: newAge })}
            />
          )}

          {currentScreen === 'map' && (
            <WorldMap
              state={gameState}
              onBack={() => setCurrentScreen('home')}
              onStartQuest={handleStartQuest}
            />
          )}

          {currentScreen === 'quest' && activeQuest && gameState.companion && (
            <QuestPage
              quest={activeQuest}
              companionId={gameState.companion}
              ageGroup={gameState.ageGroup}
              onComplete={handleCompleteQuest}
              onExit={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'reward' && activeQuest && gameState.companion && (
            <RewardPage
              quest={activeQuest}
              companionId={gameState.companion}
              previousHealth={previousHealth}
              newHealth={newHealthForReward}
              previouslyCompletedQuests={previouslyCompletedQuests}
              onNext={() => setCurrentScreen('map')}
              onGoToSanctuary={() => setCurrentScreen('sanctuary')}
            />
          )}

          {currentScreen === 'sanctuary' && (
            <WisdomSanctuary
              state={gameState}
              onBack={() => setCurrentScreen('home')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Frame restrictions guard labels */}
      <div id="workspace-credits-tag" className="bg-amber-100/50 border-t border-amber-200/50 text-[9px] text-center text-amber-800 py-1 font-sans font-bold">
        🌿 Offline-First Sandbox | Built Beautifully with Custom Synthesized Audio & Framer Vector graphics 🌿
      </div>

    </div>
  );
}
