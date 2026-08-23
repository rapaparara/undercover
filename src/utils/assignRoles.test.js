import { describe, it, expect } from 'vitest';
import { assignRoles } from './assignRoles.js';

const mockWordPairs = [
  { id: 'food-01', category: 'food', civilian: 'Coffee', undercover: 'Tea' },
  { id: 'food-02', category: 'food', civilian: 'Pizza', undercover: 'Burger' },
  { id: 'animal-01', category: 'animal', civilian: 'Cat', undercover: 'Tiger' },
];

describe('assignRoles utility', () => {
  it('should correctly assign roles with 1 undercover and no mr white', () => {
    const players = ['p1', 'p2', 'p3', 'p4'];
    const settings = { numUndercover: 1, includeMrWhite: false, category: 'random' };
    const result = assignRoles(players, settings, mockWordPairs, []);

    expect(result.assignedRoles).toBeDefined();
    const roles = Object.values(result.assignedRoles).map(r => r.role);
    expect(roles.filter(r => r === 'undercover')).toHaveLength(1);
    expect(roles.filter(r => r === 'civilian')).toHaveLength(3);
    expect(roles.filter(r => r === 'mrwhite')).toHaveLength(0);
  });

  it('should assign Mr. White when enabled', () => {
    const players = ['p1', 'p2', 'p3', 'p4', 'p5'];
    const settings = { numUndercover: 1, includeMrWhite: true, category: 'food' };
    const result = assignRoles(players, settings, mockWordPairs, []);

    const roles = Object.values(result.assignedRoles).map(r => r.role);
    expect(roles.filter(r => r === 'undercover')).toHaveLength(1);
    expect(roles.filter(r => r === 'mrwhite')).toHaveLength(1);
    expect(roles.filter(r => r === 'civilian')).toHaveLength(3);

    // Mr White word must be null
    const mrWhiteObj = Object.values(result.assignedRoles).find(r => r.role === 'mrwhite');
    expect(mrWhiteObj.word).toBeNull();
  });

  it('should avoid used word pair IDs when possible', () => {
    const players = ['p1', 'p2', 'p3'];
    const settings = { numUndercover: 1, includeMrWhite: false, category: 'food' };
    const used = ['food-01'];
    const result = assignRoles(players, settings, mockWordPairs, used);

    expect(result.wordPairId).toBe('food-02');
  });

  it('should fallback to available category pairs when all pairs are exhausted', () => {
    const players = ['p1', 'p2', 'p3'];
    const settings = { numUndercover: 1, includeMrWhite: false, category: 'food' };
    const used = ['food-01', 'food-02'];
    const result = assignRoles(players, settings, mockWordPairs, used);

    expect(['food-01', 'food-02']).toContain(result.wordPairId);
  });
});
