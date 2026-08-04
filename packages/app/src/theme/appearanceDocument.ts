export type AppearanceTheme = 'light' | 'dark' | 'system';

export const APPEARANCE_THEME_STORAGE_KEY = 'platform.appearance-theme';
export const DEFAULT_APPEARANCE_THEME: AppearanceTheme = 'system';

export const isAppearanceTheme = (value: string | null): value is AppearanceTheme =>
  value === 'light' || value === 'dark' || value === 'system';

export const getAppearanceTheme = (): AppearanceTheme => {
  try {
    const storedTheme = window.localStorage.getItem(APPEARANCE_THEME_STORAGE_KEY);
    return isAppearanceTheme(storedTheme) ? storedTheme : DEFAULT_APPEARANCE_THEME;
  } catch (_error) {
    return DEFAULT_APPEARANCE_THEME;
  }
};

export const persistAppearanceTheme = (theme: AppearanceTheme): void => {
  try {
    window.localStorage.setItem(APPEARANCE_THEME_STORAGE_KEY, theme);
  } catch (_error) {
    // The selection still applies for the current session when storage is unavailable.
  }
};

export const applyAppearanceDocumentTheme = (theme: AppearanceTheme): void => {
  document.documentElement.setAttribute('data-appearance-theme', theme);
  document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
};

export const initializeAppearanceDocumentTheme = (): AppearanceTheme => {
  const theme = getAppearanceTheme();
  applyAppearanceDocumentTheme(theme);

  window.addEventListener('storage', event => {
    if (event.key === APPEARANCE_THEME_STORAGE_KEY && isAppearanceTheme(event.newValue)) {
      applyAppearanceDocumentTheme(event.newValue);
    }
  });

  return theme;
};
