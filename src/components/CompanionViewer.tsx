import React from 'react';
import { motion, type Variants } from 'motion/react';
import { COMPANIONS } from '../quests';
import { CompanionId } from '../types';

interface CompanionViewerProps {
  id: CompanionId;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showSpeech?: boolean;
  customSpeech?: string;
}

export default function CompanionViewer({
  id,
  size = 'md',
  animated = true,
  showSpeech = false,
  customSpeech
}: CompanionViewerProps) {
  const companion = COMPANIONS[id];
  if (!companion) return null;

  const sizeClass = {
    sm: 'w-20 h-20',
    md: 'w-40 h-40 md:w-44 md:h-44',
    lg: 'w-56 h-56 md:w-64 md:h-64'
  }[size];

  // Hover animations
  const hoverAnimation: Variants = animated ? {
    hover: { 
      scale: 1.05, 
      y: -5,
      transition: { type: 'spring', stiffness: 300, damping: 12 }
    },
    tap: { scale: 0.95 }
  } : {};

  // Speech bubble font sizing based on length
  const speechText = customSpeech || companion.quote;

  return (
    <div id={`companion-${id}-container`} className="flex flex-col items-center justify-center">
      {/* Speech Bubble */}
      {showSpeech && (
        <motion.div
          id="companion-speech-bubble"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-3 max-w-[240px] bg-white border-2 border-amber-200 text-amber-900 rounded-2xl px-4 py-2.5 text-xs text-center font-medium shadow-md relative"
        >
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
          <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-amber-200 -z-10" />
          <span className="italic">"{speechText}"</span>
        </motion.div>
      )}

      {/* SVG Image Vector */}
      <motion.div
        id="companion-artwork"
        variants={hoverAnimation}
        whileHover="hover"
        whileTap="tap"
        className={`${sizeClass} relative flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow beneath the companion */}
          <ellipse cx="100" cy="180" rx="65" ry="12" fill="#E2E8F0" />
          <ellipse cx="100" cy="178" rx="45" ry="8" fill="#CBD5E1" opacity="0.6" />

          {/* GAJA THE ELEPHANT artwork */}
          {id === 'gaja' && (
            <g id="artwork-gaja">
              {/* Back Ears (behind head) */}
              <circle cx="55" cy="95" r="32" fill="#94A3B8" />
              <circle cx="55" cy="95" r="22" fill="#F472B6" opacity="0.3" />
              <circle cx="145" cy="95" r="32" fill="#94A3B8" />
              <circle cx="145" cy="95" r="22" fill="#F472B6" opacity="0.3" />

              {/* Body */}
              <rect x="65" y="105" width="70" height="60" rx="30" fill="#CBD5E1" />
              {/* Legs */}
              <rect x="75" y="150" width="18" height="25" rx="6" fill="#94A3B8" />
              <rect x="107" y="150" width="18" height="25" rx="6" fill="#94A3B8" />

              {/* Saddle cloth (Ancient / Wisdom vibe) */}
              <path d="M75,115 H125 V135 C125,145 115,145 100,145 C85,145 75,145 75,135 Z" fill="#38BDF8" />
              <circle cx="100" cy="130" r="5" fill="#FBBF24" />

              {/* Head */}
              <circle cx="100" cy="95" r="42" fill="#CBD5E1" />

              {/* Small tusks */}
              <path d="M70,123 C65,123 60,118 64,113 C68,118 72,123 70,123 Z" fill="#FFFFFF" />
              <path d="M130,123 C135,123 140,118 136,113 C132,118 128,123 130,123 Z" fill="#FFFFFF" />

              {/* Raised Trunk (Friendly Elephant) */}
              <path
                d="M93,120 C93,145 110,145 112,125 C114,110 126,110 126,122 C126,126 120,128 118,124"
                stroke="#CBD5E1"
                strokeWidth="15"
                strokeLinecap="round"
                fill="none"
              />

              {/* Eyes */}
              <circle cx="84" cy="90" r="6" fill="#1E293B" />
              <circle cx="86" cy="88" r="2.5" fill="#FFFFFF" />
              <circle cx="116" cy="90" r="6" fill="#1E293B" />
              <circle cx="118" cy="88" r="2.5" fill="#FFFFFF" />

              {/* Rosy cheeks */}
              <circle cx="75" cy="104" r="5" fill="#F472B6" opacity="0.5" />
              <circle cx="125" cy="104" r="5" fill="#F472B6" opacity="0.5" />
            </g>
          )}

          {/* MAYUR THE PEACOCK artwork */}
          {id === 'mayur' && (
            <g id="artwork-mayur">
              {/* Back plumage Fan of feathers */}
              {[...Array(7)].map((_, idx) => {
                const angle = -60 + idx * 20;
                return (
                  <g key={idx} transform={`translate(100, 130) rotate(${angle}) translate(0, -65)`}>
                    <ellipse cx="0" cy="0" rx="14" ry="24" fill="#0D9488" />
                    <ellipse cx="0" cy="0" rx="9" ry="16" fill="#22C55E" />
                    <circle cx="0" cy="0" r="5" fill="#0284C7" />
                    <circle cx="0" cy="0" r="2.5" fill="#FBBF24" />
                  </g>
                );
              })}

              {/* Body */}
              <rect x="75" y="105" width="50" height="55" rx="25" fill="#0284C7" />
              {/* Little cute wings */}
              <path d="M72,110 C62,115 65,130 75,124 Z" fill="#0F766E" />
              <path d="M128,110 C138,115 135,130 125,124 Z" fill="#0F766E" />

              {/* Small legs */}
              <line x1="90" y1="155" x2="90" y2="175" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
              <line x1="110" y1="155" x2="110" y2="175" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
              <path d="M85,175 H95" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
              <path d="M105,175 H115" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />

              {/* Neck & Head */}
              <path d="M90,120 V85 C90,75 110,75 110,85 V120 Z" fill="#0284C7" />
              <circle cx="100" cy="80" r="20" fill="#0284C7" />

              {/* Head Crown Feathers */}
              <line x1="100" y1="60" x2="100" y2="48" stroke="#0D9488" strokeWidth="3" />
              <circle cx="100" cy="46" r="3.5" fill="#22C55E" />
              <line x1="94" y1="62" x2="88" y2="52" stroke="#0D9488" strokeWidth="3" />
              <circle cx="88" cy="50" r="3.5" fill="#22C55E" />
              <line x1="106" y1="62" x2="112" y2="52" stroke="#0D9488" strokeWidth="3" />
              <circle cx="112" cy="50" r="3.5" fill="#22C55E" />

              {/* Eyes */}
              <circle cx="93" cy="78" r="4.5" fill="#1E293B" />
              <circle cx="95" cy="76" r="1.5" fill="#FFFFFF" />
              <circle cx="107" cy="78" r="4.5" fill="#1E293B" />
              <circle cx="109" cy="76" r="1.5" fill="#FFFFFF" />

              {/* Yellow Beak */}
              <path d="M96,82 L104,82 L100,92 Z" fill="#FBBF24" />
            </g>
          )}

          {/* VEERU THE MONKEY artwork */}
          {id === 'veeru' && (
            <g id="artwork-veeru">
              {/* Tail */}
              <path d="M72,135 C50,110 35,130 35,145 C35,160 50,165 60,155" stroke="#B45309" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Arms */}
              <path d="M60,115 C45,110 40,85 50,80" stroke="#78350F" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M140,115 C155,110 160,85 150,80" stroke="#78350F" strokeWidth="7" strokeLinecap="round" fill="none" />

              {/* Legs */}
              <rect x="75" y="145" width="16" height="25" rx="6" fill="#78350F" />
              <rect x="109" y="145" width="16" height="25" rx="6" fill="#78350F" />

              {/* Body */}
              <circle cx="100" cy="125" r="36" fill="#B45309" />
              <circle cx="100" cy="125" r="26" fill="#FDE047" opacity="0.4" /> {/* Yellow belly */}

              {/* Round Ears */}
              <circle cx="62" cy="75" r="16" fill="#78350F" />
              <circle cx="62" cy="75" r="9" fill="#FFF1F2" />
              <circle cx="138" cy="75" r="16" fill="#78350F" />
              <circle cx="138" cy="75" r="9" fill="#FFF1F2" />

              {/* Head Frame */}
              <circle cx="100" cy="76" r="30" fill="#B45309" />
              {/* Heart shaped light brown face mask */}
              <path d="M100,98 C78,98 74,74 88,62 C100,56 100,68 100,68 C100,68 100,56 112,62 C126,74 122,98 100,98 Z" fill="#FFF1F2" />

              {/* Wide Smiling Mouth */}
              <path d="M85,82 C90,92 110,92 115,82" stroke="#9F1239" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Nose */}
              <ellipse cx="100" cy="78" rx="4" ry="2.5" fill="#78350F" />

              {/* Eyes */}
              <circle cx="89" cy="70" r="5" fill="#1E293B" />
              <circle cx="91" cy="68" r="1.5" fill="#FFFFFF" />
              <circle cx="111" cy="70" r="5" fill="#1E293B" />
              <circle cx="113" cy="68" r="1.5" fill="#FFFFFF" />

              {/* Red Cheeks */}
              <circle cx="78" cy="78" r="4" fill="#EC4899" opacity="0.4" />
              <circle cx="122" cy="78" r="4" fill="#EC4899" opacity="0.4" />
            </g>
          )}

          {/* GAURI THE COW artwork */}
          {id === 'gauri' && (
            <g id="artwork-gauri">
              {/* Back tail with golden hair */}
              <path d="M138,135 C155,135 160,150 160,165" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="160" cy="165" r="4.5" fill="#FBBF24" />

              {/* Legs */}
              <rect x="76" y="145" width="16" height="30" rx="4" fill="#CBD5E1" />
              <rect x="76" y="168" width="16" height="8" fill="#FBBF24" rx="2" /> {/* Golden Hoof */}
              <rect x="108" y="145" width="16" height="30" rx="4" fill="#CBD5E1" />
              <rect x="108" y="168" width="16" height="8" fill="#FBBF24" rx="2" /> {/* Golden Hoof */}

              {/* Main Body */}
              <rect x="65" y="100" width="70" height="60" rx="25" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
              {/* Spots on body */}
              <ellipse cx="80" cy="115" rx="8" ry="12" fill="#475569" />
              <circle cx="115" cy="138" r="8" fill="#475569" />
              <path d="M70,140 Q80,140 76,148 Q68,146 70,140" fill="#475569" />

              {/* Golden Collar with Small Bell */}
              <rect x="80" y="94" width="40" height="6" fill="#F59E0B" rx="2" />
              <circle cx="100" cy="105" r="7" fill="#FBBF24" />
              <circle cx="100" cy="105" r="4" fill="#D97706" />

              {/* Neck & Head */}
              <rect x="84" y="65" width="32" height="35" fill="#F8FAFC" />
              {/* Head Base */}
              <ellipse cx="100" cy="65" rx="32" ry="24" fill="#F8FAFC" />

              {/* Spots on Head */}
              <path d="M72,55 C70,65 80,68 85,58 Z" fill="#475569" />

              {/* Cute Horns */}
              <path d="M78,48 Q70,38 74,32 Q82,42 84,48 Z" fill="#FEF08A" />
              <path d="M122,48 Q130,38 126,32 Q118,42 116,48 Z" fill="#FEF08A" />

              {/* Floppy Ears */}
              <path d="M68,52 C54,50 50,60 62,64 Z" fill="#FFF1F2" />
              <path d="M132,52 C146,50 150,60 138,64 Z" fill="#FFF1F2" />

              {/* Pink Muzzle / Mouth */}
              <ellipse cx="100" cy="74" rx="22" ry="14" fill="#FFF1F2" />
              {/* Sweet smile nostrils */}
              <circle cx="93" cy="72" r="2" fill="#FDA4AF" />
              <circle cx="107" cy="72" r="2" fill="#FDA4AF" />
              <path d="M94,76 C97,80 103,80 106,76" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Gentle Eyes */}
              <circle cx="86" cy="56" r="6" fill="#1E293B" />
              <circle cx="88" cy="54" r="2" fill="#FFFFFF" />
              <circle cx="114" cy="56" r="6" fill="#1E293B" />
              <circle cx="116" cy="54" r="2" fill="#FFFFFF" />
            </g>
          )}
        </svg>

        {/* Small sparkling star helper */}
        <motion.div
          className="absolute top-2 right-2 text-xl"
          animate={{ rotate: 360, opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Label and species */}
      <div id="companion-label" className="text-center mt-2 pointer-events-none">
        <h4 className="font-display font-bold text-sm text-amber-950 flex items-center justify-center gap-1">
          {companion.emoji} {companion.name}
        </h4>
        <p className="font-sans text-[10px] text-amber-700 uppercase tracking-widest font-bold">
          {companion.species}
        </p>
      </div>
    </div>
  );
}
