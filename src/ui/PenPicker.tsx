import { PENS, type PenId } from '../constants/game';
import styles from './PenPicker.module.css';

type PenPickerProps = {
    selectedPen: PenId;
    onSelectPen: (pen: PenId) => void;
};

export function PenPicker({ selectedPen, onSelectPen }: PenPickerProps) {
    return (
        <div className={styles.picker} role='group' aria-label='Pen color'>
            {(Object.keys(PENS) as PenId[]).map((penId) => (
                <button
                    key={penId}
                    type='button'
                    className={styles.swatch}
                    aria-label={penId}
                    aria-pressed={selectedPen === penId}
                    style={{ background: PENS[penId] }}
                    onClick={() => onSelectPen(penId)}
                />
            ))}
        </div>
    );
}
