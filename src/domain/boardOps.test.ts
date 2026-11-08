import { describe, expect, it } from 'vitest';
import {
    applyDigit,
    clearCell,
    clearUserEntries,
    isDirty,
    isWon,
} from './boardOps';
import { createEmptyBoard, createGivenCell, createUserCell } from './cell';
import { BOARD_SIZE } from './geometry';

describe('applyDigit', () => {
    it('writes a digit and ink onto an empty user cell', () => {
        const board = createEmptyBoard();
        const next = applyDigit(board, 0, 5, 'red');

        expect(next[0]).toEqual({ value: 5, given: false, ink: 'red' });
        expect(board[0]).toEqual({ value: 0, given: false, ink: null }); // immutable
    });

    it('overwrites a user cell with the new digit and current pen', () => {
        const board = applyDigit(createEmptyBoard(), 4, 1, 'black');
        const next = applyDigit(board, 4, 9, 'blue');

        expect(next[4]).toEqual({ value: 9, given: false, ink: 'blue' });
    });

    it('leaves a given cell unchanged', () => {
        const board = createEmptyBoard();
        board[0] = createGivenCell(7);

        const next = applyDigit(board, 0, 2, 'red');

        expect(next[0]).toEqual({ value: 7, given: true, ink: null });
        expect(next).toBe(board); // same reference is fine for a no-op
    });
});

describe('clearCell', () => {
    it('clears value and ink on a user cell', () => {
        const board = applyDigit(createEmptyBoard(), 3, 6, 'purple');
        const next = clearCell(board, 3);

        expect(next[3]).toEqual({ value: 0, given: false, ink: null });
        expect(board[3]).toEqual({ value: 6, given: false, ink: 'purple' });
    });

    it('leaves a given cell unchanged', () => {
        const board = createEmptyBoard();
        board[8] = createGivenCell(2);

        const next = clearCell(board, 8);

        expect(next[8]).toEqual({ value: 2, given: true, ink: null });
        expect(next).toBe(board);
    });

    it('is a no-op on an already empty user cell', () => {
        const board = createEmptyBoard();
        const next = clearCell(board, 10);

        expect(next[10]).toEqual({ value: 0, given: false, ink: null });
    });
});

const solution = Array.from({ length: BOARD_SIZE }, () => 1);

describe('isWon', () => {
    it('is false when the board is empty', () => {
        expect(isWon(createEmptyBoard(), solution)).toBe(false);
    });

    it('is false when any cell differs from the solution', () => {
        const board = createEmptyBoard().map(() => createUserCell(1, 'black'));
        board[80] = createUserCell(2, 'black');

        expect(isWon(board, solution)).toBe(false);
    });

    it('is true when every cell matches the solution', () => {
        const board = createEmptyBoard().map(() => createUserCell(1, 'red'));

        expect(isWon(board, solution)).toBe(true);
    });

    it('ignores ink and given flags', () => {
        const board = createEmptyBoard().map((_, index) =>
            index === 0 ? createGivenCell(1) : createUserCell(1, 'blue'),
        );

        expect(isWon(board, solution)).toBe(true);
    });
});

describe('clearUserEntries', () => {
    it('clears user digits and ink but keeps givens', () => {
        let board = createEmptyBoard();
        board[0] = createGivenCell(5);
        board = applyDigit(board, 1, 3, 'red');
        board = applyDigit(board, 2, 9, 'blue');

        const next = clearUserEntries(board);

        expect(next[0]).toEqual({ value: 5, given: true, ink: null });
        expect(next[1]).toEqual({ value: 0, given: false, ink: null });
        expect(next[2]).toEqual({ value: 0, given: false, ink: null });
        expect(board[1]).toEqual({ value: 3, given: false, ink: 'red' }); // immutable
    });

    it('returns a board of only empties when there are no givens', () => {
        const board = applyDigit(createEmptyBoard(), 4, 7, 'black');
        const next = clearUserEntries(board);

        expect(
            next.every(
                (cell) => cell.value === 0 && !cell.given && cell.ink === null,
            ),
        ).toBe(true);
    });
});

describe('isDirty', () => {
    it('is false for a fresh puzzle with only givens', () => {
        const board = createEmptyBoard();
        board[0] = createGivenCell(5);

        expect(isDirty(board)).toBe(false);
    });

    it('is true when any user cell has a value', () => {
        let board = createEmptyBoard();
        board[0] = createGivenCell(5);
        board = applyDigit(board, 1, 3, 'red');

        expect(isDirty(board)).toBe(true);
    });

    it('is false again after clearUserEntries', () => {
        let board = createEmptyBoard();
        board[0] = createGivenCell(5);
        board = applyDigit(board, 1, 3, 'black');
        board = clearUserEntries(board);

        expect(isDirty(board)).toBe(false);
    });
});
