import { ThemeTypes as Theme } from '@getstation/theme';
import { Options as PopperOptions, Placement } from '@popperjs/core';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { Manager, Popper, Reference } from 'react-popper';

import ClickOutside from './ClickOutside';
import ParentResizeObserver from './ParentResizeObserver';

export interface IComponentWithPopoverChildrenProps {
  toggle: (() => void) | undefined,
  isVisible: boolean,
}

export interface OwnProps {
  children: React.FunctionComponent<IComponentWithPopoverChildrenProps> | React.ReactNode,
  modifiers?: PopperOptions['modifiers'],
  placement?: Placement,
  overlay?: boolean,
}

export interface StateProps {
  classes?: {
    overlay: string,
  }
}

type Props = OwnProps & StateProps;

export interface State {
  showPopper: boolean
}

const styles = (theme: Theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: theme.dock.size,
    backgroundColor: 'var(--app-backdrop)',
  },
});

@injectSheet(styles)
export default class ComponentWithPopover extends React.PureComponent<Props, State> {

  static defaultProps = {
    modifiers: [],
    overlay: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showPopper: false,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleClickOutside() {
    this.setState({ showPopper: false });
  }

  handleToggle() {
    this.setState({ showPopper: !this.state.showPopper });
  }

  getChild(indice: number) {
    const { children } = this.props;
    const { showPopper } = this.state;
    const child = children![indice];

    if (typeof child === 'function') {
      return child({
        toggle: this.handleToggle,
        isVisible: showPopper,
      });
    }
    return child as React.ReactNode;
  }

  render() {
    const { placement: placementProps, modifiers, overlay } = this.props;
    const { showPopper } = this.state;
    const firstChild = this.getChild(0);
    const secondChild = this.getChild(1);

    return (
      <Manager>
        <ClickOutside onClickOutside={this.handleClickOutside}>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                {firstChild}
              </div>
            )}
          </Reference>

          {overlay && showPopper &&
          <div
            className={this.props.classes!.overlay}
            onClick={this.handleClickOutside}
          />
          }

          {showPopper &&
          <Popper
            placement={placementProps}
            modifiers={[
              {
                name: 'computeStyles',
                options: { gpuAcceleration: false },
              },
              ...modifiers!,
            ]}
          >
            {({ ref, style, placement, update }) =>
              <div
                ref={ref}
                style={style}
                data-placement={placement}
              >
                {secondChild}
                <ParentResizeObserver onResize={update} />
              </div>}
          </Popper>
          }
        </ClickOutside>
      </Manager>
    );
  }
}
