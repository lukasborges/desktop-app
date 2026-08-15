import { StationState } from '../types';

export const getUserActivities = (state: StationState) =>
  state.get('userActivities');

export const isUserSAU = (state: StationState): boolean => {
  return state.get('userActivities').size >= 3;
};
