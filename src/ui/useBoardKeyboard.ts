import { useEffect, type RefObject } from 'react';
import {
    digitFromKey,
    isArrowKey,
    isClearKey,
    nextIndexAfterArrow,
    shouldHandleBoardKeydown,
} from './boardKeyboard';

type Options = {
    boardRef: RefObject<HTMLElement | null>;
    selectedIndex: number | null;
    onSelectCell: (index: number) => void;
    onDigit: (digit: number) => void;
    onClear: () => void;
    boardLocked?: boolean;
};

export function useBoardKeyboard({
    boardRef,
    selectedIndex,
    onSelectCell,
    onDigit,
    onClear,
    boardLocked = false,
}: Options): void {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                !shouldHandleBoardKeydown(
                    document.activeElement,
                    boardRef.current,
                )
            ) {
                return;
            }

            if (isArrowKey(event.key)) {
                event.preventDefault();
                onSelectCell(nextIndexAfterArrow(selectedIndex, event.key));
                return;
            }

            if (boardLocked) {
                return;
            }

            const digit = digitFromKey(event.key);
            if (digit !== null) {
                event.preventDefault();
                onDigit(digit);
                return;
            }

            if (isClearKey(event.key)) {
                event.preventDefault();
                onClear();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [boardRef, selectedIndex, onSelectCell, onDigit, onClear, boardLocked]);
}
