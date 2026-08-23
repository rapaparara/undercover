import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PassDeviceScreen } from './PassDeviceScreen.jsx';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { HelpCircle, Send } from 'lucide-react';

export function MrWhiteGuessScreen() {
  const eliminatedPlayer = useGameStore((state) => state.eliminatedPlayer);
  const submitMrWhiteGuess = useGameStore((state) => state.submitMrWhiteGuess);

  const [step, setStep] = useState('pass'); // 'pass' | 'guess'
  const [guessInput, setGuessInput] = useState('');

  if (!eliminatedPlayer) return null;

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    submitMrWhiteGuess(guessInput);
  };

  if (step === 'pass') {
    return (
      <PassDeviceScreen
        message="Berikan HP ke Mr. White"
        playerName={eliminatedPlayer.name}
        avatarEmoji={eliminatedPlayer.avatarEmoji}
        subMessage="Anda memiliki satu kesempatan terakhir untuk menebak kata rahasia Warga Sipil!"
        actionLabel={`Saya ${eliminatedPlayer.name} — Tebak Kata`}
        onContinue={() => setStep('guess')}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto my-auto text-center space-y-6">
      <div className="space-y-3 border-b border-slate-800 pb-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800">
          Pembalasan Terakhir
        </span>
        <h2 className="text-2xl font-black text-slate-100">Tebak Kata Warga Sipil</h2>
        <p className="text-xs text-slate-300">
          Jika tebakan Anda cocok dengan kata rahasia Warga Sipil, <span className="font-bold text-violet-300">Anda langsung memenangkan seluruh permainan!</span>
        </p>
      </div>

      <form onSubmit={handleGuessSubmit} className="space-y-4">
        <div className="space-y-1 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Tebakan Kata Rahasia Anda
          </label>
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Ketik kata di sini..."
            autoFocus
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-lg font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <Button type="submit" variant="purple" size="xl" fullWidth>
          Kirim Tebakan <Send className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </Card>
  );
}
