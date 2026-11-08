import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
    NEW_GAME_CONFIRM_MESSAGE,
    RESET_CONFIRM_MESSAGE,
} from '../constants/game';
import { applyDigit } from '../domain/boardOps';
import { createEmptyBoard } from '../domain/cell';
import { GameControls } from './GameControls';

const defaultDifficultyProps = {
    difficulty: 'easy' as const,
    onDifficultyChange: () => {},
};

describe('GameControls', () => {
    it('resets without confirming when the board is clean', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        const confirmFn = vi.fn();

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={createEmptyBoard()}
                onReset={onReset}
                onNewGame={() => {}}
                confirmFn={confirmFn}
            />,
        );

        await user.click(screen.getByRole('button', { name: /reset/i }));

        expect(confirmFn).not.toHaveBeenCalled();
        expect(onReset).toHaveBeenCalledOnce();
    });

    it('does not reset when dirty and the user cancels', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        const confirmFn = vi.fn(() => false);
        const board = applyDigit(createEmptyBoard(), 0, 1, 'black');

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={board}
                onReset={onReset}
                onNewGame={() => {}}
                confirmFn={confirmFn}
            />,
        );

        await user.click(screen.getByRole('button', { name: /reset/i }));

        expect(confirmFn).toHaveBeenCalledWith(RESET_CONFIRM_MESSAGE);
        expect(onReset).not.toHaveBeenCalled();
    });

    it('resets when dirty and the user confirms', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();
        const confirmFn = vi.fn(() => true);
        const board = applyDigit(createEmptyBoard(), 0, 1, 'black');

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={board}
                onReset={onReset}
                onNewGame={() => {}}
                confirmFn={confirmFn}
            />,
        );

        await user.click(screen.getByRole('button', { name: /reset/i }));

        expect(confirmFn).toHaveBeenCalledWith(RESET_CONFIRM_MESSAGE);
        expect(onReset).toHaveBeenCalledOnce();
    });

    it('starts a new game without confirming when clean', async () => {
        const user = userEvent.setup();
        const onNewGame = vi.fn();
        const confirmFn = vi.fn();

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={createEmptyBoard()}
                onReset={() => {}}
                onNewGame={onNewGame}
                confirmFn={confirmFn}
            />,
        );

        await user.click(screen.getByRole('button', { name: /new game/i }));

        expect(confirmFn).not.toHaveBeenCalled();
        expect(onNewGame).toHaveBeenCalledOnce();
    });

    it('does not start a new game when dirty and cancelled', async () => {
        const user = userEvent.setup();
        const onNewGame = vi.fn();
        const confirmFn = vi.fn(() => false);
        const board = applyDigit(createEmptyBoard(), 0, 1, 'black');

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={board}
                onReset={() => {}}
                onNewGame={onNewGame}
                confirmFn={confirmFn}
            />,
        );

        await user.click(screen.getByRole('button', { name: /new game/i }));

        expect(confirmFn).toHaveBeenCalledWith(NEW_GAME_CONFIRM_MESSAGE);
        expect(onNewGame).not.toHaveBeenCalled();
    });

    it('reports difficulty changes', async () => {
        const user = userEvent.setup();
        const onDifficultyChange = vi.fn();

        render(
            <GameControls
                board={createEmptyBoard()}
                difficulty='easy'
                onDifficultyChange={onDifficultyChange}
                onReset={() => {}}
                onNewGame={() => {}}
            />,
        );

        await user.selectOptions(
            screen.getByRole('combobox', { name: /difficulty/i }),
            'hard',
        );

        expect(onDifficultyChange).toHaveBeenCalledWith('hard');
    });

    it('disables reset when the board is locked', async () => {
        const user = userEvent.setup();
        const onReset = vi.fn();

        render(
            <GameControls
                {...defaultDifficultyProps}
                board={createEmptyBoard()}
                onReset={onReset}
                onNewGame={() => {}}
                boardLocked={true}
            />,
        );

        const reset = screen.getByRole('button', { name: /reset/i });
        expect(reset).toBeDisabled();
        await user.click(reset);
        expect(onReset).not.toHaveBeenCalled();
    });
});
