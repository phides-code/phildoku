import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DIFFICULTIES } from '../constants/game';
import { GRID_SIZE } from '../domain/geometry';
import { generateLuckyFoxPuzzle } from './luckyFoxGenerator';

vi.mock('@luckyfoxdesign/sudoku-generator', () => ({
  generateSudoku: vi.fn(),
}));

import { generateSudoku } from '@luckyfoxdesign/sudoku-generator';

const generateSudokuMock = vi.mocked(generateSudoku);

function emptyGrid(fill = 0): number[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => fill),
  );
}

describe('generateLuckyFoxPuzzle (mocked)', () => {
  beforeEach(() => {
    generateSudokuMock.mockReset();
  });

  it('forwards difficulty and returns puzzle + solution only', () => {
    const puzzle = emptyGrid(0);
    puzzle[0][0] = 5;
    const solution = emptyGrid(1);
    solution[0][0] = 5;

    generateSudokuMock.mockReturnValue({
      puzzle,
      solution,
      difficulty: 'easy',
      score: 3,
    });

    const result = generateLuckyFoxPuzzle('easy');

    expect(generateSudokuMock).toHaveBeenCalledWith('easy');
    expect(result).toEqual({ puzzle, solution });
    expect(result).not.toHaveProperty('score');
  });

  it.each(DIFFICULTIES)('accepts difficulty %s', (difficulty) => {
    generateSudokuMock.mockReturnValue({
      puzzle: emptyGrid(0),
      solution: emptyGrid(1),
      difficulty,
      score: 0,
    });

    generateLuckyFoxPuzzle(difficulty);

    expect(generateSudokuMock).toHaveBeenCalledWith(difficulty);
  });
});
