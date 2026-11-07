import type { Board } from './cell';
import { GRID_SIZE, boxIndexes, colIndexes, rowIndexes } from './geometry';

export function findSoftConflicts(board: Board): Set<number> {
    const conflicts = new Set<number>();

    const markDuplicates = (indexes: number[]) => {
        const seen = new Map<number, number>();
        for (const index of indexes) {
            const value = board[index].value;
            if (value === 0) continue;

            const prior = seen.get(value);
            if (prior === undefined) {
                seen.set(value, index);
            } else {
                conflicts.add(prior);
                conflicts.add(index);
            }
        }
    };

    for (let unit = 0; unit < GRID_SIZE; unit++) {
        markDuplicates(rowIndexes(unit));
        markDuplicates(colIndexes(unit));
        markDuplicates(boxIndexes(unit));
    }

    return conflicts;
}
