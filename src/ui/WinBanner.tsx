import styles from './WinBanner.module.css';

type WinBannerProps = {
    won: boolean;
};

export function WinBanner({ won }: WinBannerProps) {
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
        </div>
    );
}
