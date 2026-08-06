import {
  getCollapsedSectionsForItems,
  getSnoozeDurationContent,
  shouldReloadAfterConnectionLoss,
} from '../../../src/common/helpers/lifecycleTransitions';

describe('legacy lifecycle replacements', () => {
  describe('connection recovery', () => {
    test('reloads only after an offline-to-online transition with a recoverable error', () => {
      expect(shouldReloadAfterConnectionLoss(false, true, -105)).toBe(true);
      expect(shouldReloadAfterConnectionLoss(true, true, -105)).toBe(false);
      expect(shouldReloadAfterConnectionLoss(false, true, -3)).toBe(false);
      expect(shouldReloadAfterConnectionLoss(false, false, -105)).toBe(false);
    });
  });

  describe('Bang collapsed sections', () => {
    test('collapses new sections while preserving explicitly expanded sections', () => {
      const items = [
        { sectionName: 'Top hits' },
        { sectionName: 'Applications' },
      ] as any;
      const current = {
        'Top hits': { collapsed: false },
      };

      expect(getCollapsedSectionsForItems(items, current)).toEqual({
        Applications: { collapsed: true },
      });
    });
  });

  describe('snooze duration', () => {
    test('computes content directly from current props and time', () => {
      const now = Date.now();
      expect(getSnoozeDurationContent(new Date(now + (2.5 * 60 * 60 * 1000) + 30000))).toBe('for 2h30min');
      expect(getSnoozeDurationContent(new Date(now + 30000))).toBe('for <1min');
      expect(getSnoozeDurationContent(null as any)).toBe('');
    });
  });
});
