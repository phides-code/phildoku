import type { PenId } from '../constants/game';
import { BOARD_SIZE } from './geometry';

export type Cell = {
    value: number; // 0 = empty, 1–9 = digit
    given: boolean;
    ink: PenId | null;
};

export type Board = Cell[];

export function createGivenCell(value: number): Cell {
    return { value, given: true, ink: null };
}

export function createUserCell(value: number, ink: PenId | null): Cell {
    return { value, given: false, ink };
}

export function createEmptyCell(): Cell {
    return createUserCell(0, null);
}

export function createEmptyBoard(): Board {
    return Array.from({ length: BOARD_SIZE }, () => createEmptyCell());
}
