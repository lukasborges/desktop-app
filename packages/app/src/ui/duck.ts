import * as Immutable from 'immutable';
import { ApplicationRoutingChoice } from '../urlrouter/types';

// Constants

export type SET_CURSOR_ICON = 'browserX/ui/SET_CURSOR_ICON';
export const SET_CURSOR_ICON = 'browserX/ui/SET_CURSOR_ICON';
export type TOGGLE_VISIBILITY = 'browserX/ui/TOGGLE_VISIBILITY';
export const TOGGLE_VISIBILITY = 'browserX/ui/TOGGLE_VISIBILITY';
export type SHOW_APPLICATION_ROUTING_CHOOSER = 'browserX/ui/SHOW_APPLICATION_ROUTING_CHOOSER';
export const SHOW_APPLICATION_ROUTING_CHOOSER = 'browserX/ui/SHOW_APPLICATION_ROUTING_CHOOSER';
export type RESOLVE_APPLICATION_ROUTING_CHOOSER = 'browserX/ui/RESOLVE_APPLICATION_ROUTING_CHOOSER';
export const RESOLVE_APPLICATION_ROUTING_CHOOSER = 'browserX/ui/RESOLVE_APPLICATION_ROUTING_CHOOSER';

// Action Types

export type SetCursorIcon = { type: SET_CURSOR_ICON, cursor: string };

export type ToggleVisibility = { type: TOGGLE_VISIBILITY, key: string[] };
export type ShowApplicationRoutingChooser = {
  type: SHOW_APPLICATION_ROUTING_CHOOSER,
  requestId: string,
  url: string,
  applications: ApplicationRoutingChoice[],
};
export type ResolveApplicationRoutingChooser = {
  type: RESOLVE_APPLICATION_ROUTING_CHOOSER,
  requestId: string,
  applicationId?: string,
};
export type UiActions = SetCursorIcon
  | ToggleVisibility
  | ShowApplicationRoutingChooser
  | ResolveApplicationRoutingChooser;

// Action creators

export const setCursorIcon = (cursor: 'auto' | 'wait'): SetCursorIcon => ({
  type: SET_CURSOR_ICON, cursor,
});

export const toggleVisibility = (key: string[]): ToggleVisibility => ({
  type: TOGGLE_VISIBILITY, key,
});

export const showApplicationRoutingChooser = (
  requestId: string,
  url: string,
  applications: ApplicationRoutingChoice[],
): ShowApplicationRoutingChooser => ({
  type: SHOW_APPLICATION_ROUTING_CHOOSER,
  requestId,
  url,
  applications,
});

export const resolveApplicationRoutingChooser = (
  requestId: string,
  applicationId?: string,
): ResolveApplicationRoutingChooser => ({
  type: RESOLVE_APPLICATION_ROUTING_CHOOSER,
  requestId,
  applicationId,
});

// Reducer
const DEFAULT_MAP = Immutable.Map({
  cursorIcon: Immutable.Map({
    cursor: 'auto',
  }),
});
export default function notificationCenter(state: Immutable.Map<string, any> = DEFAULT_MAP, action: UiActions) {
  switch (action.type) {

    case SET_CURSOR_ICON: {
      return state.set('cursorIcon', action.cursor);
    }

    case SHOW_APPLICATION_ROUTING_CHOOSER: {
      return state.set('applicationRoutingChooser', Immutable.fromJS({
        requestId: action.requestId,
        url: action.url,
        applications: action.applications,
      }));
    }

    case RESOLVE_APPLICATION_ROUTING_CHOOSER: {
      if (state.getIn(['applicationRoutingChooser', 'requestId']) !== action.requestId) {
        return state;
      }
      return state.delete('applicationRoutingChooser');
    }

    default:
      return state;

  }
}
