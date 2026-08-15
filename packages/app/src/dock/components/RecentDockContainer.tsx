import { Options as PopperOptions } from '@popperjs/core';
import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';

import {
  SearchPaneItemSelectedVia,
  cyclingStep, SearchPaneClosedVia,
} from '../../bang/duck';
import { ActivityEntry } from '../../activity/queries@local.gql.generated';

import RecentDockIcon from './RecentDockIcon';
import RecentSubdock, { Props as RecentSubdockProps } from './RecentSubdock';
interface OwnProps {
  highlightedItemId?: string,
  setHighlightedItemId: (bxResourceId?: string) => void,
  recentApplications: ActivityEntry[],
  selectItem: RecentSubdockProps['selectItem'],
  onDidMount: () => void,
  onWillUnmount: () => void,
  cyclingStep: typeof cyclingStep,
  stopCycling: () => void,
  ctrlTabCycling: boolean,
  isSubdockVisible: boolean,
  showRecentSubdock: () => void,
  hideRecentSubdock: (via: SearchPaneClosedVia) => void,
}

type Props = OwnProps;

interface State {
  isHover: boolean,
}

class RecentDockContainer extends React.PureComponent<Props, State> {

  private static popperModifiers: PopperOptions['modifiers'] = [
    { name: 'preventOverflow', options: { boundary: 'viewport' } },
    { name: 'offset', options: { offset: [-52, 5] } },
    { name: 'computeStyles', options: { gpuAcceleration: false } },
  ];

  timeoutSubdock: ReturnType<typeof setTimeout> | null = null;

  onOverStateChange = (isHover: boolean) => {
    if (this.timeoutSubdock !== null) {
      clearTimeout(this.timeoutSubdock);
      this.timeoutSubdock = null;
    }
    if (isHover) {
      this.timeoutSubdock = setTimeout(() => {
        this.props.showRecentSubdock();
      }, 300);
    } else {
      this.timeoutSubdock = setTimeout(() => {
        this.props.hideRecentSubdock('mouse-leave');
      }, 200);
    }
  }

  handleSelectItem = (item: ActivityEntry, via: SearchPaneItemSelectedVia, position: number) => {
    this.props.hideRecentSubdock('item-selected');
    this.props.selectItem(item, via, position);
  }

  onEsc = () => {
    this.props.hideRecentSubdock('keyboard-esc');
    this.props.stopCycling();
  }

  onClickIcon = () => {
    const { recentApplications } = this.props;
    if (this.timeoutSubdock !== null) {
      clearTimeout(this.timeoutSubdock);
      this.timeoutSubdock = null;
    }
    this.handleSelectItem(recentApplications[0], 'click-recent-dock-icon', 0);
  }

  render() {
    const {
      recentApplications, onWillUnmount, onDidMount,
      ctrlTabCycling, highlightedItemId, setHighlightedItemId,
      isSubdockVisible,
    } = this.props;

    const shouldDisplaySubdock = isSubdockVisible || ctrlTabCycling;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref}>
              <RecentDockIcon
                onMouseEnter={() => this.onOverStateChange(true)}
                onMouseLeave={() => this.onOverStateChange(false)}
                onClickIcon={this.onClickIcon}
                recentApplication={recentApplications[0]}
              />
            </div>
          )}

        </Reference>

        <Popper placement="right-start" modifiers={RecentDockContainer.popperModifiers}>
          {({ ref, style, placement }) => (
            <div ref={ref} style={style} data-placement={placement}>
              {shouldDisplaySubdock &&
                <RecentSubdock
                  selectItem={this.handleSelectItem}
                  onDidMount={onDidMount}
                  onWillUnmount={onWillUnmount}
                  onMouseEnter={() => this.onOverStateChange(true)}
                  onMouseLeave={() => this.onOverStateChange(false)}
                  onEsc={this.onEsc}
                  recentApplications={recentApplications}
                  setHighlightedItemId={setHighlightedItemId}
                  highlightedItemId={highlightedItemId}
                  cyclingStep={this.props.cyclingStep}
                  isCycling={ctrlTabCycling}
                />
              }
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default RecentDockContainer;
