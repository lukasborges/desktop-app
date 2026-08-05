import * as React from 'react';

import { Application } from './types';
import AddApplicationButton from './AddApplicationButton';

type Props = {
  application: Application,
  onClickAddNewInstance: (application: Application) => void,
};

class SubdockPanel extends React.PureComponent<Props, {}> {
  handleAddNewInstance = () => {
    const { application, onClickAddNewInstance } = this.props;
    onClickAddNewInstance(application);
  }

  render() {
    return (
      <div className="l-subdock__panel l-subdock__panel--active">
        <AddApplicationButton
          onClickAddNewInstance={this.handleAddNewInstance}
        />
      </div>
    );
  }
}

export default SubdockPanel;
