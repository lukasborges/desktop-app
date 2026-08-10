const { mutateWebpackConfig } = require('../../../webpack.config.common');

describe('webpack common config', () => {
  test('does not add legacy React externals', () => {
    const config = {
      mode: 'development',
      stats: undefined,
      module: { rules: [] },
      externals: ['existing-external'],
      resolve: { alias: {} },
    };

    mutateWebpackConfig(config);

    expect(config.externals).toEqual(['existing-external']);
  });
});
