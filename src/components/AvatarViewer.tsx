import React from 'react';
import { motion } from 'motion/react';
import { AvatarId } from '../types';

interface AvatarViewerProps {
  id: AvatarId;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function AvatarViewer({ id, size = 'md', animated = true }: AvatarViewerProps) {
  const sizeClass = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36 md:w-40 md:h-40',
    lg: 'w-48 h-48 md:w-56 md:h-56'
  }[size];

  // Breath/bounce loop animations
  const breathAnimation = animated ? {
    animate: {
      y: [0, -3, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : {};

  return (
    <div id={`avatar-${id}-container`} className="flex flex-col items-center justify-center">
      <motion.div
        id="avatar-artwork-wrapper"
        {...breathAnimation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClass} relative flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Floor Shadow */}
          <ellipse cx="80" cy="144" rx="48" ry="8" fill="#CBD5E1" opacity="0.6" />

          {/* Background circle accent */}
          <circle cx="80" cy="80" r="62" fill={id === 'boy' ? '#E0F2FE' : '#FCE7F3'} />
          <circle cx="80" cy="80" r="54" fill="white" opacity="0.4" />

          {/* BOY AVATAR */}
          {id === 'boy' && (
            <g id="boy-avatar-group">
              {/* Costume Body Tunic */}
              <path d="M48,115 C48,95 112,95 112,115 L106,145 H54 Z" fill="#3B82F6" />
              {/* Yellow sash crossing shoulder */}
              <path d="M50,118 L104,142 L108,138 L54,114 Z" fill="#FBBF24" />
              {/* Cute yellow collar */}
              <circle cx="80" cy="98" r="12" fill="#E2E8F0" />
              <circle cx="80" cy="98" r="8" fill="#FBBF24" />

              {/* Head Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FED7AA" />

              {/* Head Oval */}
              <circle cx="80" cy="72" r="26" fill="#FED7AA" />

              {/* Boy's Hair (Friendly Orange spikes/fringe) */}
              <path d="M52,65 C48,50 62,35 80,36 C98,35 112,50 108,65 C112,56 104,44 80,45 C56,44 48,56 52,65 Z" fill="#D97706" />
              {/* Spiky hair overlaps on forehead */}
              <path d="M60,60 L68,68 L74,60 L80,70 L86,60 L92,68 L100,60 L95,54 H65 Z" fill="#B45309" />

              {/* Yellow Headband */}
              <path d="M54,58 C54,58 65,52 80,52 C95,52 106,58 106,58 L105,62 C105,62 95,56 80,56 C65,56 54,62 54,62 Z" fill="#FBBF24" />
              {/* Little gem on headband */}
              <circle cx="80" cy="54" r="3.5" fill="#EF4444" />

              {/* Big adorable anime eyes */}
              <circle cx="70" cy="74" r="5" fill="#1E293B" />
              <circle cx="71.5" cy="72.5" r="1.8" fill="#FFFFFF" />
              <circle cx="90" cy="74" r="5" fill="#1E293B" />
              <circle cx="91.5" cy="72.5" r="1.8" fill="#FFFFFF" />

              {/* Little rosy cheeks */}
              <circle cx="62" cy="80" r="3" fill="#F43F5E" opacity="0.4" />
              <circle cx="98" cy="80" r="3" fill="#F43F5E" opacity="0.4" />

              {/* Smiling mouth */}
              <path d="M75,81 C77,85 83,85 85,81" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Small nose */}
              <circle cx="80" cy="77" r="1.5" fill="#F97316" />
            </g>
          )}

          {/* GIRL AVATAR */}
          {id === 'girl' && (
            <g id="girl-avatar-group">
              {/* Dress Tunic / Coral */}
              <path d="M48,115 C48,95 112,95 112,115 L106,145 H54 Z" fill="#EC4899" />
              {/* Star-themed pattern on dress */}
              <path d="M50,118 L104,142 L108,138 L54,114 Z" fill="#14B8A6" />
              {/* Cute collar */}
              <circle cx="80" cy="98" r="12" fill="#E2E8F0" />
              <circle cx="80" cy="98" r="8" fill="#FDE047" />

              {/* Head Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FED7AA" />

              {/* Two cute twin braids (behind head, popping out left and right) */}
              <path d="M48,80 C36,92 38,110 32,120 C30,123 34,127 38,122 C44,115 48,102 52,90 Z" fill="#1E293B" />
              <circle cx="32" cy="120" r="4.5" fill="#14B8A6" /> {/* Hair band left */}
              
              <path d="M112,80 C124,92 122,110 128,120 C130,123 126,127 122,122 C116,115 112,102 108,90 Z" fill="#1E293B" />
              <circle cx="128" cy="120" r="4.5" fill="#14B8A6" /> {/* Hair band right */}

              {/* Head Oval */}
              <circle cx="80" cy="72" r="26" fill="#FED7AA" />

              {/* Hair (Black/Dark braids with cute bangs on face) */}
              <path d="M52,68 C50,48 62,36 80,36 C98,36 110,48 108,68 C112,58 102,46 80,46 C58,46 48,58 52,68 Z" fill="#1E293B" />
              {/* Cute rounded bangs falling */}
              <path d="M54,62 Q68,64 72,70 Q76,64 80,72 Q84,64 88,70 Q92,64 106,62" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Flower Tiara/Headband */}
              <path d="M55,54 C65,48 95,48 105,54" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Three cute colorful flower beads */}
              <circle cx="80" cy="48" r="4" fill="#F472B6" />
              <circle cx="80" cy="48" r="1.5" fill="#FFFF00" />
              <circle cx="68" cy="50" r="4" fill="#67E8F9" />
              <circle cx="68" cy="50" r="1.5" fill="#FFFF00" />
              <circle cx="92" cy="50" r="4" fill="#FDE047" />
              <circle cx="92" cy="50" r="1.5" fill="#EC4899" />

              {/* Big adorable anime eyes */}
              <circle cx="70" cy="74" r="5" fill="#1E293B" />
              <circle cx="71.5" cy="72.5" r="1.8" fill="#FFFFFF" />
              <circle cx="90" cy="74" r="5" fill="#1E293B" />
              <circle cx="91.5" cy="72.5" r="1.8" fill="#FFFFFF" />

              {/* Little rosy cheeks */}
              <circle cx="61" cy="80" r="3.5" fill="#F43F5E" opacity="0.4" />
              <circle cx="99" cy="80" r="3.5" fill="#F43F5E" opacity="0.4" />

              {/* Smiling mouth */}
              <path d="M74,80.5 C76.5,85 83.5,85 86,80.5" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Nose */}
              <circle cx="80" cy="76.5" r="1.5" fill="#F97316" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Under Label */}
      <div id="avatar-label" className="text-center mt-1 pointer-events-none">
        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {id === 'boy' ? 'Hero Boy' : 'Hero Girl'}
        </span>
      </div>
    </div>
  );
}
