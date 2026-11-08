export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const PENS = {
    black: 'var(--pen-black)',
    red: 'var(--pen-red)',
    blue: 'var(--pen-blue)',
    purple: 'var(--pen-purple)',
} as const;
export type PenId = keyof typeof PENS;

export function isDifficulty(value: string): value is Difficulty {
    return (DIFFICULTIES as readonly string[]).includes(value);
}

export function isPenId(value: string): value is PenId {
    return value in PENS;
}

export const GAME_SESSION_STORAGE_KEY = 'phildoku.session';
export const THEME_STORAGE_KEY = 'phildoku.theme';

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export function isTheme(value: string): value is Theme {
    return (THEMES as readonly string[]).includes(value);
}

export const RESET_CONFIRM_MESSAGE = 'Clear your entries?';
export const NEW_GAME_CONFIRM_MESSAGE =
    'Start a new game? Your progress will be lost.';
