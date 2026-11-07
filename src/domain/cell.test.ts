import { describe, expect, it } from 'vitest';
import {
    createEmptyBoard,
    createEmptyCell,
    createGivenCell,
    createUserCell,
} from './cell';
import { BOARD_SIZE } from './geometry';

describe('createGivenCell', () => {
    it('marks the cell as given with no ink', () => {
        expect(createGivenCell(5)).toEqual({
            value: 5,
            given: true,
            ink: null,
        });
    });
});

describe('createUserCell', () => {
    it('stores value and pen ink', () => {
        expect(createUserCell(7, 'red')).toEqual({
            value: 7,
            given: false,
            ink: 'red',
        });
    });
});

describe('createEmptyCell', () => {
    it('represents an empty user cell', () => {
        expect(createEmptyCell()).toEqual({
            value: 0,
            given: false,
            ink: null,
        });
    });
});

describe('createEmptyBoard', () => {
    it('returns an empty user cell for every board index', () => {
        const board = createEmptyBoard();
        expect(board).toHaveLength(BOARD_SIZE);
        expect(
            board.every(
                (cell) => cell.value === 0 && !cell.given && cell.ink === null,
            ),
        ).toBe(true);
    });
});
