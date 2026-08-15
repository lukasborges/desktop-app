import { GradientProvider } from '@getstation/theme';
import { connect } from 'react-redux';
import { getThemeColors } from './selectors';
import { StationState } from '../types';

export interface StateToProps {
  themeColors: string[];
}

export interface OwnProps {
  children: React.Component;
}

export default connect<StateToProps, {}, OwnProps>((state: StationState) => ({
  themeColors: getThemeColors(state),
}))(GradientProvider);
