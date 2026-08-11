import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../packages/app/src/**/stories.tsx'],
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
      include: [
        path.resolve(__dirname, '../packages/app/src'),
        path.resolve(__dirname),
      ],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, '../packages/app/tsconfig.json'),
            context: path.resolve(__dirname, '../packages/app'),
          },
        },
      ],
      enforce: 'pre',
    });

    webpackConfig.module.rules.push({
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [{ loader: 'svg-inline-loader' }],
    });

    webpackConfig.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-import-loader' }],
    });

    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.extensions = webpackConfig.resolve.extensions || [];
    webpackConfig.resolve.extensions.push('.ts', '.tsx');
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
    webpackConfig.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';

    const existingExternals = webpackConfig.externals || [];
    webpackConfig.externals = Array.isArray(existingExternals)
      ? [...existingExternals, 'electron']
      : [existingExternals, 'electron'];

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
