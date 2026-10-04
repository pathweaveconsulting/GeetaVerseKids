import React from 'react';
import { motion } from 'motion/react';

export type CharacterId = 'krishna' | 'arjuna' | 'dhritarashtra' | 'sanjaya' | 'bhishma' | 'drona' | 'duryodhana';

interface CharacterPortraitProps {
  id: CharacterId;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function CharacterPortrait({ id, size = 'md', animated = true }: CharacterPortraitProps) {
  const sizeClass = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-32 h-32 md:w-36 md:h-36',
    lg: 'w-44 h-44 md:w-52 md:h-52'
  }[size];

  // Soft floating/ breathing animation in dialogue screens
  const animationProps = animated ? {
    animate: {
      y: [0, -3, 0],
    },
    transition: {
      duration: 3 + (id.length % 3), // slight variation so characters don't sync up roboticly
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : {};

  // Display human readable names and traditional touch identifiers
  const nameLabel = {
    krishna: "Sri Krishna 🪶",
    arjuna: "Arjuna 🏹",
    dhritarashtra: "King Dhritarashtra 👑",
    sanjaya: "Sanjaya 🔮",
    bhishma: "Grandfather Bhishma 🛡️",
    drona: "Acharya Drona 🎯",
    duryodhana: "Prince Duryodhana 🗡️"
  }[id];

  return (
    <div id={`portrait-${id}-container`} className="flex flex-col items-center justify-center">
      <motion.div
        id={`portrait-art-${id}`}
        {...animationProps}
        whileHover={{ scale: 1.06 }}
        className={`${sizeClass} relative flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Floor Shadow */}
          <ellipse cx="80" cy="144" rx="42" ry="7" fill="#CBD5E1" opacity="0.6" />

          {/* 1. KRISHNA PORTRAIT (Blue Skin, Peacock Feather, Aura) */}
          {id === 'krishna' && (
            <g id="krishna-svg-group">
              <circle cx="80" cy="80" r="62" fill="#FEF08A" /> {/* Golden Aura */}
              <circle cx="80" cy="80" r="54" fill="#67E8F9" opacity="0.4" />

              {/* Tunic yellow */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#FBBF24" />
              {/* Cute red necklace with flower drop */}
              <circle cx="80" cy="104" r="8" fill="#EF4444" />
              <circle cx="80" cy="104" r="4" fill="#FBBF24" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#7DD3FC" />

              {/* Head sky blue */}
              <circle cx="80" cy="74" r="26" fill="#7DD3FC" />

              {/* Black hair curly spikes */}
              <path d="M52,65 C46,55 52,42 70,44 C76,36 94,38 102,48 C110,58 106,68 105,72 C110,64 104,52 80,50 C56,48 50,58 52,65 Z" fill="#1E293B" />
              
              {/* Grand crown */}
              <path d="M56,54 L80,26 L104,54 Z" fill="#F59E0B" />
              <path d="M68,54 L80,34 L92,54 Z" fill="#FBBF24" />
              {/* Rubies on crown */}
              <circle cx="80" cy="38" r="4" fill="#EF4444" />
              <circle cx="68" cy="50" r="3" fill="#10B981" />
              <circle cx="92" cy="50" r="3" fill="#10B981" />

              {/* PEACOCK FEATHER on top */}
              <path d="M80,26 Q86,10 94,14 Q96,20 86,22" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="92" cy="15" rx="6" ry="8" fill="#047857" transform="rotate(30 92 15)" />
              <ellipse cx="92" cy="15" rx="3" ry="5" fill="#3B82F6" transform="rotate(30 92 15)" />
              <circle cx="92" cy="15" r="1.5" fill="#FBBF24" />

              {/* Holy yellow/red Tilak on forehead */}
              <path d="M78,54 V66 C78,67 82,67 82,66 V54 Z" fill="#FBBF24" />
              <circle cx="80" cy="65" r="2" fill="#EF4444" />

              {/* Admirable anime dark eyes */}
              <circle cx="70" cy="74" r="4.5" fill="#0F172A" />
              <circle cx="71.5" cy="72" r="1.5" fill="#FFFFFF" />
              <circle cx="90" cy="74" r="4.5" fill="#0F172A" />
              <circle cx="91.5" cy="72" r="1.5" fill="#FFFFFF" />

              {/* Rose cheeks */}
              <circle cx="63" cy="80" r="3" fill="#EC4899" opacity="0.35" />
              <circle cx="97" cy="80" r="3" fill="#EC4899" opacity="0.35" />

              {/* Smiling mouth and nose */}
              <path d="M74,82 C76,86 84,86 86,82" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="80" cy="78" r="1.5" fill="#38BDF8" />
            </g>
          )}

          {/* 2. ARJUNA PORTRAIT (Young Prince, Warrior crown, Arrows) */}
          {id === 'arjuna' && (
            <g id="arjuna-svg-group">
              <circle cx="80" cy="80" r="62" fill="#EEF2FF" /> {/* Light Indigo Back */}
              <circle cx="80" cy="80" r="54" fill="#3B82F6" opacity="0.15" />

              {/* Arrows in quiver peaking on left back */}
              <rect x="42" y="34" width="8" height="28" fill="#1E293B" transform="rotate(-20 42 34)" rx="2" />
              <path d="M30,30 L40,20 L35,16 Z" fill="#EF4444" />
              <path d="M38,34 L48,24 L43,20 Z" fill="#EF4444" />

              {/* Warrior armor back */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#3B82F6" />
              {/* Golden circular amulet plates */}
              <circle cx="64" cy="122" r="6" fill="#FBBF24" />
              <circle cx="96" cy="122" r="6" fill="#FBBF24" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FED7AA" />

              {/* Head warm flesh */}
              <circle cx="80" cy="74" r="26" fill="#FED7AA" />

              {/* Brave thick curly hair */}
              <path d="M52,70 C48,50 56,38 80,38 C104,38 112,50 108,70 C106,60 100,50 80,50 C60,50 54,60 52,70 Z" fill="#1E293B" />

              {/* Heroic pointy golden helmet crown */}
              <path d="M58,54 L80,22 L102,54 Z" fill="#FBBF24" />
              <rect x="77" y="24" width="6" height="32" fill="#EF4444" /> {/* center ribbon */}
              <circle cx="80" cy="22" r="4.5" fill="#FBBF24" />

              {/* Brave high eyebrows */}
              <path d="M64,66 Q70,62 76,67" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M84,67 Q90,62 96,66" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Determined focused eyes */}
              <circle cx="70" cy="74" r="4" fill="#1E293B" />
              <circle cx="71" cy="73" r="1.3" fill="#FFFFFF" />
              <circle cx="90" cy="74" r="4" fill="#1E293B" />
              <circle cx="91" cy="73" r="1.3" fill="#FFFFFF" />

              {/* Smiling courageous lip */}
              <path d="M74,83 C76,85 84,85 86,83" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="80" cy="78" r="1.5" fill="#F97316" />
            </g>
          )}

          {/* 3. DHRITARASHTRA PORTRAIT (Blind King, White Beard, Sovereign) */}
          {id === 'dhritarashtra' && (
            <g id="dhritarashtra-svg-group">
              <circle cx="80" cy="80" r="62" fill="#FEE2E2" /> {/* Scarlet background */}
              <circle cx="80" cy="80" r="54" fill="#9F1239" opacity="0.15" />

              {/* Sovereign royal mantle chest */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#9F1239" />
              {/* Pearls strings */}
              <circle cx="70" cy="116" r="3" fill="#FFFFFF" />
              <circle cx="80" cy="118" r="3" fill="#FFFFFF" />
              <circle cx="90" cy="116" r="3" fill="#FFFFFF" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FDBA74" />

              {/* Wise round white beard */}
              <path d="M54,82 C54,115 106,115 106,82 Z" fill="#F1F5F9" />
              <path d="M62,82 C62,102 98,102 98,82 Z" fill="#E2E8F0" />

              {/* Head skin */}
              <circle cx="80" cy="74" r="26" fill="#FDBA74" />

              {/* Noble white hair curls on sides */}
              <circle cx="53" cy="72" r="8" fill="#F1F5F9" />
              <circle cx="107" cy="72" r="8" fill="#F1F5F9" />

              {/* Double crown tier */}
              <path d="M54,52 L80,18 L106,52 Z" fill="#D97706" />
              <path d="M60,52 L80,28 L100,52 Z" fill="#F59E0B" />
              <circle cx="80" cy="18" r="5" fill="#EF4444" />

              {/* Peaceful closed eyes (blindness represented gracefully for children) */}
              <path d="M65,74 Q70,78 75,74" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M85,74 Q90,78 95,74" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Serene mouth */}
              <path d="M75,85 Q80,88 85,85" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 4. SANJAYA PORTRAIT (Wise Turbanned Narrator, Thoughtful) */}
          {id === 'sanjaya' && (
            <g id="sanjaya-svg-group">
              <circle cx="80" cy="80" r="62" fill="#FFEDD5" /> {/* Saffron orange bg */}
              <circle cx="80" cy="80" r="54" fill="#D97706" opacity="0.1" />

              {/* Simple pure yellow shawl */}
              <path d="M48,118 C48,102 112,102 112,118 L106,145 H54 Z" fill="#EA580C" />
              <path d="M48,118 Q80,132 112,118" stroke="#F97316" strokeWidth="4" fill="none" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FED7AA" />

              {/* Short gray beard */}
              <path d="M60,86 C60,104 100,104 100,86 Z" fill="#CBD5E1" />

              {/* Head skin */}
              <circle cx="80" cy="74" r="26" fill="#FED7AA" />

              {/* Traditional pink wrapping turban */}
              <ellipse cx="80" cy="50" rx="28" ry="11" fill="#EC4899" />
              <path d="M52,48 C56,36 80,34 94,38 L106,46 L54,52 Z" fill="#D946EF" />
              {/* Turquoise jewel */}
              <circle cx="80" cy="46" r="4" fill="#06B6D4" />

              {/* Intelligent eyes */}
              <circle cx="69" cy="74" r="4.5" fill="#1E293B" />
              <circle cx="70.5" cy="72.5" r="1.5" fill="#FFFFFF" />
              <circle cx="91" cy="74" r="4.5" fill="#1E293B" />
              <circle cx="92.5" cy="72.5" r="1.5" fill="#FFFFFF" />

              {/* red horizontal tilak mark on forehead */}
              <line x1="72" y1="62" x2="88" y2="62" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

              {/* Calming gentle smile */}
              <path d="M75,81.5 Q80,84 85,81.5" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Nose */}
              <circle cx="80" cy="77" r="1.5" fill="#F97316" />
            </g>
          )}

          {/* 5. BHISHMA PORTRAIT (Elder Knight Warrior, Patriarch) */}
          {id === 'bhishma' && (
            <g id="bhishma-svg-group">
              <circle cx="80" cy="80" r="62" fill="#E0F2FE" /> {/* Cool blue aura bg */}
              <circle cx="80" cy="80" r="54" fill="#1E293B" opacity="0.1" />

              {/* Silver armored chest */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#64748B" />
              <path d="M68,112 L80,102 L92,112" stroke="#E2E8F0" strokeWidth="3" fill="none" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FDBA74" />

              {/* Massive elder silver beard */}
              <path d="M50,80 C50,122 110,122 110,80 Z" fill="#F8FAFC" />
              <path d="M58,80 C58,110 102,110 102,80 Z" fill="#E2E8F0" />

              {/* Head skin */}
              <circle cx="80" cy="74" r="26" fill="#FDBA74" />

              {/* Long white hair locks dripping */}
              <path d="M53,60 Q40,84 48,102 Q55,80 55,60" fill="#F8FAFC" />
              <path d="M107,60 Q120,84 112,102 Q105,80 105,60" fill="#F8FAFC" />

              {/* Golden majestic crown with red ruby center */}
              <path d="M56,54 L80,24 L104,54 Z" fill="#D97706" />
              <path d="M64,54 L80,34 L96,54 Z" fill="#FCD34D" />
              <circle cx="80" cy="36" r="4.5" fill="#EF4444" />

              {/* Grandfatherly kind eyes */}
              <path d="M64,65 Q70,62 76,65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="70" cy="74" r="4" fill="#334155" />
              <circle cx="71" cy="73" r="1.2" fill="#FFFFFF" />

              <path d="M84,65 Q90,62 96,65" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="90" cy="74" r="4" fill="#334155" />
              <circle cx="91" cy="73" r="1.2" fill="#FFFFFF" />

              {/* Loving smile */}
              <path d="M75,83 Q80,86 85,83" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 6. DRONA PORTRAIT (Wise Archery Teacher Acharya, Holy Tilak) */}
          {id === 'drona' && (
            <g id="drona-svg-group">
              <circle cx="80" cy="80" r="62" fill="#FFFBEB" /> {/* Honey gold background */}
              <circle cx="80" cy="80" r="54" fill="#B45309" opacity="0.1" />

              {/* Traditional saffron wrap robe */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#D97706" />
              {/* Rudraksha auspicious beads seed necklace */}
              <circle cx="68" cy="116" r="4" fill="#78350F" />
              <circle cx="74" cy="119" r="4" fill="#78350F" />
              <circle cx="80" cy="120" r="4.5" fill="#EA580C" /> {/* Center pendant */}
              <circle cx="86" cy="119" r="4" fill="#78350F" />
              <circle cx="92" cy="116" r="4" fill="#78350F" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FDBA74" />

              {/* Wise teacher light beard */}
              <path d="M56,84 C56,110 104,110 104,84 Z" fill="#E2E8F0" />

              {/* Head skin */}
              <circle cx="80" cy="74" r="26" fill="#FDBA74" />

              {/* Elder topknot bun hair */}
              <circle cx="80" cy="40" r="10" fill="#1E293B" />
              <circle cx="80" cy="40" r="6" fill="#E2E8F0" opacity="0.4" />
              <rect x="74" y="48" width="12" height="4" fill="#EF4444" /> {/* Hair band red */}

              {/* Hair strands wrap */}
              <path d="M54,64 C50,48 58,45 80,46 C102,45 110,48 106,64" stroke="#1E293B" strokeWidth="6" fill="none" />

              {/* Holy yellow/red U-tilak on forehead (Vaisnava touch) */}
              <path d="M78,54 V64 C78,65 82,65 82,64 V54 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />
              <circle cx="80" cy="63" r="1.5" fill="#EF4444" />

              {/* Sharp, focused archery master eyes */}
              <circle cx="70" cy="74" r="4" fill="#1E293B" />
              <circle cx="71.2" cy="72.5" r="1.3" fill="#FFFFFF" />
              <circle cx="90" cy="74" r="4" fill="#1E293B" />
              <circle cx="91.2" cy="72.5" r="1.3" fill="#FFFFFF" />

              {/* Gentle thoughtful smile */}
              <path d="M75,81 Q80,83.5 85,81" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 7. DURYODHANA PORTRAIT (Ambitious Prince, Furrowed expression) */}
          {id === 'duryodhana' && (
            <g id="duryodhana-svg-group">
              <circle cx="80" cy="80" r="62" fill="#F5F5F4" /> {/* Grey stone background */}
              <circle cx="80" cy="80" r="54" fill="#EF4444" opacity="0.12" />

              {/* Luxury crimson gold robe and plates */}
              <path d="M48,118 C48,100 112,100 112,118 L106,145 H54 Z" fill="#9F1239" />
              {/* Gold shoulder guards */}
              <path d="M48,118 C52,110 65,110 68,118 Z" fill="#FBBF24" />
              <path d="M112,118 C108,110 95,110 92,118 Z" fill="#FBBF24" />

              {/* Neck */}
              <rect x="74" y="85" width="12" height="18" fill="#FDBA74" />

              {/* Head skin */}
              <circle cx="80" cy="74" r="26" fill="#FDBA74" />

              {/* Royal curling black mustache */}
              <path d="M68,80 C74,80 77,77 80,80 C83,77 86,80 92,80 V83 C86,83 83,81 80,81 C77,81 74,83 68,83 Z" fill="#1E293B" />

              {/* Proud golden crown with large purple amethyst stone */}
              <path d="M56,54 L80,24 L104,54 Z" fill="#B45309" />
              <path d="M64,54 L80,32 L96,54 Z" fill="#FCD34D" />
              <rect x="76" y="32" width="8" height="22" fill="#8B5CF6" /> {/* vertical gem */}
              <circle cx="80" cy="24" r="4.5" fill="#FCD34D" />

              {/* Proud furrowed eyebrows */}
              <path d="M63,64 Q70,68 77,65" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M83,65 Q90,68 97,64" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Ambitious sharp eyes */}
              <circle cx="70" cy="73" r="4.5" fill="#1E293B" />
              <circle cx="71.5" cy="71.5" r="1.3" fill="#FFFFFF" />
              <circle cx="90" cy="73" r="4.5" fill="#1E293B" />
              <circle cx="91.5" cy="71.5" r="1.3" fill="#FFFFFF" />

              {/* Royal look lip */}
              <line x1="75" y1="84" x2="85" y2="84" stroke="#9F1239" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Auxiliary Label */}
      <div id={`portrait-label-${id}`} className="text-center mt-1 pointer-events-none z-10">
        <span className="text-[10px] bg-indigo-50 text-indigo-950 font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
          {nameLabel}
        </span>
      </div>
    </div>
  );
}
