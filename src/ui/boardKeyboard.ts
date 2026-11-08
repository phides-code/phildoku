import { BOARD_SIZE, GRID_SIZE } from '../domain/geometry';

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export function nextIndexAfterArrow(
    selectedIndex: number | null,
    key: ArrowKey,
): number {
    if (selectedIndex === null) return 0;

    const row = Math.floor(selectedIndex / GRID_SIZE);
    const col = selectedIndex % GRID_SIZE;

    let nextRow = row;
    let nextCol = col;

    if (key === 'ArrowUp') nextRow = Math.max(0, row - 1);
    if (key === 'ArrowDown') nextRow = Math.min(GRID_SIZE - 1, row + 1);
    if (key === 'ArrowLeft') nextCol = Math.max(0, col - 1);
    if (key === 'ArrowRight') nextCol = Math.min(GRID_SIZE - 1, col + 1);

    return nextRow * GRID_SIZE + nextCol;
}

export function digitFromKey(key: string): number | null {
    if (key.length === 1 && key >= '1' && key <= '9') return Number(key);
    return null;
}

export function isClearKey(key: string): boolean {
    return key === 'Backspace' || key === 'Delete' || key === '0';
}

export function shouldHandleBoardKeydown(
    activeElement: Element | null,
    boardRoot: HTMLElement | null,
): boolean {
    if (!boardRoot) return false;
    if (
        !activeElement ||
        activeElement === document.body ||
        activeElement === document.documentElement
    ) {
        return true;
    }
    return boardRoot.contains(activeElement);
}

export function isArrowKey(key: string): key is ArrowKey {
    return (
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
    );
}

// silence unused if you only need BOARD_SIZE later — or drop the import
void BOARD_SIZE;
