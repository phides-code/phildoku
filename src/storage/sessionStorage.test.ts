import { describe, expect, it } from 'vitest';
import { GAME_SESSION_STORAGE_KEY } from '../constants/game';
import { createGameFromPuzzle } from '../domain/game';
import { GRID_SIZE } from '../domain/geometry';
import { createSession } from '../state/gameReducer';
import {
    loadSession,
    parseSession,
    saveSession,
    serializeSession,
} from './sessionStorage';

function fixtureGame() {
    const puzzle = Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? 5 : 0,
        ),
    );
    const solution = Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? 5 : 1,
        ),
    );
    return createGameFromPuzzle(puzzle, solution, 'easy');
}

function memoryStorage(): Storage {
    const map = new Map<string, string>();
    return {
        get length() {
            return map.size;
        },
        clear: () => map.clear(),
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => {
            map.set(key, value);
        },
        removeItem: (key) => {
            map.delete(key);
        },
        key: () => null,
    };
}

describe('serializeSession / parseSession', () => {
    it('round-trips a session', () => {
        const session = {
            ...createSession(fixtureGame()),
            selectedIndex: 1,
            pen: 'red' as const,
        };

        const parsed = parseSession(serializeSession(session));

        expect(parsed).toEqual(session);
    });

    it('returns null for corrupt JSON', () => {
        expect(parseSession('{not-json')).toBeNull();
    });

    it('returns null for JSON that is not a session', () => {
        expect(parseSession(JSON.stringify({ foo: 1 }))).toBeNull();
        expect(parseSession(JSON.stringify(null))).toBeNull();
    });

    it('migrates legacy green and orange pens to purple', () => {
        const base = createSession(fixtureGame());
        const raw = JSON.stringify({
            ...base,
            pen: 'green',
            game: {
                ...base.game,
                board: base.game.board.map((cell, index) =>
                    index === 1
                        ? { value: 4, given: false, ink: 'orange' }
                        : cell,
                ),
            },
        });

        const parsed = parseSession(raw);

        expect(parsed?.pen).toBe('purple');
        expect(parsed?.game.board[1]).toEqual({
            value: 4,
            given: false,
            ink: 'purple',
        });
    });
});

describe('saveSession / loadSession', () => {
    it('saves and loads through Storage', () => {
        const storage = memoryStorage();
        const session = createSession(fixtureGame());

        saveSession(session, storage);

        expect(loadSession(storage)).toEqual(session);
    });

    it('returns null when nothing is stored', () => {
        expect(loadSession(memoryStorage())).toBeNull();
    });

    it('returns null when stored payload is corrupt', () => {
        const storage = memoryStorage();
        storage.setItem(GAME_SESSION_STORAGE_KEY, 'nope');

        expect(loadSession(storage)).toBeNull();
    });
});
