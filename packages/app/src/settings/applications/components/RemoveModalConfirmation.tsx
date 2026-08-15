import { ModalWrapper } from '@getstation/theme';
import * as Immutable from 'immutable';
import * as pluralize from 'pluralize';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { Instances, Instance } from '../types';
import { withInstanceNumber } from '../utils';

type Classes = {
  dialog?: string,
  header?: string,
  title?: string,
  description?: string,
  body?: string,
  instanceList?: string,
  instance?: string,
  instanceIcon?: string,
  instanceName?: string,
  hintText?: string,
  actions?: string,
  button?: string,
  cancelButton?: string,
  destructiveButton?: string,
};

type DefaultProps = {
  classes: Classes,
  allInstancesRemoved: boolean,
  instancesToRemove: Instances,
  instanceTypeWording: string,
  onContinue: () => void,
  onCancel: () => void,
};

type Props = DefaultProps & {
  applicationName: string,
};

@injectSheet(() => ({
  dialog: {
    width: 400,
    maxWidth: 'calc(100% - 48px)',
    overflow: 'hidden',
    color: 'var(--app-text-primary)',
    background: 'var(--app-surface-raised)',
    border: '1px solid var(--app-border-strong)',
    borderRadius: 12,
    boxShadow: '0 14px 36px rgba(0, 0, 0, .35)',
  },
  header: {
    padding: [24, 24, 12],
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  description: {
    margin: [8, 0, 0],
    color: 'var(--app-text-secondary)',
    fontSize: 14,
    lineHeight: 1.4,
  },
  body: {
    padding: [8, 24, 20],
  },
  instanceList: {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    listStyle: 'none',
    background: 'var(--app-surface-elevated)',
    border: '1px solid var(--app-border)',
    borderRadius: 8,
  },
  instance: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 48,
    padding: [6, 12],
    boxSizing: 'border-box',
    '& + &': { borderTop: '1px solid var(--app-border-subtle)' },
  },
  instanceIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 8,
    objectFit: 'cover',
  },
  instanceName: {
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 600,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hintText: {
    margin: [14, 4, 0],
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 1.4,
    color: 'var(--app-text-muted)',
  },
  actions: {
    display: 'flex',
    padding: [0, 24, 24],
  },
  button: {
    flex: 1,
    minHeight: 36,
    padding: [0, 16],
    border: 0,
    borderRadius: 8,
    color: 'var(--app-text-primary)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    '&:focus-visible': {
      outline: '2px solid var(--app-accent)',
      outlineOffset: 2,
    },
  },
  cancelButton: {
    background: 'var(--app-active)',
    '&:hover': { filter: 'brightness(1.08)' },
  },
  destructiveButton: {
    marginLeft: 8,
    color: '#fff',
    background: 'var(--app-danger)',
    '&:hover': { filter: 'brightness(.92)' },
  },
}))
class RemoveModalConfirmation extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    classes: {},
    allInstancesRemoved: false,
    instancesToRemove: Immutable.List(),
    instanceTypeWording: 'instance',
    onContinue: () => { },
    onCancel: () => { },
  };

  getInstanceTypeWording = () => pluralize(this.props.instanceTypeWording, this.props.instancesToRemove.size);

  getPluralForm = () => this.props.instancesToRemove.size > 1;

  getItems = () =>
    withInstanceNumber(this.props.instancesToRemove).map((instance: Instance) => ({
      id: instance.id,
      name: instance.needConfiguration ? `${this.props.applicationName} (Not connected)` : instance.name,
      imageURL: instance.logoUrl,
    }))

  getTitle = (): string => {
    const { allInstancesRemoved, applicationName } = this.props;

    return allInstancesRemoved ?
      `Remove ${applicationName}` :
      `Remove this ${applicationName} ${this.getInstanceTypeWording()}?`;
  }

  getDescription = (): string | undefined => {
    const { applicationName } = this.props;
    const pluralForm = this.getPluralForm();
    const instanceTypeWording = this.getInstanceTypeWording();
    const description = `Are you sure you want to remove ${pluralForm ? 'these' : 'this'} ${applicationName} ${instanceTypeWording}?`;

    return this.props.allInstancesRemoved ? description : undefined;
  }

  getContinueContent = () => {
    return `Remove ${this.getPluralForm() ? 'these' : 'this'} ${this.getInstanceTypeWording()}`;
  }

  getHintText = () => {
    const { allInstancesRemoved } = this.props;
    const pluralForm = this.getPluralForm();

    return `No worries, you can always add ${pluralForm ? 'them' : 'it'} back from the ${allInstancesRemoved ? 'app store' : 'settings'}.`;
  }

  shouldRenderModal = () => {
    const { applicationName, instancesToRemove } = this.props;
    return applicationName && instancesToRemove.size > 0;
  }

  render() {
    const { classes, onContinue, onCancel } = this.props;

    if (this.shouldRenderModal()) {
      const title = this.getTitle();
      const description = this.getDescription();

      return (
        <ModalWrapper onClickOutside={onCancel}>
          <section className={classes.dialog} role="alertdialog" aria-modal="true" aria-labelledby="remove-dialog-title" aria-describedby="remove-dialog-hint">
            <header className={classes.header}>
              <h2 id="remove-dialog-title" className={classes.title}>{title}</h2>
              {description && <p className={classes.description}>{description}</p>}
            </header>
            <div className={classes.body}>
              <ul className={classes.instanceList}>
                {this.getItems().toArray().map((item) => (
                  <li className={classes.instance} key={item.id}>
                    {item.imageURL && <img className={classes.instanceIcon} src={item.imageURL} alt="" />}
                    <span className={classes.instanceName}>{item.name}</span>
                  </li>
                ))}
              </ul>
              <p id="remove-dialog-hint" className={classes.hintText}>
                {this.getHintText()}
              </p>
            </div>
            <footer className={classes.actions}>
              <button
                className={`${classes.button} ${classes.cancelButton}`}
                type="button"
                onClick={onCancel}
                autoFocus={true}
              >
                Cancel
              </button>
              <button className={`${classes.button} ${classes.destructiveButton}`} type="button" onClick={onContinue}>
                {this.getContinueContent()}
              </button>
            </footer>
          </section>
        </ModalWrapper>
      );
    }
    return null;
  }
}

export default RemoveModalConfirmation;
