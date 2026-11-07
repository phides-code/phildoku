import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../domain/geometry';
import { generateLuckyFoxPuzzle } from './luckyFoxGenerator';

describe('generateLuckyFoxPuzzle (integration)', () => {
  it('produces a well-formed easy puzzle', () => {
    const { puzzle, solution } = generateLuckyFoxPuzzle('easy');

    expect(puzzle).toHaveLength(GRID_SIZE);
    expect(solution).toHaveLength(GRID_SIZE);

    for (let r = 0; r < GRID_SIZE; r++) {
      expect(puzzle[r]).toHaveLength(GRID_SIZE);
      expect(solution[r]).toHaveLength(GRID_SIZE);

      for (let c = 0; c < GRID_SIZE; c++) {
        expect(solution[r][c]).toBeGreaterThanOrEqual(1);
        expect(solution[r][c]).toBeLessThanOrEqual(9);
        expect(puzzle[r][c]).toBeGreaterThanOrEqual(0);
        expect(puzzle[r][c]).toBeLessThanOrEqual(9);

        if (puzzle[r][c] !== 0) {
          expect(puzzle[r][c]).toBe(solution[r][c]);
        }
      }
    }
  });
});
