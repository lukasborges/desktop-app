
exports.default = async function(context) {

  const { appOutDir, targets } = context;

  const isLinux = targets.find(target => target.name === 'appImage');
  if (!isLinux) {
    return;
  }
  
  const fs = require('fs-extra');
  const originalDir = process.cwd();
  
  process.chdir(appOutDir);

  fs.moveSync('platform-desktop-app', 'platform-desktop-app.bin');

  // Since Electron 38 Ozone is the only path and `--ozone-platform` defaults to
  // `auto`, so the `UseOzonePlatform` feature flag is gone. The explicit
  // `--ozone-platform=wayland` is kept as a safety net when WAYLAND_DISPLAY is set
  // but XDG_SESSION_TYPE isn't, which is what auto-detection keys off.
  // @see https://www.electronjs.org/docs/latest/breaking-changes#removed-electron_ozone_platform_hint-environment-variable
  const wrapperScript =
  `#!/bin/sh
if [ -z \${WAYLAND_DISPLAY+x} ]; then
  WAYLAND_PARAMS=""
else
  WAYLAND_PARAMS="--ozone-platform=wayland"
fi
nohup "$(dirname "$(readlink -f "$0")")/platform-desktop-app.bin" \$WAYLAND_PARAMS --no-sandbox "$@" >/dev/null 2>&1 &
      `;
    fs.writeFileSync('platform-desktop-app', wrapperScript);
  fs.chmodSync('platform-desktop-app', '755');

  process.chdir(originalDir);
}
