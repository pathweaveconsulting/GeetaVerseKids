import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { playSound } from '../utils/audio';
import { UserState, CompanionId } from '../types';
import { QUESTS, COMPANIONS } from '../quests';
import { isQuestUnlocked } from '../session';

interface WorldMapProps {
  state: UserState;
  onBack: () => void;
  onStartQuest: (id: number) => void;
}

const NODE_ICONS = ['🏰', '🐚', '🏹', '👥', '🤝', '⛈️', '🌊', '⚖️', '🙇', '✨'];

// Wide map: a three-row snake (left→right, right→left, left→right, bottom to
// top), spaced so full quest names fit under each node and the companion fits
// above it (clear of the bouncing node). Positions are percentages of the
// 700px-tall canvas.
const WIDE_COORDS = [
  { x: 12, y: 80 }, { x: 37, y: 80 }, { x: 62, y: 80 }, { x: 87, y: 80 },
  { x: 78, y: 50 }, { x: 52, y: 50 }, { x: 26, y: 50 },
  { x: 24, y: 20 }, { x: 50, y: 20 }, { x: 76, y: 20 }
];

// Landmarks sit on the path between nodes, clear of labels and the companion
const LANDMARKS = [
  { x: 24.5, y: 80, icon: '🌊', label: 'River Yamuna', color: 'border-blue-300 text-blue-900 bg-blue-100/95' },
  { x: 49.5, y: 80, icon: '🌳', label: 'Vrindavan Forest', color: 'border-emerald-300 text-emerald-900 bg-emerald-100/95' },
  { x: 74.5, y: 80, icon: '🪨', label: 'Dharma Rocks', color: 'border-amber-300 text-amber-900 bg-yellow-50/95' },
  { x: 65, y: 50, icon: '🌲', label: 'Mist Woods', color: 'border-teal-300 text-teal-900 bg-teal-100/95' },
  { x: 39, y: 50, icon: '🌊', label: 'River Ganges', color: 'border-sky-300 text-sky-900 bg-sky-100/95' },
  { x: 37, y: 20, icon: '🛕', label: 'Sacred Ashram', color: 'border-rose-200 text-rose-900 bg-rose-50/95' },
  { x: 63, y: 20, icon: '🌊', label: 'Triveni Sangam', color: 'border-indigo-300 text-indigo-900 bg-indigo-50/95' }
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// Smooth curve through a list of points
const curveThrough = (points: { x: number; y: number }[]) =>
  points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    return prev.y === p.y
      ? `${d} L ${p.x} ${p.y}`
      : `${d} C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
  }, '');

export default function WorldMap({ state, onBack, onStartQuest }: WorldMapProps) {
  const isWide = useMediaQuery('(min-width: 1024px)');
  const reduceMotion = useReducedMotion();

  // The next quest bounces for a few seconds to draw the eye, then settles
  const [bounceDone, setBounceDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setBounceDone(true), 4000);
    return () => clearTimeout(timer);
  }, []);
  const bounce = !bounceDone && !reduceMotion;

  const companion = COMPANIONS[(state.companion ?? 'gaja') as CompanionId] ?? COMPANIONS.gaja;
  const completedCount = state.completedQuests.length;
  const nextQuestIndex = QUESTS.findIndex((q) => !state.completedQuests.includes(q.id));
  const companionIndex = nextQuestIndex === -1 ? QUESTS.length - 1 : nextQuestIndex;

  const handleNodeClick = (id: number, isUnlocked: boolean) => {
    if (!isUnlocked) {
      playSound.joke(); // Plays funny springy buzz sound
      return;
    }
    playSound.unlock(); // Plays sparkling sound
    onStartQuest(id);
  };

  const nodeStatus = (questId: number) => {
    const isCompleted = state.completedQuests.includes(questId);
    const isUnlocked = isQuestUnlocked(questId, state.completedQuests);
    return { isCompleted, isUnlocked, isNext: isUnlocked && !isCompleted && questId === QUESTS[companionIndex].id };
  };

  const circleClass = (isCompleted: boolean, isUnlocked: boolean, isNext: boolean) =>
    `w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full border-4 flex items-center justify-center font-display font-bold text-xl md:text-2xl shadow-md transition-colors ${
      isCompleted
        ? 'bg-emerald-500 border-emerald-700 text-white ring-4 ring-emerald-200'
        : isUnlocked
          ? `bg-amber-400 border-amber-600 text-amber-950 ring-4 ring-amber-300 ring-offset-2 ${isNext && bounce ? 'animate-bounce' : ''}`
          : 'bg-slate-300 border-slate-400 text-slate-500 opacity-75'
    }`;

  const circleContent = (index: number, isCompleted: boolean, isUnlocked: boolean) =>
    isCompleted ? '✅' : isUnlocked ? NODE_ICONS[index] : '🔒';

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
      <header id="map-header" className="max-w-5xl mx-auto w-full flex items-center justify-between gap-3 z-10">
        <button
          onClick={() => { playSound.tap(); onBack(); }}
          className="text-indigo-950 font-black text-sm bg-white/60 backdrop-blur-md border border-white px-4 py-2.5 rounded-full hover:bg-white/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-900/5 shrink-0"
        >
          ⬅️ Back To Camp
        </button>
        <div className="flex flex-col items-center text-center min-w-0">
          <span className="font-display font-black text-indigo-950 text-lg md:text-3xl tracking-wide flex items-center gap-1">
            🗺️ World of Confusion
          </span>
          <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mt-0.5">
            Region 1: The Gateway to Wisdom
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-md text-amber-900 border border-white rounded-full px-4 py-2 text-xs font-black shadow-md shadow-amber-900/5 shrink-0">
          ⭐ {state.xp} XP
        </div>
      </header>

      <p id="map-instructions" className="z-10 mx-auto mt-4 text-center bg-white/80 border border-white px-5 py-2 rounded-full text-xs font-black text-indigo-950 shadow-md">
        👇 Tap the glowing quest to start your next adventure!
      </p>

      {isWide ? (
        <WideMap
          companionIndex={companionIndex}
          completedCount={completedCount}
          companionName={companion.name}
          companionEmoji={companion.emoji}
          reduceMotion={Boolean(reduceMotion)}
          nodeStatus={nodeStatus}
          circleClass={circleClass}
          circleContent={circleContent}
          onNodeClick={handleNodeClick}
        />
      ) : (
        <TrailMap
          companionIndex={companionIndex}
          companionName={companion.name}
          companionEmoji={companion.emoji}
          nodeStatus={nodeStatus}
          circleClass={circleClass}
          circleContent={circleContent}
          onNodeClick={handleNodeClick}
        />
      )}

      {/* 3. Footer Tip */}
      <footer className="text-center font-bold text-[10px] text-teal-800/80 uppercase tracking-wide z-10">
        Completed quests reveal sacred crystals that repair the ancient Wisdom Tree!
      </footer>
    </div>
  );
}

interface MapLayoutProps {
  companionIndex: number;
  companionName: string;
  companionEmoji: string;
  nodeStatus: (questId: number) => { isCompleted: boolean; isUnlocked: boolean; isNext: boolean };
  circleClass: (isCompleted: boolean, isUnlocked: boolean, isNext: boolean) => string;
  circleContent: (index: number, isCompleted: boolean, isUnlocked: boolean) => string;
  onNodeClick: (id: number, isUnlocked: boolean) => void;
}

// Laptop and wider: the landscape map
function WideMap({
  companionIndex,
  completedCount,
  companionName,
  companionEmoji,
  reduceMotion,
  nodeStatus,
  circleClass,
  circleContent,
  onNodeClick
}: MapLayoutProps & { completedCount: number; reduceMotion: boolean }) {
  // The companion walks from the last finished quest to the next one
  const startIndex = Math.max(0, Math.min(completedCount, QUESTS.length - 1) - 1);
  const start = WIDE_COORDS[startIndex];
  const dest = WIDE_COORDS[companionIndex];
  // 24px above the node, so the bouncing node never reaches it
  const companionPos = (c: { x: number; y: number }) => ({ left: `${c.x}%`, top: `calc(${c.y}% - 56px)` });

  return (
    <main id="map-canvas" className="max-w-4xl mx-auto w-full my-4 bg-white/70 backdrop-blur-md border border-white rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] relative h-[700px] z-10">
      {/* Trail through every node */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={curveThrough(WIDE_COORDS)}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="6"
          strokeDasharray="12 8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-40"
        />
      </svg>

      {/* Landmarks along the trail */}
      {LANDMARKS.map((elem) => (
        <div
          key={elem.label}
          data-map-landmark
          className="absolute z-[5] pointer-events-none flex items-center gap-1 select-none"
          style={{ top: `${elem.y}%`, left: `${elem.x}%`, transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-base">{elem.icon}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shadow-xs whitespace-nowrap ${elem.color}`}>
            {elem.label}
          </span>
        </div>
      ))}

      {/* Future worlds */}
      {[
        { id: 'future-world-1', name: 'World of Greed', pos: { left: '8%', top: '7%' }, tone: 'text-sky-900 bg-sky-100/90 border-sky-200' },
        { id: 'future-world-2', name: 'World of Pride', pos: { left: '92%', top: '7%' }, tone: 'text-pink-900 bg-pink-100/90 border-pink-200' }
      ].map((w) => (
        <div key={w.id} id={w.id} data-map-landmark className="absolute z-10 pointer-events-none flex flex-col items-center" style={{ ...w.pos, transform: 'translate(-50%, -50%)' }}>
          <span className="text-2xl">☁️</span>
          <span className={`font-display font-black text-[9px] border px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${w.tone}`}>
            {w.name} 🔒
          </span>
        </div>
      ))}

      {/* Companion stands above the next quest, never on it */}
      <motion.div
        id="companion-map-avatar"
        initial={reduceMotion ? companionPos(dest) : companionPos(start)}
        animate={companionPos(dest)}
        transition={{ duration: reduceMotion ? 0 : 2.2, ease: 'easeInOut', delay: 0.6 }}
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{ x: '-50%', y: '-100%' }}
      >
        <div className="w-11 h-11 rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center text-2xl shadow-xl">
          {companionEmoji}
        </div>
        <div className="bg-indigo-950 text-white font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 border border-white whitespace-nowrap shadow-md">
          {companionName} 🏃
        </div>
      </motion.div>

      {QUESTS.map((quest, index) => {
        const { isCompleted, isUnlocked, isNext } = nodeStatus(quest.id);
        const coords = WIDE_COORDS[index];
        return (
          <div
            key={quest.id}
            className="absolute z-10 flex flex-col items-center"
            style={{ top: `${coords.y}%`, left: `${coords.x}%`, transform: 'translate(-50%, -32px)' }}
          >
            <motion.button
              id={`quest-node-${quest.id}`}
              aria-label={`Quest ${quest.id}: ${quest.title}${isCompleted ? ' (completed)' : isUnlocked ? '' : ' (locked)'}`}
              onClick={() => onNodeClick(quest.id, isUnlocked)}
              className={`${circleClass(isCompleted, isUnlocked, isNext)} ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              whileHover={isUnlocked ? { scale: 1.12 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              style={{ animationDuration: '2.5s' }}
            >
              {circleContent(index, isCompleted, isUnlocked)}
            </motion.button>
            <div
              data-quest-label={quest.id}
              className={`mt-2 px-2.5 py-1 rounded-xl border text-center shadow-sm w-[9.5rem] text-[11px] leading-tight ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-950 font-bold'
                  : isUnlocked
                    ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              Quest {quest.id}: {quest.title}
            </div>
          </div>
        );
      })}
    </main>
  );
}

