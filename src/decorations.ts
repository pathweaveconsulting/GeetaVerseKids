import { QUESTS } from './quests';

// Single source of truth for Sanctuary decorations: one per quest, named
// after the quest's rewardItem. A decoration is unlocked exactly when its
// quest is in UserState.completedQuests, so nothing about decorations is
// stored separately.

// Which SVG artwork WisdomTree draws for a decoration
export type DecorationArt =
  | 'lamp'
  | 'feather'
  | 'lotus'
  | 'mat'
  | 'bookshelf'
  | 'bench'
  | 'leaf'
  | 'lantern'
  | 'fountain'
  | 'sapling';

export interface Decoration {
  questId: number;
  name: string; // quest.rewardItem
  emoji: string;
  meaning: string;
  philosophicValue: string; // quest.teachingStep.originalConcept
  sourceQuest: string;
  art: DecorationArt;
}

const DECORATION_EXTRAS: Record<number, Pick<Decoration, 'emoji' | 'meaning' | 'art'>> = {
  1: {
    emoji: '🪔',
    meaning: "Lights your path when you feel nervous. Admitting that you have butterflies is the first spark of true courage!",
    art: 'lamp'
  },
  2: {
    emoji: '🎐',
    meaning: "Rings out like the conch shells of Kurukshetra. A happy sound can wake up the brave energy sleeping inside you!",
    art: 'feather'
  },
  3: {
    emoji: '🌸',
    meaning: "A calm, clear pond for looking honestly at a problem. Stand in the middle and see what is really happening.",
    art: 'lotus'
  },
  4: {
    emoji: '🧘',
    meaning: "A seat for big feelings about the people we love. Real love means wanting what is right for everyone.",
    art: 'mat'
  },
  5: {
    emoji: '🪨',
    meaning: "Each pebble is one slow breath. When your body feels shaky and wiggly, step stone by stone back to calm.",
    art: 'bookshelf'
  },
  6: {
    emoji: '🪑',
    meaning: "A place to pause and ask: am I making an excuse to run away? Noticing is the first step to facing the storm.",
    art: 'bench'
  },
  7: {
    emoji: '🍃',
    meaning: "Floats on today's breeze, not tomorrow's. Imaginary dark clouds can't sink a leaf that stays in the present.",
    art: 'leaf'
  },
  8: {
    emoji: '🏮',
    meaning: "Its flame never goes out, just like your values. Choosing what is right keeps your whole self shining.",
    art: 'lantern'
  },
  9: {
    emoji: '🐬',
    meaning: "Splashes away pride. Saying \"I am tired and I need help\" is not failing; it makes room for wisdom.",
    art: 'fountain'
  },
  10: {
    emoji: '🌳',
    meaning: "Sit beside it as a humble seeker. The bravest thing is to say \"I don't know\" and listen to those who guide you.",
    art: 'sapling'
  }
};

export const DECORATIONS: Decoration[] = QUESTS.map((quest) => {
  const extras = DECORATION_EXTRAS[quest.id];
  if (!extras) {
    throw new Error(`Missing decoration details for quest ${quest.id}`);
  }
  return {
    questId: quest.id,
    name: quest.rewardItem,
    philosophicValue: quest.teachingStep.originalConcept,
    sourceQuest: `Quest ${quest.id}: ${quest.title}`,
    ...extras
  };
});

export const getDecorationForQuest = (questId: number): Decoration | undefined =>
  DECORATIONS.find((d) => d.questId === questId);

export const getUnlockedDecorations = (completedQuests: number[]): Decoration[] =>
  DECORATIONS.filter((d) => completedQuests.includes(d.questId));
