import {
    NEW_GAME_CONFIRM_MESSAGE,
    RESET_CONFIRM_MESSAGE,
} from '../constants/game';
import type { Board } from '../domain/cell';
import { confirmIfDirty } from './confirmDirty';
import styles from './GameControls.module.css';

type GameControlsProps = {
    board: Board;
    onReset: () => void;
    onNewGame: () => void;
    confirmFn?: (message: string) => boolean;
};

export function GameControls({
    board,
    onReset,
    onNewGame,
    confirmFn,
}: GameControlsProps) {
    return (
        <div
            className={styles.controls}
            role='group'
            aria-label='Game controls'
        >
            <button
                type='button'
                className={styles.button}
                onClick={() => {
                    if (
                        confirmIfDirty(board, RESET_CONFIRM_MESSAGE, confirmFn)
                    ) {
                        onReset();
                    }
                }}
            >
                Reset
            </button>
            <button
                type='button'
                className={styles.button}
                onClick={() => {
                    if (
                        confirmIfDirty(
                            board,
                            NEW_GAME_CONFIRM_MESSAGE,
                            confirmFn,
                        )
                    ) {
                        onNewGame();
                    }
                }}
            >
                New Game
            </button>
        </div>
    );
}
