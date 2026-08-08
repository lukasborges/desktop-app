if (!process.env.STATION_DISABLE_ECX) {
  try {
    require('electron-chrome-extension/preload');
  } catch (e) {
    // Sandboxed renderers (default since Electron 20) only expose a limited
    // `require`, which cannot load modules from node_modules. Those contexts get
    // no chrome extension API, as in production where session preloads are not used.
  }
}
