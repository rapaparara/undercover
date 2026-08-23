import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { Play, RotateCcw, ShieldAlert } from 'lucide-react';

export function ResumeGamePrompt({ onResume, onDiscard }) {
  const players = useGameStore((state) => state.players);
  const phase = useGameStore((state) => state.phase);
  const round = useGameStore((state) => state.round);

  return (
    <Card className="w-full max-w-md mx-auto my-auto text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
          Game Belum Selesai Ditemukan
        </span>
        <h2 className="text-2xl font-black text-slate-100">Lanjutkan Game Sebelumnya?</h2>
        <p className="text-sm text-slate-300">
          Sesi game dengan {players.length} pemain sedang berlangsung (Putaran {round}, Fase: {phase}).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Button variant="outline" onClick={onDiscard}>
          <RotateCcw className="w-4 h-4 mr-2" /> Hapus Game
        </Button>
        <Button variant="primary" onClick={onResume}>
          <Play className="w-4 h-4 mr-2 fill-current" /> Lanjutkan Game
        </Button>
      </div>
    </Card>
  );
}
