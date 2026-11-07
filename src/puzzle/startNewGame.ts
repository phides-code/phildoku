import type { Difficulty } from '../constants/game';
import { createGameFromPuzzle, type Game } from '../domain/game';
import { generateLuckyFoxPuzzle } from './luckyFoxGenerator';
import type { PuzzleGenerator } from './types';

export function startNewGame(
    difficulty: Difficulty,
    generate: PuzzleGenerator = generateLuckyFoxPuzzle,
): Game {
    const { puzzle, solution } = generate(difficulty);
    return createGameFromPuzzle(puzzle, solution, difficulty);
}
