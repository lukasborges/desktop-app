export type WebpackAsset = string | { default?: unknown };

export function resolveWebpackAsset(asset: WebpackAsset): string {
  if (typeof asset === 'string') return asset;
  if (asset && typeof asset.default === 'string') return asset.default;

  throw new TypeError('Webpack asset loader did not return a URL');
}
