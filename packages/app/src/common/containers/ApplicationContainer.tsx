import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  container2: string,
  icon: string,
  iconContainer: string,
}

export interface Props {
  classes?: Classes,
  themeGradient?: string,
  applicationIcon: string,
  children?: React.ReactNode,
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--app-surface)',
    backgroundImage: 'none',
    padding: 24,
  },
  container2: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: '100%',
    color: 'var(--app-text-primary)',
    fontSize: '14px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 76,
    marginBottom: 24,
    border: '1px solid var(--app-border)',
    borderRadius: 16,
    backgroundColor: 'var(--app-surface-subtle)',
    position: 'relative',
  },
  icon: {
    width: 52,
    height: 52,
  },
};

@injectSheet(styles)
export class ApplicationContainerImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes!.container}>
        <div className={classes!.container2}>
          <div className={classes!.iconContainer}>
            <img src={this.props.applicationIcon} width={60} height={60} alt="Icon" />
          </div>

          {children}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.normal)(ApplicationContainerImpl as any) as React.ComponentType<Props>;
