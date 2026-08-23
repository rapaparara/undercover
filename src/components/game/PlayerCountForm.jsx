import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Users, Minus, Plus, ArrowRight } from 'lucide-react';

export function PlayerCountForm({ onNext }) {
  const totalPlayerCount = useGameStore((state) => state.totalPlayerCount);
  const setTotalPlayerCount = useGameStore((state) => state.setTotalPlayerCount);

  const [count, setCount] = useState(totalPlayerCount || 4);
  const [error, setError] = useState('');

  const handleDecrement = () => {
    if (count > 3) {
      setCount(count - 1);
      setError('');
    } else {
      setError('Minimal 3 pemain diperlukan untuk permainan Undercover');
    }
  };

  const handleIncrement = () => {
    if (count < 12) {
      setCount(count + 1);
      setError('');
    } else {
      setError('Maksimal 12 pemain didukung dalam satu perangkat');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (count < 3 || count > 12) {
      setError('Silakan pilih antara 3 hingga 12 pemain.');
      return;
    }
    setTotalPlayerCount(count);
    if (onNext) onNext();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-2">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-100">Jumlah Pemain</h2>
          <p className="text-sm text-slate-400">
            Berapa banyak orang yang bermain di lingkaran Anda?
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 py-4">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={count <= 3}
            className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Minus className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-6xl font-black text-white font-mono tracking-tight">
              {count}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Pemain
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={count >= 12}
            className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-rose-400 text-center font-medium bg-rose-950/30 border border-rose-900/50 py-2 px-3 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth>
          Lanjut: Pengaturan Game <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </Card>
  );
}
