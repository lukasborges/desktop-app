import * as remote from '@electron/remote';
import log from 'electron-log';
import * as shortid from 'shortid';
import { SagaIterator } from 'redux-saga';
import { all, call, delay, fork, getContext, put, race, select, take } from 'redux-saga/effects';
import { listAllApplications, manifestToApplicationItem } from '../../manifests';
import { logger } from '../api/logger';
import { BrowserXAppWorker } from '../app-worker';
import {
  createNewTab,
  DISPATCH_URL,
  DispatchURLAction,
  installApplication,
  navigateToApplicationTabAutomatically,
} from '../applications/duck';
import { REHYDRATION_COMPLETE } from '../store/duck';
import { navigateTabToURL, changeHashAndNavigateToTab } from '../tab-webcontents/duck';
import {
  RESOLVE_APPLICATION_ROUTING_CHOOSER,
  ResolveApplicationRoutingChooser,
  setCursorIcon,
  showApplicationRoutingChooser,
} from '../ui/duck';
import { getCursorIcon } from '../ui/selectors';
import { callService, takeEveryWitness, tryCatch } from '../utils/sagas';
import { ApplicationItem, URLRouterAction, URLRouterActionAndDestination } from './types';
import services from '../services/servicesManager';
import { unwrapGoogleRedirectUrl } from '../utils/applicationLinks';

export type DispatchUrlOptions = {
  afterFollowingRedirects?: boolean,
  originalUrl?: string,
};

const queue = new Set();
const followRedirectsTimeout = 3000;
const errorMessageTooManyRedirects = 'too much redirecting';

function* urlFromRedirections(dispatch: DispatchURLAction): SagaIterator {
  const { url } = dispatch;

  yield put(setCursorIcon('wait'));

  try {
    yield race({
      task: callService('urlRouterHelper', 'resolveRedirects', { url }),
      timeout: delay(followRedirectsTimeout),
    });
  } catch (e) {
    if (e !== errorMessageTooManyRedirects) logger.notify(e);
  } finally {
    if ((yield select(getCursorIcon)) === 'wait') {
      yield put(setCursorIcon('auto'));
    }
  }

  return url;
}

export function* dispatchUrlSaga(
  dispatch: DispatchURLAction,
  dispatchUrlOptions: DispatchUrlOptions = {},
): SagaIterator {
  const bxApp: BrowserXAppWorker = yield getContext('bxApp');
  const { router } = bxApp;
  const normalizedUrl = unwrapGoogleRedirectUrl(dispatch.url);
  const routingDispatch = normalizedUrl === dispatch.url
    ? dispatch
    : { ...dispatch, url: normalizedUrl };
  const { url, origin, options } = routingDispatch;
  const { afterFollowingRedirects, originalUrl } = dispatchUrlOptions;

  if (queue.has(url)) return;

  queue.add(url);

  const [action, destination]: URLRouterActionAndDestination = yield call([router, router.routeURL], url, origin!, options!);

  if (process.env.NODE_ENV !== 'test') {
    log.debug('[dispatch url]', url, 'origin:', origin, 'options:', options, 'action: ', action, 'destination:', destination);
  }

  if (action === URLRouterAction.DEFAULT_BROWSER && !afterFollowingRedirects) {
    const urlFromRedirects = yield call(urlFromRedirections, routingDispatch);

    queue.delete(url);

    return yield call(
      dispatchUrlSaga,
      { ...routingDispatch, url: urlFromRedirects },
      { originalUrl: url, afterFollowingRedirects: true },
    );
  }

  queue.delete(url);

  const finalDispatch = action === URLRouterAction.DEFAULT_BROWSER
    ? { ...routingDispatch, url: originalUrl }
    : routingDispatch;
  yield (call as any)(triggerCorrespondingAction, action, destination, finalDispatch);

  return { url: finalDispatch.url, origin, options, action, destination };
}

function* triggerCorrespondingAction(
  action: URLRouterAction,
  destination: any,
  { url, origin, options }: DispatchURLAction
): SagaIterator {
  if (process.env.NODE_ENV === 'test') return;

  switch (action) {
    case URLRouterAction.RELOAD:
      // dispatch(executeWebviewMethod(destination, 'reload'));
      break;
    case URLRouterAction.DEFAULT_BROWSER:
      if (!options || !options.loadInBackground) {
        remote.shell.openExternal(url)
      }
      else {
        services.browserWindow.getFocusedWindow()
          .then(lastFocusedWindow => {
            if (lastFocusedWindow) {
              lastFocusedWindow.setAlwaysOnTop(true)
                .then(() => remote.shell.openExternal(url)
                  .then(() => setTimeout(() => {
                      lastFocusedWindow.show();
                      lastFocusedWindow.setAlwaysOnTop(false);
                    }, 
                    100) //vk: I can't explain why, but without this timeout, open in background doesn't work
                  )
                );
            }
            else {
              log.info('Focused window is empty');
              remote.shell.openExternal(url);
            }
          });
      }
      break;
    case URLRouterAction.NAV_TO_TAB:
      yield put(navigateToApplicationTabAutomatically(destination.tabId));
      break;
    case URLRouterAction.NAV_IN_TAB:
      yield put(navigateTabToURL(destination.tabId, url));
      break;
    case URLRouterAction.PUSH_AND_NAV_TO_TAB:
      yield put(changeHashAndNavigateToTab(destination.tabId, url));
      break;
    case URLRouterAction.NEW_TAB:
      yield put(createNewTab(destination.applicationId, url, { navigateToApplication: true }));
      break;
    case URLRouterAction.NEW_WINDOW:
      yield put(createNewTab(destination.applicationId, url, { detach: true, navigateToApplication: true }));
      break;
    case URLRouterAction.CHOOSE_APPLICATION: {
      const requestId = shortid.generate();
      yield put(showApplicationRoutingChooser(requestId, url, destination.applications));
      const resolution: ResolveApplicationRoutingChooser = yield take(
        (candidate: ResolveApplicationRoutingChooser) =>
          candidate.type === RESOLVE_APPLICATION_ROUTING_CHOOSER
          && candidate.requestId === requestId
      );

      if (resolution.applicationId) {
        yield put(createNewTab(resolution.applicationId, url, { navigateToApplication: true }));
      }
      break;
    }
    case URLRouterAction.INSTALL_AND_OPEN: {
      yield put(installApplication(destination.manifestURL, {
        optOutFlow: true,
        installContext: { url, origin, options } as any,
        navigate: true,
        andCreateTabWithURL: url,
      }));
      break;
    }
    default:
      break;
  }
}

export function* manifestsScopesClock(bxApp: BrowserXAppWorker): SagaIterator {
  yield take(REHYDRATION_COMPLETE);

  // When app is ready, update the tree source once
  const { router } = bxApp;

  const allScopes: ApplicationItem[] = listAllApplications().map(manifestToApplicationItem);

  yield call([router.dataRouter, router.dataRouter.next], allScopes);
}

export default function* main(bxApp: BrowserXAppWorker): SagaIterator {
  yield all([
    takeEveryWitness(DISPATCH_URL, dispatchUrlSaga),
    fork(tryCatch(manifestsScopesClock), bxApp),
  ]);
}
