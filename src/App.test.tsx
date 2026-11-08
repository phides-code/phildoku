import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GRID_SIZE } from './domain/geometry';
import type { PuzzleGenerator } from './puzzle/types';
import App from './App';

function gridWithGivenAtOrigin(given: number, fillRest: number): number[][] {
    return Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) =>
            row === 0 && col === 0 ? given : fillRest,
        ),
    );
}

const fakeGenerate: PuzzleGenerator = () => ({
    puzzle: gridWithGivenAtOrigin(5, 0),
    solution: gridWithGivenAtOrigin(5, 1),
});

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

describe('App', () => {
    it('renders PhilDoku and a playable board', () => {
        render(<App generate={fakeGenerate} storage={memoryStorage()} />);

        expect(
            screen.getByRole('heading', { name: /phildoku/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('grid', { name: /sudoku board/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 1, 5, given' }),
        ).toBeInTheDocument();
    });

    it('writes a digit from the number pad into the selected cell', async () => {
        const user = userEvent.setup();

        render(<App generate={fakeGenerate} storage={memoryStorage()} />);

        await user.click(
            screen.getByRole('gridcell', { name: 'Row 1 column 2' }),
        );
        await user.click(screen.getByRole('button', { name: '3' }));

        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 2, 3' }),
        ).toHaveAttribute('data-ink', 'black');
    });

    it('changes pen for subsequent writes only', async () => {
        const user = userEvent.setup();

        render(<App generate={fakeGenerate} storage={memoryStorage()} />);

        await user.click(
            screen.getByRole('gridcell', { name: 'Row 1 column 2' }),
        );
        await user.click(screen.getByRole('button', { name: '3' }));
        await user.click(screen.getByRole('button', { name: /red/i }));
        await user.click(
            screen.getByRole('gridcell', { name: 'Row 1 column 3' }),
        );
        await user.click(screen.getByRole('button', { name: '4' }));

        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 2, 3' }),
        ).toHaveAttribute('data-ink', 'black');
        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 3, 4' }),
        ).toHaveAttribute('data-ink', 'red');
    });
});
