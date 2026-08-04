import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { AdwaitaPlusIcon } from './AdwaitaSymbolicIcons';

type Classes = {
  container: string,
  button: string,
  icon: string,
};

type DefaultProps = {
  classes: Partial<Classes>,
  instanceTypeWording: string,
  onClick: () => void,
};

type Props = DefaultProps & {
  name: string,
};

@injectSheet(() => ({
  container: {
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'var(--app-hover)',
    border: '1px solid var(--app-border-subtle)',
    borderRadius: 8,
    color: 'var(--app-text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 13,
    fontWeight: 600,
    height: 34,
    outline: 0,
    padding: [0, 13],
    transition: 'background-color 140ms ease-out, border-color 140ms ease-out',
    '&:hover': {
      backgroundColor: 'var(--app-active)',
      borderColor: 'var(--app-border)',
    },
    '&:active': {
      backgroundColor: 'var(--app-pressed)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
    },
  },
  icon: {
    fill: 'currentColor',
    height: 16,
    marginRight: 8,
    width: 16,
  },
}))
class AddNewInstance extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    classes: {},
    instanceTypeWording: 'instance',
    onClick: () => { },
  };

  getWording() {
    const { instanceTypeWording, name } = this.props;

    const wording = instanceTypeWording === 'instance' ?
      `instance of ${name}` : instanceTypeWording;

    return `Add a new ${wording}`;
  }

  render() {
    const { classes, onClick } = this.props;

    return (
      <div className={classes.container}>
        <button
          aria-label={this.getWording()}
          className={classes.button}
          onClick={onClick}
          type="button"
        >
          <AdwaitaPlusIcon className={classes.icon} />
          <span>{this.getWording()}</span>
        </button>
      </div>
    );
  }
}

export default AddNewInstance;
