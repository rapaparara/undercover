import { shuffle } from './shuffle.js';

/**
 * Assigns roles and words to players randomly without mutating physical seating joinOrder.
 * Includes auto-balancing guard, 50:50 word swap, and Fisher-Yates word shuffling.
 * 
 * @param {string[]} playerIds - Array of player IDs in join order
 * @param {{ numUndercover: number, includeMrWhite: boolean, category: string }} settings
 * @param {Array<{ id: string, category: string, civilian: string, undercover: string }>} wordPairsData
 * @param {string[]} usedWordPairIds - Array of word pair IDs used in current session
 * @returns {{
 *   assignedRoles: Record<string, { role: 'civilian'|'undercover'|'mrwhite', word: string|null }>,
 *   wordPairId: string,
 *   civilianWord: string,
 *   undercoverWord: string
 * }}
 */
export function assignRoles(playerIds, settings, wordPairsData, usedWordPairIds = []) {
   if (!playerIds || playerIds.length < 3) {
      throw new Error('Minimal 3 pemain diperlukan untuk memulai permainan.')
   }

   if (!wordPairsData || wordPairsData.length === 0) {
      throw new Error('Data pasangan kata tidak boleh kosong.')
   }

   const totalPlayers = playerIds.length
   const includeMrWhite = !!settings.includeMrWhite

   // 1. Game Balance Guard: Batasi jumlah peran khusus agar Warga Sipil selalu mayoritas
   const mrWhiteCount = includeMrWhite ? 1 : 0
   // Maksimal penyusup (Undercover + Mr. White) adalah setengah dari total pemain (dibulatkan ke bawah)
   const maxUndercover = Math.max(
      1,
      Math.floor((totalPlayers - mrWhiteCount - 1) / 2),
   )
   const requestedUndercover = Number(settings.numUndercover) || 1
   const numUndercover = Math.min(requestedUndercover, maxUndercover)

   // 2. Pemilihan Pasangan Kata Berdasarkan Kategori
   let categoryPairs = wordPairsData
   if (settings.category && settings.category !== 'random') {
      const filtered = wordPairsData.filter(
         (p) => p.category === settings.category,
      )
      if (filtered.length > 0) {
         categoryPairs = filtered
      }
   }

   // 3. Exclude used pairs & Fallback Handling
   let availablePairs = categoryPairs.filter(
      (p) => !usedWordPairIds.includes(p.id),
   )

   if (availablePairs.length === 0) {
      // Jika semua kata dalam kategori sudah pernah dipakai, reset ketersediaan
      // Hindari memilih kata yang baru saja dipakai di ronde terakhir jika memungkinkan
      const lastUsedId = usedWordPairIds[usedWordPairIds.length - 1]
      const nonLastPairs = categoryPairs.filter((p) => p.id !== lastUsedId)
      availablePairs = nonLastPairs.length > 0 ? nonLastPairs : categoryPairs
   }

   // Acak daftar kata menggunakan Fisher-Yates shuffle dan ambil kata pertama
   const shuffledPairs = shuffle(availablePairs)
   const selectedPair = shuffledPairs[0] || wordPairsData[0]

   // 4. Random Swap 50:50 untuk Kata Sipil vs Undercover
   const shouldSwapWords = Math.random() < 0.5
   const civilianWord = shouldSwapWords
      ? selectedPair.undercover
      : selectedPair.civilian
   const undercoverWord = shouldSwapWords
      ? selectedPair.civilian
      : selectedPair.undercover

   // 5. Pengacakan Pemain & Pembagian Peran
   const shuffledIds = shuffle(playerIds)
   const assignedRoles = {}

   const undercoverIds = new Set(shuffledIds.slice(0, numUndercover))
   const mrWhiteId = includeMrWhite ? shuffledIds[numUndercover] : null

   for (const id of playerIds) {
      if (undercoverIds.has(id)) {
         assignedRoles[id] = {
            role: 'undercover',
            word: undercoverWord,
         }
      } else if (id === mrWhiteId) {
         assignedRoles[id] = {
            role: 'mrwhite',
            word: null,
         }
      } else {
         assignedRoles[id] = {
            role: 'civilian',
            word: civilianWord,
         }
      }
   }

   return {
      assignedRoles,
      wordPairId: selectedPair.id,
      civilianWord,
      undercoverWord,
   }
}