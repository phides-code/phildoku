import { describe, expect, it } from 'vitest';
import {
    digitFromKey,
    isClearKey,
    nextIndexAfterArrow,
    shouldHandleBoardKeydown,
} from './boardKeyboard';

describe('nextIndexAfterArrow', () => {
    it('starts at 0 when nothing is selected', () => {
        expect(nextIndexAfterArrow(null, 'ArrowRight')).toBe(0);
    });

    it('moves within the grid and clamps at edges', () => {
        expect(nextIndexAfterArrow(0, 'ArrowRight')).toBe(1);
        expect(nextIndexAfterArrow(0, 'ArrowLeft')).toBe(0); // clamp
        expect(nextIndexAfterArrow(0, 'ArrowUp')).toBe(0); // clamp
        expect(nextIndexAfterArrow(0, 'ArrowDown')).toBe(9);
        expect(nextIndexAfterArrow(8, 'ArrowRight')).toBe(8); // end of row
        expect(nextIndexAfterArrow(80, 'ArrowDown')).toBe(80); // last cell
    });
});

describe('digitFromKey / isClearKey', () => {
    it('maps digit keys', () => {
        expect(digitFromKey('5')).toBe(5);
        expect(digitFromKey('a')).toBeNull();
    });

    it('recognizes clear keys', () => {
        expect(isClearKey('Backspace')).toBe(true);
        expect(isClearKey('Delete')).toBe(true);
        expect(isClearKey('0')).toBe(true);
        expect(isClearKey('1')).toBe(false);
    });
});

describe('shouldHandleBoardKeydown', () => {
    it('handles body focus and focus inside the board', () => {
        const board = document.createElement('div');
        const cell = document.createElement('button');
        board.appendChild(cell);
        document.body.appendChild(board);

        expect(shouldHandleBoardKeydown(document.body, board)).toBe(true);
        expect(shouldHandleBoardKeydown(cell, board)).toBe(true);

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        expect(shouldHandleBoardKeydown(outside, board)).toBe(false);

        board.remove();
        outside.remove();
    });
});
