import { ipcMain, ipcRenderer, webContents } from 'electron';

/** renderer -> main: forward a message to another webContents */
const RELAY = 'bx.relay-to-webcontents';
/** renderer -> main: same, but the target also gets the sender webContents id */
const RELAY_WITH_SENDER = 'bx.relay-to-webcontents-with-sender';

/**
 * Renderer to renderer messaging.
 *
 * `ipcRenderer.sendTo` and `IpcRendererEvent.senderId` have been removed in Electron 28,
 * so the main process now relays those messages.
 * @see https://www.electronjs.org/docs/latest/breaking-changes#removed-ipcrenderersendto
 */

/**
 * Starts the relay. Must be called once from the main process, before any renderer
 * uses `sendToWebContents` / `sendToWebContentsWithSender`.
 */
export const startIpcSendToRelay = () => {
  const forward = (targetWebContentsId: number, channel: string, args: any[]) => {
    const target = webContents.fromId(targetWebContentsId);
    if (!target || target.isDestroyed() || target.isCrashed()) return;
    target.send(channel, ...args);
  };

  ipcMain.on(RELAY, (_event: Electron.IpcMainEvent, targetWebContentsId: number, channel: string, args: any[]) => {
    forward(targetWebContentsId, channel, args);
  });

  ipcMain.on(
    RELAY_WITH_SENDER,
    (event: Electron.IpcMainEvent, targetWebContentsId: number, channel: string, args: any[]) => {
      forward(targetWebContentsId, channel, [event.sender.id, ...args]);
    }
  );
};

/**
 * From a renderer process, send a message to another webContents.
 * Drop-in replacement for `ipcRenderer.sendTo`: the receiver signature is unchanged.
 */
export const sendToWebContents = (targetWebContentsId: number, channel: string, ...args: any[]) => {
  ipcRenderer.send(RELAY, targetWebContentsId, channel, args);
};

/**
 * Same as {@link sendToWebContents}, but the receiver also gets the sender webContents id
 * as first argument, which used to be read from `event.senderId`.
 * The receiver must use {@link onFromWebContents}.
 */
export const sendToWebContentsWithSender = (targetWebContentsId: number, channel: string, ...args: any[]) => {
  ipcRenderer.send(RELAY_WITH_SENDER, targetWebContentsId, channel, args);
};

/**
 * Receiving counterpart of {@link sendToWebContentsWithSender}.
 * Returns a function removing the listener.
 */
export const onFromWebContents = (
  channel: string,
  listener: (senderWebContentsId: number, ...args: any[]) => void
) => {
  const handler = (_event: Electron.IpcRendererEvent, senderWebContentsId: number, ...args: any[]) => {
    listener(senderWebContentsId, ...args);
  };
  ipcRenderer.on(channel, handler);
  return () => {
    ipcRenderer.removeListener(channel, handler);
  };
};
