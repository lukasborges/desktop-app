import * as React from 'react';

import ReactInterval from '../../common/components/ReactInterval';
import { getSnoozeDurationContent } from '../../common/helpers/lifecycleTransitions';

export interface Props {
  snoozeEndDate: object
}

export default class SnoozeDuration extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.forceUpdate();
  }

  render() {
    return (
      <span>
        <ReactInterval enabled={true} callback={this.tick} />
        {getSnoozeDurationContent(this.props.snoozeEndDate)}
      </span>
    );
  }
}
