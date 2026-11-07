export const GRID_SIZE = 9;
export const BOARD_SIZE = GRID_SIZE * GRID_SIZE;
export const BOX_SIZE = 3;

export function rowIndexes(row: number): number[] {
    return Array.from({ length: GRID_SIZE }, (_, col) => row * GRID_SIZE + col);
}

export function colIndexes(col: number): number[] {
    return Array.from({ length: GRID_SIZE }, (_, row) => row * GRID_SIZE + col);
}

export function boxIndexes(box: number): number[] {
    const boxRow = Math.floor(box / BOX_SIZE) * BOX_SIZE;
    const boxCol = (box % BOX_SIZE) * BOX_SIZE;
    const indexes: number[] = [];

    for (let r = 0; r < BOX_SIZE; r++) {
        for (let c = 0; c < BOX_SIZE; c++) {
            indexes.push((boxRow + r) * GRID_SIZE + (boxCol + c));
        }
    }

    return indexes;
}

export function flattenGrid(grid: number[][]): number[] {
    if (
        grid.length !== GRID_SIZE ||
        grid.some((row) => row.length !== GRID_SIZE)
    ) {
        throw new Error(`Puzzle grid must be ${GRID_SIZE}x${GRID_SIZE}`);
    }

    return grid.flat();
}
