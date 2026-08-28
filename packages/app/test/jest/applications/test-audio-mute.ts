import { shouldMuteApplication } from '../../../src/applications/selectors';

describe('application audio mute', () => {
  it('mutes audio when notifications are disabled for the application', () => {
    expect(shouldMuteApplication(false, false)).toBe(true);
  });

  it('mutes audio while notifications are globally snoozed', () => {
    expect(shouldMuteApplication(true, true)).toBe(true);
  });

  it('keeps audio enabled when notifications are enabled or unset', () => {
    expect(shouldMuteApplication(false, true)).toBe(false);
    expect(shouldMuteApplication(false, undefined)).toBe(false);
  });
});
