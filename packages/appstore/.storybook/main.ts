import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../src/**/stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  webpackFinal: async (webpackConfig, { configType }) => {
    webpackConfig.module = webpackConfig.module || { rules: [] };
    webpackConfig.module.rules = webpackConfig.module.rules || [];

    webpackConfig.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
      enforce: 'pre',
    });

    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.extensions = webpackConfig.resolve.extensions || [];
    webpackConfig.resolve.extensions.push('.ts', '.tsx');
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
    webpackConfig.resolve.alias['@src'] = path.resolve(__dirname, '../src');

    if (configType === 'PRODUCTION') {
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
        },
        runtimeChunk: 'single',
      };
    }

    return webpackConfig;
  },
};

export default config;
