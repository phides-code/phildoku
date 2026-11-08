import styles from './NumberPad.module.css';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type NumberPadProps = {
    onDigit: (digit: number) => void;
    onClear: () => void;
    disabled?: boolean;
};

export function NumberPad({
    onDigit,
    onClear,
    disabled = false,
}: NumberPadProps) {
    return (
        <div className={styles.pad} role='group' aria-label='Number pad'>
            {DIGITS.map((digit) => (
                <button
                    key={digit}
                    type='button'
                    className={styles.key}
                    disabled={disabled}
                    onClick={() => onDigit(digit)}
                >
                    {digit}
                </button>
            ))}
            <button
                type='button'
                className={styles.clear}
                disabled={disabled}
                onClick={onClear}
            >
                Clear cell
            </button>
        </div>
    );
}
