import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import {
  AppearanceTheme,
  getAppearanceTheme,
  setAppearanceTheme,
} from '../../theme/appearance';

interface Classes {
  container: string,
  description: string,
  options: string,
  option: string,
  optionActive: string,
  preview: string,
  previewLight: string,
  previewDark: string,
  previewSystem: string,
  settingName: string,
}

interface Props {
  classes?: Classes,
}

interface State {
  theme: AppearanceTheme,
}

const options: { value: AppearanceTheme, label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const styles = {
  container: {
    maxWidth: 600,
    padding: [18, 0, 20],
  },
  settingName: {
    marginBottom: 4,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    color: 'var(--settings-muted-text)',
    fontSize: 13,
    marginBottom: 14,
  },
  options: {
    display: 'flex',
    gap: 10,
  },
  option: {
    appearance: 'none',
    background: 'var(--settings-option-background)',
    border: '1px solid var(--settings-border)',
    borderRadius: 8,
    color: 'inherit',
    cursor: 'pointer',
    flex: 1,
    font: 'inherit',
    padding: [8, 8, 10],
    textAlign: 'left',
    '&:hover': {
      background: 'var(--settings-option-hover-background)',
    },
    '&:focus': {
      boxShadow: '0 0 0 2px var(--settings-focus-ring)',
      outline: 'none',
    },
  },
  optionActive: {
    borderColor: 'var(--settings-accent)',
    boxShadow: '0 0 0 1px var(--settings-accent)',
  },
  preview: {
    border: '1px solid var(--settings-border)',
    borderRadius: 5,
    display: 'block',
    height: 34,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    '&:before': {
      background: 'currentColor',
      borderRadius: 2,
      content: '""',
      height: 4,
      left: 8,
      opacity: 0.45,
      position: 'absolute',
      top: 8,
      width: 28,
    },
    '&:after': {
      background: 'currentColor',
      borderRadius: 2,
      content: '""',
      height: 4,
      left: 8,
      opacity: 0.22,
      position: 'absolute',
      top: 17,
      width: 44,
    },
  },
  previewLight: {
    background: '#f7f7f8',
    color: '#24262b',
  },
  previewDark: {
    background: '#202126',
    color: '#f5f5f6',
  },
  previewSystem: {
    background: 'linear-gradient(135deg, #f7f7f8 0%, #f7f7f8 49%, #202126 51%, #202126 100%)',
    color: '#7b7d85',
  },
};

@injectSheet(styles)
export default class SettingsAppearance extends React.PureComponent<Props, State> {
  state: State = {
    theme: getAppearanceTheme(),
  };

  setTheme = (theme: AppearanceTheme) => {
    setAppearanceTheme(theme);
    this.setState({ theme });
  }

  handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setTheme(event.currentTarget.dataset.themeValue as AppearanceTheme);
  }

  render() {
    const { classes } = this.props;

    return (
      <section className={classes!.container} aria-labelledby="appearance-setting-title">
        <p id="appearance-setting-title" className={classes!.settingName}>Appearance</p>
        <p className={classes!.description}>Choose a theme or follow your system settings.</p>
        <div className={classes!.options} role="radiogroup" aria-label="Appearance theme">
          {options.map(option => {
            const selected = this.state.theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                data-theme-value={option.value}
                className={`${classes!.option} ${selected ? classes!.optionActive : ''}`}
                onClick={this.handleThemeClick}
              >
                <span className={`${classes!.preview} ${classes![`preview${option.label}` as keyof Classes]}`} />
                {option.label}
              </button>
            );
          })}
        </div>
      </section>
    );
  }
}
