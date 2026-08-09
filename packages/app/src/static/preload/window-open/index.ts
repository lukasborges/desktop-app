// See https://github.com/electron/electron/blob/b92163d2260dcee8dfef531a9fb837b6d372e060/lib/renderer/init.ts
import { ipcRendererInternal } from '../../../lib/ipc-renderer-internal';

const { hasSwitch, getSwitchValue } = (process as any)._linkedBinding('electron_common_command_line');

const parseOption = <T>(
  name: string, defaultValue: T, converter?: (value: string) => T
) => {
  return hasSwitch(name)
    ? (
      converter
        ? converter(getSwitchValue(name))
        : getSwitchValue(name)
    )
    : defaultValue;
};

const guestInstanceId = parseOption('guest-instance-id', null, value => parseInt(value, 10));
const openerId = parseOption('opener-id', null, value => parseInt(value, 10));
const isHiddenPage = hasSwitch('hidden-page');
// The `native-window-open` switch has been removed in Electron 22, so `hasSwitch`
// has been returning `false` ever since. Kept as a constant to preserve the exact
// same behavior: `window.open` calls go through the proxy below, and popups are
// handled by `setWindowOpenHandler` in the main process.
const usesNativeWindowOpen = false;

// Any URL that shouldn't be loaded as `nativeWindowOpen` as a popup
// should appear here if parent window uses `nativeWindowOpen`
const overrideNativeWindowOpenList = [
  'app.mixmax.com/_oauth/google',
];

require('./window-setup').default(
  ipcRendererInternal, guestInstanceId, openerId, isHiddenPage, usesNativeWindowOpen, overrideNativeWindowOpenList
);
