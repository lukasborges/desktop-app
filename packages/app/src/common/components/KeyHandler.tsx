import * as React from 'react';

export const KEYDOWN = 'keydown';
export const KEYPRESS = 'keypress';
export const KEYUP = 'keyup';

export type KeyEventName = typeof KEYDOWN | typeof KEYPRESS | typeof KEYUP;

export interface Props {
  keyEventName?: KeyEventName,
  keyValue: string,
  onKeyHandle: (event: KeyboardEvent) => void,
}

const legacyKeyValues: { [key: string]: string } = {
  Esc: 'Escape',
  Spacebar: ' ',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Del: 'Delete',
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return true;

  const editableParent = target.closest('[contenteditable]');
  return Boolean(editableParent && editableParent.getAttribute('contenteditable') !== 'false');
};

export default class KeyHandler extends React.PureComponent<Props> {
  static defaultProps: Pick<Props, 'keyEventName'> = {
    keyEventName: KEYUP,
  };

  componentDidMount() {
    document.addEventListener(this.props.keyEventName!, this.handleKey);
  }

  componentDidUpdate(previousProps: Props) {
    if (previousProps.keyEventName === this.props.keyEventName) return;
    document.removeEventListener(previousProps.keyEventName!, this.handleKey);
    document.addEventListener(this.props.keyEventName!, this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener(this.props.keyEventName!, this.handleKey);
  }

  handleKey = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) return;

    const key = legacyKeyValues[event.key] || event.key;
    if (key === this.props.keyValue) this.props.onKeyHandle(event);
  }

  render() {
    return null;
  }
}
