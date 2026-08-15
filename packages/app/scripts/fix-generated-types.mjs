import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = (await readdir('src', { recursive: true }))
  .filter(file => file.endsWith('queries@local.gql.generated.tsx'))
  .map(file => join('src', file));

await Promise.all(files.map(async file => {
  const source = await readFile(file, 'utf8');
  const fixed = source.replace(
    /export function (with\w+)<\s*TProps,/g,
    'export function $1<TProps extends Record<string, any>,'
  );

  if (fixed !== source) await writeFile(file, fixed);
}));

const resolverTypesFile = 'src/graphql/resolvers-types.generated.ts';
const resolverTypes = await readFile(resolverTypesFile, 'utf8');
const fixedResolverTypes = resolverTypes
  .replace(
    "import { StationUserIdentity } from '../user-identities/types';",
    "import { StationUserIdentity as StationUserIdentityModel } from '../user-identities/types';"
  )
  .replace(
    /export type StationUserIdentityResolvers<([\s\S]*?)ParentType = StationUserIdentity\n>/,
    'export type StationUserIdentityResolvers<$1ParentType = StationUserIdentityModel\n>'
  );

if (fixedResolverTypes !== resolverTypes) {
  await writeFile(resolverTypesFile, fixedResolverTypes);
}
