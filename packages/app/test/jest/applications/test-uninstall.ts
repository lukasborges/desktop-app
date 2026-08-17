import * as Immutable from 'immutable';
import { getApplicationToSelectAfterUninstall } from '../../../src/applications/selectors';

const state = (activeApplicationId: string, previousApplicationId?: string) => Immutable.fromJS({
  applications: {
    meet: { applicationId: 'meet' },
    miro: { applicationId: 'miro' },
  },
  dock: ['meet', 'miro'],
  nav: {
    tabApplicationId: activeApplicationId,
    previousTabApplicationId: previousApplicationId,
  },
}) as any;

describe('application uninstall navigation', () => {
  it('returns to the previously active application', () => {
    expect(getApplicationToSelectAfterUninstall(state('miro', 'meet'), 'miro')).toBe('meet');
  });

  it('falls back to another installed dock application', () => {
    expect(getApplicationToSelectAfterUninstall(state('miro'), 'miro')).toBe('meet');
  });

  it('does not change selection when uninstalling a background application', () => {
    expect(getApplicationToSelectAfterUninstall(state('meet'), 'miro')).toBeUndefined();
  });

  it('clears selection when uninstalling the last application', () => {
    const lastApplicationState = Immutable.fromJS({
      applications: { miro: { applicationId: 'miro' } },
      dock: ['miro'],
      nav: { tabApplicationId: 'miro' },
    }) as any;

    expect(getApplicationToSelectAfterUninstall(lastApplicationState, 'miro')).toBeUndefined();
  });
});
