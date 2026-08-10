import { renderRootAndNotify } from '../../../src/common/helpers/renderRoot';

jest.mock('react-dom', () => ({
  flushSync: (render: () => void) => render(),
}));

test('notifies Electron only after the root render commits', () => {
  const events: string[] = [];
  const root = {
    render: () => events.push('committed'),
  };

  renderRootAndNotify(root, null, () => events.push('ready'));

  expect(events).toEqual(['committed', 'ready']);
});
