import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button.jsx';
import { Smartphone, ArrowRight, ShieldAlert } from 'lucide-react';
import { hapticPulse } from '../../utils/deviceFeatures.js';

export function PassDeviceScreen({
  message = 'Oper perangkat ke pemain berikutnya',
  subMessage = 'Pastikan pemain lain tidak mengintip layar!',
  actionLabel = 'Lanjutkan',
  onContinue,
  playerName = null,
  avatarEmoji = null,
}) {
  const handleProceed = () => {
    hapticPulse(30);
    if (onContinue) onContinue();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
        <ShieldAlert className="w-4 h-4 text-amber-400" /> Mode Oper HP
      </div>

      <div className="max-w-md my-auto space-y-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-28 h-28 mx-auto rounded-3xl bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-950/60"
        >
          {avatarEmoji ? (
            <span className="text-6xl">{avatarEmoji}</span>
          ) : (
            <Smartphone className="w-14 h-14" />
          )}
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">
            {message}
          </h1>

          {playerName && (
            <p className="text-2xl font-bold text-indigo-400 tracking-wide">
              {playerName}
            </p>
          )}

          <p className="text-base text-slate-400 max-w-xs mx-auto">
            {subMessage}
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mb-6">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleProceed}
          className="shadow-2xl text-xl py-5"
        >
          {actionLabel} <ArrowRight className="w-6 h-6 ml-3" />
        </Button>
      </div>
    </motion.div>
  );
}
