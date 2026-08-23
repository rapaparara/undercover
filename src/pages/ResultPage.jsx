import React from 'react';
import { GameOverScreen } from '../components/game/GameOverScreen.jsx';

export function ResultPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <GameOverScreen />
    </div>
  );
}
