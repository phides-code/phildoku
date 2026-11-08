import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { applyDigit } from '../domain/boardOps';
import { createEmptyBoard, createGivenCell } from '../domain/cell';
import { BOARD_SIZE } from '../domain/geometry';
import { Board } from './Board';

function boardWithGiven() {
    const board = createEmptyBoard();
    return board.map((cell, index) =>
        index === 0 ? createGivenCell(5) : cell,
    );
}

describe('Board', () => {
    it('renders one cell per board index', () => {
        render(
            <Board
                board={createEmptyBoard()}
                selectedIndex={null}
                onSelectCell={() => {}}
            />,
        );

        expect(screen.getAllByRole('gridcell')).toHaveLength(BOARD_SIZE);
    });

    it('shows given digits with a given style marker', () => {
        render(
            <Board
                board={boardWithGiven()}
                selectedIndex={null}
                onSelectCell={() => {}}
            />,
        );

        const given = screen.getByRole('gridcell', {
            name: 'Row 1 column 1, 5, given',
        });
        expect(given).toHaveAttribute('data-given', 'true');
    });

    it('marks soft conflicts', () => {
        const board = applyDigit(boardWithGiven(), 1, 5, 'black');

        render(
            <Board
                board={board}
                selectedIndex={null}
                onSelectCell={() => {}}
            />,
        );

        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 1, 5, given' }),
        ).toHaveAttribute('data-conflict', 'true');
        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 2, 5' }),
        ).toHaveAttribute('data-conflict', 'true');
    });

    it('marks the selected cell and reports clicks', async () => {
        const user = userEvent.setup();
        const onSelectCell = vi.fn();

        render(
            <Board
                board={boardWithGiven()}
                selectedIndex={1}
                onSelectCell={onSelectCell}
            />,
        );

        expect(
            screen.getByRole('gridcell', { name: 'Row 1 column 2' }),
        ).toHaveAttribute('data-selected', 'true');

        await user.click(
            screen.getByRole('gridcell', { name: 'Row 1 column 3' }),
        );
        expect(onSelectCell).toHaveBeenCalledWith(2);
    });

    it('applies pen ink style for user digits', () => {
        const board = applyDigit(createEmptyBoard(), 3, 7, 'red');

        render(
            <Board
                board={board}
                selectedIndex={null}
                onSelectCell={() => {}}
            />,
        );

        const cell = screen.getByRole('gridcell', {
            name: 'Row 1 column 4, 7',
        });
        expect(cell).toHaveAttribute('data-ink', 'red');
        expect(cell).toHaveStyle({ color: 'var(--pen-red)' });
    });
});
