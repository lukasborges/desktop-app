import { theme as baseTheme } from '@getstation/theme';
import * as React from 'react';
import { jss, ThemeProvider } from 'react-jss';
// @ts-ignore: no declaration file
import jssNested from 'jss-nested';

jss.use(jssNested());

const platformTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    gray: {
      light: 'var(--app-surface-subtle)',
      middle: 'var(--app-text-muted)',
      dark: 'var(--app-text-primary)',
    },
    black: 'var(--app-text-primary)',
  },
  icons: {
    ...baseTheme.icons,
    color: {
      ...baseTheme.icons.color,
      base: 'var(--app-icon)',
    },
  },
  $bodyBkg: 'var(--app-surface-raised)',
};

export default class PlatformThemeProvider extends React.PureComponent<React.PropsWithChildren<{}>> {
  render() {
    return (
      <ThemeProvider theme={platformTheme}>
        {this.props.children}
      </ThemeProvider>
    );
  }
}
