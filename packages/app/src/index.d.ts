declare namespace NodeJS {
  interface Process extends EventEmitter {
    worker: boolean;
  }

  // Defined and ensured by `dotenv-safe`
  interface ProcessEnv {
    APP_STORE_MANIFEST_URL: string;
  }
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module 'deep-extend' {
  function deepExtend<T extends object>(target: T, ...sources: object[]): T;
  export = deepExtend;
}

declare module 'join-array' {
  function join(options: {
    array: string[];
    separator: string;
    last?: string;
    max?: number;
    maxMessage?: (missed: string) => string;
  }): string;
  export = join;
}

declare module 'react-jss' {
  import * as React from 'react';

  type StyleRules<T> = T extends (...args: any[]) => infer R ? R : T;

  export type WithSheet<T> = {
    classes: Record<keyof StyleRules<T>, string>;
    sheet: unknown;
  };

  export const jss: any;
  export const ThemeProvider: React.ComponentType<React.PropsWithChildren<{ theme: any }>>;

  const injectSheet: any;
  export default injectSheet;
}

declare module 'redux-ui/transpiled/action-reducer' {
  import { AnyAction, Reducer } from 'redux';

  export const UPDATE_UI_STATE: string;
  export function updateUI(key: string | string[], name: string, value: unknown): AnyAction;
  export function mountUI(key: string | string[], defaults: object, customReducer?: Reducer): AnyAction;
  export function unmountUI(key: string | string[]): AnyAction;
  const reducer: Reducer;
  export default reducer;
}
