import {
    THEME_STORAGE_KEY,
    isTheme,
    type Theme,
} from '../constants/game';

export function loadTheme(storage: Storage = localStorage): Theme {
    const raw = storage.getItem(THEME_STORAGE_KEY);
    if (raw !== null && isTheme(raw)) {
        return raw;
    }
    return 'light';
}

export function saveTheme(
    theme: Theme,
    storage: Storage = localStorage,
): void {
    storage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}
