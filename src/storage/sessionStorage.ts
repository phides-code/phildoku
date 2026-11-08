import {
  GAME_SESSION_STORAGE_KEY,
  isDifficulty,
  isPenId,
  type PenId,
} from '../constants/game';
import type { Cell } from '../domain/cell';
import type { Game } from '../domain/game';
import { BOARD_SIZE } from '../domain/geometry';
import type { GameSession } from '../state/gameState';

export function serializeSession(session: GameSession): string {
  return JSON.stringify(session);
}

export function parseSession(raw: string): GameSession | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!isGameSession(data)) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(
  session: GameSession,
  storage: Storage = localStorage,
): void {
  storage.setItem(GAME_SESSION_STORAGE_KEY, serializeSession(session));
}

export function loadSession(
  storage: Storage = localStorage,
): GameSession | null {
  const raw = storage.getItem(GAME_SESSION_STORAGE_KEY);
  if (raw === null) return null;
  return parseSession(raw);
}

function isGameSession(value: unknown): value is GameSession {
  if (!isRecord(value)) return false;

  if (!isPenIdValue(value.pen)) return false;
  if (!isSelectedIndex(value.selectedIndex)) return false;
  if (!isGame(value.game)) return false;

  return true;
}

function isGame(value: unknown): value is Game {
  if (!isRecord(value)) return false;
  if (typeof value.difficulty !== 'string' || !isDifficulty(value.difficulty)) {
    return false;
  }
  if (!Array.isArray(value.board) || value.board.length !== BOARD_SIZE) {
    return false;
  }
  if (!value.board.every(isCell)) return false;
  if (!Array.isArray(value.solution) || value.solution.length !== BOARD_SIZE) {
    return false;
  }
  if (!value.solution.every(isSolutionDigit)) return false;

  return true;
}

function isCell(value: unknown): value is Cell {
  if (!isRecord(value)) return false;
  if (!isBoardDigit(value.value)) return false;
  if (typeof value.given !== 'boolean') return false;
  if (!isInk(value.ink)) return false;
  if (value.given && value.ink !== null) return false;
  if (value.given && value.value === 0) return false;
  if (!value.given && value.value === 0 && value.ink !== null) return false;

  return true;
}

function isInk(value: unknown): value is PenId | null {
  return value === null || (typeof value === 'string' && isPenId(value));
}

function isPenIdValue(value: unknown): value is PenId {
  return typeof value === 'string' && isPenId(value);
}

function isSelectedIndex(value: unknown): value is number | null {
  if (value === null) return true;
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < BOARD_SIZE
  );
}

function isBoardDigit(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 9
  );
}

function isSolutionDigit(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 9
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
