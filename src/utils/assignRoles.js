import { shuffle } from './shuffle.js';

/**
 * Assigns roles and words to players randomly without mutating physical seating joinOrder.
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
  if (!playerIds || playerIds.length === 0) {
    throw new Error('playerIds cannot be empty');
  }

  // 1. Select category candidates
  let categoryPairs = wordPairsData;
  if (settings.category && settings.category !== 'random') {
    const filtered = wordPairsData.filter(p => p.category === settings.category);
    if (filtered.length > 0) {
      categoryPairs = filtered;
    }
  }

  // 2. Exclude used pairs when possible
  let availablePairs = categoryPairs.filter(p => !usedWordPairIds.includes(p.id));
  if (availablePairs.length === 0) {
    // Fallback to all pairs in category if exhausted
    availablePairs = categoryPairs;
  }

  // Pick a random word pair
  const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)] || wordPairsData[0];

  // 3. Shuffle copy of player IDs for role assignment
  const shuffledIds = shuffle([...playerIds]);
  const assignedRoles = {};

  const numUndercover = Math.max(1, settings.numUndercover || 1);
  const includeMrWhite = !!settings.includeMrWhite;

  const undercoverIds = new Set(shuffledIds.slice(0, numUndercover));
  const mrWhiteId = includeMrWhite ? shuffledIds[numUndercover] : null;

  for (const id of playerIds) {
    if (undercoverIds.has(id)) {
      assignedRoles[id] = {
        role: 'undercover',
        word: selectedPair.undercover
      };
    } else if (id === mrWhiteId) {
      assignedRoles[id] = {
        role: 'mrwhite',
        word: null
      };
    } else {
      assignedRoles[id] = {
        role: 'civilian',
        word: selectedPair.civilian
      };
    }
  }

  return {
    assignedRoles,
    wordPairId: selectedPair.id,
    civilianWord: selectedPair.civilian,
    undercoverWord: selectedPair.undercover
  };
}
