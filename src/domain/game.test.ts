import { describe, expect, it } from 'vitest';
import { createGameFromPuzzle } from './game';
import { BOARD_SIZE, GRID_SIZE } from './geometry';

/** Minimal 9×9: one given (5) at r0c0; rest empty. Solution all 1s except [0][0]=5. */
function mostlyEmptyPuzzle(): number[][] {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? 5 : 0,
        ),
    );
}

function matchingSolution(): number[][] {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? 5 : 1,
        ),
    );
}

describe('createGameFromPuzzle', () => {
    it('builds givens from nonzero puzzle cells and empties elsewhere', () => {
        const game = createGameFromPuzzle(
            mostlyEmptyPuzzle(),
            matchingSolution(),
            'easy',
        );

        expect(game.difficulty).toBe('easy');
        expect(game.board).toHaveLength(BOARD_SIZE);
        expect(game.board[0]).toEqual({ value: 5, given: true, ink: null });
        expect(game.board[1]).toEqual({ value: 0, given: false, ink: null });
    });

    it('stores a flat 81-length solution', () => {
        const game = createGameFromPuzzle(
            mostlyEmptyPuzzle(),
            matchingSolution(),
            'hard',
        );

        expect(game.solution).toHaveLength(BOARD_SIZE);
        expect(game.solution[0]).toBe(5);
        expect(game.solution[1]).toBe(1);
        expect(game.difficulty).toBe('hard');
    });
});
