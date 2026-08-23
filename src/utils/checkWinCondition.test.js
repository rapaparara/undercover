import { describe, it, expect } from 'vitest';
import { checkWinCondition } from './checkWinCondition.js';

describe('checkWinCondition utility', () => {
  it('should return "civilian" when all impostors are eliminated', () => {
    const players = [
      { role: 'civilian', isEliminated: false },
      { role: 'civilian', isEliminated: false },
      { role: 'undercover', isEliminated: true },
      { role: 'mrwhite', isEliminated: true },
    ];
    expect(checkWinCondition(players)).toBe('civilian');
  });

  it('should return "undercover" when impostors count equals or exceeds civilians', () => {
    const players = [
      { role: 'civilian', isEliminated: false },
      { role: 'undercover', isEliminated: false },
      { role: 'civilian', isEliminated: true },
    ];
    // 1 civilian, 1 undercover => 1 >= 1 => undercover win
    expect(checkWinCondition(players)).toBe('undercover');
  });

  it('should return null when game is still in progress', () => {
    const players = [
      { role: 'civilian', isEliminated: false },
      { role: 'civilian', isEliminated: false },
      { role: 'civilian', isEliminated: false },
      { role: 'undercover', isEliminated: false },
    ];
    // 3 civilians, 1 undercover => 1 < 3 => game continues
    expect(checkWinCondition(players)).toBeNull();
  });

  it('should treat Mr. White as part of impostors count for numerical balance', () => {
    const players = [
      { role: 'civilian', isEliminated: false },
      { role: 'civilian', isEliminated: false },
      { role: 'undercover', isEliminated: false },
      { role: 'mrwhite', isEliminated: false },
    ];
    // 2 civilians, 2 impostors => 2 >= 2 => undercover win
    expect(checkWinCondition(players)).toBe('undercover');
  });
});
