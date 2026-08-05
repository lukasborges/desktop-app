import { Button, Size } from '@getstation/theme';
import ms = require('ms');
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';

import { settingsButtonStyle } from '../settingsButtonStyle';

import {
  withGetAutoUpdateStatus, withCheckForUpdatesMutation, withOpenReleaseNotesMutation,
} from './queries@local.gql.generated';
export interface Classes {
  checking: string,
  info: string,
  updateButton: string,
}

export interface Props {
  classes?: Classes,
  isDownloadingUpdate: boolean,
  isCheckingUpdate: boolean,
  isUpdateAvailable: boolean,
  releaseName: string,
  checkForUpdates: () => any,
  openReleaseNotes: () => any,
}

export interface State {
  justCheckedForUpdate: boolean,
}

const styles = () => ({
  checking: {
    display: 'inline-block',
    position: 'relative',
    top: 2,
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: '100%',
    backgroundColor: 'transparent',
    border: '2px solid var(--app-text-primary)',
    animation: '3s ease-in-out 0s infinite checking',
  },
  '@keyframes checking': {
    '0%': { transform: 'scale(0.8)' },
    '50%': { transform: 'scale(1.3)' },
    '100%': { transform: 'scale(0.8)' },
  },
  info: {
    marginTop: 5,
    fontSize: 11,
    color: 'var(--app-text-muted)',
    textAlign: 'center',
  },
  updateButton: {
    ...settingsButtonStyle,
    minWidth: '160px',
    marginTop: 2,
  },
});

@injectSheet(styles)
class SettingsUpdatesButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      justCheckedForUpdate: false,
    };
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(newProps: any) {
    if (this.props.isCheckingUpdate && !newProps.isCheckingUpdate) {
      this.setState({ justCheckedForUpdate: true });

      setTimeout(
        () => this.setState({ justCheckedForUpdate: false }),
        ms('1min')
      );
    }
  }

  render() {
    const { classes } = this.props;

    if (this.props.isCheckingUpdate) {
      return (
        <Button className={classes!.updateButton} btnSize={Size.SMALL} disabled={this.props.isCheckingUpdate}>
          <span className={classes!.checking} />
          {this.props.isDownloadingUpdate ? 'Downloading...' : 'Checking...'}
        </Button>
      );
    }

    if (this.props.isUpdateAvailable) {
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.openReleaseNotes}>
            View available downloads
          </Button>

          <p className={classes!.info}>New version available ({this.props.releaseName})</p>
        </div>
      );
    }

    if (!this.props.isUpdateAvailable && this.state.justCheckedForUpdate) {
      return (
        <div>
          <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.checkForUpdates}>
            No new updates
          </Button>

          <p className={classes!.info}>You have the most recent version</p>
        </div>

      );
    }

    return (
      <Button className={classes!.updateButton} btnSize={Size.SMALL} onClick={this.props.checkForUpdates}>
        Check for updates
      </Button>
    );
  }
}

const connect = compose(
  withGetAutoUpdateStatus({
    props: ({ data }) => ({
      isDownloadingUpdate: data && data.autoUpdateStatus && data.autoUpdateStatus.isDownloadingUpdate ?
        data.autoUpdateStatus.isDownloadingUpdate : false,
      isCheckingUpdate: data && data.autoUpdateStatus && data.autoUpdateStatus.isCheckingUpdate ?
        data.autoUpdateStatus.isCheckingUpdate : false,
      isUpdateAvailable: data && data.autoUpdateStatus && data.autoUpdateStatus.isUpdateAvailable ?
        data.autoUpdateStatus.isUpdateAvailable : false,
      releaseName: data && data.autoUpdateStatus && data.autoUpdateStatus.releaseName ?
        data.autoUpdateStatus.releaseName : null,
    }),
  }),
  withCheckForUpdatesMutation({
    props: ({ mutate }) => ({
      checkForUpdates: () => mutate && mutate({ variables: { } }),
    }),
  }),
  withOpenReleaseNotesMutation({
    props: ({ mutate }) => ({
      openReleaseNotes: () => mutate && mutate({ variables: { } }),
    }),
  }),
);

export default connect(SettingsUpdatesButton);
