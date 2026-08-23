import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PassDeviceScreen } from './PassDeviceScreen.jsx';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { UserPlus, AlertCircle, CheckCircle2, Smile } from 'lucide-react';
import { hapticPulse } from '../../utils/deviceFeatures.js';

const EMOJI_OPTIONS = ['🦁', '🦊', '🐺', '🐻', '🐼', '🐵', '🦄', '🐲', '🚀', '⭐', '🔥', '👑'];

export function PlayerJoinScreen() {
  const players = useGameStore((state) => state.players);
  const totalPlayerCount = useGameStore((state) => state.totalPlayerCount);
  const joinPlayer = useGameStore((state) => state.joinPlayer);

  const [step, setStep] = useState('pass'); // 'pass' | 'input'
  const [nameInput, setNameInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[players.length % EMOJI_OPTIONS.length]);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentPlayerNum = players.length + 1;

  const handleContinuePass = () => {
    setStep('input');
    setDuplicateWarning(false);
    setErrorMsg('');
    setNameInput('');
    setSelectedEmoji(EMOJI_OPTIONS[players.length % EMOJI_OPTIONS.length]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Silakan masukkan nama yang valid.');
      return;
    }

    // Check case-insensitive duplicate
    const isDuplicate = players.some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate && !duplicateWarning) {
      setDuplicateWarning(true);
      setErrorMsg(`Nama "${trimmed}" sudah digunakan oleh pemain lain. Masukkan nama lain atau tekan Konfirmasi lagi untuk tetap menggunakannya.`);
      return;
    }

    let finalName = trimmed;
    if (isDuplicate && duplicateWarning) {
      const dupeCount = players.filter(
        (p) => p.name.trim().toLowerCase().startsWith(trimmed.toLowerCase())
      ).length;
      finalName = `${trimmed} (${dupeCount + 1})`;
    }

    hapticPulse(40);
    const success = joinPlayer(finalName, selectedEmoji);
    if (success) {
      setStep('pass');
    }
  };

  if (step === 'pass') {
    return (
      <PassDeviceScreen
        message={`Oper HP ke Pemain ${currentPlayerNum} dari ${totalPlayerCount}`}
        subMessage="Berikan HP ke orang berikutnya yang duduk di lingkaran."
        actionLabel={`Saya Pemain ${currentPlayerNum} — Isi Nama`}
        onContinue={handleContinuePass}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto my-auto">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-1">
            <UserPlus className="w-7 h-7" />
          </div>
          <span className="block text-xs font-extrabold uppercase tracking-widest text-violet-400">
            Kursi #{currentPlayerNum} dari {totalPlayerCount}
          </span>
          <h2 className="text-2xl font-black text-slate-100">Registrasi Mandiri</h2>
          <p className="text-sm text-slate-400">
            Masukkan nama Anda untuk mengunci posisi duduk dalam permainan!
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Nama Anda
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setDuplicateWarning(false);
                setErrorMsg('');
              }}
              placeholder="contoh: Budi, Ani, Andi..."
              maxLength={20}
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Opsi Emoji Avatar */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Smile className="w-4 h-4 text-amber-400" /> Pilih Emoji Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-2 rounded-xl border transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-violet-600/40 border-violet-400 scale-105 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div
            className={`flex items-start gap-2 text-xs font-medium py-2.5 px-3 rounded-lg border ${
              duplicateWarning
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Button
          type="submit"
          variant={duplicateWarning ? 'purple' : 'primary'}
          size="lg"
          fullWidth
        >
          {duplicateWarning ? (
            <>Tetap Gunakan Nama Ini</>
          ) : (
            <>
              Konfirmasi & Oper HP <CheckCircle2 className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
