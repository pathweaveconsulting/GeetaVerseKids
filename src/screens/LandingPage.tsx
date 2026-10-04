import React from 'react';
import { motion } from 'motion/react';
import { playSound } from '../utils/audio';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const handleStart = () => {
    playSound.unlock();
    onStart();
  };

  return (
    <div 
      id="landing-screen" 
      className="min-h-screen flex flex-col justify-between p-6 md:p-12 relative overflow-hidden bg-[#f9f5f0] text-amber-900 font-sans select-none"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* Floating Sparkles Background */}
      <div id="landing-sparkles" className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300 opacity-40 blur-[1px]"
            style={{
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [-25, 25],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Decorative clouds */}
      <div className="absolute top-10 -left-10 w-44 h-24 bg-white/40 blur-xl rounded-full pointer-events-none animate-float-slow" />
      <div className="absolute bottom-20 -right-10 w-60 h-28 bg-white/30 blur-xl rounded-full pointer-events-none animate-float" />

      {/* Header section (Logo or brand element) */}
      <div id="landing-header" className="flex justify-between items-center z-10">
        <span className="font-display font-bold text-amber-800 text-lg md:text-xl flex items-center gap-1.5 tracking-wider">
          🕉️ GeetaVerse Kids
        </span>
        <div className="bg-amber-100 text-amber-900 border border-amber-200/65 rounded-full px-4 py-1 text-xs font-bold tracking-wide shadow-sm">
          🌟 Playable MVP
        </div>
      </div>

      {/* Centered Hero Content */}
      <div id="landing-hero-body" className="max-w-2xl mx-auto flex flex-col items-center text-center my-auto z-10 px-4">
        {/* Glowing floating tree icon mockup using CSS/SVG */}
        <motion.div
          id="hero-tree-logo"
          initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="relative w-44 h-44 mb-6 md:mb-8 flex items-center justify-center cursor-pointer"
          onClick={() => playSound.tap()}
          whileHover={{ scale: 1.08, rotate: 3 }}
        >
          {/* Pulsing light rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-2xl animate-pulse-gentle" />
          <div className="absolute w-36 h-36 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-2xl">
            {/* Fun simplified vector tree logo */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-sm">
              <path d="M50,85 C53,70 47,45 50,25 C55,45 61,70 50,85 Z" fill="#854D0E" />
              {/* Green canopy drops */}
              <circle cx="50" cy="30" r="16" fill="#22C55E" />
              <circle cx="38" cy="42" r="14" fill="#15803D" />
              <circle cx="62" cy="42" r="14" fill="#4ADE80" />
              {/* Shiny stars */}
              <circle cx="48" cy="24" r="2.5" fill="#FEF08A" />
              <circle cx="60" cy="38" r="3" fill="#FEF08A" />
              <circle cx="36" cy="45" r="2" fill="#FEF08A" />
            </svg>
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 text-3xl animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            🌸
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="landing-title"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-amber-950 tracking-tight leading-none mb-4"
        >
          Grow Your <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy underline-offset-4">Wisdom World</span>
        </motion.h1>

        {/* Subheadline as requested */}
        <motion.p
          id="landing-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-sans text-amber-900 text-base sm:text-lg md:text-xl font-medium max-w-lg mb-8 md:mb-10 leading-relaxed"
        >
          Help restore the magical Wisdom Tree one quest at a time.
        </motion.p>

        {/* Primary CTA with bouncy spring physics */}
        <motion.button
          id="btn-start-adventure"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="font-display font-black text-lg md:text-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-600 px-10 py-5 rounded-[28px] cursor-pointer shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:brightness-110 transition-all flex items-center gap-3 touch-target"
        >
          Start Adventure <span className="text-xl">➔</span>
        </motion.button>
      </div>

      {/* Footer credits and gameplay pitch for the child */}
      <div id="landing-footer" className="text-center z-10 pt-4 flex flex-col items-center gap-2">
        <div className="flex justify-center gap-3 text-2xl animate-float">
          <span>🐘</span>
          <span>🦚</span>
          <span>🐒</span>
          <span>🐄</span>
        </div>
        <p className="font-sans text-xs text-amber-800/80 font-medium tracking-wide">
          An offline-first magical quest designed for brave young hearts | Age 6-13
        </p>
      </div>
    </div>
  );
}
