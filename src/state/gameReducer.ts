import { applyDigit, clearCell, clearUserEntries } from '../domain/boardOps';
import type { Game } from '../domain/game';
import type { GameAction, GameSession } from './gameState';

export function createSession(game: Game): GameSession {
    return {
        game,
        selectedIndex: null,
        pen: 'black',
    };
}

export function gameReducer(
    session: GameSession,
    action: GameAction,
): GameSession {
    switch (action.type) {
        case 'NEW_GAME':
            return {
                ...session,
                game: action.game,
                selectedIndex: null,
            };
        case 'HYDRATE':
            return action.session;
        case 'SELECT_CELL':
            return { ...session, selectedIndex: action.index };
        case 'SET_PEN':
            return { ...session, pen: action.pen };
        case 'INPUT_DIGIT': {
            if (session.selectedIndex === null) return session;
            return {
                ...session,
                game: {
                    ...session.game,
                    board: applyDigit(
                        session.game.board,
                        session.selectedIndex,
                        action.digit,
                        session.pen,
                    ),
                },
            };
        }
        case 'CLEAR_CELL': {
            if (session.selectedIndex === null) return session;
            return {
                ...session,
                game: {
                    ...session.game,
                    board: clearCell(session.game.board, session.selectedIndex),
                },
            };
        }
        case 'RESET_USER':
            return {
                ...session,
                game: {
                    ...session.game,
                    board: clearUserEntries(session.game.board),
                },
            };
        default:
            return session;
    }
}
