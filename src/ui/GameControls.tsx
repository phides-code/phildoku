import {
    DIFFICULTIES,
    NEW_GAME_CONFIRM_MESSAGE,
    RESET_CONFIRM_MESSAGE,
    type Difficulty,
} from '../constants/game';
import type { Board } from '../domain/cell';
import { confirmIfDirty } from './confirmDirty';
import styles from './GameControls.module.css';

type GameControlsProps = {
    board: Board;
    difficulty: Difficulty;
    onDifficultyChange: (difficulty: Difficulty) => void;
    onReset: () => void;
    onNewGame: () => void;
    confirmFn?: (message: string) => boolean;
    boardLocked?: boolean;
};

export function GameControls({
    board,
    difficulty,
    onDifficultyChange,
    onReset,
    onNewGame,
    confirmFn,
    boardLocked = false,
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
                disabled={boardLocked}
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

            <div className={styles.newGameGroup}>
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
                <label className={styles.difficulty}>
                    <span className={styles.difficultyLabel}>Difficulty</span>
                    <select
                        value={difficulty}
                        aria-label='Difficulty'
                        onChange={(event) =>
                            onDifficultyChange(event.target.value as Difficulty)
                        }
                    >
                        {DIFFICULTIES.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
