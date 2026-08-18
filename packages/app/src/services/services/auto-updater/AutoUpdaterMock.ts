import { EventEmitter } from 'events';
import ms = require('ms');
import log from 'electron-log';
import { delay } from 'bluebird';

export default class AutoUpdaterMock extends EventEmitter {

  url: string;

  setFeedURL(url: string) {
    log.debug('autoUpdater.mock: setFeedURL', url);
    this.url = url;
  }

  getFeedURL() {
    return this.url;
  }

  checkForUpdates() {
    if (!this.url) {
      log.warn('No feed URL was provided.');
      return;
    }

    const scenario = process.env.STATION_AUTOUPDATER_MOCK_SCENARIO || 'available';
    log.debug(`autoUpdater.mock: checkForUpdates with scenario ${scenario} and url ${this.url}`);

    switch (scenario) {
      case 'not-available':
        this.checkForUpdatesWithNotAvailableScenario();
        break;
      case 'available':
        this.checkForUpdatesWithAvailableScenario();
        break;
      default:
        log.error('autoUpdater.mock: checkForUpdates not a valid scenario', scenario);
    }
  }

  quitAndInstall() {
    log.debug('autoUpdater.mock: quitAndInstall');
  }

  protected async checkForUpdatesWithAvailableScenario() {

    log.debug('autoUpdater.mock: emit checking-for-update');
    this.emit('checking-for-update');

    await delay(ms('3sec'));

    log.debug('autoUpdater.mock: emit update-available');
    this.emit('update-available', { version: '3.3.0-beta.999' });
  }

  protected async checkForUpdatesWithNotAvailableScenario() {
    log.debug('autoUpdater.mock: checkForUpdates');
    this.emit('checking-for-update');

    await delay(ms('3sec'));

    log.debug('autoUpdater.mock: emit update-not-available');
    this.emit('update-not-available');
  }
}
