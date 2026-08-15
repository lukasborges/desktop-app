import { Dispatch } from 'redux';
// @ts-ignore: no declaration file
import { observer } from 'redux-observers';
import { getFocus } from '../app/selectors';
import { getFrontActiveTabId } from '../applications/utils';
import { updateTabId } from './duck';
import { getWindowCurrentTabId, getWindowIsMain } from './get';
import { getWindow } from './selectors';
import { StationState } from '../types';

const observeFrontActiveTab = (observer as any)(
  null,
  (dispatch: Dispatch<any>, state: StationState) => {
    const activeWebviewId = getFocus(state);
    if (!activeWebviewId) return;

    const activeTabId = getFrontActiveTabId(state);
    const webview = getWindow(state, activeWebviewId);

    if (!webview) return;
    const isMain = getWindowIsMain(webview);

    if (!isMain) return;
    const activeTabIdInWebviews = getWindowCurrentTabId(webview);
    if (activeTabId === activeTabIdInWebviews) return;
    dispatch(updateTabId(getFocus(state), activeTabId));
  }
);

export default [
  observeFrontActiveTab,
];
