import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PassDeviceScreen } from './PassDeviceScreen.jsx';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Vote, Check, Users } from 'lucide-react';
import { hapticPulse } from '../../utils/deviceFeatures.js';

export function VotingPhase() {
  const players = useGameStore((state) => state.players);
  const settings = useGameStore((state) => state.settings);
  const currentActionIndex = useGameStore((state) => state.currentActionIndex);
  const submitVote = useGameStore((state) => state.submitVote);
  const tallyVotesAndEliminate = useGameStore((state) => state.tallyVotesAndEliminate);

  const activePlayers = players.filter((p) => !p.isEliminated);
  const isPrivate = settings.votingMode === 'private';

  const [manualSelectedId, setManualSelectedId] = useState(null);
  const [privateStep, setPrivateStep] = useState('pass');
  const [privateSelectedTargetId, setPrivateSelectedTargetId] = useState(null);

  const currentVoter = players[currentActionIndex] || activePlayers[0];

  const handleManualTally = (selectedId) => {
    hapticPulse(50);
    tallyVotesAndEliminate(selectedId);
  };

  const handlePrivateVoteSubmit = () => {
    if (!privateSelectedTargetId || !currentVoter) return;
    hapticPulse(40);
    submitVote(currentVoter.id, privateSelectedTargetId);
    setPrivateSelectedTargetId(null);
    setPrivateStep('pass');
  };

  if (isPrivate) {
    if (privateStep === 'pass') {
      return (
        <PassDeviceScreen
          message={`Oper HP ke Pemilih`}
          playerName={currentVoter.name}
          avatarEmoji={currentVoter.avatarEmoji}
          subMessage="Pemungutan suara rahasia — jaga layar agar tidak terlihat!"
          actionLabel={`Saya ${currentVoter.name} — Berikan Suara`}
          onContinue={() => setPrivateStep('vote')}
        />
      );
    }

    return (
      <Card className="w-full max-w-md mx-auto my-auto space-y-6">
        <div className="text-center space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{currentVoter.avatarEmoji || '👤'}</span>
            <h2 className="text-xl font-bold text-slate-100">Suara Rahasia {currentVoter.name}</h2>
          </div>
          <p className="text-xs text-slate-400">
            Siapa yang Anda curigai sebagai Undercover atau Mr. White?
          </p>
        </div>

        <div className="space-y-2">
          {activePlayers
            .filter((p) => p.id !== currentVoter.id)
            .map((target) => (
              <button
                key={target.id}
                type="button"
                onClick={() => setPrivateSelectedTargetId(target.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                  privateSelectedTargetId === target.id
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{target.avatarEmoji || '👤'}</span>
                  <div>
                    <span className="font-bold text-slate-100">{target.name}</span>
                    <span className="block text-xs text-slate-400">Kursi #{target.joinOrder + 1}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    privateSelectedTargetId === target.id
                      ? 'bg-rose-500 border-rose-400 text-white'
                      : 'border-slate-700'
                  }`}
                >
                  {privateSelectedTargetId === target.id && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
        </div>

        <Button
          variant="danger"
          size="lg"
          fullWidth
          disabled={!privateSelectedTargetId}
          onClick={handlePrivateVoteSubmit}
        >
          Kirim Suara Rahasia <Vote className="w-5 h-5 ml-2" />
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 mb-1">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-100">Hitung Suara Ruangan</h2>
        <p className="text-sm text-slate-300">
          Lakukan pemungutan suara langsung di ruangan. Pilih pemain yang mendapat suara terbanyak untuk mengeliminasi mereka!
        </p>
      </div>

      <div className="space-y-2">
        {activePlayers.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => setManualSelectedId(player.id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
              manualSelectedId === player.id
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{player.avatarEmoji || '👤'}</span>
              <div>
                <span className="font-bold text-slate-100">{player.name}</span>
                <span className="block text-xs text-slate-400">Kursi #{player.joinOrder + 1}</span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                manualSelectedId === player.id
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'border-slate-700'
              }`}
            >
              {manualSelectedId === player.id && <Check className="w-4 h-4" />}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleManualTally(null)}
        >
          Hasil Seri! (Tanpa Eliminasi)
        </Button>
        <Button
          variant="danger"
          size="lg"
          disabled={!manualSelectedId}
          onClick={() => handleManualTally(manualSelectedId)}
        >
          Eliminasi Pemain <Vote className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
