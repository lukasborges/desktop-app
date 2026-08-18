import { SDK } from '@getstation/sdk';
import { evolve } from 'ramda';
import { EMPTY, Observable } from 'rxjs';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';

import { Transformer } from '../utils/fp';
import { SDKConsumer } from './SDKProvider';

type SDKActivator = (sdk: SDK, bx?: SDKConsumer) => Promise<void> | Observable<Error> | Promise<Observable<Error>> | any;
type SDKDeactivator = (sdk: SDK, bx?: SDKConsumer) => void;

type Activator = (sdk: SDK, bx?: SDKConsumer) => Promise<Observable<Error>>;
type Deactivator = SDKDeactivator;

/**
 * Describe the shape of a service runtime (sdk side).
 * @deprecated
 */
interface SDKServiceRuntime {
  activate: SDKActivator,
  deactivate: SDKDeactivator,
}
/**
 * Describe the shape of a service runtime (bx side).
 * @deprecated
 */
export interface ServiceRuntime {
  activate: Activator,
  deactivate: Deactivator,
}

export const ensureActivator: Transformer<SDKActivator, Activator> = activate => async (sdk: SDK, bx?: SDKConsumer) => {
  const result = await activate(sdk, bx);
  return result instanceof Observable ? result : EMPTY;
};

const ensureRuntime: Transformer<SDKServiceRuntime, ServiceRuntime> = evolve({
  activate: ensureActivator,
});

/**
 * A dynamic `import()` cannot be used here: TypeScript hoists the template
 * string into a temporary variable, so webpack cannot statically infer the
 * directory and ends up with an empty context (`Cannot find module` at runtime).
 */
const getRuntimeContext = () => require.context('../../manifests/runtime', true, /\/main\.tsx?$/);

/**
 * webpack 4 context keys keep their extension (`./slack/main.ts`), while
 * manifests reference them without it (`slack/main`).
 */
const runtimeKey = (requireRuntime: __WebpackModuleApi.RequireContext, main: string) => requireRuntime.keys()
  .find(key => key.replace(/^\.\//, '').replace(/\.tsx?$/, '') === main);

/**
 * Load the `ServiceRuntime` of a given service.
 * If there is no runtime defined (no `main` key in service definition), load
 * a dummy runtime that does nothing.
 */
export const getServiceRuntime = async (manifest: BxAppManifest): Promise<ServiceRuntime | void> => {
  if (!manifest || !manifest.main) return;

  const requireRuntime = getRuntimeContext();
  const key = runtimeKey(requireRuntime, manifest.main);
  if (!key) {
    console.error(`No service runtime found for "${manifest.main}"`);
    return;
  }

  const sdkRuntime: ServiceRuntime = requireRuntime(key).default;

  return ensureRuntime(sdkRuntime);
};

/**
 * Load the `ServiceRuntimeRenderer` of a given service.
 * If there is no runtime defined (no `renderer` key in service definition), load
 * a dummy runtime that does nothing.
 * FIXME migrate this to use manifest
 */
export const getServiceRuntimeRenderer = async (_serviceId?: string): Promise<ServiceRuntime | void> => {
  return;
  /*if (!manifest || !manifest.main) return;

  const sdkRuntime: ServiceRuntime = await import(
    `../../manifests/runtime/${manifest.renderer}`)
    .then(({ default: main }) => main);

  return ensureRuntime(sdkRuntime);*/
};
