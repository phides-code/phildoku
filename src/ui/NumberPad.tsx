import styles from './NumberPad.module.css';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type NumberPadProps = {
    onDigit: (digit: number) => void;
    onClear: () => void;
};

export function NumberPad({ onDigit, onClear }: NumberPadProps) {
    return (
        <div className={styles.pad} role='group' aria-label='Number pad'>
            {DIGITS.map((digit) => (
                <button
                    key={digit}
                    type='button'
                    className={styles.key}
                    onClick={() => onDigit(digit)}
                >
                    {digit}
                </button>
            ))}
            <button type='button' className={styles.clear} onClick={onClear}>
                Clear
            </button>
        </div>
    );
}
