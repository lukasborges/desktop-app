/** @jest-environment jsdom */

import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';

import KeyHandler, { KEYDOWN, KEYUP } from '../../../src/common/components/KeyHandler';

const { act } = React;

describe('KeyHandler', () => {
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

  test('handles only the configured key and event type', () => {
    const onKeyHandle = jest.fn();
    act(() => {
      root.render(React.createElement(KeyHandler, {
        keyEventName: KEYDOWN,
        keyValue: 'Escape',
        onKeyHandle,
      }));
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
    expect(onKeyHandle).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Esc', bubbles: true }));
    expect(onKeyHandle).toHaveBeenCalledTimes(1);
  });

  test('ignores keyboard events from editable controls', () => {
    const onKeyHandle = jest.fn();
    act(() => {
      root.render(React.createElement(KeyHandler, {
        keyEventName: KEYDOWN,
        keyValue: 'Escape',
        onKeyHandle,
      }));
    });

    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const editable = document.createElement('div');
    const editableChild = document.createElement('span');
    editable.setAttribute('contenteditable', 'true');
    editable.appendChild(editableChild);
    document.body.append(input, textarea, editable);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    editableChild.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(onKeyHandle).not.toHaveBeenCalled();
    input.remove();
    textarea.remove();
    editable.remove();
  });

  test('updates its document listener when props change', () => {
    const onKeyHandle = jest.fn();
    act(() => {
      root.render(React.createElement(KeyHandler, {
        keyEventName: KEYDOWN,
        keyValue: 'Escape',
        onKeyHandle,
      }));
    });
    act(() => {
      root.render(React.createElement(KeyHandler, {
        keyEventName: KEYUP,
        keyValue: 'Alt',
        onKeyHandle,
      }));
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }));
    expect(onKeyHandle).toHaveBeenCalledTimes(1);
  });

  test('removes its document listener when unmounted', () => {
    const onKeyHandle = jest.fn();
    act(() => {
      root.render(React.createElement(KeyHandler, {
        keyEventName: KEYDOWN,
        keyValue: 'Escape',
        onKeyHandle,
      }));
    });
    act(() => root.unmount());
    root = createRoot(host);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onKeyHandle).not.toHaveBeenCalled();
  });
});
