import styles from './ThemeToggle.module.css';
import type { Theme } from '../constants/game';

type ThemeToggleProps = {
    theme: Theme;
    onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            className={styles.toggle}
            aria-pressed={isDark}
            aria-label="Dark mode"
            onClick={onToggle}
        >
            {isDark ? 'Light mode' : 'Dark mode'}
        </button>
    );
}
