import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '@getstation/theme';

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
    backgroundColor: 'var(--app-hover)',
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

class AppIcon extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, className, imgUrl } = this.props;

    return (
      <div className={`${classes.container} ${className || ''}`}>
      {
        imgUrl ?
        <img className={classes.icon} src={imgUrl} alt="" />
        :
        <span>&nbsp;</span>
      }
      </div>
    );
  }
}

export default injectSheet(styles)(AppIcon) as React.ComponentType<Props>;