// Phones and tablets: a winding trail from top to bottom, one quest per row,
// so every name fits in full
function TrailMap({
  companionIndex,
  companionName,
  companionEmoji,
  nodeStatus,
  circleClass,
  circleContent,
  onNodeClick
}: MapLayoutProps) {
  const containerRef = useRef<HTMLOListElement>(null);
  const [path, setPath] = useState('');
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Draw the trail through the node circles (offset* ignores the bounce transform)
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const points = Array.from(container.querySelectorAll<HTMLElement>('[data-node-circle]')).map((c) => ({
        x: c.offsetLeft + c.offsetWidth / 2,
        y: c.offsetTop + c.offsetHeight / 2
      }));
      setSize({ w: container.offsetWidth, h: container.offsetHeight });
      setPath(curveThrough(points));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <main id="map-canvas" className="max-w-xl mx-auto w-full my-4 bg-white/70 backdrop-blur-md border border-white rounded-[32px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] py-4 z-10">
      <ol ref={containerRef} className="relative">
        <svg className="absolute inset-0 pointer-events-none" width={size.w} height={size.h} aria-hidden="true">
          <path d={path} fill="none" stroke="#94A3B8" strokeWidth="5" strokeDasharray="10 8" strokeLinecap="round" className="opacity-40" />
        </svg>

        {QUESTS.map((quest, index) => {
          const { isCompleted, isUnlocked, isNext } = nodeStatus(quest.id);
          const onLeft = index % 2 === 0;
          const companionHere = index === companionIndex;
          return (
            <li key={quest.id} className="list-none">
              <motion.button
                id={`quest-node-${quest.id}`}
                onClick={() => onNodeClick(quest.id, isUnlocked)}
                whileTap={isUnlocked ? { scale: 0.97 } : {}}
                className={`w-full flex items-center gap-4 px-[7%] py-3 min-h-[104px] text-left ${onLeft ? 'flex-row' : 'flex-row-reverse text-right'} ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div data-node-circle className={circleClass(isCompleted, isUnlocked, isNext)} style={{ animationDuration: '2.5s' }}>
                  {circleContent(index, isCompleted, isUnlocked)}
                </div>
                <div
                  data-quest-label={quest.id}
                  className={`flex-1 min-w-0 flex flex-col ${onLeft ? 'items-start' : 'items-end'} gap-1`}
                >
                  {companionHere && (
                    <span id="companion-map-avatar" className="inline-flex items-center gap-1 bg-indigo-950 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      <span className="text-base leading-none">{companionEmoji}</span> {companionName} is here
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-indigo-500' : 'text-slate-400'}`}>
                    Quest {quest.id} · {isCompleted ? 'Done ✅' : isUnlocked ? 'Play now' : 'Locked'}
                  </span>
                  <span className={`font-display font-black text-sm leading-snug ${isUnlocked ? 'text-indigo-950' : 'text-slate-500'}`}>
                    {quest.title}
                  </span>
                </div>
              </motion.button>
            </li>
          );
        })}
      </ol>

      {/* Future worlds */}
      <div className="flex justify-center gap-3 px-4 pt-2">
        {['World of Greed', 'World of Pride'].map((name, i) => (
          <div key={name} id={`future-world-${i + 1}`} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
            ☁️ {name} 🔒
          </div>
        ))}
      </div>
    </main>
  );
}
