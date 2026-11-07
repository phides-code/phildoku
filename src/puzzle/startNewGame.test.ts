import { describe, expect, it, vi } from 'vitest';
import { GRID_SIZE } from '../domain/geometry';
import { startNewGame } from './startNewGame';
import type { PuzzleGenerator } from './types';

function gridWithGivenAtOrigin(given: number, fillRest: number): number[][] {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? given : fillRest,
        ),
    );
}

describe('startNewGame', () => {
    it('builds a Game from the generator output', () => {
        const generate: PuzzleGenerator = vi.fn(() => ({
            puzzle: gridWithGivenAtOrigin(5, 0),
            solution: gridWithGivenAtOrigin(5, 1),
        }));

        const game = startNewGame('medium', generate);

        expect(generate).toHaveBeenCalledWith('medium');
        expect(game.difficulty).toBe('medium');
        expect(game.board[0]).toEqual({ value: 5, given: true, ink: null });
        expect(game.board[1]).toEqual({ value: 0, given: false, ink: null });
        expect(game.solution[0]).toBe(5);
        expect(game.solution[1]).toBe(1);
    });
});
