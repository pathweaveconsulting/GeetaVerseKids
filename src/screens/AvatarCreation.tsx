import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound, setActiveCompanionId } from '../utils/audio';
import { AvatarId, CompanionId } from '../types';
import AvatarViewer from '../components/AvatarViewer';
import CompanionViewer from '../components/CompanionViewer';
import { COMPANIONS } from '../quests';

interface AvatarCreationProps {
  onSave: (name: string, avatar: AvatarId, companion: CompanionId, ageGroup: 'explorer' | 'seeker' | 'guide') => void;
  onBack: () => void;
}

export default function AvatarCreation({ onSave, onBack }: AvatarCreationProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('boy');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionId>('gaja');
  const [selectedAge, setSelectedAge] = useState<'explorer' | 'seeker' | 'guide'>('seeker');
  const [errorText, setErrorText] = useState('');

  const handleAvatarSelect = (id: AvatarId) => {
    playSound.tap();
    setSelectedAvatar(id);
  };

  const handleCompanionSelect = (id: CompanionId) => {
    playSound.unlock();
    setSelectedCompanion(id);
    setActiveCompanionId(id);
  };

  const handleAgeSelect = (age: 'explorer' | 'seeker' | 'guide') => {
    playSound.tap();
    setSelectedAge(age);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      playSound.joke();
      setErrorText("Oops! What is your magical name?");
      return;
    }
    setErrorText('');
    playSound.success();
    setActiveCompanionId(selectedCompanion);
    onSave(name.trim(), selectedAvatar, selectedCompanion, selectedAge);
  };

  return (
    <div 
      id="avatar-creation-screen"
      className="min-h-screen py-8 px-4 md:px-8 bg-[#f9f5f0] text-amber-900 font-sans select-none flex flex-col justify-between relative overflow-hidden"
    >
      {/* Sleek Theme Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5b4fc33] via-[#fcd34d11] to-[#f9f5f0] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />

      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 z-10">
        <button
          type="button"
          onClick={() => { playSound.tap(); onBack(); }}
          className="text-indigo-950 font-black text-sm bg-white/60 backdrop-blur-md border border-white px-4 py-2.5 rounded-full hover:bg-white/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          ⬅️ Back
        </button>
        <span className="font-display font-black text-indigo-950 text-xl md:text-2xl tracking-wider">
          Create Your Quest Profile
        </span>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center">
        
        {/* Step 1: Name Entry */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 mb-6 flex flex-col items-center max-w-xl mx-auto w-full z-10">
          <label className="font-display font-black text-xl md:text-2xl text-indigo-950 mb-3 text-center">
            👋 Welcome Hero! What is your name?
          </label>
          <input
            type="text"
            placeholder="Type your magical name here..."
            value={name}
            onChange={(e) => {
              setName(e.target.value.slice(0, 16));
              if (errorText) setErrorText('');
            }}
            maxLength={16}
            className="w-full text-center font-display font-bold text-xl md:text-2xl text-indigo-950 bg-white border border-indigo-100 placeholder-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-3xl py-3.5 px-4 outline-none transition-all shadow-inner"
          />
          {errorText && (
            <motion.p 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-red-600 font-semibold text-sm mt-2"
            >
              ⚠️ {errorText}
            </motion.p>
          )}
          <p className="text-xs text-amber-700/80 font-medium mt-2">Maximum 16 letters</p>
        </div>

        {/* Step 2: Choose Persona / Companion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Choose Persona */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 flex flex-col items-center z-10">
            <h3 className="font-display font-black text-lg md:text-xl text-indigo-950 mb-4 flex items-center gap-1.5">
              🎭 Choose Your Avatar
            </h3>
            
            <div className="flex gap-6 md:gap-8 justify-center my-2">
              <button
                type="button"
                onClick={() => handleAvatarSelect('boy')}
                className={`relative p-4 rounded-3xl transition-all outline-none border-4  ${
                  selectedAvatar === 'boy' 
                    ? 'border-indigo-500 bg-indigo-50/50 scale-105 shadow-md' 
                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <AvatarViewer id="boy" size="sm" animated={selectedAvatar === 'boy'} />
                {selectedAvatar === 'boy' && (
                  <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1.5 text-xs font-bold leading-none">
                    ✨
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleAvatarSelect('girl')}
                className={`relative p-4 rounded-3xl transition-all outline-none border-4 ${
                  selectedAvatar === 'girl' 
                    ? 'border-indigo-500 bg-indigo-50/50 scale-105 shadow-md' 
                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <AvatarViewer id="girl" size="sm" animated={selectedAvatar === 'girl'} />
                {selectedAvatar === 'girl' && (
                  <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1.5 text-xs font-bold leading-none">
                    ✨
                  </div>
                )}
              </button>
            </div>
            
            <p className="text-xs text-amber-800 font-medium mt-3 text-center">
              This is how you will appear in the World of Confusion!
            </p>
          </div>

          {/* Choose Companion */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 flex flex-col items-center z-10">
            <h3 className="font-display font-black text-lg md:text-xl text-indigo-950 mb-3 flex items-center gap-1.5">
              🤝 Choose Your Companion
            </h3>

            <div className="grid grid-cols-4 gap-2 w-full my-1">
              {(['gaja', 'mayur', 'veeru', 'gauri'] as CompanionId[]).map((cId) => {
                const comp = COMPANIONS[cId];
                const active = selectedCompanion === cId;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => handleCompanionSelect(cId)}
                    className={`p-2.5 rounded-2xl transition-all border-3 flex flex-col items-center outline-none cursor-pointer ${
                      active
                        ? 'border-amber-500 bg-amber-100/60 scale-105 font-bold shadow-sm'
                        : 'border-transparent bg-amber-50/50 hover:bg-amber-100/30'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-sm mb-1">{comp.emoji}</span>
                    <span className="text-[10px] text-amber-950 font-black capitalize">{comp.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full mt-3 px-3 py-2 bg-orange-50/60 border border-orange-100 rounded-2xl min-h-[50px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={selectedCompanion}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="font-sans text-xs italic text-orange-950 text-center font-semibold leading-snug"
                >
                  "{COMPANIONS[selectedCompanion].quote}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Step 3: Age Adaptation Selection Options */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] md:rounded-[40px] shadow-2xl p-6 md:p-8 mb-8 flex flex-col items-center z-10">
          <h3 className="font-display font-black text-lg md:text-xl text-indigo-950 mb-4 flex items-center gap-1.5">
            🎯 Select Your Adventures Level
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {/* Explorer ages 6-8 */}
            <button
              type="button"
              onClick={() => handleAgeSelect('explorer')}
              className={`p-4 rounded-3xl border-3 text-left transition-all outline-none cursor-pointer flex flex-col ${
                selectedAge === 'explorer'
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-md scale-102'
                  : 'border-indigo-100 bg-white hover:bg-indigo-50/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🎨</span>
                <span className="font-display font-black text-sm text-indigo-950">Explorer (6-8 Yrs)</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 font-bold leading-relaxed">
                Playful stories and friendly analogies. Relates to fundamental kindness and focus with less reading!
              </p>
            </button>

            {/* Seeker ages 9-11 */}
            <button
              type="button"
              onClick={() => handleAgeSelect('seeker')}
              className={`p-4 rounded-3xl border-3 text-left transition-all outline-none cursor-pointer flex flex-col ${
                selectedAge === 'seeker'
                  ? 'border-amber-500 bg-amber-50/60 shadow-md scale-102'
                  : 'border-indigo-100 bg-white hover:bg-indigo-50/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌟</span>
                <span className="font-display font-black text-sm text-indigo-950">Seeker (9-11 Yrs)</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 font-bold leading-relaxed">
                Relatable school challenges, interactive word-by-word breakups, chanting, and engaging quiz trials.
              </p>
            </button>

            {/* Guide ages 12-13 */}
            <button
              type="button"
              onClick={() => handleAgeSelect('guide')}
              className={`p-4 rounded-3xl border-3 text-left transition-all outline-none cursor-pointer flex flex-col ${
                selectedAge === 'guide'
                  ? 'border-pink-500 bg-pink-50/60 shadow-md scale-102'
                  : 'border-indigo-100 bg-white hover:bg-indigo-50/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🧠</span>
                <span className="font-display font-black text-sm text-indigo-950">Guide (12-13 Yrs)</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 font-bold leading-relaxed">
                Ancient original Gita principles paired with critical self-reflection. Digs deeper into philosophical context!
              </p>
            </button>
          </div>
        </div>

        {/* Complete Profile Button */}
        <div className="flex justify-center z-10">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-display font-black text-lg sm:text-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:brightness-110 px-10 py-5 rounded-[28px] shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all duration-300 flex items-center gap-2 cursor-pointer touch-target"
          >
            🌟 Save & Enter GeetaVerse
          </motion.button>
        </div>
      </form>

      {/* Decorative prompt */}
      <p className="text-center text-[11px] text-amber-800/80 font-bold mt-6 z-10">
        No email, no passcodes, no tracking. All progress stays safely in your browser! 🌐
      </p>
    </div>
  );
}
