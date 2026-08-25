import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { Button } from '../components/common/Button.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { ResumeGamePrompt } from '../components/game/ResumeGamePrompt.jsx';
import {
   Shield,
   Play,
   HelpCircle,
   Users,
   Eye,
   Sparkles,
   Trash2,
} from 'lucide-react'

export function HomePage({ onStartNewGame }) {
   const phase = useGameStore((state) => state.phase)
   const players = useGameStore((state) => state.players)
   const resetAll = useGameStore((state) => state.resetAll)

   const [showRules, setShowRules] = useState(false)

   const hasUnfinishedGame =
      players.length > 0 &&
      phase !== 'HOME' &&
      phase !== 'GAME_OVER' &&
      phase !== 'SETUP'

   const handleDiscard = () => {
      resetAll()
   }

   const handleResume = () => {
      // Current phase state in store will drive rendering automatically
   }

   if (hasUnfinishedGame) {
      return (
         <div className="min-h-screen flex items-center justify-center p-4">
            <ResumeGamePrompt
               onResume={handleResume}
               onDiscard={handleDiscard}
            />
         </div>
      )
   }

   return (
      <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 max-w-xl mx-auto select-none">
         {/* Header Atas */}
         <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
               <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
               </div>
               <span className="font-extrabold text-slate-200 tracking-wider text-sm uppercase">
                  Game Oper HP Bersama
               </span>
            </div>

            <div className="flex items-center gap-2">
               <button
                  type="button"
                  onClick={resetAll}
                  title="Reset Storage & Sesi"
                  className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
               >
                  <Trash2 className="w-4 h-4" /> Reset Sesi
               </button>

               <button
                  type="button"
                  onClick={() => setShowRules(true)}
                  className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
               >
                  <HelpCircle className="w-4 h-4 text-indigo-400" /> Cara
                  Bermain
               </button>
            </div>
         </div>

         {/* Konten Utama Hero */}
         <div className="my-auto text-center space-y-8 py-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-lg">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Game Potong
                  Kata &amp; Deteksi Sosial
               </div>

               <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  UNDER
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                     COVER
                  </span>
               </h1>

               <p className="text-base sm:text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
                  Satu HP, 3 hingga 12 pemain duduk dalam lingkaran. Temukan
                  penyusup sebelum mereka menguasai permainan!
               </p>
            </div>

            {/* Lencana Fitur */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
               <div className="glass-card p-3 space-y-1">
                  <Users className="w-5 h-5 mx-auto text-indigo-400" />
                  <span className="block text-[11px] font-bold text-slate-300">
                     3–12 Pemain
                  </span>
               </div>
               <div className="glass-card p-3 space-y-1">
                  <Eye className="w-5 h-5 mx-auto text-emerald-400" />
                  <span className="block text-[11px] font-bold text-slate-300">
                     Kata Rahasia
                  </span>
               </div>
               <div className="glass-card p-3 space-y-1">
                  <Shield className="w-5 h-5 mx-auto text-purple-400" />
                  <span className="block text-[11px] font-bold text-slate-300">
                     Tanpa Internet
                  </span>
               </div>
            </div>

            <Button
               variant="primary"
               size="xl"
               fullWidth
               onClick={onStartNewGame}
               className="text-2xl font-black py-6 shadow-2xl shadow-emerald-950/80"
            >
               <Play className="w-7 h-7 mr-3 fill-current" /> Mulai Game Baru
            </Button>
         </div>

         {/* Modal Aturan */}
         <Modal
            isOpen={showRules}
            onClose={() => setShowRules(false)}
            title="Aturan Bermain Undercover"
         >
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
               <div className="space-y-1">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                     1. Registrasi Mandiri &amp; Pembagian Peran
                  </h4>
                  <p>
                     Oper HP secara berurutan sesuai lingkaran duduk. Setiap
                     pemain memasukkan namanya sendiri dan menerima kata rahasia
                     (Warga Sipil mendapat satu kata, Undercover mendapat kata
                     yang sedikit berbeda, Mr. White tidak memiliki kata).
                  </p>
               </div>

               <div className="space-y-1">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                     2. Putaran Deskripsi Kata
                  </h4>
                  <p>
                     Sesuai urutan duduk, setiap pemain mendeskripsikan kata
                     rahasianya dengan satu frasa atau kalimat. Jangan terlalu
                     gamblang, tapi jangan terlalu samar!
                  </p>
               </div>

               <div className="space-y-1">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                     3. Pemungutan Suara &amp; Eliminasi
                  </h4>
                  <p>
                     Diskusikan siapa yang tampak memiliki kata berbeda dan
                     lakukan voting untuk mengeliminasi mereka. Jika Mr. White
                     tereliminasi, mereka punya 1 kesempatan menebak kata Warga
                     Sipil untuk menang!
                  </p>
               </div>

               <div className="space-y-1">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                     4. Syarat Kemenangan
                  </h4>
                  <p>
                     <strong>Warga Sipil:</strong> Eliminasi seluruh Undercover
                     dan Mr. White.
                     <br />
                     <strong>Undercover:</strong> Jumlah penyusup menyamai atau
                     melebihi Warga Sipil.
                     <br />
                     <strong>Mr. White:</strong> Berhasil menebak kata rahasia
                     Warga Sipil saat tereliminasi.
                  </p>
               </div>
            </div>
         </Modal>

         {/* Footer */}
         <div className="text-center py-2 text-xs text-slate-500">
            Social Deduction Oper Perangkat • Aplikasi Klien Murni
         </div>
      </div>
   )
}