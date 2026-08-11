import { resolveWebpackAsset } from '../../../manifests/webpackAsset';

describe('resolveWebpackAsset', () => {
  test('keeps CommonJS asset URLs unchanged', () => {
    expect(resolveWebpackAsset('data:image/svg+xml;base64,abc')).toBe('data:image/svg+xml;base64,abc');
  });

  test('unwraps ES module asset URLs', () => {
    expect(resolveWebpackAsset({ default: 'data:image/png;base64,abc' })).toBe('data:image/png;base64,abc');
  });

  test('rejects invalid asset loader output', () => {
    expect(() => resolveWebpackAsset({})).toThrow('Webpack asset loader did not return a URL');
  });
});
