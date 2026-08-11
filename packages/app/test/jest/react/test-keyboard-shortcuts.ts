/** @jest-environment jsdom */

jest.mock('mousetrap', () => {
  const Mousetrap = function () { } as any;
  Mousetrap.bind = jest.fn();
  Mousetrap.unbind = jest.fn();
  Mousetrap.prototype.handleKey = jest.fn();
  return Mousetrap;
});

import * as Mousetrap from 'mousetrap';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import KeyboardShortcuts from '../../../src/dock/components/KeyboardShortcuts';

const { act } = React;
const originalHandleKey = Mousetrap.prototype.handleKey;

describe('KeyboardShortcuts', () => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    Mousetrap.prototype.handleKey = originalHandleKey;
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
    }
    Mousetrap.prototype.handleKey = originalHandleKey;
    host.remove();
  });

  test('unbinds shortcuts and restores Mousetrap when unmounted', () => {
    act(() => {
      root!.render(React.createElement(KeyboardShortcuts));
    });

    expect(Mousetrap.bind).toHaveBeenCalled();
    expect(Mousetrap.prototype.handleKey).not.toBe(originalHandleKey);

    act(() => root!.unmount());
    root = undefined;

    expect(Mousetrap.unbind).toHaveBeenCalledTimes(8);
    expect(Mousetrap.unbind).toHaveBeenCalledWith('ctrl');
    expect(Mousetrap.unbind).toHaveBeenCalledWith('mod');
    expect(Mousetrap.unbind).toHaveBeenCalledWith('alt');
    expect(Mousetrap.unbind).toHaveBeenCalledWith('ctrl+KeyAboveTab');
    expect(Mousetrap.prototype.handleKey).toBe(originalHandleKey);
  });
});
