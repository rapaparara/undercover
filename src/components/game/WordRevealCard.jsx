import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../../store/gameStore.js'
import { PassDeviceScreen } from './PassDeviceScreen.jsx'
import { Button } from '../common/Button.jsx'
import { Card } from '../common/Card.jsx'
import { Eye, EyeOff, Check, HelpCircle } from 'lucide-react'
import { hapticPulse } from '../../utils/deviceFeatures.js'

export function WordRevealCard() {
   const players = useGameStore((state) => state.players)
   const currentActionIndex = useGameStore((state) => state.currentActionIndex)
   const revealNext = useGameStore((state) => state.revealNext)
   const hideAndNext = useGameStore((state) => state.hideAndNext)

   const currentPlayer = players[currentActionIndex]

   const [step, setStep] = useState('pass') // 'pass' | 'card'
   const [isRevealedLocally, setIsRevealedLocally] = useState(false)
   const [holdProgress, setHoldProgress] = useState(0)

   const animationFrameRef = useRef(null)
   const isTouchingRef = useRef(false)

   // Reset state lokal otomatis setiap kali pemain berpindah (currentActionIndex berubah)
   useEffect(() => {
      setStep('pass')
      setIsRevealedLocally(false)
      setHoldProgress(0)
      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current)
      }
   }, [currentActionIndex])

   // Pembersihan animation frame ketika komponen unmount
   useEffect(() => {
      return () => {
         if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
         }
      }
   }, [])

   const handleEndHold = useCallback(() => {
      isTouchingRef.current = false
      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current)
      }
      setHoldProgress((prev) => (prev >= 100 ? 100 : 0))
   }, [])

   const handleStartHold = (e) => {
      // Mencegah emulasi mouse event terduplikasi jika dipicu oleh touch event seluler
      if (e.type === 'touchstart') {
         isTouchingRef.current = true
      } else if (e.type === 'mousedown' && isTouchingRef.current) {
         return
      }

      if (isRevealedLocally) return

      const startTime = Date.now()
      const duration = 600 // ms

      const updateProgress = () => {
         const elapsed = Date.now() - startTime
         const progress = Math.min(100, (elapsed / duration) * 100)
         setHoldProgress(progress)

         if (progress < 100) {
            animationFrameRef.current = requestAnimationFrame(updateProgress)
         } else {
            setIsRevealedLocally(true)
            hapticPulse(60)
            revealNext()
         }
      }

      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(updateProgress)
   }

   const handleHideAndContinue = () => {
      if (animationFrameRef.current) {
         cancelAnimationFrame(animationFrameRef.current)
      }
      setIsRevealedLocally(false)
      setHoldProgress(0)
      setStep('pass')
      hideAndNext()
   }

   if (!currentPlayer) return null

   if (step === 'pass') {
      return (
         <PassDeviceScreen
            message="Oper HP ke"
            playerName={currentPlayer.name}
            avatarEmoji={currentPlayer.avatarEmoji}
            subMessage="Hanya pemain ini yang boleh melihat layar berikutnya!"
            actionLabel={`Saya ${currentPlayer.name} — Lihat Kata Rahasia`}
            onContinue={() => setStep('card')}
         />
      )
   }

   return (
      <Card className="w-full max-w-md mx-auto my-auto text-center select-none">
         <div className="space-y-6 py-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
               <div className="flex items-center gap-2">
                  <span className="text-2xl">
                     {currentPlayer.avatarEmoji || '👤'}
                  </span>
                  <span className="text-xl font-bold text-slate-100">
                     {currentPlayer.name}
                  </span>
               </div>
               <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/60">
                  Pemain {currentActionIndex + 1} dari {players.length}
               </span>
            </div>

            {/* Tampilan tahan untuk melihat kata */}
            {!isRevealedLocally ? (
               <div
                  onMouseDown={handleStartHold}
                  onMouseUp={handleEndHold}
                  onMouseLeave={handleEndHold}
                  onTouchStart={handleStartHold}
                  onTouchEnd={handleEndHold}
                  onTouchCancel={handleEndHold}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ touchAction: 'none' }}
                  className="relative h-64 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-dashed border-indigo-500/40 flex flex-col items-center justify-center p-6 cursor-pointer select-none overflow-hidden shadow-2xl active:scale-98 transition-transform"
               >
                  <div
                     className="absolute bottom-0 left-0 top-0 bg-indigo-600/30 transition-all duration-75 pointer-events-none"
                     style={{ width: `${holdProgress}%` }}
                  />

                  <div className="relative z-10 space-y-3 pointer-events-none">
                     <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <EyeOff className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-extrabold text-slate-100">
                        Tekan &amp; Tahan untuk Melihat
                     </h3>
                     <p className="text-xs text-slate-400 max-w-xs">
                        Tahan ~1 detik untuk membongkar peran &amp; kata rahasia
                        Anda
                     </p>
                  </div>
               </div>
            ) : (
               <div className="min-h-64 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-6 flex flex-col items-center justify-center space-y-4 shadow-2xl animate-fade-in">
                  {currentPlayer.role === 'mrwhite' ? (
                     <div className="space-y-4 py-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                           <HelpCircle className="w-9 h-9" />
                        </div>
                        <div className="space-y-2">
                           <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950/60 px-3 py-1 rounded-full border border-violet-800">
                              Peran Rahasia Anda
                           </span>
                           <h3 className="text-3xl font-black text-white">
                              Anda adalah Mr. White!
                           </h3>
                           <p className="text-sm text-slate-300 bg-slate-800/80 p-4 rounded-xl border border-slate-700 leading-relaxed">
                              Anda{' '}
                              <span className="font-bold text-violet-400">
                                 tidak memiliki kata rahasia
                              </span>
                              . Dengarkan deskripsi pemain lain dengan cermat,
                              membaurlah, dan tebak kata Warga Sipil jika Anda
                              tereliminasi!
                           </p>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-4 py-2">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                           <Eye className="w-9 h-9" />
                        </div>
                        <div className="space-y-2">
                           <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                              Kata Rahasia Anda
                           </span>
                           <h3 className="text-4xl font-black text-emerald-300 tracking-wide font-sans py-2">
                              {currentPlayer.word}
                           </h3>
                           <p className="text-xs text-slate-400">
                              Ingat kata Anda baik-baik! Deskripsikan secara
                              tersirat saat diskusi.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {isRevealedLocally && (
               <Button
                  variant="primary"
                  size="xl"
                  fullWidth
                  onClick={handleHideAndContinue}
               >
                  Sembunyikan &amp; Lanjutkan <Check className="w-6 h-6 ml-2" />
               </Button>
            )}
         </div>
      </Card>
   )
}
