import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';

import { Application } from '../types';

import SubdockHead from './SubdockHead';
import SubdockPanel from './SubdockPanel';

interface Classes {
  container: string,
  panels: string,
}

interface Props {
  classes?: Classes,
  application: Application,
  applicationId: string,
  onOverStateChange: (change: boolean) => any,
  notificationsEnabled: boolean,
  themeGradient: string,
  onClickAddNewInstance: (application: Application) => void,
  openApplicationPreferences: (application: Application) => void,
  toggleNotifications: () => void,
  onChangeIcon: () => void,
  onResetIcon: () => void,
  hasCustomIcon: boolean,
  handleHideSubdock: () => void,
}

@injectSheet(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    zIndex: 4,
    border: '1px solid var(--app-border)',
    borderRadius: 12,
    boxShadow: '0 16px 48px var(--app-shadow)',
    maxHeight: 'calc(100vh - 76px)',
    overflow: 'hidden',
    backgroundColor: 'var(--app-header-background)',
    backgroundAttachment: 'fixed',
  },
  panels: {
    flex: '1 1 auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))
export default class Subdock extends React.PureComponent<Props, {}> {

  render() {
    const {
      classes, application, onOverStateChange, notificationsEnabled,
      onClickAddNewInstance, openApplicationPreferences,
      toggleNotifications, onChangeIcon, onResetIcon, hasCustomIcon,
    } = this.props;

    const onMouseEnter = () => onOverStateChange(true);
    const onMouseLeave = () => onOverStateChange(false);

    return (
      <div className={`${classes!.container} station-subdock`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <SubdockHead
          application={application}
          notificationsEnabled={notificationsEnabled}
          openApplicationPreferences={openApplicationPreferences}
          toggleNotifications={toggleNotifications}
          onChangeIcon={onChangeIcon}
          onResetIcon={onResetIcon}
          hasCustomIcon={hasCustomIcon}
        />

        <div className={classes!.panels}>
          {application &&
            <SubdockPanel
              application={application}
              onClickAddNewInstance={onClickAddNewInstance}
            />
          }
        </div>
      </div>
    );
  }
}
