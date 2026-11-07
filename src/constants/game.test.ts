import { describe, expect, it } from 'vitest';
import { DIFFICULTIES, PENS, isDifficulty, isPenId } from './game';

describe('DIFFICULTIES', () => {
    it('lists easy, medium, and hard in that order', () => {
        expect(DIFFICULTIES).toEqual(['easy', 'medium', 'hard']);
    });
});

describe('PENS', () => {
    it('lists the four pen ids', () => {
        expect(Object.keys(PENS)).toEqual(['black', 'red', 'blue', 'green']);
    });

    it('maps each pen to its css variable token', () => {
        expect(PENS.black).toBe('var(--pen-black)');
        expect(PENS.red).toBe('var(--pen-red)');
        expect(PENS.blue).toBe('var(--pen-blue)');
        expect(PENS.green).toBe('var(--pen-green)');
    });
});

describe('isDifficulty', () => {
    it('accepts only known difficulties', () => {
        expect(isDifficulty('easy')).toBe(true);
        expect(isDifficulty('expert')).toBe(false);
    });
});

describe('isPenId', () => {
    it('accepts only known pen ids', () => {
        expect(isPenId('red')).toBe(true);
        expect(isPenId('purple')).toBe(false);
    });
});
