import { forwardRef } from 'react';
import { PENS } from '../constants/game';
import type { Board as BoardModel } from '../domain/cell';
import { findSoftConflicts } from '../domain/conflicts';
import { GRID_SIZE } from '../domain/geometry';
import styles from './Board.module.css';

type BoardProps = {
    board: BoardModel;
    selectedIndex: number | null;
    onSelectCell: (index: number) => void;
};

export const Board = forwardRef<HTMLDivElement, BoardProps>(function Board(
    { board, selectedIndex, onSelectCell },
    ref,
) {
    const conflicts = findSoftConflicts(board);

    return (
        <div
            ref={ref}
            className={styles.board}
            role='grid'
            aria-label='Sudoku board'
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
            {board.map((cell, index) => {
                const row = Math.floor(index / GRID_SIZE) + 1;
                const col = (index % GRID_SIZE) + 1;
                const position = `Row ${row} column ${col}`;
                const label =
                    cell.value === 0
                        ? position
                        : `${position}, ${cell.value}${cell.given ? ', given' : ''}`;

                return (
                    <button
                        key={index}
                        type='button'
                        role='gridcell'
                        className={styles.cell}
                        aria-label={label}
                        data-given={cell.given ? 'true' : undefined}
                        data-selected={
                            selectedIndex === index ? 'true' : undefined
                        }
                        data-conflict={
                            conflicts.has(index) ? 'true' : undefined
                        }
                        data-ink={
                            !cell.given && cell.ink ? cell.ink : undefined
                        }
                        style={
                            !cell.given && cell.ink
                                ? { color: PENS[cell.ink] }
                                : undefined
                        }
                        onClick={() => onSelectCell(index)}
                    >
                        {cell.value === 0 ? '' : cell.value}
                    </button>
                );
            })}
        </div>
    );
});
