import * as Immutable from 'immutable';
import { NEW_TAB } from '../../../src/urlrouter/constants';
import URLRouter from '../../../src/urlrouter/URLRouter';
import { URLRouterAction } from '../../../src/urlrouter/types';
import { getState } from '../../electron-mocha/urlrouter/data-mock';

describe('URLRouter single-section navigation', () => {
  it('reuses the origin tab when an in-scope link requests a new tab', async () => {
    const manifestProvider = {
      getFirstValue: async () => ({
        manifest: { scope: 'https://app.clickup.com' },
      }),
    } as any;
    const router = new URLRouter(getState, manifestProvider);
    const origin = {
      applicationId: 'clickup-H16C9XsPM',
      tabId: 'clickup-H16C9XsPM/Bke6A5mjvM',
    };

    const [action, destination] = await router.routeURL(
      'https://app.clickup.com/55712/another-view',
      origin,
      { target: NEW_TAB },
    );

    expect(action).toBe(URLRouterAction.NAV_IN_TAB);
    expect(destination).toEqual(origin);
  });

  it('reuses the active section when routing to another installed application', async () => {
    const manifestProvider = {
      getFirstValue: async (manifestURL: string) => ({
        manifest: {
          scope: manifestURL.includes('/39/')
            ? 'https://github.com'
            : 'https://not-a-match.invalid',
        },
      }),
    } as any;
    const router = new URLRouter(getState, manifestProvider);

    const [action, destination] = await router.routeURL(
      'https://github.com/getstation/a-new-destination',
      undefined,
      { target: NEW_TAB },
    );

    expect(action).toBe(URLRouterAction.PUSH_AND_NAV_TO_TAB);
    expect(destination).toEqual({ tabId: 'github-S1PwoQsDG/Bkq6B5OpM' });
  });

  it('does not reactivate a persisted secondary tab that is hidden from the popup', async () => {
    const router = new URLRouter(getState, {} as any);

    const [action, destination] = await router.routeURL(
      'https://github.com/getstation/browserX/pull/430',
    );

    expect(action).toBe(URLRouterAction.PUSH_AND_NAV_TO_TAB);
    expect(destination).toEqual({ tabId: 'github-S1PwoQsDG/Bkq6B5OpM' });
  });

  it('lists matching application instances in dock order', async () => {
    const state = Immutable.fromJS({
      applications: {
        'teams-second': {
          applicationId: 'teams-second',
          manifestURL: 'teams-manifest',
        },
        'teams-first': {
          applicationId: 'teams-first',
          manifestURL: 'teams-manifest',
        },
      },
      dock: ['teams-first', 'teams-second'],
      tabs: {},
    });
    const manifestProvider = {
      getFirstValue: async () => ({
        manifest: {
          name: 'Microsoft Teams',
          scope: 'https://teams.microsoft.com',
        },
      }),
    } as any;
    const router = new URLRouter(() => state as any, manifestProvider);

    const [action, destination] = await router.routeURL(
      'https://teams.microsoft.com/l/meetup-join/example',
    );

    expect(action).toBe(URLRouterAction.CHOOSE_APPLICATION);
    expect((destination as any).applications).toEqual([
      expect.objectContaining({ applicationId: 'teams-first', description: 'Instance 1' }),
      expect.objectContaining({ applicationId: 'teams-second', description: 'Instance 2' }),
    ]);
  });
});
