import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle.js';

describe('shuffle utility', () => {
  it('should return a new array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);
    expect(output).toHaveLength(input.length);
    expect(output.sort()).toEqual(input.sort());
    expect(output).not.toBe(input); // Must return copy
  });

  it('should handle empty arrays and single-element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });

  it('should maintain item count across multiple shuffles', () => {
    const input = ['alice', 'bob', 'charlie', 'david'];
    const output = shuffle(input);
    expect(output).toHaveLength(4);
    expect(output).toContain('alice');
    expect(output).toContain('bob');
    expect(output).toContain('charlie');
    expect(output).toContain('david');
  });
});
