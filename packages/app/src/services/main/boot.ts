/* tslint:disable:no-import-side-effect */

/*
** This file purpose is to handle startup side effects in main process
*/
import { app, ipcMain } from 'electron';

import { startSessionsListening } from '../api/sessions';
import { startIpcSendToRelay } from '../../lib/ipc-send-to';

export default () => {

  // make sure that `stream-electron-ipc` side-effect is called early
  require('../../utils/stream-ipc-proxy');

  // relays renderer to renderer messages, `ipcRenderer.sendTo` is gone since Electron 28
  startIpcSendToRelay();

  startSessionsListening();

  ipcMain.on('get-is-packaged', (event) => {
    event.returnValue = app.isPackaged;
  });

};
