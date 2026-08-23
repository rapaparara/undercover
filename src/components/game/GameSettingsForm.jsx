import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { CATEGORIES } from '../../data/wordPairs.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Settings, Shield, UserX, Folder, Clock, Vote, RotateCw, Play, ArrowLeft } from 'lucide-react';

export function GameSettingsForm({ onBack }) {
  const totalPlayerCount = useGameStore((state) => state.totalPlayerCount);
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const startPlayerJoin = useGameStore((state) => state.startPlayerJoin);

  const maxUndercoverAllowed = Math.max(1, Math.floor(totalPlayerCount / 3));

  const [numUndercover, setNumUndercover] = useState(
    Math.min(settings.numUndercover || 1, maxUndercoverAllowed)
  );
  const [includeMrWhite, setIncludeMrWhite] = useState(!!settings.includeMrWhite);
  const [category, setCategory] = useState(settings.category || 'random');
  const [discussionTimerSeconds, setDiscussionTimerSeconds] = useState(
    settings.discussionTimerSeconds !== undefined ? settings.discussionTimerSeconds : 60
  );
  const [votingMode, setVotingMode] = useState(settings.votingMode || 'manual');
  const [rotateStartingSpeaker, setRotateStartingSpeaker] = useState(
    settings.rotateStartingSpeaker !== undefined ? settings.rotateStartingSpeaker : true
  );

  const [validationError, setValidationError] = useState('');

  const validate = (ucCount, mrW) => {
    const impostorCount = ucCount + (mrW ? 1 : 0);
    const civilianCount = totalPlayerCount - impostorCount;
    if (civilianCount < 2) {
      setValidationError(`Penyusup terlalu banyak! Anda harus menyisakan minimal 2 Warga Sipil untuk total ${totalPlayerCount} pemain.`);
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleUndercoverChange = (val) => {
    const newUc = Number(val);
    setNumUndercover(newUc);
    validate(newUc, includeMrWhite);
  };

  const handleMrWhiteToggle = (e) => {
    const val = e.target.checked;
    setIncludeMrWhite(val);
    validate(numUndercover, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(numUndercover, includeMrWhite)) return;

    updateSettings({
      numUndercover,
      includeMrWhite,
      category,
      discussionTimerSeconds,
      votingMode,
      rotateStartingSpeaker,
    });

    startPlayerJoin();
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">Aturan & Pengaturan Game</h2>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-slate-800 text-indigo-300 rounded-full border border-slate-700">
            {totalPlayerCount} Pemain
          </span>
        </div>

        <div className="space-y-5">
          {/* Jumlah Undercover */}
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Shield className="w-4 h-4 text-emerald-400" /> Pemain Undercover
              </label>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {numUndercover}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={maxUndercoverAllowed}
              value={numUndercover}
              onChange={(e) => handleUndercoverChange(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-xs text-slate-400">
              Maksimal diizinkan untuk {totalPlayerCount} pemain: {maxUndercoverAllowed} Undercover
            </p>
          </div>

          {/* Sakelar Mr White */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <UserX className="w-4 h-4 text-violet-400" /> Sertakan Mr. White
              </label>
              <p className="text-xs text-slate-400">
                Mr. White tidak punya kata & harus menebak kata Warga Sipil saat tereliminasi
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeMrWhite}
                onChange={handleMrWhiteToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>

          {/* Kategori Kata */}
          <div className="glass-card p-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Folder className="w-4 h-4 text-amber-400" /> Kategori Kata
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Pemungutan Suara */}
          <div className="glass-card p-4 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Vote className="w-4 h-4 text-sky-400" /> Mode Pemungutan Suara
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVotingMode('manual')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  votingMode === 'manual'
                    ? 'bg-sky-600/30 border-sky-500 text-sky-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual (Hitung Ruangan)
              </button>
              <button
                type="button"
                onClick={() => setVotingMode('private')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  votingMode === 'private'
                    ? 'bg-sky-600/30 border-sky-500 text-sky-200 shadow-md'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Rahasia (Oper HP)
              </button>
            </div>
          </div>

          {/* Pengatur Waktu & Rotasi Pembicara */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-emerald-400" /> Waktu Diskusi
              </label>
              <select
                value={discussionTimerSeconds}
                onChange={(e) => setDiscussionTimerSeconds(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={0}>Tanpa Pengatur Waktu</option>
                <option value={30}>30 Detik</option>
                <option value={60}>60 Detik (Bawaan)</option>
                <option value={90}>90 Detik</option>
                <option value={120}>2 Menit</option>
              </select>
            </div>

            <div className="glass-card p-4 flex flex-col justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <RotateCw className="w-4 h-4 text-purple-400" /> Putar Pembicara
              </label>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400">Putar urutan bicara tiap putaran</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rotateStartingSpeaker}
                    onChange={(e) => setRotateStartingSpeaker(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {validationError && (
          <p className="text-sm text-rose-400 text-center font-medium bg-rose-950/30 border border-rose-900/50 py-2 px-3 rounded-lg">
            {validationError}
          </p>
        )}

        <Button type="submit" variant="primary" size="xl" fullWidth>
          Mulai Registrasi Pemain <Play className="w-5 h-5 ml-2 fill-current" />
        </Button>
      </form>
    </Card>
  );
}
