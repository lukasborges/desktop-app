import { fromJS } from 'immutable';

import { getNotificationBadgeCount } from '../../../src/notification-center/selectors';

describe('notification center badge count', () => {
  it('counts only notifications present in the notification center', () => {
    const state = fromJS({
      notificationCenter: {
        notifications: ['notification-1', 'notification-2'],
      },
    });

    expect(getNotificationBadgeCount(state as any)).toBe(2);
  });

  it('hides the badge while notifications are snoozed', () => {
    const state = fromJS({
      notificationCenter: {
        notifications: ['notification-1'],
        snoozeDuration: '1hour',
      },
    });

    expect(getNotificationBadgeCount(state as any)).toBe(0);
  });
});
