export const initializeAppearance = () => {
  // The App Store runs under its own platform:// origin, so it cannot read the
  // shell's localStorage preference. Electron exposes nativeTheme.themeSource
  // through prefers-color-scheme, including explicit light/dark selections.
  document.documentElement.dataset.appearanceTheme = 'system';
};
