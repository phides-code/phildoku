import type { PenId } from '../constants/game';
import type { Board } from './cell';
import { createEmptyCell, createUserCell } from './cell';

export function applyDigit(
    board: Board,
    index: number,
    digit: number,
    penId: PenId,
): Board {
    const cell = board[index];
    if (cell.given) {
        return board;
    }

    const next = board.slice();
    next[index] = createUserCell(digit, penId);
    return next;
}

export function clearCell(board: Board, index: number): Board {
    if (board[index].given) {
        return board;
    }

    const next = board.slice();
    next[index] = createEmptyCell();
    return next;
}

export function isWon(board: Board, solution: number[]): boolean {
    return board.every((cell, index) => cell.value === solution[index]);
}

export function clearUserEntries(board: Board): Board {
    return board.map((cell) => (cell.given ? cell : createEmptyCell()));
}

export function isDirty(board: Board): boolean {
    return board.some((cell) => !cell.given && cell.value !== 0);
}
