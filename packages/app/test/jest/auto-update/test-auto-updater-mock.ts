jest.mock('bluebird', () => ({
  delay: () => Promise.resolve(),
}));

import AutoUpdaterMock from '../../../src/services/services/auto-updater/AutoUpdaterMock';

describe('AutoUpdaterMock', () => {
  const previousScenario = process.env.STATION_AUTOUPDATER_MOCK_SCENARIO;

  afterEach(() => {
    if (previousScenario === undefined) {
      delete process.env.STATION_AUTOUPDATER_MOCK_SCENARIO;
    } else {
      process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = previousScenario;
    }
  });

  test('emits the available update sequence', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'available';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    const updateAvailable = new Promise(resolve => {
      updater.once('update-available', info => {
        events.push(`available:${info.version}`);
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateAvailable;

    expect(events).toEqual([
      'checking',
      'available:3.3.0-fork.999',
    ]);
  });

  test('emits the not-available update sequence', async () => {
    process.env.STATION_AUTOUPDATER_MOCK_SCENARIO = 'not-available';
    const updater = new AutoUpdaterMock();
    const events: string[] = [];

    updater.setFeedURL('https://example.test/latest.yml');
    updater.on('checking-for-update', () => events.push('checking'));
    const updateNotAvailable = new Promise(resolve => {
      updater.once('update-not-available', () => {
        events.push('not-available');
        resolve();
      });
    });

    updater.checkForUpdates();
    await updateNotAvailable;

    expect(events).toEqual([
      'checking',
      'not-available',
    ]);
  });
});
