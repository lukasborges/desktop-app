import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  control: string,
  controlDisabled: string,
  input: string,
  track: string,
  thumb: string,
}

interface Props {
  checked: boolean,
  classes?: Classes,
  disabled?: boolean,
  disabledHint?: string,
  label: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any,
}

const styles = {
  control: {
    alignItems: 'center',
    cursor: 'default',
    display: 'inline-flex',
    flexShrink: 0,
    height: 26,
    position: 'relative',
    '&:hover $track': {
      backgroundColor: 'var(--app-switch-track-hover)',
    },
    '&:focus-within $track': {
      boxShadow: '0 0 0 2px rgba(53, 132, 228, .6)',
    },
  },
  controlDisabled: {
    cursor: 'not-allowed',
    opacity: .55,
  },
  input: {
    height: 1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: 1,
    '&:checked + $track': {
      backgroundColor: 'var(--app-accent)',
      borderColor: 'var(--app-accent)',
    },
    '&:checked + $track $thumb': {
      transform: 'translateX(18px)',
    },
    '&:disabled + $track': {
      boxShadow: 'none',
    },
  },
  track: {
    backgroundColor: 'var(--app-switch-track)',
    border: '1px solid var(--app-border)',
    borderRadius: 999,
    boxSizing: 'border-box',
    display: 'inline-flex',
    height: 24,
    padding: 2,
    transition: 'background-color 140ms ease-out, border-color 140ms ease-out, box-shadow 140ms ease-out',
    width: 42,
  },
  thumb: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 1px 2px rgba(0, 0, 0, .45)',
    display: 'block',
    height: 18,
    transition: 'transform 160ms ease-out',
    width: 18,
  },
};

@injectSheet(styles)
export default class AdwaitaSwitch extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    disabledHint: '',
  };

  render() {
    const { checked, classes, disabled, disabledHint, label, onChange } = this.props;

    return (
      <label
        className={`${classes!.control} ${disabled ? classes!.controlDisabled : ''}`}
        title={disabled && disabledHint ? disabledHint : label}
      >
        <input
          aria-label={label}
          checked={checked}
          className={classes!.input}
          disabled={disabled}
          onChange={onChange}
          type="checkbox"
        />
        <span aria-hidden="true" className={classes!.track}>
          <span className={classes!.thumb} />
        </span>
      </label>
    );
  }
}
