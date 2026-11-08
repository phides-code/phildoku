import styles from './WinBanner.module.css';

type WinBannerProps = {
    won: boolean;
    onNewGame: () => void;
};

export function WinBanner({ won, onNewGame }: WinBannerProps) {
    if (!won) {
        return null;
    }

    return (
        <div
            className={styles.banner}
            role='status'
            aria-label='Puzzle complete'
        >
            <p className={styles.message}>You solved it.</p>
            <button type='button' className={styles.button} onClick={onNewGame}>
                New Game
            </button>
        </div>
    );
}
