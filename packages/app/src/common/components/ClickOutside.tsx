import * as React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onClickOutside: (event: MouseEvent | TouchEvent) => void,
}

export default class ClickOutside extends React.PureComponent<Props> {
  container: HTMLDivElement | null = null;
  ignoreNextClick = false;

  componentDidMount() {
    document.addEventListener('touchend', this.handleEvent, true);
    document.addEventListener('click', this.handleEvent, true);
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleEvent, true);
    document.removeEventListener('click', this.handleEvent, true);
  }

  handleEvent = (event: MouseEvent | TouchEvent) => {
    if (event.type === 'touchend') {
      this.ignoreNextClick = true;
    } else if (this.ignoreNextClick) {
      this.ignoreNextClick = false;
      return;
    }

    const target = event.target;
    if (this.container && target instanceof Node && !this.container.contains(target)) {
      this.props.onClickOutside(event);
    }
  }

  setContainer = (container: HTMLDivElement | null) => {
    this.container = container;
  }

  render() {
    const { children, ...props } = this.props;
    delete (props as Partial<Props>).onClickOutside;
    return (
      <div {...props} ref={this.setContainer}>
        {children}
      </div>
    );
  }
}
