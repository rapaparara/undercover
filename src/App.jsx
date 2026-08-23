import React, { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore.js';
import { HomePage } from './pages/HomePage.jsx';
import { SetupPage } from './pages/SetupPage.jsx';
import { GamePage } from './pages/GamePage.jsx';
import { ResultPage } from './pages/ResultPage.jsx';
import { requestWakeLock, releaseWakeLock } from './utils/deviceFeatures.js';

export default function App() {
  const phase = useGameStore((state) => state.phase);
  const resetToSetup = useGameStore((state) => state.resetToSetup);
  const wakeLockRef = useRef(null);

  // Screen Wake Lock Lifecycle (Section 10.10)
  useEffect(() => {
    const isGameplayActive =
      phase !== 'HOME' && phase !== 'GAME_OVER';

    async function manageWakeLock() {
      if (isGameplayActive) {
        if (!wakeLockRef.current) {
          wakeLockRef.current = await requestWakeLock();
        }
      } else {
        if (wakeLockRef.current) {
          await releaseWakeLock(wakeLockRef.current);
          wakeLockRef.current = null;
        }
      }
    }

    manageWakeLock();

    return () => {
      if (wakeLockRef.current) {
        releaseWakeLock(wakeLockRef.current);
        wakeLockRef.current = null;
      }
    };
  }, [phase]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {phase === 'HOME' && (
        <HomePage onStartNewGame={resetToSetup} />
      )}
      {phase === 'SETUP' && (
        <SetupPage />
      )}
      {(phase === 'PLAYER_JOIN' ||
        phase === 'REVEAL' ||
        phase === 'DISCUSSION' ||
        phase === 'VOTING' ||
        phase === 'ELIMINATION' ||
        phase === 'MR_WHITE_GUESS') && (
        <GamePage />
      )}
      {phase === 'GAME_OVER' && (
        <ResultPage />
      )}
    </main>
  );
}
