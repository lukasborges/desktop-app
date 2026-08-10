/** @jest-environment jsdom */

import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import ClickOutside from '../../../src/common/components/ClickOutside';

const { act } = React;

describe('ClickOutside', () => {
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

  test('calls the handler only for clicks outside its wrapper', () => {
    const onClickOutside = jest.fn();
    act(() => {
      root.render(React.createElement(
        ClickOutside,
        { className: 'wrapper', onClickOutside },
        React.createElement('button', { id: 'inside' })
      ));
    });

    const inside = host.querySelector('#inside')!;
    act(() => inside.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onClickOutside).not.toHaveBeenCalled();
    expect(host.querySelector('.wrapper')).not.toBeNull();

    const outside = document.createElement('button');
    outside.addEventListener('click', event => event.stopPropagation());
    document.body.appendChild(outside);
    act(() => outside.dispatchEvent(new MouseEvent('click', { bubbles: true })));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
    outside.remove();
  });

  test('ignores the synthetic click after a touch and handles later clicks', () => {
    const onClickOutside = jest.fn();
    act(() => {
      root.render(React.createElement(ClickOutside, { onClickOutside }));
    });

    act(() => document.body.dispatchEvent(new Event('touchend', { bubbles: true })));
    act(() => document.body.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onClickOutside).toHaveBeenCalledTimes(1);

    act(() => document.body.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onClickOutside).toHaveBeenCalledTimes(2);
  });

  test('removes document listeners when unmounted', () => {
    const onClickOutside = jest.fn();
    act(() => {
      root.render(React.createElement(ClickOutside, { onClickOutside }));
    });
    act(() => root.unmount());
    root = createRoot(host);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
