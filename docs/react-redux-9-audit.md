# React Redux 9 compatibility audit

This audit is the Stage 1c prerequisite from issue #2. It describes the
React Redux usage that existed before the React 18, React Redux 9, and Redux 5
dependency upgrades. The inventory was taken while the repository still used:

- React and React DOM 16.14.0
- React Redux 5.1.2 with `@types/react-redux` 7.1.34
- Redux 4.2.1
- TypeScript 4.9.5 and React types 16.14.x

React Redux 9.2.0 declares React 18 or 19, Redux 5, and React types 18 or 19 as
peer dependencies. It includes its own TypeScript declarations. It must
therefore land in Stage 3 after the Redux 5 work in Stage 2, together with
React 18 and the removal of `@types/react-redux`.

## Inventory

The pre-audit source tree had 40 direct `react-redux` importers: 31 TypeScript
files and 9 JavaScript files.

| Usage | Count | Notes |
| --- | ---: | --- |
| `Provider` roots | 4 | Main window, subwindow, about window, and App Store |
| `connect` wrappers | 36 | 31 call-expression wrappers and 5 decorators |
| `mapStateToProps` using own props | 4 | Subscription ordering and own-prop updates need smoke coverage |
| `mapDispatchToProps` using own props | 5 | Must keep rebinding when own props change |
| custom `mergeProps` | 2 | Application and general settings |
| `forwardRef` option | 2 | Unused by callers and ignored by React Redux 5.1.2; removed in this audit |
| direct Redux hooks | 0 | No hook conversion is required for the initial upgrade |

The four provider boundaries are:

- `packages/app/src/index.js`
- `packages/app/src/index-sub.js`
- `packages/app/src/about-window/about.js`
- `packages/appstore/src/index.tsx`

The five decorator wrappers are:

- `packages/app/src/about-window/Container.js`
- `packages/app/src/applications/ApplicationScene.js`
- `packages/app/src/containers/App.js`
- `packages/app/src/containers/AppSub.js`
- `packages/app/src/in-tab-search/TabSearchInput.js`

Decorators only apply the normal `connect` higher-order component and do not
depend on a removed React Redux API. Their composition order is observable,
especially where drag-and-drop, JSS, or gradient HOCs surround them, so a
syntax-only rewrite is not required for the dependency upgrade.

## Compatibility findings

No importer uses the legacy React Redux context directly. There are no uses of
`connectAdvanced`, `createProvider`, `ReactReduxContext`, `storeKey`,
`withRef`, `getWrappedInstance`, custom equality callbacks, or a store passed
as a component prop. All connected state is read through regular selectors,
including the Immutable desktop state.

The React Redux 9.2 `connect` declaration retains the overloads used here:
map-state only, map-state plus function map-dispatch, merge props, options,
own props, and an explicit state generic. The two custom merge functions and
all nine own-prop-aware mapping functions can remain in place. They need
behavioral coverage during Stage 3 because they are the surfaces most sensitive
to subscription and own-prop update ordering.

The old `@types/react-redux` package is newer than the installed runtime and
already exposes a largely modern `connect` type surface. That reduced type
drift in current TypeScript files, but it also allowed two `forwardRef` options
that React Redux 5.1.2 silently ignored. No caller attaches a ref to either
connected component, so the unused options were removed in this stage.

The App Store root component also had a dummy `connect` that selected a
constant `foo` value and bound a no-op action. Neither prop was read. Removing
that wrapper leaves 39 direct importers and 35 connected components without
changing rendered behavior.

## Upgrade requirements

Stage 2 must upgrade Redux first and validate all desktop and App Store store
implementations. React Redux 9 cannot be installed against Redux 4.

Stage 3 must:

1. Upgrade React, React DOM, their type packages, and React Redux together.
2. Remove `@types/react-redux`, because React Redux 9 ships its declarations.
3. Convert each of the four provider entry points to a persistent `createRoot`.
4. Preserve the post-commit `bx-ready-to-show` signal in the three Electron
   renderer roots.
5. Compile all explicit `connect` generics against the bundled v9 types.
6. Exercise the own-prop mappings, both custom merge functions, and the HOC
   composition around the five decorators.
7. Smoke-test main-window startup, subwindow rendering, the about window, and
   App Store hot replacement, in addition to the broader checks listed in #2.

No separate React Redux compatibility rewrite is required before Stage 2.

## Stage 2 bridge status

Stage 2 upgrades the direct desktop and App Store dependency to Redux 5.0.1
and Redux Thunk 3.1.0 while React Redux remains at 5.1.2. Yarn consequently
reports the expected React Redux peer-range warning because that retired
release only declares support through Redux 4. The bridge is temporary and is
removed when React Redux 9 lands in Stage 3. Production builds, persistence
and saga tests, real-store SDK coverage, and Linux packaging validate the
bridge behavior. The shared-redux middleware remains in both built desktop
store paths, and no peer override is added to hide the warning.

`shared-redux` also keeps its private Redux 4 dependency. It exchanges plain
actions and serialized state with the application stores rather than exposing
its private Redux store type, so replacing that transitive dependency is not a
prerequisite for the direct Redux 5 upgrade.
