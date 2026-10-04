import { AvatarId, CompanionId, GameScreen, UserState } from './types';
import { QUESTS, COMPANIONS } from './quests';

// Loading and saving of everything kept in localStorage. Saved data can be
// missing, from an older version, or corrupted, so every read is validated
// and falls back to safe defaults instead of throwing.

export const GAME_STATE_KEY = 'geetaverse_kids_game_state_v1';
export const SESSION_KEY = 'geetaverse_kids_session_v1';

export type AgeGroup = 'explorer' | 'seeker' | 'guide';
export type QuestStep = 1 | 2 | 3 | 4 | 5;

export const initialGameState = (): UserState => ({
  avatar: null,
  avatarName: '',
  companion: null,
  xp: 0,
  completedQuests: [],
  treeHealth: 0,
  lastPlayed: new Date().toISOString()
});

// Where the child is: the screen, plus the quest in progress or the reward
// being shown
export interface Session {
  screen: GameScreen;
  questId?: number;
  questStep?: QuestStep;
  wisdomUncovered?: boolean;
  questOrigin?: 'home' | 'map';
  reward?: RewardInfo;
}

export interface RewardInfo {
  questId: number;
  previousHealth: number;
  newHealth: number;
  previouslyCompletedQuests: number[];
  isReplay: boolean;
}

const SCREENS: GameScreen[] = ['landing', 'avatar', 'home', 'map', 'quest', 'sanctuary', 'reward'];
const QUEST_IDS = QUESTS.map((q) => q.id);

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isQuestId = (v: unknown): v is number => typeof v === 'number' && QUEST_IDS.includes(v);
const questIdList = (v: unknown): number[] =>
  Array.isArray(v) ? [...new Set(v.filter(isQuestId))].sort((a, b) => a - b) : [];

const readJson = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (e.g. private browsing): play on without saving
  }
};

export const hasProfile = (state: UserState) => Boolean(state.avatar && state.companion && state.avatarName);

export function loadGameState(): UserState {
  const raw = readJson(GAME_STATE_KEY);
  if (!isObject(raw)) return initialGameState();

  const avatar: AvatarId | null = raw.avatar === 'boy' || raw.avatar === 'girl' ? raw.avatar : null;
  const companion = typeof raw.companion === 'string' && raw.companion in COMPANIONS ? (raw.companion as CompanionId) : null;
  const avatarName = typeof raw.avatarName === 'string' ? raw.avatarName.trim().slice(0, 16) : '';
  if (!avatar || !companion || !avatarName) return initialGameState();

  const completedQuests = questIdList(raw.completedQuests);
  const ageGroup = raw.ageGroup === 'explorer' || raw.ageGroup === 'seeker' || raw.ageGroup === 'guide' ? raw.ageGroup : undefined;
  const xp = typeof raw.xp === 'number' && Number.isFinite(raw.xp) && raw.xp >= 0 ? Math.floor(raw.xp) : completedQuests.length * 50;
  return {
    avatar,
    avatarName,
    companion,
    ageGroup,
    xp,
    completedQuests,
    treeHealth: Math.min(completedQuests.length * 10, 100),
    lastPlayed: typeof raw.lastPlayed === 'string' ? raw.lastPlayed : new Date().toISOString()
  };
}

export const saveGameState = (state: UserState) => writeJson(GAME_STATE_KEY, state);

export function clearSavedData() {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear
  }
}

// A quest can be played once the one before it is done (replays included)
export const isQuestUnlocked = (questId: number, completed: number[]) =>
  questId === QUEST_IDS[0] || completed.includes(questId) || completed.includes(questId - 1);

function parseReward(v: unknown): RewardInfo | undefined {
  if (!isObject(v) || !isQuestId(v.questId)) return undefined;
  const health = (h: unknown) => (typeof h === 'number' && h >= 0 && h <= 100 ? h : 0);
  return {
    questId: v.questId,
    previousHealth: health(v.previousHealth),
    newHealth: health(v.newHealth),
    previouslyCompletedQuests: questIdList(v.previouslyCompletedQuests),
    isReplay: v.isReplay === true
  };
}

// Turn a requested screen into one that is valid for this game state.
// Screens that need data the child doesn't have fall back to Home or Landing.
export function resolveSession(requested: unknown, state: UserState): Session {
  const s = isObject(requested) ? requested : {};
  const screen = SCREENS.includes(s.screen as GameScreen) ? (s.screen as GameScreen) : 'landing';

  if (!hasProfile(state)) {
    return { screen: screen === 'avatar' ? 'avatar' : 'landing' };
  }
  switch (screen) {
    case 'landing':
    case 'home':
    case 'map':
    case 'sanctuary':
      return { screen };
    case 'avatar':
      return { screen: 'home' };
    case 'quest': {
      if (!isQuestId(s.questId) || !isQuestUnlocked(s.questId, state.completedQuests)) return { screen: 'home' };
      const step = typeof s.questStep === 'number' && [1, 2, 3, 4, 5].includes(s.questStep) ? (s.questStep as QuestStep) : 1;
      return {
        screen,
        questId: s.questId,
        questStep: step,
        wisdomUncovered: s.wisdomUncovered === true || step > 2,
        questOrigin: s.questOrigin === 'map' ? 'map' : 'home'
      };
    }
    case 'reward': {
      const reward = parseReward(s.reward);
      // The quest is saved as complete before the Reward screen opens
      if (!reward || !state.completedQuests.includes(reward.questId)) return { screen: 'home' };
      return { screen, questId: reward.questId, reward, questOrigin: s.questOrigin === 'map' ? 'map' : 'home' };
    }
  }
}

export const loadSession = (state: UserState): Session => resolveSession(readJson(SESSION_KEY), state);

export const saveSession = (session: Session) => writeJson(SESSION_KEY, session);
