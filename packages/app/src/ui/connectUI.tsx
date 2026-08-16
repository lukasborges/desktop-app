import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  mountUI,
  unmountUI,
  updateUI as updateUIAction,
} from 'redux-ui/transpiled/action-reducer';

type UIState = Record<string, any>;

type Options = {
  key: string,
  state: UIState,
  persist?: boolean,
};

type ConnectedProps = {
  dispatch: Dispatch,
  uiState?: any,
};

const toPlainObject = (value: any): UIState => {
  if (!value) return {};
  return typeof value.toJS === 'function' ? value.toJS() : value;
};

// redux-ui's HOC depends on the legacy React Redux context. Keep its reducer
// and actions, but connect UI state through the current React Redux Provider.
const connectUI = ({ key, state: defaultState, persist = false }: Options) =>
  (WrappedComponent: React.ComponentType<any>): React.ComponentType<any> => {
    class UIConnector extends React.PureComponent<ConnectedProps & Record<string, any>> {
      componentDidMount() {
        this.mountDefaultState();
      }

      componentDidUpdate() {
        this.mountDefaultState();
      }

      componentWillUnmount() {
        if (persist) return;

        const removeState = () => this.props.dispatch(unmountUI([key]));
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          window.requestAnimationFrame(removeState);
        } else {
          removeState();
        }
      }

      mountDefaultState() {
        if (this.props.uiState !== undefined) return;
        this.props.dispatch(mountUI([key], this.getDefaultState(), undefined));
      }

      getDefaultState(): UIState {
        return Object.keys(defaultState).reduce((values, name) => {
          const value = defaultState[name];
          values[name] = typeof value === 'function' ? value(this.props) : value;
          return values;
        }, {} as UIState);
      }

      updateUI = (updates: UIState) => {
        Object.keys(updates).forEach(name => {
          this.props.dispatch(updateUIAction([key], name, updates[name]));
        });
      }

      render() {
        const { dispatch, uiState, ...props } = this.props;
        const ui = {
          ...this.getDefaultState(),
          ...toPlainObject(uiState),
        };

        return <WrappedComponent {...props} ui={ui} updateUI={this.updateUI} />;
      }
    }

    return connect(
      (storeState: any) => ({ uiState: storeState.getIn(['ui', key]) }),
      (dispatch: Dispatch) => ({ dispatch }),
    )(UIConnector as any) as React.ComponentType<any>;
  };

export default connectUI;
