import { SagaIterator } from 'redux-saga';
import { call, getContext, put, select } from 'redux-saga/effects';
import type { BrowserXAppWorker } from '../../app-worker';
import { navigateTabToURL } from '../../tab-webcontents/duck';
import { getTabId } from '../../tabs/get';
import { getManifestOrTimeout } from '../api';
import { navigateToApplicationTab, SetHomeTabAsActiveAction } from '../duck';
import { getApplicationActiveTab, getApplicationManifestURL } from '../get';
import type { BxAppManifest } from '../manifest-provider/bxAppManifest';
import { getApplicationById, getApplicationFullConfigData, getHomeTab } from '../selectors';
import { getStartURL } from './helpers';

export function* setHomeTabAsActiveForApplication({ applicationId }: SetHomeTabAsActiveAction): SagaIterator {
  const application = yield select(getApplicationById, applicationId);
  if (!application) return;

  const homeTab = yield select(getHomeTab, applicationId);
  if (!homeTab) throw new Error(`No home tab for app ${applicationId}`);

  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const manifestURL = getApplicationManifestURL(application);
  const manifest: BxAppManifest = yield call(getManifestOrTimeout, bxApp, manifestURL);
  const configData = yield select(getApplicationFullConfigData, application);
  const startURL = yield call(getStartURL, manifest, manifestURL, applicationId, configData);

  const currentTabId = getApplicationActiveTab(application);
  const homeTabId = getTabId(homeTab);

  // The home tab can navigate like any other tab, so selecting it alone may
  // leave the user on the last visited page (or even a blank one).
  yield put(navigateTabToURL(homeTabId, startURL));

  if (currentTabId !== homeTabId) {
    // @ts-ignore:thunk
    yield put(navigateToApplicationTab(applicationId, homeTabId));
  }
}
