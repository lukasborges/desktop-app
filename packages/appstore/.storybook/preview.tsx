import { BrowserXThemeProvider, withBrowserXTheme } from '@getstation/theme';
import type { Preview } from '@storybook/react';
import * as React from 'react';
import { ThemeProvider } from 'react-jss';

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  minWidth: '300px',
  WebkitOverflowScrolling: 'touch',
  overflow: 'visible',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeight: 'normal',
  WebkitFontSmoothing: 'antialiased',
};

// The published theme package still exposes its legacy theme HOC types.
// @ts-ignore theme types mismatch between react-jss generations
const ThemeForwarder = withBrowserXTheme(ThemeProvider);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },
  decorators: [
    (Story) => (
      <BrowserXThemeProvider>
        <ThemeForwarder>
          <div style={style}>
            <Story />
          </div>
        </ThemeForwarder>
      </BrowserXThemeProvider>
    ),
  ],
};

export default preview;
