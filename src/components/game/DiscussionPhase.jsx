import React, { useState } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { Button } from '../common/Button.jsx'
import { Card } from '../common/Card.jsx'
import { Timer } from '../common/Timer.jsx'
import {
   MessageSquare,
   Vote,
   Skull,
   Mic,
   ArrowRightCircle,
   Sparkles,
} from 'lucide-react'

export function DiscussionPhase() {
   const players = useGameStore((state) => state.players)
   const round = useGameStore((state) => state.round)
   const startingSpeakerIndex = useGameStore(
      (state) => state.startingSpeakerIndex,
   )
   const settings = useGameStore((state) => state.settings)
   const proceedToVoting = useGameStore((state) => state.proceedToVoting)

   const [hasStartedDebate, setHasStartedDebate] = useState(false)

   const total = players.length

   // Susun urutan pemain melingkar dari startingSpeakerIndex
   const speakingOrder = []
   for (let i = 0; i < total; i++) {
      const idx = (startingSpeakerIndex + i) % total
      speakingOrder.push(players[idx])
   }

   // Identifikasi pembicara pertama yang masih aktif (belum gugur)
   const firstSpeaker = speakingOrder.find((p) => !p.isEliminated)

   return (
      <div className="w-full max-w-xl mx-auto space-y-6 select-none">
         {/* Header Utama & Sorotan Pembicara Pertama */}
         <Card className="text-center space-y-4 bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-xl font-black text-slate-100">
                     Fase Diskusi
                  </h2>
               </div>
               <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-950/60 text-indigo-300 rounded-full border border-indigo-800">
                  Putaran {round}
               </span>
            </div>

            {/* Sorotan Pembicara Pertama */}
            {firstSpeaker && (
               <div className="bg-gradient-to-r from-emerald-950/60 to-teal-900/60 border border-emerald-500/40 rounded-2xl p-4 shadow-lg relative overflow-hidden mt-2">
                  <div className="absolute -top-2 -right-2 p-3 opacity-15">
                     <Mic className="w-24 h-24 text-emerald-400" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-700/50 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" /> Tahap
                        1: Deskripsi Kata
                     </span>

                     <div className="flex items-center gap-3 my-1">
                        <span className="text-5xl">
                           {firstSpeaker.avatarEmoji || '👤'}
                        </span>
                        <div className="text-left">
                           <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                              Pembicara Pertama
                           </span>
                           <h3 className="text-2xl font-black text-slate-100 leading-tight">
                              {firstSpeaker.name}
                           </h3>
                           <span className="text-xs text-emerald-300/80 font-medium">
                              Kursi #{firstSpeaker.joinOrder + 1}
                           </span>
                        </div>
                     </div>

                     <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                        Mulai dari <strong>{firstSpeaker.name}</strong>,
                        sebutkan 1 frasa deskripsi kata rahasia Anda, lalu oper
                        giliran secara berurutan melingkar.
                     </p>
                  </div>
               </div>
            )}
         </Card>

         {/* Urutan Tempat Duduk */}
         <Card>
            <div className="space-y-3">
               <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                     Urutan Giliran Deskripsi
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800">
                     {speakingOrder.filter((p) => !p.isEliminated).length}{' '}
                     Pemain Aktif
                  </span>
               </div>

               <div className="space-y-2">
                  {speakingOrder.map((player, index) => {
                     const isFirstSpeaker = player.id === firstSpeaker?.id

                     return (
                        <div
                           key={player.id}
                           className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              player.isEliminated
                                 ? 'bg-slate-950/40 border-slate-800/40 opacity-40 line-through'
                                 : isFirstSpeaker
                                   ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                                   : 'bg-slate-900/60 border-slate-800'
                           }`}
                        >
                           <div className="flex items-center gap-3">
                              <div
                                 className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isFirstSpeaker
                                       ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/50'
                                       : 'bg-slate-800 text-slate-400'
                                 }`}
                              >
                                 {index + 1}
                              </div>
                              <span className="text-2xl">
                                 {player.avatarEmoji || '👤'}
                              </span>
                              <div>
                                 <span className="font-bold text-slate-100 text-sm sm:text-base">
                                    {player.name}
                                 </span>
                                 <span className="block text-[10px] text-slate-500 uppercase font-medium">
                                    Kursi #{player.joinOrder + 1}
                                 </span>
                              </div>
                           </div>

                           <div>
                              {player.isEliminated ? (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-900/40">
                                    <Skull className="w-3 h-3" /> Gugur
                                 </span>
                              ) : isFirstSpeaker ? (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-md border border-emerald-700">
                                    <Mic className="w-3 h-3" /> Giliran 1
                                 </span>
                              ) : (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    <ArrowRightCircle className="w-3 h-3" />{' '}
                                    Mengikuti
                                 </span>
                              )}
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </Card>

         {/* Tahap 2: Timer Bebas & Pemungutan Suara */}
         <Card className="space-y-6">
            <div className="text-center space-y-1">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                  Tahap 2: Debat &amp; Voting
               </span>
               <p className="text-xs text-slate-400 pt-1">
                  Setelah semua orang menyebutkan deskripsi katanya, mulailah
                  berdiskusi untuk mencari penyusup!
               </p>
            </div>

            {settings.discussionTimerSeconds > 0 && (
               <div className="border-t border-b border-slate-800/80 py-4">
                  {!hasStartedDebate ? (
                     <div className="text-center space-y-3 py-2">
                        <Button
                           variant="secondary"
                           size="lg"
                           fullWidth
                           onClick={() => setHasStartedDebate(true)}
                           className="bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 font-bold py-3"
                        >
                           <MessageSquare className="w-4 h-4 mr-2 text-indigo-400" />{' '}
                           Mulai Timer Diskusi Bebas (
                           {settings.discussionTimerSeconds} Detik)
                        </Button>
                        <p className="text-[11px] text-slate-500">
                           Tekan jika rotasi deskripsi sudah selesai dan ingin
                           membatasi waktu debat terbuka.
                        </p>
                     </div>
                  ) : (
                     <Timer
                        initialSeconds={settings.discussionTimerSeconds}
                        autoStart={true}
                        onExpire={proceedToVoting}
                     />
                  )}
               </div>
            )}

            <Button
               variant="primary"
               size="xl"
               fullWidth
               onClick={proceedToVoting}
               className="shadow-xl shadow-emerald-950/50 py-4 font-black text-lg"
            >
               Mulai Pemungutan Suara <Vote className="w-5 h-5 ml-2" />
            </Button>
         </Card>
      </div>
   )
}
