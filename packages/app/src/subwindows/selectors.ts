import { StationState } from '../types';
import { StationSubWindowsImmutable } from './types';

export const getSubwindows = (state: StationState): StationSubWindowsImmutable =>
  state.get('subwindows') as unknown as StationSubWindowsImmutable;

export const hasSubwindow = (state: StationState, tabId: string) => getSubwindows(state).has(tabId);
