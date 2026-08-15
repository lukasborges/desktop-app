import * as React from 'react';

export default class ConsoleErrorBoundary extends React.PureComponent<React.PropsWithChildren<{}>> {
  componentDidCatch(error: Error) {
    console.error(error);
    throw error;
  }

  render() {
    return this.props.children;
  }
}
