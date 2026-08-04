import { nativeTheme } from '@electron/remote';
import {
  APPEARANCE_THEME_STORAGE_KEY,
  AppearanceTheme,
  applyAppearanceDocumentTheme,
  getAppearanceTheme,
  isAppearanceTheme,
  persistAppearanceTheme,
} from './appearanceDocument';

export {
  APPEARANCE_THEME_STORAGE_KEY,
  AppearanceTheme,
  DEFAULT_APPEARANCE_THEME,
  getAppearanceTheme,
} from './appearanceDocument';

export const applyAppearanceTheme = (theme: AppearanceTheme): void => {
  applyAppearanceDocumentTheme(theme);
  nativeTheme.themeSource = theme;
};

export const setAppearanceTheme = (theme: AppearanceTheme): void => {
  persistAppearanceTheme(theme);
  applyAppearanceTheme(theme);
};

export const initializeAppearanceTheme = (): AppearanceTheme => {
  const theme = getAppearanceTheme();
  applyAppearanceTheme(theme);

  window.addEventListener('storage', event => {
    if (event.key === APPEARANCE_THEME_STORAGE_KEY && isAppearanceTheme(event.newValue)) {
      applyAppearanceTheme(event.newValue);
    }
  });

  return theme;
};
