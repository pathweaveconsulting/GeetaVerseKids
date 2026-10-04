import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { setActiveCompanionId, stopSpeaking } from './utils/audio';
import { UserState, GameScreen, AvatarId, CompanionId } from './types';
import { QUESTS } from './quests';
import {
  AgeGroup,
  QuestStep,
  Session,
  clearSavedData,
  hasProfile,
  initialGameState,
  loadGameState,
  loadSession,
  resolveSession,
  saveGameState as persistGameState,
  saveSession
} from './session';

// Import Screens
import LandingPage from './screens/LandingPage';
import AvatarCreation from './screens/AvatarCreation';
import HomeScreen from './screens/HomeScreen';
import WorldMap from './screens/WorldMap';
import QuestPage from './screens/QuestPage';
import RewardPage from './screens/RewardPage';
import WisdomSanctuary from './screens/WisdomSanctuary';
import SoundNote from './components/SoundNote';

// Each browser history entry carries the session it shows, so Back/Forward
// (and the phone back gesture) move between app screens. depth counts the
// app's own entries behind the current one.
interface HistoryState {
  geetaverse: true;
  session: Session;
  depth: number;
}

const currentHistoryState = (): HistoryState | null => {
  const st = window.history.state as HistoryState | null;
  return st && st.geetaverse ? st : null;
};

