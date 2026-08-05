import { app } from 'electron';
import { join } from 'path';
import * as assert from 'assert';
import { runSaga } from 'redux-saga';

import { dispatchUrlSaga } from '../../../src/urlrouter/sagas';
import ManifestProvider from '../../../src/applications/manifest-provider/manifest-provider';
import { BrowserXAppWorker } from '../../../src/app-worker';
import URLRouter from '../../../src/urlrouter/URLRouter';
import { NEW_TAB } from '../../../src/urlrouter/constants';

import { getState } from './data-mock';

const manifestProvider = new ManifestProvider({
//  cachePath: join(app.getPath('userData'), 'ApplicationManifestsCache'),
});

const context = {
  bxApp: {
    router: new URLRouter(getState, manifestProvider),
  },
};

let dispatcher;

describe('URL Router Dispatcher', () => {

  beforeEach(async () => {
    dispatcher = dispatchUrlSaga;
  });

  it('Dispatch linkedin.com should navigate to the corresponding open app tab', async () => {
    const linkToRedirect = 'https://www.linkedin.com/';

    const { url, action, destination } = await runSaga(
      {
        context,
        dispatch: () => {},
        getState,
      },
      dispatcher,
      { url: linkToRedirect }, { }, {})
      .toPromise();

    assert.equal(action, 'NAV_TO_TAB');
    assert.equal(destination.tabId, 'linkedIn-SJYMzYu6M/BJeYzft_6f');
    assert.equal(url, 'https://www.linkedin.com/');
  });

  it('keeps target blank links in the originating application section', async () => {
    const origin = {
      applicationId: 'clickup-H16C9XsPM',
      tabId: 'clickup-H16C9XsPM/Bke6A5mjvM',
    };

    const [action, destination] = await context.bxApp.router.routeURL(
      'https://app.clickup.com/55712/another-view',
      origin,
      { target: NEW_TAB },
    );

    assert.equal(action, 'NAV_IN_TAB');
    assert.deepEqual(destination, origin);
  });
});
