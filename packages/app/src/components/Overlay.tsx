import { GradientType, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import ClickOutside from '../common/components/ClickOutside';
import KeyHandler, { KEYDOWN } from '../common/components/KeyHandler';

import UtilityViewClose from './UtilityViewClose';

const noop = () => {};

export interface Classes {
  container: string,
  panels: string,
  kbd: string,
  label: string,
  content: string,
  category: string,
  li: string,
  head: string,
  subtitle: string,
  titleText: string,
}

type DefaultProps = {
  withClickOutside?: boolean,
};

type HocProps = {
  themeGradient: string,
  classes?: Classes,
};

export type Props = HocProps & DefaultProps & {
  className?: string,
  title?: string,
  onClose: (via: string) => void,
  children: React.ReactNode,
  contentClassName?: string,
  headClassName?: string,
};

const styles = () => ({
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: 54,
    bottom: 0,
    left: 68,
    right: 0,
    overflow: 'auto',
    zIndex: 100,
    backgroundColor: 'var(--app-surface)',
    backgroundImage: 'none',
    opacity: 1.00,
    color: 'var(--app-text-primary)',
    borderLeft: '1px solid var(--app-border-subtle)',
    padding: '26px 32px 32px',
  },
  content: {
    flexGrow: 1,
    maxWidth: 'none',
    alignSelf: 'stretch',
    '&>div': {
      display: 'inherit',
      width: '100%',
    },
  },
  head: {
    alignItems: 'center',
    borderBottom: '1px solid var(--app-border-subtle)',
    marginBottom: 24,
    minHeight: 40,
    padding: '0 52px 20px 0',
    fontSize: '14px',
    maxWidth: 'none',
    width: '100%',
    display: 'flex',
    alignSelf: 'center',
  },
  titleText: {
    flexGrow: 1,
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: '-.01em',
    margin: 0,
  },
});

@injectSheet(styles)
class Overlay extends React.PureComponent<Props & HocProps> {

  static defaultProps: DefaultProps = {
    withClickOutside: true,
  };

  renderChildren() {
    const { onClose, children, withClickOutside } = this.props;
    const onClickOutside = withClickOutside ? () => onClose('click') : noop;
    return (
      <ClickOutside onClickOutside={onClickOutside}>
        {children}
      </ClickOutside>
    );
  }

  render() {
    const { classes, className, contentClassName, headClassName, title, onClose } = this.props;

    return (
      <div className={classNames(classes!.container, 'station-content-overlay', className)}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Escape"
          onKeyHandle={() => onClose('esc')}
        />
        <UtilityViewClose
          label={`Close ${title || 'view'}`}
          onClick={() => onClose('click')}
        />
        { title &&
        <div className={classNames(classes!.head, 'station-content-overlay__head', headClassName)}>
          <h1 className={classes!.titleText}>{title}</h1>
        </div>
        }
        <div className={classNames(classes!.content, 'station-content-overlay__content', contentClassName)}>
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.withOverlay)(Overlay);
