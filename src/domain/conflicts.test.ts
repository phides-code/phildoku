import { describe, expect, it } from 'vitest';
import { createEmptyBoard, createGivenCell, createUserCell } from './cell';
import { findSoftConflicts } from './conflicts';

function boardWith(
    placements: Array<{ index: number; value: number; given?: boolean }>,
) {
    const board = createEmptyBoard();
    for (const { index, value, given = false } of placements) {
        board[index] = given
            ? createGivenCell(value)
            : createUserCell(value, 'black');
    }
    return board;
}

describe('findSoftConflicts', () => {
    it('returns no conflicts on an empty board', () => {
        expect(findSoftConflicts(createEmptyBoard()).size).toBe(0);
    });

    it('flags duplicate digits in the same row', () => {
        // row 0: indexes 0 and 1 both hold 5
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 0, value: 5 },
                { index: 1, value: 5 },
            ]),
        );
        expect(conflicts).toEqual(new Set([0, 1]));
    });

    it('flags duplicate digits in the same column', () => {
        // col 0: indexes 0 and 9
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 0, value: 3 },
                { index: 9, value: 3 },
            ]),
        );
        expect(conflicts).toEqual(new Set([0, 9]));
    });

    it('flags duplicate digits in the same 3x3 box', () => {
        // box 0: indexes 1 and 11 (not same row or col)
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 1, value: 8 },
                { index: 11, value: 8 },
            ]),
        );
        expect(conflicts).toEqual(new Set([1, 11]));
    });

    it('ignores empty cells', () => {
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 0, value: 0 },
                { index: 1, value: 0 },
            ]),
        );
        expect(conflicts.size).toBe(0);
    });

    it('flags a given that clashes with a user entry', () => {
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 0, value: 4, given: true },
                { index: 2, value: 4 },
            ]),
        );
        expect(conflicts).toEqual(new Set([0, 2]));
    });

    it('does not flag the same digit in different units', () => {
        // index 0 = r0c0 box0; index 13 = r1c4 box1 — different row, col, and box
        const conflicts = findSoftConflicts(
            boardWith([
                { index: 0, value: 5 },
                { index: 13, value: 5 },
            ]),
        );
        expect(conflicts.size).toBe(0);
    });
});
