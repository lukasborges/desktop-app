import { GradientType, withGradient } from '@getstation/theme';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { oc } from 'ts-optchain';
import Maybe from 'graphql/tsutils/Maybe';

import {
  installApplication,
  pickCustomApplicationIcon,
  resetCustomApplicationIcon,
  toggleNotifications,
} from '../applications/duck';
import { getNotificationsEnabled } from '../applications/selectors';
import { openApplicationPreferences, OpenApplicationPreferencesVia } from '../settings/applications/duck';
import { StationState } from '../types';

import Subdock from './components/Subdock';
import { Application } from './types';
import { withGetApplicationForSubdock } from './queries@local.gql.generated';

export interface ITabSelectedInfo {
  isHome: boolean,
  isFavorite: boolean,
}

export interface ActiveTab {
  id: Maybe<string>,
  url: Maybe<string>,
}

interface GraphQLProps {
  loading: boolean,
  application: Application,
}

export interface OuterProps {
  applicationId: string,
  onOverStateChange: (change: boolean) => void,
  handleHideSubdock: () => void,
  onLoaded?: () => void, // used to inform parent component when subdock is fully loaded,
}

export interface OwnProps {
  notificationsEnabled: boolean | undefined,
  themeGradient: string,
  onClickAddNewInstance: (application: Application) => void,
  toggleNotifications: () => void,
  openApplicationPreferences: (application: Application) => void,
  onChangeIcon: () => void,
  onResetIcon: () => void,
}

type Props = OuterProps & OwnProps & GraphQLProps;

class SubdockContainerImpl extends React.PureComponent<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      this.props.onLoaded && this.props.onLoaded();
    }
  }

  render() {
    const { loading } = this.props;
    if (loading) return null;

    return (
      <Subdock
        {...this.props}
        hasCustomIcon={Boolean(this.props.application && this.props.application.customIconURL)}
      />
    );
  }
}

const SubdockContainer = React.memo(compose(
  connect(
    (state: StationState, ownProps: Props) => {
      const { applicationId } = ownProps;

      return {
        notificationCount: 0,
        notificationsEnabled: getNotificationsEnabled(state, applicationId),
      };
    },
    (dispatch, ownProps) => {
      return bindActionCreators({
        toggleNotifications: () => toggleNotifications(ownProps.applicationId),
        openApplicationPreferences: (application: Application) =>
          openApplicationPreferences(application.manifestURL, OpenApplicationPreferencesVia.APP_SUBDOCK),
        onChangeIcon: () => pickCustomApplicationIcon(ownProps.applicationId),
        onResetIcon: () => resetCustomApplicationIcon(ownProps.applicationId),
        onClickAddNewInstance: (application: Application) => {
          return installApplication(application.manifestURL, { navigate: true });
        },
      }, dispatch);
    }
  ),
  withGetApplicationForSubdock<OuterProps, Partial<Props>>({
    options: (props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      application: oc(data).application(),
    }),
  }),
  withGradient(GradientType.withDarkOverlay),
)(SubdockContainerImpl));

export default SubdockContainer as React.ComponentType<OuterProps>;
