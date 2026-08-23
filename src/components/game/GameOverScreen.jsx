import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Trophy, Shield, Skull, HelpCircle, RotateCcw, Home, Award } from 'lucide-react';

export function GameOverScreen() {
  const players = useGameStore((state) => state.players);
  const winner = useGameStore((state) => state.winner);
  const civilianWord = useGameStore((state) => state.civilianWord);
  const undercoverWord = useGameStore((state) => state.undercoverWord);
  const sessionStats = useGameStore((state) => state.sessionStats);
  const playAgain = useGameStore((state) => state.playAgain);
  const resetToSetup = useGameStore((state) => state.resetToSetup);

  const [activeTab, setActiveTab] = useState('roles');

  const winnerConfigs = {
    civilian: {
      title: 'Warga Sipil Menang!',
      subtitle: 'Warga Sipil berhasil mengidentifikasi dan mengeliminasi seluruh penyusup!',
      badgeColor: 'bg-emerald-950/80 border-emerald-500 text-emerald-300',
      gradient: 'from-emerald-900/60 to-slate-900',
      icon: Shield,
    },
    undercover: {
      title: 'Undercover Menang!',
      subtitle: 'Penyusup Undercover berhasil menguasai permainan!',
      badgeColor: 'bg-rose-950/80 border-rose-500 text-rose-300',
      gradient: 'from-rose-900/60 to-slate-900',
      icon: Skull,
    },
    mrwhite: {
      title: 'Mr. White Menang!',
      subtitle: 'Mr. White berhasil menebak kata rahasia Warga Sipil saat tereliminasi!',
      badgeColor: 'bg-violet-950/80 border-violet-500 text-violet-300',
      gradient: 'from-violet-900/60 to-slate-900',
      icon: HelpCircle,
    },
  };

  const winConfig = winnerConfigs[winner] || winnerConfigs.civilian;
  const WinIcon = winConfig.icon;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Banner Pemenang */}
      <Card className={`text-center space-y-4 bg-gradient-to-b ${winConfig.gradient}`}>
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900/80 border-2 border-slate-700 flex items-center justify-center shadow-2xl">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        <div className="space-y-2">
          <span className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${winConfig.badgeColor}`}>
            Game Selesai
          </span>
          <h1 className="text-3xl font-black text-slate-100">{winConfig.title}</h1>
          <p className="text-sm text-slate-300">{winConfig.subtitle}</p>
        </div>

        {/* Pasangan Kata */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card p-3 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Kata Warga Sipil
            </span>
            <span className="text-lg font-black text-emerald-400">{civilianWord}</span>
          </div>
          <div className="glass-card p-3 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Kata Undercover
            </span>
            <span className="text-lg font-black text-rose-400">{undercoverWord}</span>
          </div>
        </div>
      </Card>

      {/* Tab Rincian Peran vs Statistik Sesi */}
      <Card>
        <div className="flex border-b border-slate-800 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'roles'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Rincian Peran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'stats'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> Statistik Sesi
          </button>
        </div>

        {activeTab === 'roles' ? (
          <div className="space-y-2">
            {players.map((player) => {
              const roleLabels = {
                civilian: 'Warga Sipil',
                undercover: 'Undercover',
                mrwhite: 'Mr. White',
              };

              const roleBadges = {
                civilian: 'bg-emerald-950/50 text-emerald-300 border-emerald-800',
                undercover: 'bg-rose-950/50 text-rose-300 border-rose-800',
                mrwhite: 'bg-violet-950/50 text-violet-300 border-violet-800',
              };

              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{player.avatarEmoji || '👤'}</span>
                    <div>
                      <span className="font-bold text-slate-100">{player.name}</span>
                      <span className="block text-xs text-slate-400">
                        Kata: {player.word || 'Tidak ada (Mr. White)'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${roleBadges[player.role]}`}>
                    {roleLabels[player.role] || player.role}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.values(sessionStats).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada statistik sesi tercatat.</p>
            ) : (
              Object.values(sessionStats).map((stat) => {
                const winRate = stat.gamesPlayed > 0 ? Math.round((stat.gamesWon / stat.gamesPlayed) * 100) : 0;

                return (
                  <div
                    key={stat.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                  >
                    <span className="font-bold text-slate-100">{stat.name}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-400">
                        Main: <strong className="text-slate-200">{stat.gamesPlayed}</strong>
                      </span>
                      <span className="text-slate-400">
                        Menang: <strong className="text-emerald-400">{stat.gamesWon}</strong>
                      </span>
                      <span className="font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                        {winRate}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800">
          <Button variant="outline" size="lg" onClick={resetToSetup}>
            <Home className="w-4 h-4 mr-2" /> Pengaturan Game Baru
          </Button>
          <Button variant="primary" size="lg" onClick={playAgain}>
            <RotateCcw className="w-4 h-4 mr-2" /> Main Lagi (Pemain Sama)
          </Button>
        </div>
      </Card>
    </div>
  );
}
