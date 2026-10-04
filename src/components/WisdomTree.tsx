import React from 'react';
import { motion } from 'motion/react';
import { speakText } from '../utils/audio';
import { Decoration, DecorationArt, DECORATIONS } from '../decorations';

interface WisdomTreeProps {
  health: number; // 0 to 100
  unlockedDecorations: Decoration[];
  size?: 'sm' | 'md' | 'lg' | 'interactive';
  interactive?: boolean;
  onDecorationClick?: (questId: number) => void;
}

export default function WisdomTree({
  health,
  unlockedDecorations,
  size = 'md',
  interactive = false,
  onDecorationClick
}: WisdomTreeProps) {
  const decorationFor = (art: DecorationArt) => unlockedDecorations.find((d) => d.art === art);
  const isUnlocked = (art: DecorationArt) => decorationFor(art) !== undefined;

  const handleDecorationClick = (art: DecorationArt) => {
    const decoration = decorationFor(art);
    if (!decoration) return;
    onDecorationClick?.(decoration.questId);
    speakText(`${decoration.name}! ${decoration.meaning}`, "narrator");
  };

  const handleCanopyClick = () => {
    if (health >= 100) {
      speakText("Superb! The Wisdom Tree canopy is fully leafy, glowing, and glowing with celestial flowers!", "krishna");
    } else if (health >= 70) {
      speakText("Lush Canopy! The branches are full of sweet, glowing blossoms and leaves!", "companion");
    } else if (health >= 40) {
      speakText("Growing Canopy! The tree is starting to sprout beautiful green leaves!", "companion");
    } else {
      speakText("Budding canopy! Earn more crystals from the world map to make the tree look healthy and green!", "companion");
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

        {/* --- DECORATION: PEACOCK FEATHER CROWN - Rendered behind the canopy --- */}
        {isUnlocked('feather') && (
          <motion.g
            id="dec-feather-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="cursor-pointer hover:brightness-110"
            onClick={() => handleDecorationClick('feather')}
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

        {/* --- GROUND DECORATION: DOLPHIN FOUNTAIN (far left) --- */}
        {isUnlocked('fountain') && (
          <motion.g
            id="dec-fountain-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('fountain')}
          >
            <g transform="translate(55, 350)">
              {/* Stone basin */}
              <path d="M-24,6 L-20,18 H20 L24,6 Z" fill="#D1A377" stroke="#78350F" strokeWidth="1.5" />
              <ellipse cx="0" cy="6" rx="24" ry="5" fill="#B45309" />
              <ellipse cx="0" cy="6" rx="19" ry="3.5" fill="#38BDF8" />
              {/* Leaping dolphin */}
              <motion.g
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M-12,4 C-13,-12 2,-24 14,-12 L17,-10 L12,-9 C4,-17 -5,-10 -7,4 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="1" />
                <path d="M-2,-19 L1,-25 L4,-18 Z" fill="#0369A1" />
                <path d="M-12,4 L-18,7 L-11,7 L-9,11 Z" fill="#0369A1" />
                <circle cx="8" cy="-14" r="1.3" fill="#1E293B" />
              </motion.g>
              {/* Splash droplets */}
              <circle cx="16" cy="-3" r="2" fill="#BAE6FD" />
              <circle cx="20" cy="1" r="1.5" fill="#BAE6FD" />
              <circle cx="-17" cy="-4" r="1.5" fill="#BAE6FD" />
            </g>
          </motion.g>
        )}

        {/* --- GROUND DECORATION: SUNSET BENCH (left, beside the mat) --- */}
        {isUnlocked('bench') && (
          <motion.g
            id="dec-bench-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('bench')}
          >
            <g transform="translate(108, 350)">
              {/* Setting sun peeking over the backrest */}
              <circle cx="0" cy="-14" r="13" fill="#F59E0B" opacity="0.3" filter="url(#glow)" />
              <path d="M-9,-14 A9,9 0 0 1 9,-14 Z" fill="#FB923C" />
              {/* Backrest posts and slats */}
              <rect x="-18" y="-17" width="2.5" height="17" fill="#92400E" rx="1" />
              <rect x="15.5" y="-17" width="2.5" height="17" fill="#92400E" rx="1" />
              <rect x="-18" y="-14" width="36" height="3" fill="#D97706" rx="1" />
              <rect x="-18" y="-8" width="36" height="3" fill="#D97706" rx="1" />
              {/* Seat */}
              <rect x="-20" y="-2" width="40" height="4" fill="#B45309" stroke="#78350F" strokeWidth="1" rx="1.5" />
              {/* Legs */}
              <rect x="-16" y="2" width="3" height="10" fill="#78350F" />
              <rect x="13" y="2" width="3" height="10" fill="#78350F" />
            </g>
          </motion.g>
        )}

        {/* --- GROUND DECORATION: SACRED MEDITATION TREE (far right) --- */}
        {isUnlocked('sapling') && (
          <motion.g
            id="dec-sapling-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('sapling')}
          >
            <g transform="translate(342, 336)">
              {/* Soft golden halo */}
              <circle cx="0" cy="-12" r="20" fill="#FDE047" opacity="0.25" filter="url(#glow)" />
              {/* Grassy mound */}
              <ellipse cx="0" cy="24" rx="16" ry="4" fill="#86EFAC" />
              {/* Trunk */}
              <path d="M-3,24 C-2,12 -4,2 0,-4 C4,2 2,12 3,24 Z" fill="#78350F" />
              {/* Round canopy */}
              <circle cx="-9" cy="-4" r="9" fill="#15803D" />
              <circle cx="9" cy="-4" r="9" fill="#4ADE80" />
              <circle cx="0" cy="-12" r="12" fill="#22C55E" />
              {/* Blossoms */}
              <circle cx="-5" cy="-14" r="2" fill="#EC4899" />
              <circle cx="6" cy="-9" r="2" fill="#EC4899" />
              {/* Wisdom star on top */}
              <path d="M0,-32 L2,-28 L6,-28 L3,-25 L4,-21 L0,-23 L-4,-21 L-3,-25 L-6,-28 L-2,-28 Z" fill="#FDE047" />
            </g>
          </motion.g>
        )}

        {/* --- BACKGROUND DECORATION: MEDITATION MAT --- */}
        {isUnlocked('mat') && (
          <motion.g
            id="dec-meditation-tree-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('mat')}
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

        {/* --- DECORATION: BOOKSHELF - Built directly inside the tree hollow! --- */}
        {isUnlocked('bookshelf') ? (
          <motion.g
            id="dec-bookshelf-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('bookshelf')}
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
        <g id="tree-foliage" className="cursor-pointer" onClick={handleCanopyClick}>
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

        {/* --- DECORATION: LAMP --- */}
        {isUnlocked('lamp') && (
          <motion.g
            id="dec-lamp-group"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('lamp')}
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

        {/* --- DECORATION: POTTED LOTUS --- */}
        {isUnlocked('lotus') && (
          <motion.g
            id="dec-plant-group"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('lotus')}
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
        {/* --- DECORATION: ETERNAL FLAME LANTERN (hangs from the right branch) --- */}
        {isUnlocked('lantern') && (
          <motion.g
            id="dec-lantern-group"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('lantern')}
          >
            {/* Rope */}
            <line x1="280" y1="216" x2="280" y2="238" stroke="#78350F" strokeWidth="1.5" />
            {/* Light aura */}
            <circle cx="280" cy="251" r="16" fill="#F59E0B" opacity="0.3" filter="url(#glow)" />
            {/* Top cap */}
            <rect x="273" y="237" width="14" height="3" fill="#92400E" rx="1" />
            {/* Round lantern body with ribs */}
            <ellipse cx="280" cy="251" rx="11" ry="11" fill="#EF4444" stroke="#92400E" strokeWidth="1" />
            <ellipse cx="280" cy="251" rx="5" ry="11" fill="none" stroke="#92400E" strokeWidth="0.8" opacity="0.6" />
            {/* Glowing window */}
            <ellipse cx="280" cy="252" rx="4.5" ry="6" fill="#FEF08A" opacity="0.85" />
            {/* Flame */}
            <motion.path
              d="M280,248 C278,251 278,254 280,256 C282,254 282,251 280,248 Z"
              fill="#F59E0B"
              animate={{ scale: [1, 1.2, 1], y: [0, -1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Bottom cap and tassel */}
            <rect x="275" y="261" width="10" height="3" fill="#92400E" rx="1" />
            <line x1="280" y1="264" x2="280" y2="272" stroke="#FBBF24" strokeWidth="2" />
          </motion.g>
        )}

        {/* --- DECORATION: FLOATING LOTUS LEAF (drifts in the sky, upper left) --- */}
        {isUnlocked('leaf') && (
          <motion.g
            id="dec-leaf-group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="cursor-pointer"
            onClick={() => handleDecorationClick('leaf')}
          >
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <g transform="translate(58, 120)">
                {/* Lily pad with its notch */}
                <path d="M0,0 L15,-3 A15.3,15.3 0 1 0 15,3 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
                {/* Veins */}
                <line x1="0" y1="0" x2="-10" y2="-10" stroke="#15803D" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1="0" x2="-14" y2="0" stroke="#15803D" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1="0" x2="-10" y2="10" stroke="#15803D" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1="0" x2="0" y2="-14" stroke="#15803D" strokeWidth="1" opacity="0.6" />
                <line x1="0" y1="0" x2="0" y2="14" stroke="#15803D" strokeWidth="1" opacity="0.6" />
                {/* Little lotus bud resting on the pad */}
                <ellipse cx="-4" cy="-3" rx="3" ry="5" fill="#F472B6" />
                <circle cx="-4" cy="-4" r="1.2" fill="#FACC15" />
                {/* Sparkles underneath */}
                <circle cx="-8" cy="20" r="1.5" fill="#FEF08A" />
                <circle cx="6" cy="22" r="1" fill="#FEF08A" />
              </g>
            </motion.g>
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
            <div className="bg-white/95 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium shadow-md">
              ✨ Unlocked: {unlockedDecorations.length} / {DECORATIONS.length} magical decors!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
