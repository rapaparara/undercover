import React from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Timer } from '../common/Timer.jsx';
import { MessageSquare, Vote, Skull } from 'lucide-react';

export function DiscussionPhase() {
  const players = useGameStore((state) => state.players);
  const round = useGameStore((state) => state.round);
  const startingSpeakerIndex = useGameStore((state) => state.startingSpeakerIndex);
  const settings = useGameStore((state) => state.settings);
  const proceedToVoting = useGameStore((state) => state.proceedToVoting);

  const total = players.length;
  const speakingOrder = [];

  for (let i = 0; i < total; i++) {
    const idx = (startingSpeakerIndex + i) % total;
    speakingOrder.push(players[idx]);
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <Card className="text-center space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-slate-100">Fase Diskusi</h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-950/60 text-emerald-300 rounded-full border border-emerald-800">
            Putaran {round}
          </span>
        </div>

        <p className="text-sm text-slate-300">
          Berputarlah sesuai lingkaran duduk. Deskripsikan kata rahasia Anda dengan satu frasa atau kalimat tanpa membocorkannya!
        </p>

        {settings.discussionTimerSeconds > 0 && (
          <Timer initialSeconds={settings.discussionTimerSeconds} />
        )}
      </Card>

      {/* Daftar Urutan Bicara */}
      <Card>
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between">
            <span>Urutan Bicara Tempat Duduk</span>
            <span>{speakingOrder.filter((p) => !p.isEliminated).length} Aktif</span>
          </h3>

          <div className="space-y-2">
            {speakingOrder.map((player, index) => {
              const isFirst = index === 0 && !player.isEliminated;

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    player.isEliminated
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-40 line-through'
                      : isFirst
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5">
                      #{index + 1}
                    </span>
                    <span className="text-2xl">{player.avatarEmoji || '👤'}</span>
                    <div>
                      <span className="font-bold text-slate-100">{player.name}</span>
                      <span className="block text-xs text-slate-400">
                        Kursi #{player.joinOrder + 1}
                      </span>
                    </div>
                  </div>

                  <div>
                    {player.isEliminated ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-900/40">
                        <Skull className="w-3.5 h-3.5" /> Gugur
                      </span>
                    ) : isFirst ? (
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-md border border-emerald-700">
                        Mulai Bicara
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Aktif</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={proceedToVoting}
          >
            Lanjut ke Pemungutan Suara <Vote className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
