import { forwardRef, useEffect, useRef, type Ref } from 'react';
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

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}

export const Board = forwardRef<HTMLDivElement, BoardProps>(function Board(
    { board, selectedIndex, onSelectCell },
    ref,
) {
    const boardRef = useRef<HTMLDivElement | null>(null);
    const conflicts = findSoftConflicts(board);

    useEffect(() => {
        if (selectedIndex === null) {
            return;
        }

        const cell = boardRef.current?.querySelector<HTMLButtonElement>(
            `[data-cell-index="${selectedIndex}"]`,
        );
        if (cell && document.activeElement !== cell) {
            cell.focus({ preventScroll: true });
        }
    }, [selectedIndex]);

    return (
        <div
            ref={(node) => {
                boardRef.current = node;
                assignRef(ref, node);
            }}
            className={styles.board}
            role='grid'
            aria-label='Sudoku board'
            style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
        >
            {board.map((cell, index) => {
                const row = Math.floor(index / GRID_SIZE) + 1;
                const col = (index % GRID_SIZE) + 1;
                const position = `Row ${row} column ${col}`;
                const label =
                    cell.value === 0
                        ? position
                        : `${position}, ${cell.value}${cell.given ? ', given' : ''}`;
                const isSelected = selectedIndex === index;
                const isTabStop =
                    isSelected || (selectedIndex === null && index === 0);

                return (
                    <button
                        key={index}
                        type='button'
                        role='gridcell'
                        className={styles.cell}
                        aria-label={label}
                        tabIndex={isTabStop ? 0 : -1}
                        data-cell-index={index}
                        data-given={cell.given ? 'true' : undefined}
                        data-selected={isSelected ? 'true' : undefined}
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
