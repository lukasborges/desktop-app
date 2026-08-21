import { Icon, IconSymbol, roundedBackground, Tooltip } from '@getstation/theme';
import * as React from 'react';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export type Classes = {
  iconWrapper: string,
  icon: string,
};

export type Props = {
  className?: string,
  classes?: Classes,
  symbolId: IconSymbol,
  onClick: (e: React.MouseEvent<Element>) => void,
  size?: number,
  tooltip?: string,
  tooltipOffset?: string,
  tooltipPlacement?: string,
};

const styles = () => ({
  iconWrapper: {
    alignItems: 'center',
    background: 'none',
    border: 0,
    borderRadius: 7,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    height: 24,
    width: 24,
    opacity: 0.62,
    marginLeft: 5,
    padding: 0,
    '&:hover': {
      ...roundedBackground('rgba(255,255,255,0.1)'),
      opacity: 1,
    },
  },
  icon: {
    display: 'flex',
  },
});

@injectSheet(styles)
class SubdockButton extends React.PureComponent<Props> {
  renderIcon() {
    const { classes, size, onClick, symbolId, className: upperClassName } = this.props;
    return (
      <button
        className={classNames(classes!.iconWrapper, upperClassName)}
        onClick={onClick}
        type="button"
      >
        <Icon
          className={classes!.icon}
          size={size}
          symbolId={symbolId}
        />
      </button>
    );
  }

  renderIconWithTooltip() {
    const { tooltip, tooltipOffset, tooltipPlacement } = this.props;
    return (
      <Tooltip
        tooltip={tooltip}
        offset={tooltipOffset || '0, 4'}
        placement={tooltipPlacement || 'top'}
        alternate={true}
      >
        {this.renderIcon()}
      </Tooltip>
    );
  }

  render() {
    const { tooltip } = this.props;
    if (tooltip) {
      return this.renderIconWithTooltip();
    }
    return this.renderIcon();
  }
}

export default SubdockButton;
