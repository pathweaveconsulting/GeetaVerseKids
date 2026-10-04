import React from 'react';
import { motion } from 'motion/react';
import { speakText } from '../utils/audio';

interface WisdomTreeProps {
  health: number; // 0 to 100
  unlockedDecorations: string[]; // e.g. ['lamp', 'plant', 'bookshelf', 'feather', 'tree']
  size?: 'sm' | 'md' | 'lg' | 'interactive';
  interactive?: boolean;
  onDecorationClick?: (item: string) => void;
}

export default function WisdomTree({
  health,
  unlockedDecorations,
  size = 'md',
  interactive = false,
  onDecorationClick
}: WisdomTreeProps) {
  const isUnlocked = (item: string) => unlockedDecorations.includes(item);

  const handleElementClick = (item: string) => {
    // Tap callback
    onDecorationClick?.(item);

    // Dynamic, engaging child-first descriptions spoken in-character with Indian phonetic pronunciation
    if (item === 'lamp') {
      speakText("The Hanging Lamp represents Dharma! Let the gold light of righteous action guide your choice!", "narrator");
    } else if (item === 'plant') {
      speakText("The Potted Lotus represents Detachment! Live like a pristine lotus blossom, untouched by sticky muddy water!", "narrator");
    } else if (item === 'bookshelf') {
      speakText("The Sacred Bookshelf represents Study! Clear your mind to discover ultimate truth and stable attention!", "narrator");
    } else if (item === 'feather') {
      speakText("The Peacock Feather represents Sri Krishna! Wear a joy-filled smile and do your life duty with playful courage!", "narrator");
    } else if (item === 'tree') {
      speakText("The Meditation Mat represents tranquility! Sit with a tall spine, breathe sweet air, and stand calm!", "narrator");
    } else if (item === 'canopy') {
      if (health >= 100) {
        speakText("Superb! The Wisdom Tree canopy is fully leafy, glowing, and glowing with celestial flowers!", "krishna");
      } else if (health >= 70) {
        speakText("Lush Canopy! The branches are full of sweet, glowing blossoms and leaves!", "companion");
      } else if (health >= 40) {
        speakText("Growing Canopy! The tree is starting to sprout beautiful green leaves!", "companion");
      } else {
        speakText("Budding canopy! Earn more crystals from the world map to make the tree look healthy and green!", "companion");
      }
    }
  };

  // Dimension mapping
  const widthClass = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72 md:w-80 md:h-80',
    lg: 'w-96 h-96 md:w-[450px] md:h-[450px]',
    interactive: 'w-full h-full min-h-[300px] max-h-[500px]'
  }[size];

  // Colors based on health state
  const trunkColor = health === 0 ? '#8B5A2B' : health < 40 ? '#9B6133' : '#78350F';
  const trunkGradient = health === 0 ? ['#996633', '#774411'] : ['#854D0E', '#451A03'];

  return (
    <div id="wisdom-tree-wrapper" className={`relative flex items-center justify-center ${widthClass} mx-auto`}>
      {/* Magical glowing aura behind the tree */}
      <div 
        id="tree-glowing-aura"
        className="absolute inset-0 rounded-full blur-[60px] opacity-25 mix-blend-screen transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${
            health === 0 
              ? 'rgba(156, 163, 175, 0.4) 0%' 
              : health < 50 
                ? 'rgba(234, 179, 8, 0.5) 0%' 
                : 'rgba(34, 197, 94, 0.6) 0%, rgba(217, 119, 6, 0.2) 70%'
          }, rgba(0,0,0,0) 100%)`
        }}
      />

      {/* Floating Sparkles (Framer Motion) */}
      {health > 0 && (
        <div id="flying-particles" className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(health < 50 ? 6 : 12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-200"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${15 + Math.random() * 70}%`,
              }}
              animate={{
                y: [-10, -40, -10],
                x: [0, (Math.random() - 0.5) * 30, 0],
                scale: [0.6, 1.2, 0.6],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* SVG Wisdom Tree */}
      <svg
        id="wisdom-tree-svg"
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="trunkGrad" x1="200" y1="200" x2="200" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={trunkGradient[0]} />
            <stop offset="100%" stopColor={trunkGradient[1]} />
          </linearGradient>

          {/* Leaves Gradient */}
          <linearGradient id="foliage0" x1="150" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
          <linearGradient id="foliageStage1" x1="150" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7CD953" />
            <stop offset="100%" stopColor="#1E6E1C" />
          </linearGradient>
          <linearGradient id="foliageStage2" x1="150" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="foliageStage3" x1="150" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="40%" stopColor="#4ADE80" />
            <stop offset="80%" stopColor="#166534" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Radial glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- DECORATION: PEACOCK FEATHER (Quest 4 reward) - Rendered behind the canopy --- */}
        {isUnlocked('feather') && (
          <motion.g
            id="dec-feather-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="cursor-pointer hover:brightness-110"
            onClick={() => handleElementClick('feather')}
          >
            {/* Crown of Feathers backing the leaves */}
            {[...Array(5)].map((_, index) => {
              const angle = -45 + index * 22.5; // Fan out
              return (
                <g key={index} transform={`translate(200, 160) rotate(${angle}) translate(0, -110)`}>
                  {/* Stem */}
                  <line x1="0" y1="0" x2="0" y2="80" stroke="#047857" strokeWidth="2.5" />
                  {/* Feather head */}
                  <ellipse cx="0" cy="0" rx="16" ry="24" fill="#0D9488" />
                  <ellipse cx="0" cy="0" rx="10" ry="16" fill="#F59E0B" />
                  <circle cx="0" cy="0" r="6" fill="#0369A1" />
                  <circle cx="0" cy="0" r="3" fill="#D946EF" />
                </g>
              );
            })}
          </motion.g>
        )}

        {/* --- TREE BASE LAND & HILLS --- */}
        <ellipse cx="200" cy="370" rx="140" ry="25" fill="#E2E8F0" />
        <ellipse cx="200" cy="365" rx="120" ry="18" fill={health === 0 ? '#D1D5DB' : '#BBF7D0'} />
        {health > 0 && <ellipse cx="200" cy="362" rx="90" ry="12" fill="#86EFAC" />}

        {/* --- BACKGROUND DECORATION: MEDITATION SOIL/CUSHION (Quest 5 reward) --- */}
        {isUnlocked('tree') && (
          <motion.g
            id="dec-meditation-tree-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleElementClick('tree')}
          >
            {/* A beautiful circular golden velvet meditation mat near the roots */}
            <ellipse cx="200" cy="366" rx="65" ry="15" fill="#B45309" stroke="#FBBF24" strokeWidth="3" />
            <ellipse cx="200" cy="366" rx="55" ry="11" fill="#FBBF24" />
            {/* Tiny cosmic lotus pattern in center of mat */}
            <circle cx="200" cy="366" r="4" fill="#F59E0B" />
            <path d="M200,360 C197,364 203,364 200,360 Z" fill="#EF4444" />
            <path d="M200,372 C197,368 203,368 200,372 Z" fill="#EF4444" />
            <path d="M192,366 C196,363 196,369 192,366 Z" fill="#EF4444" />
            <path d="M208,366 C204,363 204,369 208,366 Z" fill="#EF4444" />
          </motion.g>
        )}

        {/* --- MAIN TRUNK --- */}
        <path
          d="M170,365 C175,300 160,250 180,210 C185,200 190,190 200,190 C210,190 215,200 220,210 C240,250 225,300 230,365 Z"
          fill="url(#trunkGrad)"
        />

        {/* Branch Left */}
        <path
          d="M182,230 C160,210 130,225 110,215 C100,210 120,200 140,205 C160,210 174,218 182,230 Z"
          fill="url(#trunkGrad)"
        />

        {/* Branch Right */}
        <path
          d="M218,230 C240,210 270,225 290,215 C300,210 280,200 260,205 C240,210 226,218 218,230 Z"
          fill="url(#trunkGrad)"
        />

        {/* Branch Center Top Split */}
        <path
          d="M200,190 C190,165 170,140 180,120 C185,115 195,130 200,150 C205,130 215,115 220,120 C230,140 210,165 200,190 Z"
          fill="url(#trunkGrad)"
        />

        {/* --- DECORATION: BOOKSHELF (Quest 3 reward) - Built directly inside the tree hollow! --- */}
        {isUnlocked('bookshelf') ? (
          <motion.g
            id="dec-bookshelf-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleElementClick('bookshelf')}
          >
            {/* Tree Hollow Frame */}
            <ellipse cx="200" cy="275" rx="16" ry="24" fill="#3F2107" />
            {/* Shelf structure */}
            <rect x="187" y="272" width="26" height="3" fill="#D97706" rx="1" />
            <rect x="189" y="284" width="22" height="3" fill="#D97706" rx="1" />
            {/* Tiny stylized colorful books on the shelves! */}
            {/* Shelf 1 Books */}
            <rect x="190" y="260" width="4" height="12" fill="#F43F5E" rx="0.5" />
            <rect x="195" y="263" width="3.5" height="9" fill="#0EA5E9" rx="0.5" />
            <line x1="195" y1="265" x2="198" y2="265" stroke="white" strokeWidth="0.5" />
            <rect x="200" y="258" width="5" height="14" fill="#EAB308" rx="0.5" transform="rotate(10, 202, 265)" />
            {/* Shelf 2 Books (Scrolls) */}
            <rect x="192" y="278" width="16" height="6" fill="#FEF08A" rx="2" stroke="#B45309" strokeWidth="0.5" />
            <circle cx="194" cy="281" r="1" fill="#D97706" />
            <circle cx="206" cy="281" r="1" fill="#D97706" />
          </motion.g>
        ) : (
          // Simple natural hollow when not unlocked yet
          <ellipse cx="200" cy="275" rx="12" ry="18" fill="#3F2107" opacity="0.6" />
        )}

        {/* --- THE FOLIAGE / CANOPY (Visual Tree Growth) --- */}
        <g id="tree-foliage" className="cursor-pointer" onClick={() => handleElementClick('canopy')}>
          {health === 0 ? (
            // Dry/Bare branches with simple grey/pale green buds to look safe and repairable
            <g id="stage-bare">
              <circle cx="110" cy="210" r="12" fill="url(#foliage0)" opacity="0.8" />
              <circle cx="290" cy="210" r="12" fill="url(#foliage0)" opacity="0.8" />
              <circle cx="180" cy="120" r="15" fill="url(#foliage0)" opacity="0.8" />
              <circle cx="220" cy="120" r="15" fill="url(#foliage0)" opacity="0.8" />
              <circle cx="200" cy="150" r="18" fill="url(#foliage0)" opacity="0.9" />
              {/* Cute tiny dry leaf buds */}
              <circle cx="140" cy="180" r="5" fill="#84CC16" />
              <circle cx="260" cy="180" r="5" fill="#84CC16" />
            </g>
          ) : health < 40 ? (
            // Stage 1: Young green foliage buds growing
            <g id="stage-sprout">
              <circle cx="110" cy="210" r="28" fill="url(#foliageStage1)" />
              <circle cx="290" cy="210" r="28" fill="url(#foliageStage1)" />
              <circle cx="180" cy="120" r="32" fill="url(#foliageStage1)" />
              <circle cx="220" cy="120" r="32" fill="url(#foliageStage1)" />
              <circle cx="200" cy="155" r="38" fill="url(#foliageStage1)" />
              {/* Golden magic fruit sprouts */}
              <circle cx="190" cy="140" r="4" fill="#FBBF24" />
              <circle cx="210" cy="150" r="4" fill="#FBBF24" />
            </g>
          ) : health < 80 ? (
            // Stage 2: Strong bright green lush canopy, overflowing
            <g id="stage-lush">
              <circle cx="106" cy="210" r="38" fill="url(#foliageStage2)" />
              <circle cx="294" cy="210" r="38" fill="url(#foliageStage2)" />
              <circle cx="180" cy="110" r="44" fill="url(#foliageStage2)" />
              <circle cx="220" cy="110" r="44" fill="url(#foliageStage2)" />
              <circle cx="200" cy="150" r="48" fill="url(#foliageStage2)" />
              <circle cx="150" cy="160" r="35" fill="url(#foliageStage2)" />
              <circle cx="250" cy="160" r="35" fill="url(#foliageStage2)" />
              {/* Flowering blossoms */}
              <circle cx="180" cy="130" r="5" fill="#EC4899" />
              <circle cx="180" cy="130" r="2" fill="#FFFF00" />
              <circle cx="220" cy="130" r="5" fill="#EC4899" />
              <circle cx="220" cy="130" r="2" fill="#FFFF00" />
              <circle cx="130" cy="190" r="5" fill="#EC4899" />
              <circle cx="130" cy="190" r="2" fill="#FFFF00" />
              <circle cx="270" cy="190" r="5" fill="#EC4899" />
              <circle cx="270" cy="190" r="2" fill="#FFFF00" />
            </g>
          ) : (
            // Stage 3: Heavenly Golden-Emerald Cosmic Wisdom Canopy
            <g id="stage-heavenly">
              {/* Outer soft glowing halo blobs */}
              <circle cx="200" cy="155" r="75" fill="#4ADE80" opacity="0.15" filter="url(#glow)" />
              <circle cx="100" cy="210" r="50" fill="url(#foliageStage3)" opacity="0.9" />
              <circle cx="300" cy="210" r="50" fill="url(#foliageStage3)" opacity="0.9" />
              <circle cx="175" cy="100" r="55" fill="url(#foliageStage3)" opacity="0.9" />
              <circle cx="225" cy="100" r="55" fill="url(#foliageStage3)" opacity="0.9" />
              <circle cx="200" cy="145" r="62" fill="url(#foliageStage3)" />
              <circle cx="140" cy="155" r="52" fill="url(#foliageStage3)" opacity="0.95" />
              <circle cx="260" cy="155" r="52" fill="url(#foliageStage3)" opacity="0.95" />
              {/* Radiant glowing golden fruit/stars hanging on tree */}
              <motion.g
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* 5 glowing crystal stars */}
                <path d="M200,60 L203,66 L210,66 L205,71 L207,77 L200,73 L193,77 L195,71 L190,66 L197,66 Z" fill="#FDE047" />
                <path d="M120,160 L122,164 L127,164 L123,167 L124,171 L120,168 L116,171 L117,167 L113,164 L118,164 Z" fill="#38BDF8" filter="url(#glow)" />
                <path d="M280,160 L282,164 L287,164 L283,167 L284,171 L280,168 L276,171 L277,167 L273,164 L278,164 Z" fill="#F472B6" />
                <path d="M165,110 L167,114 L172,114 L168,117 L169,121 L165,118 L161,121 L162,117 L158,114 L163,114 Z" fill="#EAB308" />
                <path d="M235,110 L237,114 L242,114 L238,117 L239,121 L235,118 L231,121 L232,117 L228,114 L233,114 Z" fill="#EAB308" />
              </motion.g>
            </g>
          )}
        </g>

        {/* --- DECORATION: LAMP (Quest 1 reward) --- */}
        {isUnlocked('lamp') && (
          <motion.g
            id="dec-lamp-group"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="cursor-pointer"
            onClick={() => handleElementClick('lamp')}
          >
            {/* Ropes hanging from Branch Left */}
            <line x1="120" y1="210" x2="120" y2="245" stroke="#78350F" strokeWidth="1.5" />
            {/* The golden oil lamp */}
            {/* Lantern frame */}
            <path d="M110,245 H130 L127,260 H113 Z" fill="#D97706" stroke="#92400E" strokeWidth="1" />
            {/* Glass body */}
            <rect x="114" y="248" width="12" height="10" fill="#FEF08A" opacity="0.75" />
            {/* Flame */}
            <motion.path
              d="M120,249 C118,252 118,255 120,257 C122,255 122,252 120,249 Z"
              fill="#EF4444"
              animate={{ scale: [1, 1.2, 1], y: [0, -1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Hanger loop */}
            <circle cx="120" cy="244" r="2.5" stroke="#78350F" strokeWidth="1.5" fill="none" />
            {/* Light aura */}
            <circle cx="120" cy="253" r="14" fill="#F59E0B" opacity="0.3" filter="url(#glow)" />
          </motion.g>
        )}

        {/* --- DECORATION: PLANT (Quest 2 reward) --- */}
        {isUnlocked('plant') && (
          <motion.g
            id="dec-plant-group"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleElementClick('plant')}
          >
            {/* Beautiful potted golden lotus or flower rose on the right base */}
            <g transform="translate(290, 345)">
              {/* Potted Cup */}
              <path d="M-12,12 L12,12 L8,24 L-8,24 Z" fill="#D1A377" stroke="#78350F" strokeWidth="1.5" />
              <rect x="-14" y="8" width="28" height="4" fill="#B45309" rx="1.5" />
              {/* Stem */}
              <path d="M0,8 C-5,0 -2,-8 2,-12" stroke="#16A34A" strokeWidth="2.5" fill="none" />
              <path d="M0,8 C5,2 7,-4 2,-10" stroke="#16A34A" strokeWidth="2.5" fill="none" />
              {/* Big red/pink blooming lotus buds */}
              {/* Petal 1 */}
              <ellipse cx="2" cy="-14" rx="6" ry="10" fill="#EC4899" transform="rotate(-30, 2, -14)" />
              {/* Petal 2 */}
              <ellipse cx="2" cy="-14" rx="6" ry="10" fill="#EC4899" transform="rotate(30, 2, -14)" />
              {/* Center */}
              <ellipse cx="2" cy="-16" rx="5" ry="10" fill="#F472B6" />
              <circle cx="2" cy="-16" r="2" fill="#FACC15" />
              {/* Little leaf */}
              <path d="M0,8 C-10,6 -12,2 -8,0" fill="#22C55E" />
            </g>
          </motion.g>
        )}
      </svg>

      {/* Touch-interaction floating indicators (only standard state labels when interactive) */}
      {interactive && (
        <div id="tree-overlay-hints" className="absolute top-4 left-4 right-4 pointer-events-none flex flex-wrap gap-2 justify-center">
          {unlockedDecorations.length === 0 && (
            <div className="bg-white/95 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-medium shadow-md">
              🌳 Complete quests to decorate your Sanctuary tree!
            </div>
          )}
          {unlockedDecorations.length > 0 && (
            <div className="bg-white/95 text-emerald-900 border border-emerald-250 px-3 py-1 rounded-full text-xs font-medium shadow-md">
              ✨ Unlocked: {unlockedDecorations.length} / 5 magical decors!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
