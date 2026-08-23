/**
 * Evaluates active players to check if Civilians or Undercover have won.
 * 
 * @param {Array<{ role: string, isEliminated: boolean }>} players 
 * @returns {'civilian' | 'undercover' | null}
 */
export function checkWinCondition(players) {
  if (!players || players.length === 0) return null;

  const activePlayers = players.filter(p => !p.isEliminated);

  let activeCivilian = 0;
  let activeUndercover = 0;
  let activeMrWhite = 0;

  for (const player of activePlayers) {
    if (player.role === 'civilian') activeCivilian++;
    else if (player.role === 'undercover') activeUndercover++;
    else if (player.role === 'mrwhite') activeMrWhite++;
  }

  // Civilians win if all Undercovers and Mr. Whites are eliminated
  if (activeUndercover === 0 && activeMrWhite === 0) {
    return 'civilian';
  }

  // Undercover team wins if impostors (Undercover + Mr White) >= active Civilians
  if (activeUndercover + activeMrWhite >= activeCivilian) {
    return 'undercover';
  }

  // Game continues
  return null;
}
