import { generateSudoku } from '@luckyfoxdesign/sudoku-generator';
import type { PuzzleGenerator } from './types';

export const generateLuckyFoxPuzzle: PuzzleGenerator = (difficulty) => {
    const { puzzle, solution } = generateSudoku(difficulty);
    return { puzzle, solution };
};
