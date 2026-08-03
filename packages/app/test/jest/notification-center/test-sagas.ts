import notificationCenterSaga from '../../../src/notification-center/sagas';
import {
  ATTACH_WEBCONTENTS_TO_TAB,
  NEW_WEBCONTENTS_ATTACHED_TO_TAB,
} from '../../../src/tab-webcontents/duck';

describe('notification center sagas', () => {
  it('registers notification observers only for new web contents', () => {
    const rootEffect: any = notificationCenterSaga().next().value;
    const watchedPatterns = rootEffect.payload.map((effect: any) => effect.payload.args[0]);

    expect(watchedPatterns).toContain(NEW_WEBCONTENTS_ATTACHED_TO_TAB);
    expect(watchedPatterns).not.toContain(ATTACH_WEBCONTENTS_TO_TAB);
  });
});
