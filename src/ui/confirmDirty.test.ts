import { describe, expect, it, vi } from 'vitest';
import {
    NEW_GAME_CONFIRM_MESSAGE,
    RESET_CONFIRM_MESSAGE,
} from '../constants/game';
import { applyDigit } from '../domain/boardOps';
import { createEmptyBoard } from '../domain/cell';
import { confirmIfDirty } from './confirmDirty';

describe('confirmIfDirty', () => {
    it('returns true without confirming when the board is clean', () => {
        const confirmFn = vi.fn();

        expect(
            confirmIfDirty(
                createEmptyBoard(),
                RESET_CONFIRM_MESSAGE,
                confirmFn,
            ),
        ).toBe(true);
        expect(confirmFn).not.toHaveBeenCalled();
    });

    it('asks and returns the confirm result when dirty', () => {
        const board = applyDigit(createEmptyBoard(), 0, 1, 'black');
        const confirmFn = vi.fn(() => false);

        expect(confirmIfDirty(board, RESET_CONFIRM_MESSAGE, confirmFn)).toBe(
            false,
        );
        expect(confirmFn).toHaveBeenCalledWith(RESET_CONFIRM_MESSAGE);
    });

    it('can confirm a new-game message when dirty', () => {
        const board = applyDigit(createEmptyBoard(), 0, 1, 'black');
        const confirmFn = vi.fn(() => true);

        expect(confirmIfDirty(board, NEW_GAME_CONFIRM_MESSAGE, confirmFn)).toBe(
            true,
        );
        expect(confirmFn).toHaveBeenCalledWith(NEW_GAME_CONFIRM_MESSAGE);
    });
});