export default function App() {
  // Restore the saved game and the child's place synchronously, so a refresh
  // never flashes the landing page first
  const [boot] = useState(() => {
    const state = loadGameState();
    return { state, session: loadSession(state) };
  });
  const [gameState, setGameState] = useState<UserState>(boot.state);
  const [session, setSession] = useState<Session>(boot.session);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const currentScreen = session.screen;
  const activeQuest = session.questId ? QUESTS.find((q) => q.id === session.questId) ?? null : null;

  useEffect(() => {
    if (gameState.companion) setActiveCompanionId(gameState.companion);
  }, [gameState.companion]);

  // Keep localStorage and the current history entry in step with the session
  useEffect(() => {
    saveSession(session);
    window.history.replaceState({ geetaverse: true, session, depth: currentHistoryState()?.depth ?? 0 }, '');
  }, [session]);

  // Browser Back/Forward
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const st = event.state as HistoryState | null;
      if (!st?.geetaverse) return;
      stopSpeaking();
      let next = resolveSession(st.session, gameStateRef.current);
      // Never replay a reward celebration from history
      if (next.screen === 'reward') next = { screen: next.questOrigin ?? 'map' };
      setSession(next);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: Session, { replace = false } = {}) => {
    const depth = currentHistoryState()?.depth ?? 0;
    const entry: HistoryState = { geetaverse: true, session: next, depth: replace ? depth : depth + 1 };
    if (replace) window.history.replaceState(entry, '');
    else window.history.pushState(entry, '');
    setSession(next);
  };

  // Go back one app screen if there is one in history, otherwise replace the
  // current screen with the fallback
  const goBack = (fallback: GameScreen) => {
    if ((currentHistoryState()?.depth ?? 0) > 0) window.history.back();
    else navigate({ screen: fallback }, { replace: true });
  };

  const saveGameState = (updatedState: UserState) => {
    setGameState(updatedState);
    persistGameState(updatedState);
  };

  const handleNavigate = (target: GameScreen) => navigate({ screen: target });

  const handleStartAdventure = () => {
    navigate({ screen: hasProfile(gameState) ? 'home' : 'avatar' });
  };

  const handleSaveProfile = (name: string, avatar: AvatarId, companion: CompanionId, ageGroup: AgeGroup) => {
    saveGameState({
      ...gameState,
      avatar,
      avatarName: name,
      companion,
      ageGroup,
      lastPlayed: new Date().toISOString()
    });
    // Replace the profile form, so Back from Home goes to the landing page
    navigate({ screen: 'home' }, { replace: true });
  };

  const handleStartQuest = (questId: number) => {
    if (!QUESTS.some((q) => q.id === questId) || !gameState.companion) return;
    navigate({
      screen: 'quest',
      questId,
      questStep: 1,
      wisdomUncovered: false,
      questOrigin: currentScreen === 'map' ? 'map' : 'home'
    });
  };

  const handleQuestProgress = (questStep: QuestStep, wisdomUncovered: boolean) => {
    setSession((s) =>
      s.screen === 'quest' && (s.questStep !== questStep || s.wisdomUncovered !== wisdomUncovered)
        ? { ...s, questStep, wisdomUncovered }
        : s
    );
  };

  // Leaving a quest or its Reward screen returns to where the quest started
  const returnToQuestOrigin = () => goBack(session.questOrigin ?? 'home');

  const handleCompleteQuest = (questId: number) => {
    if (!QUESTS.some((q) => q.id === questId)) return;

    const isReplay = gameState.completedQuests.includes(questId);
    const newCompleted = isReplay
      ? gameState.completedQuests
      : [...gameState.completedQuests, questId].sort((a, b) => a - b);

    // 10% health per quest completed (10 quests)
    const prevH = Math.min(gameState.completedQuests.length * 10, 100);
    const nextH = Math.min(newCompleted.length * 10, 100);

    saveGameState({
      ...gameState,
      completedQuests: newCompleted,
      xp: isReplay ? gameState.xp : gameState.xp + 50,
      treeHealth: nextH,
      lastPlayed: new Date().toISOString()
    });

    // The Reward screen replaces the quest in history: Back from it returns
    // to where the quest started rather than into the finished quest
    navigate(
      {
        screen: 'reward',
        questId,
        questOrigin: session.questOrigin,
        reward: {
          questId,
          previousHealth: prevH,
          newHealth: nextH,
          previouslyCompletedQuests: gameState.completedQuests,
          isReplay
        }
      },
      { replace: true }
    );
  };

  const handleLeaveReward = (target: 'map' | 'sanctuary') => {
    if (target === session.questOrigin) returnToQuestOrigin();
    else navigate({ screen: target }, { replace: true });
  };

  const handleReset = () => {
    clearSavedData();
    setGameState(initialGameState());
    navigate({ screen: 'landing' });
  };

  return (
    // reducedMotion="user" turns off motion/react movement when the device asks for reduced motion
    <MotionConfig reducedMotion="user">
    <div className="bg-gradient-to-tr from-amber-50 to-orange-100 min-h-screen text-slate-800 antialiased font-sans flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">

      {/* Visual background atmospheric particles */}
      <div id="geetaverse-cosmic-glow" className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-300/10 to-transparent pointer-events-none -z-10" />

      <SoundNote />

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
              onBack={() => goBack('landing')}
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
              onBack={() => navigate({ screen: 'home' })}
              onStartQuest={handleStartQuest}
            />
          )}

          {currentScreen === 'quest' && activeQuest && gameState.companion && (
            <QuestPage
              quest={activeQuest}
              companionId={gameState.companion}
              ageGroup={gameState.ageGroup}
              initialStep={session.questStep ?? 1}
              initialWisdomUncovered={session.wisdomUncovered ?? false}
              isReplay={gameState.completedQuests.includes(activeQuest.id)}
              onProgress={handleQuestProgress}
              onComplete={handleCompleteQuest}
              onExit={returnToQuestOrigin}
            />
          )}

          {currentScreen === 'reward' && activeQuest && gameState.companion && session.reward && (
            <RewardPage
              quest={activeQuest}
              companionId={gameState.companion}
              previousHealth={session.reward.previousHealth}
              newHealth={session.reward.newHealth}
              previouslyCompletedQuests={session.reward.previouslyCompletedQuests}
              isReplay={session.reward.isReplay}
              onNext={() => handleLeaveReward('map')}
              onGoToSanctuary={() => handleLeaveReward('sanctuary')}
            />
          )}

          {currentScreen === 'sanctuary' && (
            <WisdomSanctuary
              state={gameState}
              onBack={() => navigate({ screen: 'home' })}
            />
          )}
        </motion.div>
      </AnimatePresence>

    </div>
    </MotionConfig>
  );
}
