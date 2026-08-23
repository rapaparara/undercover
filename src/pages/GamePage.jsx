import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { PlayerJoinScreen } from '../components/game/PlayerJoinScreen.jsx';
import { WordRevealCard } from '../components/game/WordRevealCard.jsx';
import { DiscussionPhase } from '../components/game/DiscussionPhase.jsx';
import { VotingPhase } from '../components/game/VotingPhase.jsx';
import { EliminationResult } from '../components/game/EliminationResult.jsx';
import { MrWhiteGuessScreen } from '../components/game/MrWhiteGuessScreen.jsx';

export function GamePage() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
      {phase === 'PLAYER_JOIN' && <PlayerJoinScreen />}
      {phase === 'REVEAL' && <WordRevealCard />}
      {phase === 'DISCUSSION' && <DiscussionPhase />}
      {phase === 'VOTING' && <VotingPhase />}
      {phase === 'ELIMINATION' && <EliminationResult />}
      {phase === 'MR_WHITE_GUESS' && <MrWhiteGuessScreen />}
    </div>
  );
}
