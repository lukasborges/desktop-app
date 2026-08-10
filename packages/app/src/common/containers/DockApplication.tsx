import * as React from 'react';

import ClickOutside from '../components/ClickOutside';
import KeyHandler, { KEYDOWN } from '../components/KeyHandler';

import Portal from './Portal';

export type DockApplicationCloseEvent =
  React.SyntheticEvent<HTMLElement> | KeyboardEvent | MouseEvent | TouchEvent;

interface Props {
  children: React.ReactNode,
  open: boolean,
  onRequestClose: (e?: DockApplicationCloseEvent) => void,
  onClickOutside?: (e: MouseEvent | TouchEvent) => void,
}

export default class DockApplication extends React.PureComponent<Props, {}> {
  subdockContainer: HTMLDivElement | null;

  render() {
    const { onClickOutside, onRequestClose } = this.props;

    const childrenArray = React.Children.toArray(this.props.children);
    const [iconComponent, contentComponent] = childrenArray;

    return (
      <ClickOutside onClickOutside={onClickOutside || (() => null)}>
        {iconComponent}

        <Portal into="portal-application-scene">
            { this.props.open &&
              contentComponent
            }
        </Portal>

        { this.props.open &&
          <KeyHandler
            keyEventName={KEYDOWN}
            keyValue="Escape"
            onKeyHandle={onRequestClose}
          />
        }
      </ClickOutside>
    );
  }
}
