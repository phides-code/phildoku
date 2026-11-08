import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WinBanner } from './WinBanner';

describe('WinBanner', () => {
    it('renders nothing when the puzzle is not won', () => {
        const { container } = render(
            <WinBanner won={false} onNewGame={() => {}} />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('shows a win message and new-game action when won', async () => {
        const user = userEvent.setup();
        const onNewGame = vi.fn();

        render(<WinBanner won={true} onNewGame={onNewGame} />);

        expect(
            screen.getByRole('status', { name: /puzzle complete/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/you solved it/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /new game/i }));
        expect(onNewGame).toHaveBeenCalledOnce();
    });
});
