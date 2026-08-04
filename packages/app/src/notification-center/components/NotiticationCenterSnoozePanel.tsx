import * as React from 'react';
import injectSheet from 'react-jss';
import NotificationCenterSnoozePanelItem from './NotiticationCenterSnoozePanelItem';
import { minutesBeforeHeightAm } from '../utils';

export interface Classes {
  container: string,
  title: string,
  list: string,
}

export interface Props {
  classes?: Classes,
  handleSnooze: (duration: string) => any,
}

const styles = () => ({
  container: {
    backgroundColor: 'var(--app-surface-elevated)',
    border: '1px solid var(--app-border)',
    borderRadius: 10,
    boxShadow: '0 12px 36px rgba(0, 0, 0, .45)',
    padding: [8, 10],
    minWidth: '100px',
    marginTop: 5,
  },
  title: {
    color: 'var(--app-text-primary)',
    fontWeight: 700,
  },
  list: {
    marginTop: 6,
  },
});

@injectSheet(styles)
class NotificationCenterSnoozePanel extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <span className={classes!.title}>Do Not Disturb for</span>
        <ul className={classes!.list}>
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('21min')}
            duration="20 minutes"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('61min')}
            duration="1 hour"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('121min')}
            duration="2 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('241min')}
            duration="4 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze(`${minutesBeforeHeightAm()}min`)}
            duration="Until tomorrow"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('INFINITE')}
            duration="Always"
          />
        </ul>
      </div>
    );
  }
}

export default NotificationCenterSnoozePanel;
