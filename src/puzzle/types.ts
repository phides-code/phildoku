import type { Difficulty } from '../constants/game';

export type GeneratedPuzzle = {
    puzzle: number[][];
    solution: number[][];
};

export type PuzzleGenerator = (difficulty: Difficulty) => GeneratedPuzzle;
