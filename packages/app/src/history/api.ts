import { history } from '@getstation/sdk';
import { SearchSection } from '../sdk/search/types';
import { Transformer } from '../utils/fp';
import memoizee = require('memoizee');

export const historyItemsAsLastUsedSection: Transformer<history.HistoryEntry[], SearchSection> = memoizee(
  (items: history.HistoryEntry[]) => ({ sectionName: 'Last Used', results: items })
);
