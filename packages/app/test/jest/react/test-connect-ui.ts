/** @jest-environment jsdom */

import * as Immutable from 'immutable';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reduxUI from 'redux-ui/transpiled/action-reducer';
import { createRoot, Root } from 'react-dom/client';

import connectUI from '../../../src/ui/connectUI';

const { act } = React;

describe('connectUI', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  test('uses the React Redux 9 Provider for UI state', () => {
    const reducer = (state = Immutable.Map({ ui: reduxUI(undefined, { type: '@@init' }) }), action: any) =>
      state.set('ui', reduxUI(state.get('ui'), action));
    const store = createStore(reducer);
    const View = ({ ui, updateUI }: any) => React.createElement(
      'button',
      { onClick: () => updateUI({ visible: true }) },
      String(ui.visible),
    );
    const ConnectedView = connectUI({
      key: 'smokeTest',
      state: { visible: false },
      persist: true,
    })(View);

    act(() => {
      root.render(React.createElement(
        Provider,
        { store: store as any },
        React.createElement(ConnectedView),
      ));
    });
    expect(host.textContent).toBe('false');

    act(() => {
      host.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(host.textContent).toBe('true');
  });
});
