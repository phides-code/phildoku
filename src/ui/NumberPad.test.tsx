import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberPad } from './NumberPad';

describe('NumberPad', () => {
    it('renders digits 1–9 and a clear control', () => {
        render(<NumberPad onDigit={() => {}} onClear={() => {}} />);

        for (let digit = 1; digit <= 9; digit++) {
            expect(
                screen.getByRole('button', { name: String(digit) }),
            ).toBeInTheDocument();
        }
        expect(
            screen.getByRole('button', { name: /clear/i }),
        ).toBeInTheDocument();
    });

    it('reports the pressed digit', async () => {
        const user = userEvent.setup();
        const onDigit = vi.fn();

        render(<NumberPad onDigit={onDigit} onClear={() => {}} />);

        await user.click(screen.getByRole('button', { name: '7' }));
        expect(onDigit).toHaveBeenCalledWith(7);
    });

    it('reports clear', async () => {
        const user = userEvent.setup();
        const onClear = vi.fn();

        render(<NumberPad onDigit={() => {}} onClear={onClear} />);

        await user.click(screen.getByRole('button', { name: /clear/i }));
        expect(onClear).toHaveBeenCalledOnce();
    });

    it('ignores presses when disabled', async () => {
        const user = userEvent.setup();
        const onDigit = vi.fn();
        const onClear = vi.fn();

        render(
            <NumberPad onDigit={onDigit} onClear={onClear} disabled={true} />,
        );

        await user.click(screen.getByRole('button', { name: '7' }));
        await user.click(screen.getByRole('button', { name: /clear/i }));

        expect(onDigit).not.toHaveBeenCalled();
        expect(onClear).not.toHaveBeenCalled();
    });
});
