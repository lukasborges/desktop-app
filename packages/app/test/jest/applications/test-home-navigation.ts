import * as Immutable from 'immutable';
import { call, getContext, put, select } from 'redux-saga/effects';

jest.mock('../../../src/applications/api', () => ({
  getManifestOrTimeout: jest.fn(),
}));

import { setHomeTabAsActive, navigateToApplicationTab } from '../../../src/applications/duck';
import { getApplicationFullConfigData, getApplicationById, getHomeTab } from '../../../src/applications/selectors';
import { getManifestOrTimeout } from '../../../src/applications/api';
import { getStartURL } from '../../../src/applications/sagas/helpers';
import { setHomeTabAsActiveForApplication } from '../../../src/applications/sagas/home';
import { navigateTabToURL } from '../../../src/tab-webcontents/duck';

describe('application home navigation', () => {
  const applicationId = 'app-id';
  const manifestURL = 'station-manifest://app';
  const homeTabId = 'app-id/home';
  const application = Immutable.fromJS({ applicationId, manifestURL, activeTab: 'app-id/other' });
  const homeTab = Immutable.fromJS({ applicationId, tabId: homeTabId, isApplicationHome: true });
  const manifest = { start_url: 'https://example.com/default' };
  const configData = { customURL: 'https://example.com/configured' };
  const bxApp = {};

  it('reloads the configured start URL before selecting the home tab', () => {
    const saga = setHomeTabAsActiveForApplication(setHomeTabAsActive(applicationId));

    expect(saga.next().value).toEqual(select(getApplicationById, applicationId));
    expect(saga.next(application).value).toEqual(select(getHomeTab, applicationId));
    expect(saga.next(homeTab).value).toEqual(getContext('bxApp'));
    expect(saga.next(bxApp).value).toEqual(call(getManifestOrTimeout, bxApp, manifestURL));
    expect(saga.next(manifest).value).toEqual(select(getApplicationFullConfigData, application));
    expect(saga.next(configData).value).toEqual(
      call(getStartURL, manifest, manifestURL, applicationId, configData)
    );
    expect(saga.next(configData.customURL).value).toEqual(
      put(navigateTabToURL(homeTabId, configData.customURL))
    );
    expect(saga.next().value).toEqual(put(navigateToApplicationTab(applicationId, homeTabId)));
    expect(saga.next().done).toBe(true);
  });

  it('reloads home even when the home tab is already active', () => {
    const activeApplication = application.set('activeTab', homeTabId);
    const saga = setHomeTabAsActiveForApplication(setHomeTabAsActive(applicationId));

    saga.next();
    saga.next(activeApplication);
    saga.next(homeTab);
    saga.next(bxApp);
    saga.next(manifest);
    saga.next(configData);

    expect(saga.next(configData.customURL).value).toEqual(
      put(navigateTabToURL(homeTabId, configData.customURL))
    );
    expect(saga.next().done).toBe(true);
  });
});
