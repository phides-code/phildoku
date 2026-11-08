import { beforeEach, describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../constants/game';
import { applyTheme, loadTheme, saveTheme } from './themeStorage';

function memoryStorage(): Storage {
    const map = new Map<string, string>();
    return {
        get length() {
            return map.size;
        },
        clear: () => map.clear(),
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => {
            map.set(key, value);
        },
        removeItem: (key) => {
            map.delete(key);
        },
        key: () => null,
    };
}

describe('themeStorage', () => {
    beforeEach(() => {
        document.documentElement.removeAttribute('data-theme');
    });

    it('defaults to light when nothing is stored', () => {
        expect(loadTheme(memoryStorage())).toBe('light');
    });

    it('round-trips a theme through Storage', () => {
        const storage = memoryStorage();
        saveTheme('dark', storage);
        expect(storage.getItem(THEME_STORAGE_KEY)).toBe('dark');
        expect(loadTheme(storage)).toBe('dark');
    });

    it('ignores corrupt theme values', () => {
        const storage = memoryStorage();
        storage.setItem(THEME_STORAGE_KEY, 'neon');
        expect(loadTheme(storage)).toBe('light');
    });

    it('applies the theme to the document element', () => {
        applyTheme('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
