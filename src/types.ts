export type GameScreen = 'landing' | 'avatar' | 'home' | 'map' | 'quest' | 'sanctuary' | 'reward';

export type CompanionId = 'gaja' | 'mayur' | 'veeru' | 'gauri';
export type AvatarId = 'boy' | 'girl';

export interface Companion {
  id: CompanionId;
  name: string;
  species: string;
  description: string;
  color: string;
  accentColor: string;
  emoji: string;
  quote: string;
}

export interface UserState {
  avatar: AvatarId | null;
  avatarName: string;
  companion: CompanionId | null;
  ageGroup?: 'explorer' | 'seeker' | 'guide'; // Selected group
  xp: number;
  completedQuests: number[]; // e.g. [1, 2]
  treeHealth: number; // 0 to 100
  lastPlayed: string;
}

export interface QuestStep {
  title: string;
  description: string;
  illustrationType: string;
  points?: string[];
}

export interface QuestChallenge {
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface Quest {
  id: number;
  title: string;
  shortDescription: string;
  rewardCrystal: string;
  rewardItem: string;
  themeColor: string;
  textColor: string;
  shadowColor: string;
  
  // Custom Shloka elements for parent depth and deep children education
  shlokaSanskrit?: string;
  shlokaTransliteration?: string;
  shlokaTranslation?: string;
  shlokaKidVersion?: string;
  shlokaWordMeanings?: { word: string; meaning: string }[];
  chantSteps?: string[];

  // Steps
  storyStep: {
    title: string;
    text: string;
    narratorQuote: string;
  };
  teachingStep: {
    title: string;
    originalConcept: string; // The deep Gita philosophy (simplified)
    kidWisdom: string; // The translated kid-friendly wisdom
    explorerWisdom?: string; // Shorter simple sentence for age 6-8
    guideWisdom?: string; // Richer philosophical context for age 12-13
  };
  exampleStep: {
    title: string;
    childName: string;
    scenario: string;
  };
  challengeStep: {
    title: string;
    question: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  };
}
