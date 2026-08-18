import { autoUpdater as autoUpdaterProd } from 'electron-updater';

import { isPackaged } from '../../../utils/env';

import AutoUpdaterMock from './AutoUpdaterMock';

if (isPackaged) {
  // Platform beta releases are tagged as prerelease (v3.3.0-beta.N), so the GitHub
  // /releases/latest endpoint returns 406. Opt in to prereleases.
  autoUpdaterProd.allowPrerelease = true;
  // Package installation differs by operating system and Linux package
  // format. Only detect updates; let the user choose the appropriate asset
  // from the GitHub release page.
  autoUpdaterProd.autoDownload = false;
  autoUpdaterProd.autoInstallOnAppQuit = false;
}

export const autoUpdater = isPackaged ? autoUpdaterProd : new AutoUpdaterMock();
