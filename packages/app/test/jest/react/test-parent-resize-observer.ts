/** @jest-environment jsdom */

import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import ParentResizeObserver from '../../../src/common/components/ParentResizeObserver';

const { act } = React;

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  observe = jest.fn();
  disconnect = jest.fn();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
}

describe('ParentResizeObserver', () => {
  let host: HTMLDivElement;
  let root: Root;
  let observers: ResizeObserverMock[];
  let originalResizeObserver: typeof ResizeObserver;

  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = true;
    originalResizeObserver = (global as any).ResizeObserver;
  });

  beforeEach(() => {
    observers = [];
    (global as any).ResizeObserver = jest.fn((callback: ResizeObserverCallback) => {
      const observer = new ResizeObserverMock(callback);
      observers.push(observer);
      return observer;
    });
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  afterAll(() => {
    (global as any).ResizeObserver = originalResizeObserver;
  });

  test('observes its parent and uses the latest resize callback', () => {
    const firstOnResize = jest.fn();
    const secondOnResize = jest.fn();
    act(() => {
      root.render(React.createElement(
        'div',
        { id: 'observed' },
        React.createElement(ParentResizeObserver, { onResize: firstOnResize })
      ));
    });

    const observer = observers[0];
    expect(observer.observe).toHaveBeenCalledWith(host.querySelector('#observed'));
    observer.callback([], observer as unknown as ResizeObserver);
    expect(firstOnResize).toHaveBeenCalledTimes(1);

    act(() => {
      root.render(React.createElement(
        'div',
        { id: 'observed' },
        React.createElement(ParentResizeObserver, { onResize: secondOnResize })
      ));
    });
    observer.callback([], observer as unknown as ResizeObserver);

    expect(firstOnResize).toHaveBeenCalledTimes(1);
    expect(secondOnResize).toHaveBeenCalledTimes(1);
  });

  test('disconnects the native observer when unmounted', () => {
    act(() => {
      root.render(React.createElement(
        'div',
        null,
        React.createElement(ParentResizeObserver, { onResize: jest.fn() })
      ));
    });
    const observer = observers[0];

    act(() => root.unmount());
    root = createRoot(host);

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
