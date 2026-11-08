import type { PenId } from '../constants/game';
import type { Game } from '../domain/game';

export type GameSession = {
    game: Game;
    selectedIndex: number | null;
    pen: PenId;
};

export type GameAction =
    | { type: 'NEW_GAME'; game: Game }
    | { type: 'HYDRATE'; session: GameSession }
    | { type: 'SELECT_CELL'; index: number }
    | { type: 'SET_PEN'; pen: PenId }
    | { type: 'INPUT_DIGIT'; digit: number }
    | { type: 'CLEAR_CELL' }
    | { type: 'RESET_USER' };
