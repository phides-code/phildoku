import { isDirty } from '../domain/boardOps';
import type { Board } from '../domain/cell';

export function confirmIfDirty(
    board: Board,
    message: string,
    confirmFn: (message: string) => boolean = (msg) => window.confirm(msg),
): boolean {
    if (!isDirty(board)) return true;
    return confirmFn(message);
}
