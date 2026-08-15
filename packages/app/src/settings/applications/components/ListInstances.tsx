import { List as ListImmutable } from 'immutable';
import * as pluralize from 'pluralize';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import AppIcon from '../../../dock/components/AppIcon';
import Providers from '../../../password-managers/providers/index';
import { Instance, Instances } from '../types';
import { orderInstances } from '../utils';

import { AdwaitaCloseIcon } from './AdwaitaSymbolicIcons';

interface Classes {
  container: string,
  title: string,
  list: string,
  row: string,
  identity: string,
  logo: string,
  logoFallback: string,
  name: string,
  configureButton: string,
  actions: string,
  unlinkButton: string,
  removeButton: string,
  removeIcon: string,
}

type DefaultProps = {
  onConfigureInstance: (instanceId: string) => void,
  onRemoveInstance: (instanceId: string) => void,
  onUnlinkPasswordManager: (instanceId: string) => void,
  instanceTypeWording: string,
  applications: any,
};

type Props = DefaultProps & {
  classes?: Classes,
  applicationThemeColor?: string,
  manifestURL: string,
  instances: Instances,
};

@injectSheet({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  list: {
    backgroundColor: 'var(--app-hover)',
    border: '1px solid var(--app-border-subtle)',
    borderRadius: 10,
    listStyle: 'none',
    margin: 0,
    maxWidth: 520,
    overflow: 'hidden',
    padding: 0,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: 12,
    minHeight: 48,
    padding: [6, 8, 6, 12],
    '&:not(:last-child)': {
      borderBottom: '1px solid var(--app-border-subtle)',
    },
  },
  identity: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    minWidth: 0,
  },
  logo: {
    flexShrink: 0,
    marginRight: 10,
  },
  logoFallback: {
    alignItems: 'center',
    backgroundColor: 'var(--app-active)',
    border: '1px solid var(--app-border)',
    borderRadius: 8,
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 600,
    height: 32,
    justifyContent: 'center',
    marginRight: 10,
    textTransform: 'uppercase',
    width: 32,
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  configureButton: {
    background: 'transparent',
    border: 0,
    color: 'var(--app-accent)',
    cursor: 'default',
    font: 'inherit',
    outline: 0,
    overflow: 'hidden',
    padding: 0,
    textAlign: 'left',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      borderRadius: 4,
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: 6,
  },
  unlinkButton: {
    background: 'transparent',
    border: 0,
    borderRadius: 7,
    color: 'var(--app-text-secondary)',
    cursor: 'default',
    fontSize: 12,
    outline: 0,
    padding: [6, 8],
    '&:hover': {
      backgroundColor: 'var(--app-hover)',
      color: 'var(--app-text-primary)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  removeButton: {
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    borderRadius: 7,
    color: 'var(--app-text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 30,
    justifyContent: 'center',
    outline: 0,
    padding: 0,
    width: 30,
    '&:hover': {
      backgroundColor: 'var(--app-hover)',
      color: 'var(--app-danger)',
    },
    '&:active': {
      backgroundColor: 'var(--app-pressed)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  removeIcon: {
    fill: 'currentColor',
    height: 16,
    width: 16,
  },
})
class ListInstances extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    onConfigureInstance: () => { },
    onRemoveInstance: () => { },
    onUnlinkPasswordManager: () => { },
    instanceTypeWording: 'instance',
    applications: null,
  };

  handleConfigure = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onConfigureInstance(event.currentTarget.dataset.instanceId!);
  }

  handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onRemoveInstance(event.currentTarget.dataset.instanceId!);
  }

  handleUnlinkPasswordManager = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.onUnlinkPasswordManager(event.currentTarget.dataset.instanceId!);
  }

  renderInstance = (instance: Instance) => {
    const {
      classes,
      applicationThemeColor,
      instanceTypeWording,
    } = this.props;
    const providerId = instance.passwordManagerLink && instance.passwordManagerLink.providerId;
    const provider = providerId && Providers[providerId];
    const removeLabel = `Remove ${instanceTypeWording}`;

    return (
      <li className={classes!.row} key={instance.id}>
        <div className={classes!.identity}>
          {instance.logoUrl ?
            <AppIcon
              className={classes!.logo}
              imgUrl={instance.logoUrl}
              size={32}
              themeColor={applicationThemeColor}
            /> :
            <span aria-hidden="true" className={classes!.logoFallback}>{instance.name.charAt(0)}</span>
          }
          {instance.needConfiguration ?
            <button
              className={classes!.configureButton}
              data-instance-id={instance.id}
              onClick={this.handleConfigure}
              type="button"
            >
              Configure {instanceTypeWording}
            </button> :
            <span className={classes!.name}>{instance.name}</span>
          }
        </div>

        <div className={classes!.actions}>
          {provider &&
            <button
              className={classes!.unlinkButton}
              data-instance-id={instance.id}
              onClick={this.handleUnlinkPasswordManager}
              type="button"
            >
              Unlink {provider.name}
            </button>
          }
          <button
            aria-label={removeLabel}
            className={classes!.removeButton}
            data-instance-id={instance.id}
            onClick={this.handleRemove}
            title={removeLabel}
            type="button"
          >
            <AdwaitaCloseIcon className={classes!.removeIcon} />
          </button>
        </div>
      </li>
    );
  }

  render() {
    const { applications, classes, instances, instanceTypeWording } = this.props;
    const applicationIds: ListImmutable<string> = applications.map((app: any) => app.get('applicationId'));
    const orderedInstances = orderInstances(instances, applicationIds);

    return (
      <section className={classes!.container}>
        <div className={classes!.title}>{pluralize(instanceTypeWording)}</div>
        <ul className={classes!.list}>
          {orderedInstances.map(this.renderInstance).toArray()}
        </ul>
      </section>
    );
  }
}

export default ListInstances;
