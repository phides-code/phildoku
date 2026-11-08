import { describe, expect, it } from 'vitest';
import { createGameFromPuzzle } from '../domain/game';
import { GRID_SIZE } from '../domain/geometry';
import { createSession, gameReducer } from './gameReducer';

function gridWithGivenAtOrigin(given: number, fillRest: number): number[][] {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? given : fillRest,
        ),
    );
}

function fixtureGame(difficulty: 'easy' | 'medium' | 'hard' = 'easy') {
    return createGameFromPuzzle(
        gridWithGivenAtOrigin(5, 0),
        gridWithGivenAtOrigin(5, 1),
        difficulty,
    );
}

describe('createSession', () => {
    it('starts with no selection and a black pen', () => {
        const game = fixtureGame();
        const session = createSession(game);

        expect(session).toEqual({
            game,
            selectedIndex: null,
            pen: 'black',
        });
    });
});

describe('gameReducer', () => {
    it('NEW_GAME replaces the game and clears selection', () => {
        const first = createSession(fixtureGame('easy'));
        let session = gameReducer(first, { type: 'SELECT_CELL', index: 3 });
        session = gameReducer(session, { type: 'SET_PEN', pen: 'red' });

        const nextGame = fixtureGame('hard');
        session = gameReducer(session, { type: 'NEW_GAME', game: nextGame });

        expect(session.game).toBe(nextGame);
        expect(session.selectedIndex).toBeNull();
        expect(session.pen).toBe('red'); // pen preserved
    });

    it('HYDRATE replaces the entire session', () => {
        const current = createSession(fixtureGame('easy'));
        const saved = {
            game: fixtureGame('medium'),
            selectedIndex: 4,
            pen: 'blue' as const,
        };

        const session = gameReducer(current, {
            type: 'HYDRATE',
            session: saved,
        });

        expect(session).toEqual(saved);
    });

    it('SELECT_CELL sets the selected index', () => {
        const session = gameReducer(createSession(fixtureGame()), {
            type: 'SELECT_CELL',
            index: 12,
        });

        expect(session.selectedIndex).toBe(12);
    });

    it('SET_PEN changes only the pen', () => {
        const initial = createSession(fixtureGame());
        const session = gameReducer(initial, { type: 'SET_PEN', pen: 'green' });

        expect(session.pen).toBe('green');
        expect(session.game).toBe(initial.game);
        expect(session.selectedIndex).toBeNull();
    });

    it('INPUT_DIGIT writes the current pen onto the selected cell', () => {
        let session = createSession(fixtureGame());
        session = gameReducer(session, { type: 'SET_PEN', pen: 'red' });
        session = gameReducer(session, { type: 'SELECT_CELL', index: 1 });
        session = gameReducer(session, { type: 'INPUT_DIGIT', digit: 3 });

        expect(session.game.board[1]).toEqual({
            value: 3,
            given: false,
            ink: 'red',
        });
    });

    it('INPUT_DIGIT is a no-op when nothing is selected', () => {
        const initial = createSession(fixtureGame());
        const session = gameReducer(initial, { type: 'INPUT_DIGIT', digit: 3 });

        expect(session).toBe(initial);
    });

    it('INPUT_DIGIT does not change a given cell', () => {
        let session = createSession(fixtureGame());
        session = gameReducer(session, { type: 'SELECT_CELL', index: 0 });
        session = gameReducer(session, { type: 'INPUT_DIGIT', digit: 9 });

        expect(session.game.board[0]).toEqual({
            value: 5,
            given: true,
            ink: null,
        });
    });

    it('CLEAR_CELL clears the selected user cell', () => {
        let session = createSession(fixtureGame());
        session = gameReducer(session, { type: 'SELECT_CELL', index: 1 });
        session = gameReducer(session, { type: 'INPUT_DIGIT', digit: 3 });
        session = gameReducer(session, { type: 'CLEAR_CELL' });

        expect(session.game.board[1]).toEqual({
            value: 0,
            given: false,
            ink: null,
        });
    });

    it('CLEAR_CELL is a no-op when nothing is selected', () => {
        const initial = createSession(fixtureGame());
        const session = gameReducer(initial, { type: 'CLEAR_CELL' });

        expect(session).toBe(initial);
    });

    it('RESET_USER clears user entries and keeps givens, selection, and pen', () => {
        let session = createSession(fixtureGame());
        session = gameReducer(session, { type: 'SET_PEN', pen: 'blue' });
        session = gameReducer(session, { type: 'SELECT_CELL', index: 1 });
        session = gameReducer(session, { type: 'INPUT_DIGIT', digit: 3 });

        session = gameReducer(session, { type: 'RESET_USER' });

        expect(session.game.board[0]).toEqual({
            value: 5,
            given: true,
            ink: null,
        });
        expect(session.game.board[1]).toEqual({
            value: 0,
            given: false,
            ink: null,
        });
        expect(session.selectedIndex).toBe(1);
        expect(session.pen).toBe('blue');
    });
});
