import React, { useState, useSyncExternalStore } from 'react';
import { getSoundStatus, subscribeSoundStatus } from '../utils/audio';

// A small, friendly note when sound or narration can't play. It sits above
// the screen (not over it) and can be closed.
export default function SoundNote() {
  const status = useSyncExternalStore(subscribeSoundStatus, getSoundStatus, getSoundStatus);
  const [dismissed, setDismissed] = useState(false);
  if (status === 'on' || dismissed) return null;

  const message =
    status === 'speech-off'
      ? "Voice narration isn't available here, so you can read along. Everything else works!"
      : "Sound is off on this device. You can still play everything!";

  return (
    <div id="sound-note" role="status" className="mx-auto mt-2 px-4 w-full max-w-xl z-20">
      <div className="flex items-center gap-2 bg-white/90 border border-amber-200 rounded-full pl-4 pr-1 py-1 shadow-md text-xs font-bold text-amber-900">
        <span className="text-base" aria-hidden="true">🔇</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Close sound note"
          className="rounded-full hover:bg-amber-50 text-amber-800 font-black cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
