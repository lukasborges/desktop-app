import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '@getstation/theme';

import { iconNeedsContrastBackground } from '../../utils/iconContrast';

interface Props {
  classes?: any,
  className?: string,
  imgUrl?: string,
  themeColor?: string,
  size?: number,
}

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    alignItems: 'center',
    backgroundColor: 'var(--app-rail-tile)',
    border: '1px solid var(--app-rail-tile-border)',
    boxSizing: 'border-box',
    borderRadius: (props: Props) => (props.size || 30) * .275,
    display: 'flex',
    flexShrink: 0,
    position: 'relative',
    width: (props: Props) => props.size || 30,
    height: (props: Props) => props.size || 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    borderRadius: '27%',
    height: '65%',
    objectFit: 'contain',
    width: '65%',
  },
});

interface State {
  needsContrastBackground: boolean,
}

class AppIcon extends React.PureComponent<Props, State> {
  state = {
    needsContrastBackground: false,
  };

  handleIconLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    this.setState({ needsContrastBackground: iconNeedsContrastBackground(event.currentTarget) });
  }

  render() {
    const { classes, className, imgUrl, themeColor } = this.props;

    return (
      <div
        className={`${classes.container} ${className || ''}`}
        style={{ backgroundColor: this.state.needsContrastBackground ? themeColor : undefined }}
      >
      {
        imgUrl ?
        <img className={classes.icon} src={imgUrl} alt="" onLoad={this.handleIconLoad} />
        :
        <span>&nbsp;</span>
      }
      </div>
    );
  }
}

export default injectSheet(styles)(AppIcon) as React.ComponentType<Props>;
