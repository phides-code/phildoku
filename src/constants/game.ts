export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const PENS = {
    black: 'var(--pen-black)',
    red: 'var(--pen-red)',
    blue: 'var(--pen-blue)',
    green: 'var(--pen-green)',
} as const;
export type PenId = keyof typeof PENS;

export function isDifficulty(value: string): value is Difficulty {
    return (DIFFICULTIES as readonly string[]).includes(value);
}

export function isPenId(value: string): value is PenId {
    return value in PENS;
}
