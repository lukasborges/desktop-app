import * as moment from 'moment';
// @ts-ignore no declaration file
import * as millisec from 'millisec';
import ms = require('ms');

interface SectionWithName {
  sectionName: string;
}

export interface CollapseSections {
  [sectionName: string]: { collapsed: boolean };
}

const sameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const getSnoozeDurationContent = (snoozeEndDate: object) => {
  if (!snoozeEndDate) return '';

  const diff = moment(snoozeEndDate).diff(new Date());
  const msDiff = millisec(diff);
  const h = Math.floor(diff / ms('1hour'));
  const m = msDiff.getMinutes();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const untilTomorrow = diff > ms('4h') && sameDay(moment(snoozeEndDate).toDate(), tomorrow);

  if (untilTomorrow) return 'until tomorrow';
  if (diff > ms('1h')) return m !== 0 ? `for ${h}h${m}min` : `for ${h}h`;
  if (diff > ms('1min')) return `for ${m}min`;
  return 'for <1min';
};

export const getCollapsedSectionsForItems = (
  items: SectionWithName[],
  collapseSections: CollapseSections = {},
) => items.reduce(
  (nextCollapseSections, item) => {
    if (
      collapseSections[item.sectionName] &&
      !collapseSections[item.sectionName].collapsed
    ) {
      return nextCollapseSections;
    }
    nextCollapseSections[item.sectionName] = { collapsed: true };
    return nextCollapseSections;
  },
  {} as CollapseSections,
);

export const shouldReloadAfterConnectionLoss = (
  wasOnline: boolean | null | undefined,
  isOnline: boolean | null | undefined,
  errorCode?: number,
) => Boolean(isOnline && !wasOnline && errorCode && [-105, -106, -109, -130].includes(errorCode));
