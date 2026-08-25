import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { Button } from '../common/Button.jsx';
import { Card } from '../common/Card.jsx';
import { Modal } from '../common/Modal.jsx'
import {
   Trophy,
   Shield,
   Skull,
   HelpCircle,
   RotateCcw,
   Home,
   Award,
   Trash2,
   Crown,
   Heart,
   AlertTriangle,
} from 'lucide-react'

export function GameOverScreen() {
   const players = useGameStore((state) => state.players)
   const winner = useGameStore((state) => state.winner)
   const civilianWord = useGameStore((state) => state.civilianWord)
   const undercoverWord = useGameStore((state) => state.undercoverWord)
   const sessionStats = useGameStore((state) => state.sessionStats)
   const playAgain = useGameStore((state) => state.playAgain)
   const resetToSetup = useGameStore((state) => state.resetToSetup)
   const resetAll = useGameStore((state) => state.resetAll)

   const [activeTab, setActiveTab] = useState('roles')
   const [showConfirmReset, setShowConfirmReset] = useState(false)

   const winnerConfigs = {
      civilian: {
         title: 'Warga Sipil Menang!',
         subtitle:
            'Warga Sipil berhasil mengidentifikasi dan mengeliminasi seluruh penyusup!',
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
         subtitle:
            'Mr. White berhasil menebak kata rahasia Warga Sipil saat tereliminasi!',
         badgeColor: 'bg-violet-950/80 border-violet-500 text-violet-300',
         gradient: 'from-violet-900/60 to-slate-900',
         icon: HelpCircle,
      },
   }

   const winConfig = winnerConfigs[winner] || winnerConfigs.civilian

   // Cari angka kemenangan tertinggi untuk menentukan Top Performer
   const maxWins = Object.values(sessionStats).reduce(
      (max, curr) => (curr.gamesWon > max ? curr.gamesWon : max),
      0,
   )

   const handleConfirmReset = () => {
      setShowConfirmReset(false)
      resetAll()
   }

   return (
      <div className="w-full max-w-xl mx-auto space-y-6 select-none">
         {/* Banner Pemenang */}
         <Card
            className={`text-center space-y-4 bg-gradient-to-b ${winConfig.gradient}`}
         >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-900/80 border-2 border-slate-700 flex items-center justify-center shadow-2xl">
               <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <div className="space-y-2">
               <span
                  className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${winConfig.badgeColor}`}
               >
                  Game Selesai
               </span>
               <h1 className="text-3xl font-black text-slate-100">
                  {winConfig.title}
               </h1>
               <p className="text-sm text-slate-300">{winConfig.subtitle}</p>
            </div>

            {/* Pasangan Kata */}
            <div className="grid grid-cols-2 gap-3 pt-2">
               <div className="glass-card p-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                     Kata Warga Sipil
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                     {civilianWord || '-'}
                  </span>
               </div>
               <div className="glass-card p-3 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                     Kata Undercover
                  </span>
                  <span className="text-lg font-black text-rose-400">
                     {undercoverWord || '-'}
                  </span>
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
               <div key="tab-roles" className="space-y-2">
                  {players.map((player) => {
                     const roleLabels = {
                        civilian: 'Warga Sipil',
                        undercover: 'Undercover',
                        mrwhite: 'Mr. White',
                     }

                     const roleBadges = {
                        civilian:
                           'bg-emerald-950/50 text-emerald-300 border-emerald-800',
                        undercover:
                           'bg-rose-950/50 text-rose-300 border-rose-800',
                        mrwhite:
                           'bg-violet-950/50 text-violet-300 border-violet-800',
                     }

                     return (
                        <div
                           key={player.id}
                           className={`flex items-center justify-between p-3 rounded-xl border ${
                              player.isEliminated
                                 ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                                 : 'bg-slate-900/60 border-slate-800'
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                 {player.avatarEmoji || '👤'}
                              </span>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-100">
                                       {player.name}
                                    </span>
                                    {player.isEliminated ? (
                                       <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                                          <Skull className="w-3 h-3" /> Gugur
                                       </span>
                                    ) : (
                                       <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                                          <Heart className="w-3 h-3" /> Selamat
                                       </span>
                                    )}
                                 </div>
                                 <span className="block text-xs text-slate-400">
                                    Kata:{' '}
                                    {player.word || 'Tidak ada (Mr. White)'}
                                 </span>
                              </div>
                           </div>

                           <span
                              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${
                                 roleBadges[player.role] || roleBadges.civilian
                              }`}
                           >
                              {roleLabels[player.role] || player.role}
                           </span>
                        </div>
                     )
                  })}
               </div>
            ) : (
               <div key="tab-stats" className="space-y-2">
                  {Object.keys(sessionStats).length === 0 ? (
                     <p className="text-xs text-slate-400 text-center py-4">
                        Belum ada statistik sesi tercatat.
                     </p>
                  ) : (
                     Object.entries(sessionStats).map(([playerId, stat]) => {
                        const winRate =
                           stat.gamesPlayed > 0
                              ? Math.round(
                                   (stat.gamesWon / stat.gamesPlayed) * 100,
                                )
                              : 0
                        const isTopPerformer =
                           maxWins > 0 && stat.gamesWon === maxWins

                        return (
                           <div
                              key={playerId}
                              className={`flex items-center justify-between p-3 rounded-xl border ${
                                 isTopPerformer
                                    ? 'bg-amber-950/20 border-amber-500/40'
                                    : 'bg-slate-900/60 border-slate-800'
                              }`}
                           >
                              <div className="flex items-center gap-2">
                                 {isTopPerformer && (
                                    <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                                 )}
                                 <span className="font-bold text-slate-100">
                                    {stat.name}
                                 </span>
                              </div>

                              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                                 <span className="text-slate-400">
                                    Main:{' '}
                                    <strong className="text-slate-200">
                                       {stat.gamesPlayed}
                                    </strong>
                                 </span>
                                 <span className="text-slate-400">
                                    Menang:{' '}
                                    <strong className="text-emerald-400">
                                       {stat.gamesWon}
                                    </strong>
                                 </span>
                                 <span className="font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                                    {winRate}%
                                 </span>
                              </div>
                           </div>
                        )
                     })
                  )}
               </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-800">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" onClick={resetToSetup}>
                     <Home className="w-4 h-4 mr-2" /> Pengaturan Game Baru
                  </Button>
                  <Button variant="primary" size="lg" onClick={playAgain}>
                     <RotateCcw className="w-4 h-4 mr-2" /> Main Lagi (Pemain
                     Sama)
                  </Button>
               </div>

               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmReset(true)}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 w-full mt-1"
               >
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus Sesi &amp; Reset
                  Storage
               </Button>
            </div>
         </Card>

         {/* Modal Konfirmasi Reset Storage */}
         <Modal
            isOpen={showConfirmReset}
            onClose={() => setShowConfirmReset(false)}
            title="Hapus Sesi &amp; Storage?"
         >
            <div className="space-y-4 text-center">
               <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
               </div>
               <p className="text-slate-300 text-sm leading-relaxed">
                  Apakah Anda yakin ingin menghapus seluruh statistik sesi dan
                  riwayat pemain? Tindakan ini tidak dapat dibatalkan.
               </p>
               <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                     variant="outline"
                     onClick={() => setShowConfirmReset(false)}
                  >
                     Batal
                  </Button>
                  <Button
                     variant="primary"
                     className="bg-rose-600 hover:bg-rose-500"
                     onClick={handleConfirmReset}
                  >
                     Ya, Hapus Semua
                  </Button>
               </div>
            </div>
         </Modal>
      </div>
   )
}