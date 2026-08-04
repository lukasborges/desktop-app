import { Icon, IconSymbol } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  navigationWrapper: string,
  navigation: string,
  navigationIcon: string,
  settings: string,
}

export interface Props {
  classes?: Classes,
  onClickSettings?: () => void,
  ctrlTabCycling?: boolean,
  searchShortcut?: string,
  smallSize?: boolean,
}

const styles = {
  container: {
    minHeight: ({ smallSize }: Props) => smallSize ? 32 : 40,
    backgroundColor: 'var(--app-surface-elevated)',
    padding: [4, 8, 4, 12],
    color: 'var(--app-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--app-border-subtle)',
  },
  navigationWrapper: {
    display: 'flex',
  },
  navigation: {
    fontSize: ({ smallSize }: Props) => smallSize ? 8 : 10,
    marginRight: 10,
    color: 'var(--app-text-secondary)',
  },
  navigationIcon: {
    marginRight: 4,
    padding: [2, 4],
    color: 'var(--app-text-primary)',
    background: 'var(--app-active)',
    border: '1px solid var(--app-border-subtle)',
    borderRadius: 4,
  },
  settings: {
    marginTop: 2,
    height: 25,
    opacity: .6,
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'var(--app-hover)',
      borderRadius: 6,
    },
  },
};

@injectSheet(styles)
export default class BangBottom extends React.PureComponent<Props, {}> {
  render() {
    const { classes, ctrlTabCycling, onClickSettings } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.navigationWrapper}>
          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>TAB</span>
            { !ctrlTabCycling &&
              <>
                <span className={classes!.navigationIcon}>↑</span>
                <span className={classes!.navigationIcon}>↓</span>
              </>
            }
            Navigate
          </div>

          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>ESC</span>
            Close
          </div>
        </div>

        { onClickSettings &&
          <a className={classes!.settings} onClick={onClickSettings}>
            <Icon
              symbolId={IconSymbol.COG}
              size={25}
              color="var(--app-icon)"
            />
          </a>
        }
      </div>
    );
  }
}
