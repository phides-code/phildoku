import { useEffect, useReducer, useRef, useState } from 'react';
import { DIFFICULTIES, type Difficulty } from './constants/game';
import { isWon } from './domain/boardOps';
import { startNewGame } from './puzzle/startNewGame';
import type { PuzzleGenerator } from './puzzle/types';
import { createSession, gameReducer } from './state/gameReducer';
import { loadSession, saveSession } from './storage/sessionStorage';
import { Board } from './ui/Board';
import { GameControls } from './ui/GameControls';
import { NumberPad } from './ui/NumberPad';
import { PenPicker } from './ui/PenPicker';
import { useBoardKeyboard } from './ui/useBoardKeyboard';
import { WinBanner } from './ui/WinBanner';
import styles from './App.module.css';

type AppProps = {
    generate?: PuzzleGenerator;
    storage?: Storage;
    confirmFn?: (message: string) => boolean;
};

function createInitialSession(
    generate?: PuzzleGenerator,
    storage: Storage = localStorage,
) {
    const saved = loadSession(storage);
    if (saved) return saved;
    return createSession(startNewGame('easy', generate));
}

export default function App({
    generate,
    storage = localStorage,
    confirmFn,
}: AppProps = {}) {
    const [session, dispatch] = useReducer(gameReducer, undefined, () =>
        createInitialSession(generate, storage),
    );
    const [difficulty, setDifficulty] = useState<Difficulty>(
        session.game.difficulty,
    );
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        saveSession(session, storage);
    }, [session, storage]);

    const beginNewGame = () => {
        dispatch({
            type: 'NEW_GAME',
            game: startNewGame(difficulty, generate),
        });
    };

    useBoardKeyboard({
        boardRef,
        selectedIndex: session.selectedIndex,
        onSelectCell: (index) => dispatch({ type: 'SELECT_CELL', index }),
        onDigit: (digit) => dispatch({ type: 'INPUT_DIGIT', digit }),
        onClear: () => dispatch({ type: 'CLEAR_CELL' }),
    });

    const won = isWon(session.game.board, session.game.solution);

    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1>PhilDoku</h1>
                <label className={styles.difficulty}>
                    Difficulty
                    <select
                        value={difficulty}
                        onChange={(event) =>
                            setDifficulty(event.target.value as Difficulty)
                        }
                    >
                        {DIFFICULTIES.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </label>
            </header>

            <WinBanner won={won} onNewGame={beginNewGame} />

            <Board
                ref={boardRef}
                board={session.game.board}
                selectedIndex={session.selectedIndex}
                onSelectCell={(index) =>
                    dispatch({ type: 'SELECT_CELL', index })
                }
            />

            <NumberPad
                onDigit={(digit) => dispatch({ type: 'INPUT_DIGIT', digit })}
                onClear={() => dispatch({ type: 'CLEAR_CELL' })}
            />

            <PenPicker
                selectedPen={session.pen}
                onSelectPen={(pen) => dispatch({ type: 'SET_PEN', pen })}
            />

            <GameControls
                board={session.game.board}
                confirmFn={confirmFn}
                onReset={() => dispatch({ type: 'RESET_USER' })}
                onNewGame={beginNewGame}
            />
        </div>
    );
}
