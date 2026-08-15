import { createSelector } from 'reselect';

import {
  getActiveApplicationId,
} from '../nav/selectors';
import {
  AccountsStep,
  ConfigurationStep,
  UnlockStep,
} from './duck';
import Providers from './providers';
import { StationState } from '../types';

export const getPasswordManagers = (state: StationState) =>
  state.get('passwordManagers');

export const getProvider = createSelector(
  getPasswordManagers,
  passwordManagers => passwordManagers.first()
);

export const getProviderId = () => 'onePassword';

export const getProviderJS = createSelector(
  getProviderId,
  providerId => {
    const { runtime: _runtime, ...provider } = Providers[providerId];
    return provider;
  }
);

export const getPasswordManager = createSelector(
  getProvider,
  getProviderJS,
  (passwordManagers, providerInformations) => {
    if (passwordManagers && passwordManagers.size > 0) {
      const passwordManager = passwordManagers
        .first()
        .toJS();

      return Object.assign({}, passwordManager,
        { providerId: providerInformations.id, providerName: providerInformations.name });
    }
  }
);

export const getPasswordManagerId = createSelector(
  getPasswordManager,
  passwordManager => passwordManager.id
);

export const getConfigurationProcess = (state: StationState) => {
  const configuration = state.getIn(['passwordManagers', 'configuration']);

  if (configuration) {
    return configuration.toJS();
  }
  return { step: ConfigurationStep.NotStarted };
};

export const getAccounts = (state: StationState) => {
  const accounts = state.getIn(['passwordManagers', 'accounts']);

  if (accounts) {
    return accounts.toJS();
  }
  return { step: AccountsStep.NotAsked };
};

export const getUnlockProcess = (state: StationState) => {
  const unlock = state.getIn(['passwordManagers', 'unlock']);

  if (unlock) {
    return unlock.toJS();
  }
  return { step: UnlockStep.NotAsked };
};

export const getLinks = (state: StationState) =>
  state.get('passwordManagerLinks');

export const getLink = createSelector(
  getLinks,
  (_: any, applicationId: string) => applicationId,
  (links, applicationId: string) => links.get(applicationId)
);

export const getLinkForActiveApplication = createSelector(
  getActiveApplicationId,
  getLinks,
  (applicationId, links) => links.get(applicationId)
);

export const getDisplayBanner = (state: StationState) =>
  state.getIn(['passwordManagers', 'displayBanner']) || false;

export const getDisplayRemoveLinkBanner = (state: StationState) =>
  state.getIn(['passwordManagers', 'displayRemoveLinkBanner']) || false;

export const getLoadingCredentials = (state: StationState) =>
  state.getIn(['passwordManagers', 'loadingCredentials']) || false;
