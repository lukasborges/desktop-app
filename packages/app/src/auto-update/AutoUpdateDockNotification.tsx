import { IconSymbol } from '@getstation/theme';
import * as Immutable from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import DockApplicationSubdock from '../common/containers/DockApplicationSubdock';
import NativeAppDockIcon from '../dock/components/NativeAppDockIcon';
import connectUI from '../ui/connectUI';

import AutoUpdateSubdock from './components/AutoUpdateSubdock';
import { openReleaseNotes, setReleaseNotesSubdockVisibility, toggleReleaseNotesSubdockVisibility } from './duck';
import { getReleaseName, isSubdockOpen as getIsSubdockOpen, isUpdateAvailable as getIsUpdateAvailable } from './selectors';

interface UIProp {
  visible: boolean,
}

export interface Props {
  ui: UIProp,
  isUpdateAvailable: boolean,
  isSubdockOpen: boolean,
  releaseName: string,
  onClickOpenReleaseNotes: () => any
  onToggleReleaseNotesSubdockVisibility: () => any
  onSetReleaseNotesSubdockVisibility: (visible: boolean) => any
}

class AutoUpdateDockNotificationImpl extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.hideSubdock = this.hideSubdock.bind(this);
  }

  hideSubdock() {
    this.props.onSetReleaseNotesSubdockVisibility(false);
  }

  render() {
    const { isUpdateAvailable, ui, isSubdockOpen } = this.props;

    const showIcon = isUpdateAvailable || ui.visible || isSubdockOpen;
    if (!showIcon) return null;

    return (
      <DockApplicationSubdock
        open={isSubdockOpen}
        onRequestClose={this.hideSubdock}
      >
        <NativeAppDockIcon
          className="appcues-subdock-autoupdate"
          iconSymbolId={IconSymbol.UPDATE}
          active={this.props.isSubdockOpen}
          onClick={this.props.onToggleReleaseNotesSubdockVisibility}
          badge={this.props.isUpdateAvailable}
        />
        <AutoUpdateSubdock
          updateAvailable={this.props.isUpdateAvailable}
          releaseName={this.props.releaseName}
          onClickOpenReleaseNotes={this.props.onClickOpenReleaseNotes}
          onClickRemindLater={this.hideSubdock}
        />
      </DockApplicationSubdock>
    );
  }
}

const AutoUpdateDockNotification = connectUI({
  key: 'autoUpdate',
  state: {
    visible: false,
  },
})(AutoUpdateDockNotificationImpl);

export default connect(
  (state: Immutable.Map<string, any>) => ({
    isUpdateAvailable: getIsUpdateAvailable(state),
    isSubdockOpen: getIsSubdockOpen(state),
    releaseName: getReleaseName(state),
  }),
  (dispatch: Dispatch) => bindActionCreators({
    onClickOpenReleaseNotes: openReleaseNotes,
    onToggleReleaseNotesSubdockVisibility: toggleReleaseNotesSubdockVisibility,
    onSetReleaseNotesSubdockVisibility: (visible: boolean) => setReleaseNotesSubdockVisibility(visible),
  }, dispatch)
)(AutoUpdateDockNotification);
