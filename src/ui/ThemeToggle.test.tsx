import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
    it('shows dark mode affordance when light', () => {
        render(<ThemeToggle theme="light" onToggle={() => {}} />);

        expect(
            screen.getByRole('button', { name: /dark mode/i }),
        ).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows light mode affordance when dark and reports toggles', async () => {
        const user = userEvent.setup();
        const onToggle = vi.fn();

        render(<ThemeToggle theme="dark" onToggle={onToggle} />);

        const toggle = screen.getByRole('button', { name: /dark mode/i });
        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(toggle).toHaveTextContent(/light mode/i);

        await user.click(toggle);
        expect(onToggle).toHaveBeenCalledOnce();
    });
});
