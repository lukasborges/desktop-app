import * as React from 'react';

export interface Props {
  onResize: () => void,
}

const markerStyle: React.CSSProperties = {
  display: 'none',
};

export default class ParentResizeObserver extends React.PureComponent<Props> {
  marker: HTMLSpanElement | null = null;
  observer: ResizeObserver | null = null;

  componentDidMount() {
    const parent = this.marker && this.marker.parentElement;
    if (!parent) return;

    this.observer = new ResizeObserver(this.handleResize);
    this.observer.observe(parent);
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect();
  }

  handleResize = () => {
    this.props.onResize();
  }

  setMarker = (marker: HTMLSpanElement | null) => {
    this.marker = marker;
  }

  render() {
    return <span ref={this.setMarker} style={markerStyle} />;
  }
}
