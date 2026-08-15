// Selectors in this file must prevent circular dependencies
import { createSelector } from 'reselect';
import { StationState } from '../types';
import { getApplicationIdentityId } from './get';

/**
 * @deprecated
 */
export const getApplicationsWithUserIdentity = createSelector(
  (state: StationState) => state.get('applications'),
  (state: StationState) => state.get('userIdentities'),
  (applicatons, identities) =>
    applicatons.map(app => (app as any).set('userIdentity', identities.get(getApplicationIdentityId(app))))
);
