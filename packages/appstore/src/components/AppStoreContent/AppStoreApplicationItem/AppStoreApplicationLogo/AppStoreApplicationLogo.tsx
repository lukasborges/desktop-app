import { Icon, IconSymbol } from '@getstation/theme';
import * as React from 'react';
import injectSheet from 'react-jss';
import Lottie from 'react-lottie';
// @ts-ignore
import * as animationData from '@src/shared/animations/add-application-animation.json';

import { iconNeedsContrastBackground } from '../../../../../../app/src/utils/iconContrast';
import styles, { AppStoreApplicationLogoClasses } from './styles';

export type AppStoreApplicationLogoProps = {
  classes?: AppStoreApplicationLogoClasses,
  iconURL: string,
  themeColor?: string,
  isAnimationStopped: boolean,
  toggleAnimation: (isAnimationStopped: boolean) => void,
};

export type AppStoreApplicationLogoState = {
  isStopped: boolean,
  needsContrastBackground: boolean,
};

@injectSheet(styles)
export default class AppStoreApplicationLogo extends React.PureComponent<AppStoreApplicationLogoProps, AppStoreApplicationLogoState> {

  constructor(props: any) {
    super(props);
    this.state = { isStopped: true, needsContrastBackground: false };
  }

  handleIconLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    this.setState({ needsContrastBackground: iconNeedsContrastBackground(event.currentTarget) });
  }

  render() {
    const { classes, iconURL, themeColor, isAnimationStopped, toggleAnimation } = this.props;
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    return (
      <div className={classes!.iconContainer}>
        { iconURL ?
          <div
            className={classes!.iconFrame}
            style={{ backgroundColor: this.state.needsContrastBackground ? themeColor : 'transparent' }}
          >
            {isAnimationStopped &&
              <img
                src={iconURL}
                alt=""
                className={classes!.icon}
                onLoad={this.handleIconLoad}
              />
            }
          </div>
          :
          <Icon symbolId={IconSymbol.APP_ICON_PLACEHOLDER} size={40}/>
        }

        {!isAnimationStopped &&
          <div className={classes!.animationIcon}>
            <Lottie
              options={defaultOptions}
              height={40}
              width={40}
              isStopped={isAnimationStopped}
              eventListeners={[
                {
                  eventName: 'complete',
                  callback: () => toggleAnimation(true),
                },
              ]}
            />
          </div>
        }
      </div>
    );
  }
}
