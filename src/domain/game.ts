import type { Difficulty } from '../constants/game';
import type { Board } from './cell';
import { createEmptyCell, createGivenCell } from './cell';
import { BOARD_SIZE, flattenGrid } from './geometry';

export type Game = {
    board: Board;
    solution: number[];
    difficulty: Difficulty;
};

export function createGameFromPuzzle(
    puzzle: number[][],
    solution: number[][],
    difficulty: Difficulty,
): Game {
    const flatPuzzle = flattenGrid(puzzle);
    const flatSolution = flattenGrid(solution);

    if (
        flatPuzzle.length !== BOARD_SIZE ||
        flatSolution.length !== BOARD_SIZE
    ) {
        throw new Error(`Puzzle and solution must have ${BOARD_SIZE} cells`);
    }

    const board: Board = flatPuzzle.map((value) =>
        value === 0 ? createEmptyCell() : createGivenCell(value),
    );

    return { board, solution: flatSolution, difficulty };
}
