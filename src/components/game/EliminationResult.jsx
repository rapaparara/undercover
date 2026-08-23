import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Skull, Shield, HelpCircle, ArrowRight, Scale } from 'lucide-react';
import { hapticPulse } from '../../utils/deviceFeatures.js';

export function EliminationResult() {
  const eliminatedPlayer = useGameStore((state) => state.eliminatedPlayer);
  const isTieVote = useGameStore((state) => state.isTieVote);
  const proceedFromElimination = useGameStore((state) => state.proceedFromElimination);

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipCard = () => {
    if (!isFlipped) {
      hapticPulse(60);
      setIsFlipped(true);
    }
  };

  if (isTieVote) {
    return (
      <Card className="w-full max-w-md mx-auto my-auto text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Scale className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-100">Hasil Seri!</h2>
          <p className="text-slate-300 text-sm">
            Jumlah suara sama. Tidak ada pemain yang tereliminasi putaran ini!
          </p>
        </div>
        <Button variant="primary" size="xl" fullWidth onClick={proceedFromElimination}>
          Lanjut ke Putaran Berikutnya <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </Card>
    );
  }

  if (!eliminatedPlayer) return null;

  const roleConfigs = {
    civilian: {
      title: 'Warga Sipil',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border-emerald-700 text-emerald-300',
      icon: Shield,
      desc: 'Warga Sipil polos telah tereliminasi!',
    },
    undercover: {
      title: 'Undercover',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-950/80 border-rose-700 text-rose-300',
      icon: Skull,
      desc: 'Berhasil! Pemain Undercover berhasil tereliminasi!',
    },
    mrwhite: {
      title: 'Mr. White',
      color: 'text-violet-400',
      badgeBg: 'bg-violet-950/80 border-violet-700 text-violet-300',
      icon: HelpCircle,
      desc: 'Mr. White tertangkap! Mereka mendapat 1 kesempatan menebak untuk menyelamatkan diri!',
    },
  };

  const config = roleConfigs[eliminatedPlayer.role] || roleConfigs.civilian;
  const RoleIcon = config.icon;

  return (
    <Card className="w-full max-w-md mx-auto my-auto text-center space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800">
          Hasil Pemungutan Suara
        </span>
        <h2 className="text-3xl font-black text-slate-100">{eliminatedPlayer.name}</h2>
        <p className="text-xs text-slate-400">
          Tekan kartu untuk melihat identitas rahasianya
        </p>
      </div>

      {/* Kontainer Kartu Balik */}
      <div className="perspective-1000 py-2">
        <motion.div
          onClick={handleFlipCard}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-full h-64 rounded-2xl cursor-pointer preserve-3d shadow-2xl"
        >
          {/* Depan Kartu */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border-2 border-rose-500/40 flex flex-col items-center justify-center p-6 backface-hidden">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
              <Skull className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Tekan untuk Buka Peran</h3>
          </div>

          {/* Belakang Kartu */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center p-6 rotateY-180 backface-hidden">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
              <RoleIcon className={`w-9 h-9 ${config.color}`} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-2 ${config.badgeBg}`}>
              {config.title}
            </span>
            <h4 className="text-2xl font-extrabold text-white">{eliminatedPlayer.name}</h4>
            <p className="text-xs text-slate-400 mt-2">{config.desc}</p>
          </div>
        </motion.div>
      </div>

      {isFlipped && (
        <Button variant="primary" size="xl" fullWidth onClick={proceedFromElimination}>
          Lanjutkan <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      )}
    </Card>
  );
}
