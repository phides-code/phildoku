import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WinBanner } from './WinBanner';

describe('WinBanner', () => {
    it('renders nothing when the puzzle is not won', () => {
        const { container } = render(<WinBanner won={false} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('shows a win message when won', () => {
        render(<WinBanner won={true} />);

        expect(
            screen.getByRole('status', { name: /puzzle complete/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/you solved it/i)).toBeInTheDocument();
    });
});
