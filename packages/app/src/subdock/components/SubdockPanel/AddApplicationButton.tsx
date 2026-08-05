import { Button, Style } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { settingsButtonStyle } from '../../../settings/components/settingsButtonStyle';

interface Classes {
  container: string,
  button: string,
}

interface Props {
  classes?: Classes,
  onClickAddNewInstance: () => void,
}

@injectSheet(() => ({
  container: {
    margin: [8, 12, 14],
    paddingTop: 4,
    textAlign: 'center',
  },
  button: {
    ...settingsButtonStyle,
    width: '100%',
  },
}))
export default class AddApplicationButton extends React.PureComponent<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, onClickAddNewInstance } = this.props;

    return (
      <div className={classes!.container}>
        <Button className={classes!.button} btnStyle={Style.SECONDARY} onClick={onClickAddNewInstance}>
          Add a new instance
        </Button>
      </div>
    );
  }
}
