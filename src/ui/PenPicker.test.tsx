import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PenPicker } from './PenPicker';

describe('PenPicker', () => {
    it('renders one control per pen', () => {
        render(<PenPicker selectedPen='black' onSelectPen={() => {}} />);

        expect(
            screen.getByRole('button', { name: /black/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /red/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /blue/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /green/i }),
        ).toBeInTheDocument();
    });

    it('marks the selected pen', () => {
        render(<PenPicker selectedPen='red' onSelectPen={() => {}} />);

        expect(screen.getByRole('button', { name: /red/i })).toHaveAttribute(
            'aria-pressed',
            'true',
        );
        expect(screen.getByRole('button', { name: /black/i })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
    });

    it('reports the chosen pen', async () => {
        const user = userEvent.setup();
        const onSelectPen = vi.fn();

        render(<PenPicker selectedPen='black' onSelectPen={onSelectPen} />);

        await user.click(screen.getByRole('button', { name: /blue/i }));
        expect(onSelectPen).toHaveBeenCalledWith('blue');
    });
});
